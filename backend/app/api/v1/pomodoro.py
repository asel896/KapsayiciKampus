from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import func
from datetime import datetime

from app.api import deps
from app.models.pomodoro import Pomodoro
from app.models.task import Task
from app.models.user import User
from app.schemas.pomodoro import PomodoroCreate, PomodoroOut, StatsOut
from app.services.badge_service import badge_service

# ❌ BURADAKİ HATALI KENDİ KENDİNİ İMPORT EDEN SATIRLAR TAMAMEN SİLİNDİ!

router = APIRouter()

# 📝 1. POMODORO OTURUMUNU KAYDET (POST /api/v1/pomodoro/save)
@router.post("/save", response_model=PomodoroOut, status_code=status.HTTP_201_CREATED)
async def save_pomodoro(
    pomodoro_in: PomodoroCreate,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    duration_val = getattr(pomodoro_in, "duration", getattr(pomodoro_in, "duration_minutes", 25))
    mode_val = getattr(pomodoro_in, "mode", "pomodoro")
    
    now = datetime.now()
    date_str = now.strftime("%d.%m.%Y")
    hour_int = now.hour

    new_pomodoro = Pomodoro(
        user_id=current_user.id,
        date=date_str,
        duration=duration_val,
        mode=mode_val,
        hour=hour_int
    )
    db.add(new_pomodoro)
    
    if hasattr(current_user, "total_sessions"):
        current_user.total_sessions = (current_user.total_sessions or 0) + 1
        db.add(current_user)
        
    await db.commit()
    await db.refresh(new_pomodoro)
    await db.refresh(current_user)
    
    await badge_service.check_and_award_badges(db=db, user_id=current_user.id)
    
    return {
        "id": new_pomodoro.id,
        "user_id": new_pomodoro.user_id,
        "task_id": getattr(pomodoro_in, "task_id", None),
        "duration_minutes": duration_val,
        "completed_at": getattr(new_pomodoro, "created_at", now)
    }


# ⏱️ 2. GEÇMİŞ POMODOROLARI LİSTELE (GET /api/v1/pomodoro)
@router.get("/", response_model=List[PomodoroOut])
async def get_pomodoros(
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    order_column = Pomodoro.created_at.desc() if hasattr(Pomodoro, 'created_at') else Pomodoro.id.desc()
    
    result = await db.execute(
        select(Pomodoro)
        .where(Pomodoro.user_id == current_user.id)
        .order_by(order_column)
    )
    
    raw_pomodoros = result.scalars().all()
    formatted_pomodoros = []
    for p in raw_pomodoros:
        formatted_pomodoros.append({
            "id": p.id,
            "user_id": p.user_id,
            "task_id": None,
            "duration_minutes": getattr(p, "duration", 25),
            "completed_at": getattr(p, "created_at", datetime.now())
        })
    return formatted_pomodoros


# 📊 3. GENEL İSTATİSTİKLERİ GETİR (GET /api/v1/stats)
@router.get("/stats", response_model=StatsOut)
async def get_user_stats(
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    task_result = await db.execute(
        select(func.count(Task.id)).where(Task.user_id == current_user.id, Task.done == True)
    )
    completed_tasks_count = task_result.scalar() or 0
    
    pomo_result = await db.execute(
        select(func.count(Pomodoro.id), func.sum(Pomodoro.duration))
        .where(Pomodoro.user_id == current_user.id)
    )
    pomo_stats = pomo_result.all()
    
    total_pomodoros = pomo_stats[0][0] or 0
    total_minutes = pomo_stats[0][1] or 0
    
    session_count = getattr(current_user, "total_sessions", 0) or 0
    total_mins_calc = session_count * 25
    total_xp_calc = (total_mins_calc * 2) + (session_count * 15)
    current_level = (total_xp_calc // 500) + 1

    return {
        "total_pomodoros": total_pomodoros,
        "total_minutes": total_minutes,
        "completed_tasks_count": completed_tasks_count,
        "level": current_level,
        "total_xp": total_xp_calc
    }


# 🗑️ 4. POMODORO OTURUMUNU SİL (DELETE /api/v1/pomodoro/{id})
@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_pomodoro(
    id: int,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    result = await db.execute(
        select(Pomodoro).where(Pomodoro.id == id, Pomodoro.user_id == current_user.id)
    )
    pomodoro = result.scalar_one_or_none()
    
    if not pomodoro:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Pomodoro oturumu bulunamadı.")
        
    await db.delete(pomodoro)
    
    if hasattr(current_user, "total_sessions") and (current_user.total_sessions or 0) > 0:
        current_user.total_sessions -= 1
        db.add(current_user)
        
    await db.commit()
    return None


# 🔄 5. POMODORO OTURUMUNU GÜNCELLE (PUT /api/v1/pomodoro/{id})
@router.put("/{id}", response_model=PomodoroOut)
async def update_pomodoro(
    id: int,
    pomodoro_in: PomodoroCreate,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    result = await db.execute(
        select(Pomodoro).where(Pomodoro.id == id, Pomodoro.user_id == current_user.id)
    )
    pomodoro = result.scalar_one_or_none()
    
    if not pomodoro:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Pomodoro oturumu bulunamadı.")
        
    duration_val = getattr(pomodoro_in, "duration", getattr(pomodoro_in, "duration_minutes", 25))
    mode_val = getattr(pomodoro_in, "mode", "pomodoro")
    
    pomodoro.duration = duration_val
    pomodoro.mode = mode_val
    
    db.add(pomodoro)
    await db.commit()
    await db.refresh(pomodoro)
    
    return {
        "id": pomodoro.id,
        "user_id": pomodoro.user_id,
        "task_id": getattr(pomodoro_in, "task_id", None),
        "duration_minutes": pomodoro.duration,
        "completed_at": getattr(pomodoro, "created_at", datetime.now())
    }