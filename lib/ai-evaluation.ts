// AI Evaluation API client for communicating with FastAPI backend

export interface AIEvaluationResult {
  id: string;
  student_name: string;
  assignment_id: string;
  total_marks: number;
  obtained_marks: number;
  percentage: number;
  grade: string;
  correct_answers: string[];
  incorrect_answers: string[];
  partial_credit_areas: string[];
  strengths: string[];
  areas_for_improvement: string[];
  detailed_feedback: string;
  timestamp: string;
  evaluation_type: 'single' | 'multiple';
}

export interface SingleEvaluationResponse {
  success: boolean;
  result: AIEvaluationResult;
  message: string;
}

export interface MultipleEvaluationResponse {
  evaluation_id: string;
  total_students: number;
  results: AIEvaluationResult[];
  summary: {
    average_percentage: number;
    grade_distribution: Record<string, number>;
    highest_score: number;
    lowest_score: number;
  };
  timestamp: string;
}

const AI_API_BASE_URL = 'http://localhost:8000';

export class AIEvaluationAPI {
  private baseUrl: string;

  constructor(baseUrl: string = AI_API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async evaluateSingle(
    answerKey: File,
    studentResponse: File,
    studentName?: string,
    assignmentId?: string
  ): Promise<SingleEvaluationResponse> {
    const formData = new FormData();
    formData.append('answer_key', answerKey);
    formData.append('student_response', studentResponse);
    
    if (studentName) {
      formData.append('student_name', studentName);
    }
    
    if (assignmentId) {
      formData.append('assignment_id', assignmentId);
    }

    const response = await fetch(`${this.baseUrl}/evaluate/single`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async evaluateMultiple(
    answerKey: File,
    studentResponses: File[],
    assignmentId?: string
  ): Promise<MultipleEvaluationResponse> {
    const formData = new FormData();
    formData.append('answer_key', answerKey);
    
    studentResponses.forEach((file) => {
      formData.append('student_responses', file);
    });
    
    if (assignmentId) {
      formData.append('assignment_id', assignmentId);
    }

    const response = await fetch(`${this.baseUrl}/evaluate/multiple`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getEvaluation(evaluationId: string): Promise<AIEvaluationResult> {
    const response = await fetch(`${this.baseUrl}/evaluations/${evaluationId}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getEvaluationsByAssignment(assignmentId: string): Promise<AIEvaluationResult[]> {
    const response = await fetch(`${this.baseUrl}/evaluations/assignment/${assignmentId}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await fetch(`${this.baseUrl}/health`);

    if (!response.ok) {
      throw new Error(`Health check failed! status: ${response.status}`);
    }

    return response.json();
  }
}

// Export a default instance
export const aiEvaluationAPI = new AIEvaluationAPI();

// Utility functions
export const getGradeColor = (grade: string): string => {
  switch (grade.toUpperCase()) {
    case 'A+':
    case 'A': return 'bg-green-600/20 text-green-300 border-green-500/30';
    case 'A-':
    case 'B+':
    case 'B': return 'bg-blue-600/20 text-blue-300 border-blue-500/30';
    case 'B-':
    case 'C+':
    case 'C': return 'bg-yellow-600/20 text-yellow-300 border-yellow-500/30';
    case 'C-':
    case 'D': return 'bg-orange-600/20 text-orange-300 border-orange-500/30';
    case 'F': return 'bg-red-600/20 text-red-300 border-red-500/30';
    default: return 'bg-gray-600/20 text-gray-300 border-gray-500/30';
  }
};

export const getPerformanceColor = (percentage: number): string => {
  if (percentage >= 90) return 'text-green-400';
  if (percentage >= 80) return 'text-blue-400';
  if (percentage >= 70) return 'text-yellow-400';
  if (percentage >= 60) return 'text-orange-400';
  return 'text-red-400';
};

export const calculateGrade = (percentage: number): string => {
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
};