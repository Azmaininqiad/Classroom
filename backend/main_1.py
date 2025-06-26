from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import os
from typing import List, Dict, Any
import json

app = FastAPI(title="Education Chatbot API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust for your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "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")
TAVUS_API_KEY = os.getenv("TAVUS_API_KEY", "eb30ed6c27d74c9a8e37b090054970f5")
OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"
TAVUS_BASE_URL = "https://tavusapi.com/v2"

# Pydantic models
class ChatMessage(BaseModel):
    message: str
    conversation_history: List[Dict[str, Any]] = []

class TavusSpeakRequest(BaseModel):
    session_id: str
    message: str

class ChatResponse(BaseModel):
    response: str

class TavusSessionResponse(BaseModel):
    session_id: str
    status: str

# Education-focused system prompt for the chatbot
EDUCATION_SYSTEM_PROMPT = """You are EduBot, an AI-powered educational assistant designed to help students learn and explore knowledge across all subjects. Your responses should be:

1. Educational and informative
2. Age-appropriate and accessible
3. Encouraging and supportive of learning
4. Clear and well-structured
5. Include examples when helpful
6. Suggest further learning resources when relevant

Focus on subjects like:
- Mathematics and Science
- History and Social Studies
- Language Arts and Literature
- Foreign Languages
- Arts and Creative subjects
- Technology and Computer Science
- Life skills and practical knowledge

Always encourage curiosity, critical thinking, and a love for learning. Break down complex topics into digestible parts and use analogies when helpful. If you don't know something, encourage the student to research further and provide guidance on how to find reliable sources.

Keep responses conversational but informative, and remember that your responses will be both shown as text and spoken aloud via video interface."""

# Tavus persona configuration for education
TAVUS_EDUCATION_CONFIG = {
    "system_prompt": """Your responses will be spoken out, so avoid any formatting or stage directions. 
Precision and clarity are key for delivering an optimal educational experience.
You may receive additional real-time information via system messages - incorporate these if relevant.

Your name is EduBot, a friendly AI educational assistant. 
You're knowledgeable and enthusiastic about learning, always ready to help students understand complex topics.
With a warm, encouraging tone, you make learning feel accessible and exciting.
Think of yourself as a patient tutor who adapts to each student's learning style.

Focus on being:
- Clear and articulate in explanations
- Encouraging and supportive
- Patient with questions
- Enthusiastic about knowledge
- Helpful in breaking down complex concepts""",

    "context": """EduBot is an AI-powered educational assistant focused on helping students learn across all subjects. 
EduBot believes in making quality education accessible to everyone and is passionate about fostering curiosity and critical thinking.

This conversation was initiated to help the student learn and explore new topics. You'll be talking with learners of various ages and backgrounds, so adapt your communication style accordingly. Make sure to:
- Ask about their learning goals and interests
- Encourage questions and curiosity
- Provide clear, structured explanations
- Suggest practical exercises or further reading
- Celebrate learning milestones

Important conversational guidelines:
- Use encouraging language that builds confidence
- Break down complex topics into manageable parts
- Use examples and analogies to clarify concepts
- Ask follow-up questions to ensure understanding
- Adapt your explanation style to the learner's level

You are designed to support learning through both text and video interaction, making education more engaging and accessible.""",

    "persona_name": "EduBot Educational Assistant",
    "layers": {
        "llm": {
            "model": "tavus-llama",
            "speculative_inference": True
        },
        "perception": {
            "perception_model": "raven-0",
            "ambient_awareness_queries": []
        }
    },
    "default_replica_id": "rf4703150052"  # You'll need to replace this with your actual replica ID
}

@app.get("/")
async def root():
    return {"message": "Education Chatbot API is running"}

@app.post("/api/chat", response_model=ChatResponse)
async def chat_with_openrouter(request: ChatMessage):
    """
    Send message to OpenRouter and get educational response
    """
    try:
        # Prepare conversation history
        messages = [{"role": "system", "content": EDUCATION_SYSTEM_PROMPT}]
        
        # Add conversation history
        for msg in request.conversation_history:
            if msg.get("role") in ["user", "assistant"]:
                messages.append({
                    "role": msg["role"],
                    "content": msg["content"]
                })
        
        # Add current message
        messages.append({"role": "user", "content": request.message})
        
        # OpenRouter API call
        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": "deepseek/deepseek-chat-v3-0324:free",  # You can change this model
            "messages": messages,
            "max_tokens": 1000,
            "temperature": 0.7
        }
        
        response = requests.post(
            f"{OPENROUTER_BASE_URL}/chat/completions",
            headers=headers,
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            assistant_response = result["choices"][0]["message"]["content"]
            return ChatResponse(response=assistant_response)
        else:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"OpenRouter API error: {response.text}"
            )
            
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Request failed: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")

