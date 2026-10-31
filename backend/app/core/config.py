import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Visit Record by Voice"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-key-visit-record-voice-hackathon-2026")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Sarvam Saaras Speech Recognition API
    SARVAM_API_KEY: str = os.getenv("SARVAM_API_KEY", "")
    SARVAM_API_URL: str = "https://api.sarvam.ai/speech-to-text"
    
    # LLM extraction
    LLM_API_KEY: str = os.getenv("LLM_API_KEY", "")
    LLM_MODEL: str = os.getenv("LLM_MODEL", "gemini-1.5-pro")

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
