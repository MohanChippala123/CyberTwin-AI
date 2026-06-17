from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    ANTHROPIC_API_KEY: str
    DATABASE_URL: str = "sqlite:///./cybertwin.db"
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000"

    class Config:
        env_file = ".env"
        case_sensitive = True

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]

settings = Settings()
