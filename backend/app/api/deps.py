from typing import AsyncGenerator
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import ValidationError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.config import settings
from app.core.security import ALGORITHM
from app.database.session import SessionLocal
from app.models.user import User

# React veya Swagger UI'dan giriş token'ının aranacağı endpoint adresini belirtiyoruz
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login"
)

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Her HTTP isteği geldiğinde yeni bir asenkron veritabanı oturumu açar,
    işlem bittiğinde ise bu oturumu otomatik olarak kapatır (Memory Leak engeller).
    """
    async with SessionLocal() as session:
        yield session


async def get_current_user(
    db: AsyncSession = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> User:
    """
    İsteği atan kullanıcının JWT Token'ını çözer, doğrular ve 
    veritabanındaki kullanıcı nesnesini (User) endpoint'e enjekte eder.
    """
    try:
        # Token'ı gizli anahtarımızla çözüyoruz
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Geçersiz kimlik doğrulama token'ı.",
            )
    except (JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Kimlik doğrulama token'ı doğrulanamadı.",
        )
    
    # Sendeki veritabanı yapısı INTEGER (1, 2, 3...) ID kullandığı için user_id'yi int'e çeviriyoruz
    try:
        user_id_int = int(user_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Geçersiz kullanıcı ID formatı.",
        )

    # Veritabanından bu ID'ye sahip kullanıcıyı çekiyoruz
    result = await db.execute(select(User).where(User.id == user_id_int))
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Kullanıcı bulunamadı."
        )
        
    return user