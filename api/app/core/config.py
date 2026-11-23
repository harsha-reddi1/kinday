from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "kinDay Backend Service"
    API_V1_STR: str = "/api/v1"
    APP_ENV: str = "development"

    # Supabase Credentials (Service role is strictly server-side)
    SUPABASE_URL: str = "https://your-project.supabase.co"
    SUPABASE_SERVICE_ROLE_KEY: str = "your-service-role-key"

    # Google Gemini AI (Paid billing tier)
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-2.5-flash"

    # Pairing & Security Settings
    PAIRING_CODE_TTL_MINUTES: int = 10
    MAX_CIRCULAR_PAGES: int = 5
    FREE_CIRCULAR_QUOTA_PER_MONTH: int = 5

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://app.kinday.com"
    ]

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()
