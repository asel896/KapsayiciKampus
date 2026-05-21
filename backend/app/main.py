from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1 import auth, task, ai, analytics
from app.api.v1.websocket import sio_app
from app.api.v1.pomodoro import router as pomodoro_router
from app.database.session import Base, engine 
from app.models.setting import UserSetting
from app.api.v1.setting import router as setting_router
from datetime import datetime

# Modelleri önceden yükleyerek SQLAlchemy ilişkilerinin kilitlenmesini engelliyoruz.
from app.models.user import User
from app.models.task import Task
from app.models.pomodoro import Pomodoro
try:
    from app.models.badge import Badge, UserBadge
except ImportError:
    pass

# FastAPI uygulamasını tek bir kez başlatıyoruz
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="CampusFlow: Akademik Odaklanma ve Kampüs Sosyal Ağı API Altyapısı"
)

# 🔥 CORS AYARI
origins = [
    "http://localhost:3000",      # React varsayılan portu
    "http://localhost:5173",      # Vite (React) varsayılan portu
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"], 
)

# 🌐 Sağlık Kontrolü
@app.get("/")
async def root():
    return {
        "status": "online",
        "message": "CampusFlow API Altyapısı Aktif!",
        "version": settings.VERSION
    }


@app.on_event("startup")
async def startup_event():
    async with engine.begin() as conn:
        # Veritabanında eksik olan tabloları otomatik yaratır
        await conn.run_sync(Base.metadata.create_all)


# 🚀 TÜM ROTALARI DOĞRU VE TEK BİR YERDE EKLİYORUZ
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Kimlik Doğrulama"])
app.include_router(task.router, prefix="/api/v1/tasks", tags=["Görevler / Yapılacaklar"])
app.include_router(ai.router, prefix="/api/v1/ai", tags=["Yapay Zeka (Gemini Asistan)"])
app.include_router(pomodoro_router, prefix="/api/v1/pomodoro", tags=["Pomodoro"])
app.include_router(setting_router, prefix="/api/v1", tags=["Ayarlar"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["Dashboard / Analitikler"])

# Socket.IO bağlantısı
app.mount("/socket.io", app=sio_app)