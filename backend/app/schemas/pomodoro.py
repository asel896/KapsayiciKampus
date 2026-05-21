from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# Pomodoro kaydederken frontend'den beklenen veriler
class PomodoroCreate(BaseModel):
    task_id: Optional[int] = None
    duration_minutes: int = 30  # Varsayılan 30 dk

# Veritabanından frontend'e dönecek Pomodoro verisi
class PomodoroOut(BaseModel):
    id: int
    user_id: int
    task_id: Optional[int]
    duration_minutes: int
    completed_at: datetime

    class Config:
        from_attributes = True

# İstatistikler (Stats) için dönüş şeması
class StatsOut(BaseModel):
    total_pomodoros: int
    total_minutes: int
    completed_tasks_count: int
    level: int
    total_xp: int