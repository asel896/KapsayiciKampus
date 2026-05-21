from pydantic import BaseModel
from typing import List, Dict

class DailyFocus(BaseModel):
    date: str          # Örn: "2026-05-21" veya "Pazartesi"
    total_minutes: int # O gün toplam kaç dakika odaklandı?

class WeeklyAnalyticsOut(BaseModel):
    total_focus_time: int       # Haftalık toplam odaklanma (dakika)
    completed_pomodoros: int    # Tamamlanan toplam pomodoro sayısı
    daily_distribution: List[DailyFocus] # Gün gün dağılım

class MonthlyAnalyticsOut(BaseModel):
    total_focus_time: int
    completed_pomodoros: int
    monthly_distribution: List[DailyFocus]

class StreakOut(BaseModel):
    current_streak: int  # Şu anki aktif seri (kaç gündür üst üste giriyor?)
    longest_streak: int  # Kullanıcının rekor serisi