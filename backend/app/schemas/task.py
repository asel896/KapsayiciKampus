from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Ortak Todo alanları
class TaskBase(BaseModel):
    text: str
    category: Optional[str] = "study"
    priority: Optional[str] = "medium"
    completed: Optional[bool] = False
    estimated_pomodoros: Optional[int] = 1
    completed_pomodoros: Optional[int] = 0

# Yeni Todo oluştururken frontend'den istenecek alanlar
class TaskCreate(TaskBase):
    pass

# Todo güncellenirken (Örn: tamamlandı işaretlenirken veya pomodoro sayısı artarken)
class TaskUpdate(BaseModel):
    text: Optional[str] = None
    category: Optional[str] = None
    priority: Optional[str] = None
    completed: Optional[bool] = None
    estimated_pomodoros: Optional[int] = None
    completed_pomodoros: Optional[int] = None

# Veritabanından React'e gönderilecek temiz veri yapısı
class TaskOut(TaskBase):
    id: int
    user_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True