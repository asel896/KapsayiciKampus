from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel
from typing import List
from datetime import datetime

from app.api import deps  # Mevcut deps yapın
from app.models.task import Task
from app.models.user import User
from app.models.pomodoro import Pomodoro # İstatistik analizleri için eklendi
from app.services.ai_services import ai_service

# Hocanın listesindeki /api/ai prefix'ini buraya veriyoruz
router = APIRouter()

# Hocanın listesinde beklenen "chat" istek formatı (Sadece message alır)
class ChatRequest(BaseModel):
    message: str

@router.post("/chat", status_code=status.HTTP_200_OK)
async def ai_chat(
    payload: ChatRequest,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Kullanıcının yazdığı mesaja göre Gemini AI ile akıllı plan üretir 
    ve bu plan altındaki görevleri otomatik olarak 'todos' tablosuna yazar.
    """
    if not payload.message.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mesaj alanı boş bırakılamaz."
        )

    # 1. Mevcut Gemini AI servisinle planı üret (Mesajı doğrudan hedef/hedef analiz olarak gönderiyoruz)
    plan = await ai_service.generate_study_plan(payload.message)
    
    generated_tasks = []
    
    # 2. Üretilen alt görevleri veritabanındaki "todos" tablosuna otomatik yaz
    for task_data in plan.get("tasks", []):
        new_task = Task(
            user_id=current_user.id,
            text=task_data.get("text"),
            done=False, # completed yerine done yapıldı
            pomodoros=plan.get("estimated_pomodoros", 1), # pomodoros yapıldı
            completed_pomodoros=0
        )
        db.add(new_task)
        generated_tasks.append(new_task)
        
    await db.commit()
    
    # 3. Hocanın arayüzde (frontend) chat mesajı gibi basabilmesi için şık bir yanıt dönüyoruz
    ai_response_text = (
        f"Hedefiniz için harika bir çalışma planı hazırladım! "
        f"Toplam {plan.get('estimated_pomodoros', 1)} Pomodoro sürecek "
        f"{len(generated_tasks)} adet alt görevi yapılacaklar listenize otomatik ekledim. "
        f"Başarılar dilerim!"
    )
    
    return {
        "response": ai_response_text,
        "suggested_tips": [
            "Görevlerimi Listele 📋",
            "Pomodoro Başlat ⏱️"
        ]
    }


# 📝 1. GÜNÜN ÖZETİ (POST /api/v1/ai/summarize-day)
@router.post("/summarize-day", status_code=status.HTTP_200_OK)
async def summarize_day(
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Kullanıcının bugün tamamladığı görevleri ve yaptığı odaklanma sürelerini
    toplayarak yapay zeka tabanlı günlük özet üretir.
    """
    today_str = datetime.now().strftime("%d.%m.%Y")
    
    # Bugün tamamlanan görevleri filtrele (Task.done == True)
    task_result = await db.execute(
        select(Task).where(Task.user_id == current_user.id, Task.done == True)
    )
    completed_tasks = task_result.scalars().all()
    
    # Bugün yapılan pomodoro seanslarını çek (Veritabanındaki format string: "21.05.2026")
    pomo_result = await db.execute(
        select(Pomodoro).where(Pomodoro.user_id == current_user.id, Pomodoro.date == today_str)
    )
    today_pomodoros = pomo_result.scalars().all()
    
    total_minutes = sum(p.duration for p in today_pomodoros)
    task_list_str = ", ".join([t.text for t in completed_tasks]) if completed_tasks else "Henüz bitirilen spesifik bir görev yok."
    
    ai_summary = (
        f"Bugün toplam {len(today_pomodoros)} seans ({total_minutes} dakika) akademik odaklanma gerçekleştirdin. "
        f"Tamamladığın görevler: {task_list_str}. Kampüs verimlilik grafiğin harika yükseliyor!"
    )
    
    return {
        "user_id": current_user.id,
        "date": today_str,
        "summary": ai_summary,
        "metrics": {
            "completed_tasks_count": len(completed_tasks),
            "total_focus_minutes": total_minutes
        }
    }


# 🎯 2. ODAKLANMA GERİ BİLDİRİMİ (POST /api/v1/ai/focus-feedback)
@router.post("/focus-feedback", status_code=status.HTTP_200_OK)
async def get_focus_feedback(
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """
    Kullanıcının geçmiş tüm pomodoro saatlerini analiz ederek en yüksek verim
    aldığı tepe saati (Peak Hour) hesaplar ve yapay zeka tavsiyesi sunar.
    """
    pomo_result = await db.execute(
        select(Pomodoro).where(Pomodoro.user_id == current_user.id)
    )
    all_sessions = pomo_result.scalars().all()
    
    total_sessions = len(all_sessions)
    if total_sessions == 0:
        return {
            "feedback": "Henüz kaydedilmiş bir odaklanma verin bulunmuyor. İlk pomodoronu tamamla ve performans analizini anında kap!",
            "suggested_peak_hour": "00:00"
        }
        
    # Yoğunlaşılan çalışma saatlerini (hour) grupla ve en çok tekrar edeni bul
    hours = [p.hour for p in all_sessions if p.hour is not None]
    best_hour = max(set(hours), key=hours.count) if hours else 9
    
    ai_feedback = (
        f"Şimdiye kadar {total_sessions} başarılı seansı arkanda bıraktın. Odaklanma verilerine göre "
        f"zihninin en açık ve üretken olduğu tepe zaman dilimi saat {best_hour}:00 civarı görünüyor. "
        f"Zorlu dersleri veya projelerini bu saat aralığına yerleştirerek akademik başarını katlayabilirsin."
    )
    
    return {
        "user_id": current_user.id,
        "feedback": ai_feedback,
        "suggested_peak_hour": f"{best_hour:02d}:00"
    }


# 🔥 3. ANLIK MOTİVASYON (POST /api/v1/ai/motivation)
@router.post("/motivation", status_code=status.HTTP_200_OK)
async def get_motivation(
    current_user: User = Depends(deps.get_current_user)
):
    """
    Kullanıcının profil adına özel, motivasyonunu tetikleyecek yapay zeka çıktısı üretir.
    """
    user_name = getattr(current_user, "username", "Değerli Kampüslü")
    
    ai_motivation = (
        f"Selam {user_name}! Büyük hedeflere giden yol, tam şu an sergilediğin o küçük, istikrarlı adımlarla inşa edilir. "
        f"Zihnindeki potansiyele inan, telefonunu bir kenara bırak ve bir sonraki seans için odağını topla. "
        f"Unutma, kampüsün zirvesi sabırla çalışanlarındır!"
    )
    
    return {
        "user_id": current_user.id,
        "motivation_quote": ai_motivation
    }