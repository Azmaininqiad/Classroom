from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import google.generativeai as genai
from supabase import create_client, Client
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
import io
import os
from pydantic import BaseModel
import json
import asyncio
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(title="AI Evaluation API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
SUPABASE_URL = "https://xrahjhhjeamprikyjwyg.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyYWhqaGhqZWFtcHJpa3lqd3lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwMDU3ODgsImV4cCI6MjA2NDU4MTc4OH0.9PCS7wxdTuxx2PUMyH5nA2A-dVFxGV5FUXgV0ePqHEY"
GEMINI_API_KEY = "AIzaSyBoUdOFtm6VgmUdzkiTM5bW67TJXc5zMk0"

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Initialize Gemini
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-2.0-flash-exp')

# Pydantic models
class EvaluationResult(BaseModel):
    id: str
    student_name: str
    total_marks: int
    obtained_marks: int
    percentage: float
    grade: str
    correct_answers: List[str]
    incorrect_answers: List[str]
    partial_credit_areas: List[str]
    strengths: List[str]
    areas_for_improvement: List[str]
    detailed_feedback: str
    timestamp: str
    evaluation_type: str

class EvaluationSummary(BaseModel):
    average_percentage: float
    grade_distribution: Dict[str, int]
    highest_score: float
    lowest_score: float

class SingleEvaluationResponse(BaseModel):
    success: bool
    result: Optional[EvaluationResult] = None
    message: str

class MultipleEvaluationResponse(BaseModel):
    success: bool
    results: Optional[List[EvaluationResult]] = None
    summary: Optional[EvaluationSummary] = None
    message: str
    total_students: Optional[int] = None

def get_file_mime_type(filename: str) -> str:
    """Get MIME type based on file extension."""
    extension = filename.lower().split('.')[-1]
    mime_types = {
        'pdf': 'application/pdf',
        'txt': 'text/plain',
        'doc': 'application/msword',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png'
    }
    return mime_types.get(extension, 'application/octet-stream')

def calculate_grade(percentage: float) -> str:
    """Calculate letter grade based on percentage."""
    if percentage >= 90:
        return 'A'
    elif percentage >= 80:
        return 'B'
    elif percentage >= 70:
        return 'C'
    elif percentage >= 60:
        return 'D'
    else:
        return 'F'

async def evaluate_with_gemini(answer_key_content: bytes, answer_key_filename: str, 
                             student_content: bytes, student_filename: str, 
                             student_name: str) -> Dict[str, Any]:
    """Evaluate student response using Gemini AI."""
    
    try:
        # Prepare files for Gemini
        answer_key_mime = get_file_mime_type(answer_key_filename)
        student_mime = get_file_mime_type(student_filename)
        
        # Upload files to Gemini
        answer_key_file = genai.upload_file(
            io.BytesIO(answer_key_content),
            mime_type=answer_key_mime,
            display_name=f"answer_key_{answer_key_filename}"
        )
        
        student_file = genai.upload_file(
            io.BytesIO(student_content),
            mime_type=student_mime,
            display_name=f"student_response_{student_filename}"
        )
        
        # Wait for file processing
        await asyncio.sleep(2)
        
        # Create evaluation prompt
        prompt = f"""
        You are an expert academic evaluator. Please evaluate the student's response against the provided answer key.

        INSTRUCTIONS:
        1. Compare the student's response with the answer key thoroughly
        2. Identify correct answers, incorrect answers, and areas with partial credit
        3. Provide detailed feedback and suggestions for improvement
        4. Calculate the total marks and percentage score
        5. Assign a letter grade (A, B, C, D, F)
        6. Identify the student's strengths and areas for improvement

        STUDENT: {student_name}

        Return your evaluation in this EXACT JSON format:
        {{
            "total_marks": <integer>,
            "obtained_marks": <integer>,
            "percentage": <float>,
            "grade": "<letter_grade>",
            "correct_answers": ["<answer1>", "<answer2>", ...],
            "incorrect_answers": ["<answer1>", "<answer2>", ...],
            "partial_credit_areas": ["<area1>", "<area2>", ...],
            "strengths": ["<strength1>", "<strength2>", ...],
            "areas_for_improvement": ["<area1>", "<area2>", ...],
            "detailed_feedback": "<comprehensive_feedback_text>"
        }}

        Please analyze both files and provide a thorough evaluation.
        """
        
        # Generate evaluation
        response = model.generate_content([
            prompt,
            answer_key_file,
            student_file
        ])
        
        # Parse response
        response_text = response.text.strip()
        
        # Clean up JSON response (remove markdown formatting if present)
        if response_text.startswith('```json'):
            response_text = response_text[7:-3]
        elif response_text.startswith('```'):
            response_text = response_text[3:-3]
        
        evaluation_data = json.loads(response_text)
        
        # Clean up uploaded files
        genai.delete_file(answer_key_file.name)
        genai.delete_file(student_file.name)
        
        return evaluation_data
        
    except Exception as e:
        logger.error(f"Gemini evaluation error: {str(e)}")
        # Clean up files in case of error
        try:
            genai.delete_file(answer_key_file.name)
            genai.delete_file(student_file.name)
        except:
            pass
        raise HTTPException(status_code=500, detail=f"AI evaluation failed: {str(e)}")

async def save_evaluation_result(evaluation_data: Dict[str, Any], student_name: str, 
                               assignment_id: str, evaluation_type: str) -> EvaluationResult:
    """Save evaluation result to Supabase database."""
    
    result_id = str(uuid.uuid4())
    timestamp = datetime.utcnow().isoformat()
    
    # Create result object
    result = EvaluationResult(
        id=result_id,
        student_name=student_name,
        total_marks=evaluation_data.get('total_marks', 100),
        obtained_marks=evaluation_data.get('obtained_marks', 0),
        percentage=evaluation_data.get('percentage', 0.0),
        grade=evaluation_data.get('grade', 'F'),
        correct_answers=evaluation_data.get('correct_answers', []),
        incorrect_answers=evaluation_data.get('incorrect_answers', []),
        partial_credit_areas=evaluation_data.get('partial_credit_areas', []),
        strengths=evaluation_data.get('strengths', []),
        areas_for_improvement=evaluation_data.get('areas_for_improvement', []),
        detailed_feedback=evaluation_data.get('detailed_feedback', ''),
        timestamp=timestamp,
        evaluation_type=evaluation_type
    )
    
    # Save to Supabase
    try:
        supabase.table('evaluation_results').insert({
            'id': result_id,
            'assignment_id': assignment_id,
            'student_name': student_name,
            'total_marks': result.total_marks,
            'obtained_marks': result.obtained_marks,
            'percentage': result.percentage,
            'grade': result.grade,
            'correct_answers': result.correct_answers,
            'incorrect_answers': result.incorrect_answers,
            'partial_credit_areas': result.partial_credit_areas,
            'strengths': result.strengths,
            'areas_for_improvement': result.areas_for_improvement,
            'detailed_feedback': result.detailed_feedback,
            'timestamp': timestamp,
            'evaluation_type': evaluation_type
        }).execute()
        
        logger.info(f"Saved evaluation result for student: {student_name}")
        return result
        
    except Exception as e:
        logger.error(f"Database save error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to save evaluation result: {str(e)}")

@app.post("/api/evaluate/single", response_model=SingleEvaluationResponse)
async def evaluate_single(
    answer_key: UploadFile = File(...),
    student_response: UploadFile = File(...),
    assignment_id: str = Form(...),
    student_name: str = Form(...)
):
    """Evaluate a single student response."""
    
    try:
        # Read file contents
        print(f"Evaluating single response for student: {student_name}")
        answer_key_content = await answer_key.read()
        student_content = await student_response.read()
        
        # Validate files
        if not answer_key_content or not student_content:
            raise HTTPException(status_code=400, detail="Empty files provided")
        
        # Evaluate with Gemini
        evaluation_data = await evaluate_with_gemini(
            answer_key_content, answer_key.filename,
            student_content, student_response.filename,
            student_name
        )
        
        # Save result
        result = await save_evaluation_result(
            evaluation_data, student_name, assignment_id, "single"
        )
        
        return SingleEvaluationResponse(
            success=True,
            result=result,
            message="Single evaluation completed successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Single evaluation error: {str(e)}")
        return SingleEvaluationResponse(
            success=False,
            message=f"Evaluation failed: {str(e)}"
        )

@app.post("/api/evaluate/multiple", response_model=MultipleEvaluationResponse)
async def evaluate_multiple(
    answer_key: UploadFile = File(...),
    student_responses: List[UploadFile] = File(...),
    assignment_id: str = Form(...)
):
    """Evaluate multiple student responses."""
    
    try:
        # Read answer key
        answer_key_content = await answer_key.read()
        
        if not answer_key_content:
            raise HTTPException(status_code=400, detail="Empty answer key file")
        
        results = []
        
        # Process each student response
        for student_file in student_responses:
            student_content = await student_file.read()
            
            if not student_content:
                logger.warning(f"Skipping empty file: {student_file.filename}")
                continue
            
            # Extract student name from filename (remove extension)
            student_name = student_file.filename.rsplit('.', 1)[0] if student_file.filename else "Unknown"
            
            try:
                # Evaluate with Gemini
                evaluation_data = await evaluate_with_gemini(
                    answer_key_content, answer_key.filename,
                    student_content, student_file.filename,
                    student_name
                )
                
                # Save result
                result = await save_evaluation_result(
                    evaluation_data, student_name, assignment_id, "multiple"
                )
                
                results.append(result)
                
            except Exception as e:
                logger.error(f"Failed to evaluate {student_name}: {str(e)}")
                # Continue with other students even if one fails
                continue
        
        if not results:
            raise HTTPException(status_code=400, detail="No valid evaluations completed")
        
        # Calculate summary statistics
        percentages = [r.percentage for r in results]
        grades = [r.grade for r in results]
        
        summary = EvaluationSummary(
            average_percentage=sum(percentages) / len(percentages),
            grade_distribution={grade: grades.count(grade) for grade in set(grades)},
            highest_score=max(percentages),
            lowest_score=min(percentages)
        )
        
        return MultipleEvaluationResponse(
            success=True,
            results=results,
            summary=summary,
            message="Multiple evaluation completed successfully",
            total_students=len(results)
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Multiple evaluation error: {str(e)}")
        return MultipleEvaluationResponse(
            success=False,
            message=f"Evaluation failed: {str(e)}"
        )

@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

@app.get("/evaluations/assignment/{assignment_id}")
async def get_evaluations(assignment_id: str):
    """Get all evaluations for a specific assignment."""
    try:
        response = supabase.table('evaluation_results').select("*").eq('assignment_id', assignment_id).execute()
        return {"success": True, "data": response.data}
    except Exception as e:
        logger.error(f"Failed to fetch evaluations: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch evaluations")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)