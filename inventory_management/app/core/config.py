# app/core/config.py
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MSSQL_SERVER: str
    MSSQL_DATABASE: str
    MSSQL_PORT: int = 1433
    
    # JWT settings
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60

    # Database settings (from .env)
    DB_USER: str | None = None
    DB_PASSWORD: str | None = None
    DB_HOST: str | None = None
    DB_PORT: str | None = None
    DB_NAME: str | None = None

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"  # Allow extra fields in .env

settings = Settings()
