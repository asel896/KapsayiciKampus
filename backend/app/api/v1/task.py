from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload  # 🎯 KRİTİK: İlişkili rozetleri asenkron yüklemek için ekledik

from app.api import deps
from app.models.task import Task
from app.models.user import User
from app.models.badge import Badge  # 🎯 KRİTİK: Tüm rozet kalıplarını sorgulamak için ekledik
from app.schemas.task import TaskCreate, TaskOut, TaskUpdate
# ⚠️ Rozet servisini buraya import ediyoruz (Dosyayı oluşturduğunda çalışacak)
from app.services.badge_service import badge_service 

router = APIRouter()

# 📋 1. KULLANICININ TÜM GÖREVLERİNİ LİSTELE (GET)
@router.get("/", response_model=List[TaskOut])
async def get_tasks(
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    result = await db.execute(
        select(Task).where((Task.user_id == current_user.id) | (Task.user_id == None)).order_by(Task.id.asc())
    )
    return result.scalars().all()


# ➕ 2. YENİ GÖREV EKLE (POST)
@router.post("/", response_model=TaskOut, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_in: TaskCreate,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    new_task = Task(
    user_id=current_user.id,
    text=payload.text,
    done=False, # completed yerine done
    pomodoros=payload.pomodoros or 1, # estimated_pomodoros yerine pomodoros
    completed_pomodoros=0
    )
    
    db.add(new_task)
    await db.commit()
    await db.refresh(new_task)
    return new_task


# 🎖️ 3. KULLANICININ KAZANDIĞI ROZETLERİ LİSTELE (GET)
# FastAPI'nin çakışma yaşamaması ve "my-badges" kelimesini "task_id" sanmaması için bu endpoint üste taşındı.
# Frontend bu endpoint'e istek atarak hem sol kariyer panelini hem de sağ başarı kartlarını besleyecek
@router.get("/my-badges", status_code=status.HTTP_200_OK)
async def get_my_badges(
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    # Kullanıcının rozetler ilişkisini (badges) taze bir şekilde ve asenkron güvenle çekiyoruz
    result = await db.execute(
        select(User)
        .where(User.id == current_user.id)
        .options(selectinload(User.badges))
    )
    user_with_badges = result.scalar_one()
    
    # Kullanıcının veritabanındaki oturum verilerini alalım (Yoksa 0 kabul edelim)
    # total_sessions alan adı modelinde neyse ona göre eşitleyebilirsin
    session_count = getattr(user_with_badges, "total_sessions", 0) or 0
    
    # --- FRONTEND ALGORİTMASININ BİREBİR İKİZİ ---
    total_mins = session_count * 25 
    total_xp = (total_mins * 2) + (session_count * 15)
    
    current_level = (total_xp // 500) + 1
    current_level_xp = total_xp % 500
    level_progress = (current_level_xp / 500) * 100

    # Veritabanına tohumladığımız (seed) tüm 12 rozet şablonunu çekelim
    all_badges_result = await db.execute(select(Badge))
    all_badges = all_badges_result.scalars().all()
    
    # Kullanıcının şu ana kadar gerçekten kazanıp cüzdanına eklediği rozetlerin ID'leri
    unlocked_badge_ids = {badge.id for badge in user_with_badges.badges}
    
    achievements_list = []
    
    for badge in all_badges:
        # Kullanıcı veritabanında bu rozete sahip mi yoksa mevcut istatistiği kilit açmaya yetiyor mu?
        has_badge = badge.id in unlocked_badge_ids or session_count >= badge.requirement
        
        # Rozet barı için yüzde hesaplama
        if session_count >= badge.requirement:
            progress_percentage = 100
        else:
            progress_percentage = int((session_count / badge.requirement) * 100) if badge.requirement > 0 else 0

        # React tarafındaki BADGE_DEFS map döngüsüne tam enjeksiyon şeması
        achievements_list.append({
            "id": badge.badge_type,       # Frontend tarafında 'first', 'focus5' vb. ID kontrolü için
            "name": badge.title,          # b.name
            "desc": badge.description,    # b.desc
            "task": f"{badge.requirement} Pomodoro Oturumu", # b.task (Kilitliyken gösterilecek hedef)
            "anim": badge.icon,           # animationMap[b.anim] ile Lottie JSON dosyasını tetikler
            "rarity": badge.rarity.lower() if badge.rarity else "common", # rarityStyles[meta.rarity] için küçük harf
            "xp": badge.xp_reward,        # meta.xp
            "progress": progress_percentage,
            "has_unlocked": has_badge     # Kartın 'unlocked' veya 'locked' class almasını sağlar
        })

    # Kariyer ve Rozetler bir arada döner, frontend tek API çağrısıyla tüm sayfayı çizer!
    return {
        "career": {
            "level": current_level,
            "current_level_xp": current_level_xp,
            "level_progress": level_progress,
            "total_xp": total_xp,
            "session_count": session_count,
            "total_mins": total_mins
        },
        "achievements": achievements_list
    }


# 🔄 4. GÖREVİ GÜNCELLE / TAMAMLANDI YAP (PUT)
@router.put("/{task_id}", response_model=TaskOut)
async def update_task(
    task_id: int,
    task_in: TaskUpdate,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalar_one_or_none()
    
    if not task:
        raise HTTPException(status_code=404, detail="Görev bulunamadı.")
        
    # Gelen güncelleme isteklerini uyguluyoruz
    task_data = task_in.model_dump(exclude_unset=True)
    for key, value in task_data.items():
        setattr(task, key, value)
        
    await db.commit()
    await db.refresh(task)

    # 🎖️ KRİTİK DOKUNUŞ: Görev başarıyla tamamlandıysa, rozet kazanıp kazanmadığını kontrol et!
    if task.completed:
        await badge_service.check_and_award_badges(db=db, user_id=current_user.id)

    return task


# ❌ 5. GÖREVİ SİL (DELETE)
@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: int,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalar_one_or_none()
    
    if not task:
        raise HTTPException(status_code=404, detail="Görev bulunamadı.")
        
    await db.delete(task)
    await db.commit()
    return None