from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.api import deps
from app.core import security
from app.core.config import settings
from app.models.user import User
from app.schemas.user import UserCreate, UserOut, Token

# Uvicorn'un arayıp bulamadığı, eksik olan kritik tanım tam olarak buydu:
router = APIRouter()


# 📝 KAYIT OLMA (REGISTER) ENDPOINT'I
@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserCreate, db: AsyncSession = Depends(deps.get_db)):
    # 1. Bu e-posta adresiyle daha önce kayıt olunmuş mu kontrol et
    result = await db.execute(select(User).where(User.email == user_in.email))
    existing_user = result.scalar_one_or_none()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Bu e-posta adresi zaten kullanımda."
        )
    
    # 2. Şifreyi güvenli bir şekilde hash'le
    hashed_password = security.get_password_hash(user_in.password)
    
    # 3. Yeni kullanıcı nesnesini oluştur (Mevcut veritabanı alanlarına birebir uygun)
    new_user = User(
        email=user_in.email,
        first_name=user_in.first_name,
        last_name=user_in.last_name,
        password_hash=hashed_password,
        campus_name=user_in.campus_name
    )
    
    # 4. Veritabanına kaydet
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    return new_user


# 🔑 GİRİŞ YAPMA (LOGIN) ENDPOINT'I
@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(deps.get_db)
):
    # 1. Kullanıcıyı e-postasına göre ara (OAuth2 formunda username alanına e-posta yazılır)
    result = await db.execute(select(User).where(User.email == form_data.username))
    user = result.scalar_one_or_none()
    
    # 2. Kullanıcı var mı ve şifre doğru mu kontrol et
    if not user or not security.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="E-posta veya şifre hatalı."
        )
    
    # 3. Güvenli JWT Token üret ve süre sınırını belirle
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        subject=user.id, expires_delta=access_token_expires
    )
    
    # 4. Token'ı React'e teslim et
    return {"access_token": access_token, "token_type": "bearer"}


# 👤 KULLANICI PROFİL BİLGİSİ (GET /api/auth/me) ENDPOINT'I
# Giriş yapmış olan kullanıcının o anki güncel bilgilerini (Level, XP, Seans vb.) döner.
@router.get("/me", response_model=UserOut)
async def get_me(current_user: User = Depends(deps.get_current_user)):
    # 🎯 Sadece sondaki yazım hatası düzeltildi, mevcut güvenli akış korundu.
    return current_user