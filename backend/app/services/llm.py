# app/services/llm.py
from typing import List, Dict, Any
from langchain.chat_models import ChatOpenAI
from langchain.schema import AIMessage, HumanMessage, SystemMessage
from app.core.config import settings
from app.models.chat import Message


class LLMService:
    def __init__(self):
        self.llm = ChatOpenAI(
            model_name=settings.LLM_MODEL,
            openai_api_key=settings.OPENAI_API_KEY,
            streaming=True,
            temperature=0.7,
        )

    def format_messages(self, messages: List[Message]) -> List[Any]:
        """Convert messages from the frontend format to LangChain format."""
        formatted_messages = []

        for message in messages:
            # Access attributes directly from the Pydantic model
            if message.role == "system":
                formatted_messages.append(SystemMessage(content=message.content))
            elif message.role == "user":
                formatted_messages.append(HumanMessage(content=message.content))
            elif message.role == "assistant":
                formatted_messages.append(AIMessage(content=message.content))

        return formatted_messages

    async def generate_response(self, messages: List[Message]) -> str:
        """Generate a response using LangChain."""
        formatted_messages = self.format_messages(messages)
        response = self.llm(formatted_messages)
        return response.content

    async def generate_streaming_response(self, messages: List[Message]):
        """Generate a streaming response using LangChain."""
        formatted_messages = self.format_messages(messages)

        # Set up a streaming chat model
        streaming_llm = ChatOpenAI(
            model_name=settings.LLM_MODEL,
            openai_api_key=settings.OPENAI_API_KEY,
            streaming=True,
            temperature=0.7,
        )

        # Stream the response
        for chunk in streaming_llm.stream(formatted_messages):
            if hasattr(chunk, "content"):
                yield chunk.content
            else:
                # Fallback in case the chunk structure is different
                yield chunk.get("content", "")
