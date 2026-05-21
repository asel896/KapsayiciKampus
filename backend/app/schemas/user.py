from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# Kullanıcı verilerinin ortak alanları
class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    campus_name: Optional[str] = "Genel"

# Kayıt olurken frontend'den istenecek veriler
class UserCreate(UserBase):
    password: str

# API'den dışarıya (React'e) kullanıcı bilgilerini dönerken kullanılacak şema
# Güvenlik nedeniyle şifreyi burada ASLA geri dönmeyiz.
class UserOut(UserBase):
    id: int
    total_xp: int
    level: int
    created_at: datetime

    class Config:
        from_attributes = True

# Başarılı giriş sonrasında React'e verilecek Token şeması
class Token(BaseModel):
    access_token: str
    token_type: str