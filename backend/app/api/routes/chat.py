# app/api/routes/chat.py
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import StreamingResponse
from app.models.chat import ChatRequest, ChatResponse
from app.services.llm import LLMService

router = APIRouter(prefix="/chat", tags=["chat"])

# Create an instance of the LLM service
llm_service = LLMService()


@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Process a chat request and return a response from the LLM.
    """
    try:
        response = await llm_service.generate_response(request.messages)
        return ChatResponse(response=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/stream")
async def chat_stream(request: ChatRequest):
    """
    Process a chat request and return a streaming response from the LLM.
    """
    try:
        # Create a streaming response
        return StreamingResponse(
            llm_service.generate_streaming_response(request.messages),
            media_type="text/event-stream",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
