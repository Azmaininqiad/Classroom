from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import os

app = FastAPI(title="Tavus Video Conversation API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TAVUS_API_KEY = os.getenv("TAVUS_API_KEY", "caa76efefe4e4a8caf2a94b05454b668")
TAVUS_BASE_URL = "https://tavusapi.com/v2"

class TavusConversationRequest(BaseModel):
    conversation_name: str = "EduBot Video Chat"
    conversational_context: str = "You are EduBot, an educational AI assistant helping students learn."
    custom_greeting: str = "Hello! I'm EduBot, your AI learning companion."

@app.post("/api/start-tavus-conversation")
async def start_tavus_conversation(req: TavusConversationRequest):
    headers = {
        "Content-Type": "application/json",
        "x-api-key": TAVUS_API_KEY
    }
    data = {
        "persona_id": "p2a2fc492574",
        "replica_id": "rf4703150052",
        "conversation_name": req.conversation_name,
        "conversational_context": req.conversational_context,
        "custom_greeting": req.custom_greeting,
        "properties": {
            "language": "english"
        }
    }
    try:
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
    except Exception as e:
        print("Tavus conversation error:", str(e))
        raise HTTPException(status_code=500, detail=f"Tavus conversation error: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Tavus Video Conversation API is running"} 
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)