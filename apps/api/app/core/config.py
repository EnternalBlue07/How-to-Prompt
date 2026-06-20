from functools import lru_cache

from pydantic import AnyUrl, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "PromptVerse X API"
    database_url: str = Field(
        default="postgresql+asyncpg://promptverse:promptverse_dev_password@localhost:5432/promptverse"
    )
    clerk_issuer: AnyUrl
    clerk_jwks_url: AnyUrl
    cors_origins: list[str] = Field(default_factory=lambda: ["http://localhost:3000"])


@lru_cache
def get_settings() -> Settings:
    return Settings()
