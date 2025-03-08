# app/models/chat.py
from typing import List
from pydantic import BaseModel, Field


class Message(BaseModel):
    role: str = Field(
        ..., description="Role of the message sender (system, user, or assistant)"
    )
    content: str = Field(..., description="Content of the message")


class ChatRequest(BaseModel):
    messages: List[Message] = Field(..., description="Chat messages history")


class ChatResponse(BaseModel):
    response: str = Field(..., description="LLM response")
