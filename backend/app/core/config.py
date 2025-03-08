# app/core/config.py
from typing import List
from pydantic import BaseSettings, validator


class Settings(BaseSettings):
    PROJECT_NAME: str = "Chat API"
    PROJECT_DESCRIPTION: str = "FastAPI backend with LangChain for chat applications"
    PROJECT_VERSION: str = "0.1.0"

    # API settings
    API_PREFIX: str = "/api"

    # CORS settings
    CORS_ORIGINS: List[str] = ["http://localhost:3000"]

    # LLM settings
    LLM_MODEL: str = "gpt-4o-mini"
    OPENAI_API_KEY: str = ""

    @validator("OPENAI_API_KEY", pre=True)
    def validate_openai_api_key(cls, v):
        if not v:
            raise ValueError("OPENAI_API_KEY is required")
        return v

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
