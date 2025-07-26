from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field


class EnvSettings(BaseSettings):
    """
    Environment variables configuration.
    Auto-loads from .env file and system environment.
    """

    MONGO_URI: str = Field(..., description="MongoDB connection string")
    MONGO_DB: str = Field(..., description="MongoDB database name")

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


env_settings = EnvSettings()

__all__ = ["env_settings"]
