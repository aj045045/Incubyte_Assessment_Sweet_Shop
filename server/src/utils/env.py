from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field


class EnvSettings(BaseSettings):
    """
    Environment variables configuration.
    Auto-loads from .env file and system environment.
    """

    MONGO_URI: str = Field(...)
    MONGO_DB: str = Field(...)
    SECRET_KEY: str = Field(...)
    ALGORITHM: str = Field(...)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(...)

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


env_settings = EnvSettings()

__all__ = ["env_settings"]