@app.post("/api/initialize-tavus")
async def initialize_tavus_session():
    """
    Initialize Tavus video conversation session for video interaction
    """
    try:
        headers = {
            "Content-Type": "application/json",
            "x-api-key": TAVUS_API_KEY
        }
        # You should have a persona_id and (optionally) a replica_id. For demo, use persona_id from previous persona creation.
        # In production, store persona_id and replica_id in your DB or config.
        persona_id = "p2a2fc492574"  # Replace with your actual persona_id
        # Optionally, add replica_id if you have it
        data = {
            "persona_id": persona_id,
            # "replica_id": "your_replica_id",  # Uncomment and set if needed
            "conversation_name": "EduBot Video Chat",
            "conversational_context": "You are EduBot, an educational AI assistant helping students learn.",
            "custom_greeting": "Hello! I'm EduBot, your AI learning companion.",
            "properties": {
                "language": "english"
            }
        }
        response = requests.post(
            f"{TAVUS_BASE_URL}/conversations",
            headers=headers,
            json=data,
            timeout=30
        )
        if response.status_code == 200:
            result = response.json()
            conversation_id = result.get("conversation_id")
            conversation_url = result.get("conversation_url")
            if not conversation_id or not conversation_url:
                print("Tavus API did not return conversation_id or conversation_url. Response:", result)
                raise HTTPException(
                    status_code=500,
                    detail=f"Tavus API did not return conversation_id or conversation_url. Response: {result}"
                )
            return {"conversation_id": conversation_id, "conversation_url": conversation_url, "status": "initialized"}
        else:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Tavus API error: {response.text}"
            )
    except requests.exceptions.RequestException as e:
        print("Tavus request failed:", str(e))
        raise HTTPException(status_code=500, detail=f"Tavus request failed: {str(e)}")
    except Exception as e:
        print("Tavus initialization error:", str(e))
        raise HTTPException(status_code=500, detail=f"Tavus initialization error: {str(e)}")

@app.post("/api/tavus-speak")
async def tavus_speak(request: TavusSpeakRequest):
    """
    Send message to Tavus persona to speak
    """
    try:
        headers = {
            "Content-Type": "application/json",
            "x-api-key": TAVUS_API_KEY
        }
        
        # This endpoint might vary based on Tavus API documentation
        # You may need to adjust the endpoint and payload structure
        payload = {
            "session_id": request.session_id,
            "message": request.message,
            "action": "speak"
        }
        
        response = requests.post(
            f"{TAVUS_BASE_URL}/sessions/{request.session_id}/speak",
            headers=headers,
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            return {"status": "success", "message": "Speech initiated"}
        else:
            raise HTTPException(
                status_code=response.status_code,
                detail=f"Tavus speak API error: {response.text}"
            )
            
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Tavus speak request failed: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Tavus speak error: {str(e)}")

@app.get("/api/health")
async def health_check():
    """
    Health check endpoint
    """
    return {
        "status": "healthy",
        "openrouter_configured": bool(OPENROUTER_API_KEY and OPENROUTER_API_KEY != "your-openrouter-api-key"),
        "tavus_configured": bool(TAVUS_API_KEY and TAVUS_API_KEY != "your-tavus-api-key")
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)