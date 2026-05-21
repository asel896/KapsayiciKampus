import os
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# .env dosyasındaki değişkenleri sisteme yükle
load_dotenv()

class Settings(BaseSettings):
    PROJECT_NAME: str = os.getenv("PROJECT_NAME", "CampusFlow")
    VERSION: str = os.getenv("VERSION", "1.0.0")
    API_V1_STR: str = os.getenv("API_V1_STR", "/api/v1")
    
    # JWT & Güvenlik
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-key-change-me")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))
    
    # Veritabanı
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    
    # Gemini AI
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

    class Config:
        case_sensitive = True

# 🚨 Hatanın sebebi bu satırın eksik veya hatalı olması! 
# FastAPI'nin diğer dosyalardan "from app.core.config import settings" diyerek çağırabilmesi için bu nesne şart.
settings = Settings()