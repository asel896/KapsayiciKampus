from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from app.models.badge import Badge
from app.models.task import Task
from app.models.user import User

class BadgeService:
    async def check_and_award_badges(self, db: AsyncSession, user_id: int):
        # 1. Kullanıcının tamamladığı TÜM normal görevlerin sayısını çekelim
        # 🌟 KRİTİK DÜZELTME: Veritabanındaki gerçek sütun adı olan Task.done kullanıldı!
        all_tasks_query = await db.execute(
            select(Task).where(Task.user_id == user_id, Task.done == True)
        )
        completed_all_tasks = all_tasks_query.scalars().all()
        completed_tasks_count = len(completed_all_tasks)

        # 2. Kullanıcının tamamladığı YAPAY ZEKA görevlerinin sayısını çekelim
        ai_tasks_count = sum(
            1 for t in completed_all_tasks 
            if t.text and ("-" in t.text or "Konu Tekrarı" in t.text or "Soru Çözümü" in t.text)
        )

        # 3. Kullanıcıyı rozetleriyle birlikte veritabanından güvenli bir şekilde çekelim
        user_query = await db.execute(
            select(User).where(User.id == user_id).options(selectinload(User.badges))
        )
        user = user_query.scalar_one_or_none()
        
        if not user:
            return  # Kullanıcı bulunamadıysa işlemi durdur

        # 🎯 Frontend'deki Kariyer kartı ve Level hesaplaması için 
        # Kullanıcının toplam tamamlanan seans/görev istatistiğini güncelliyoruz.
        if hasattr(user, "total_sessions"):
            user.total_sessions = completed_tasks_count
            db.add(user)

        # 4. Sistemde tanımlı olan tüm rozet türlerini getir
        badges_query = await db.execute(select(Badge))
        all_badges = badges_query.scalars().all()

        # 5. Rozet kazanma mantığını işletelim
        for badge in all_badges:
            # Eğer kullanıcı bu rozete zaten sahipse mükerrer ekleme yapma, geç
            if badge in user.badges:
                continue

            # Güvenli erişim sağlamak için attribute kontrolleri ekliyoruz
            b_type = getattr(badge, "badge_type", None)
            b_req = getattr(badge, "requirement", 0)

            # A) NORMAL GÖREV ROZETİ KONTROLÜ
            if b_type == "completed_tasks" and completed_tasks_count >= b_req:
                user.badges.append(badge)

            # B) YAPAY ZEKA GÖREVİ ROZETİ KONTROLÜ
            elif b_type == "ai_tasks" and ai_tasks_count >= b_req:
                user.badges.append(badge)
                
        # Değişiklikleri veritabanına kalıcı olarak kaydet
        await db.commit()

badge_service = BadgeService()