from typing import Any, List
import json

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "SupportFlow API"

    DATABASE_URL: str

    CORS_ORIGINS: List[str] = ["http://localhost:5173"]

    JWT_SECRET: str
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_HOURS: int = 8

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, value: Any):
        if isinstance(value, str):
            try:
                return json.loads(value)
            except Exception:
                return [origin.strip() for origin in value.split(",")]
        return value

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
    )


settings = Settings()