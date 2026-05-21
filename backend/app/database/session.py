from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

# .env'den gelen URL'yi kontrol edip asenkron sürücüyü (asyncpg) zorunlu kılıyoruz
if settings.DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = settings.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)
else:
    DATABASE_URL = settings.DATABASE_URL

# Asenkron motor kurulumu
engine = create_async_engine(
    DATABASE_URL, 
    echo=True,       # Konsolda SQL sorgularını görmek için (Geliştirme aşamasında çok işimize yarayacak)
    future=True
)

# Sorguları yönetecek asenkron session yapısı
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

Base = declarative_base()