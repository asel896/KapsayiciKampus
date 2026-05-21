import asyncio
from app.api.deps import get_db
from app.models.badge import Badge, user_badges
from sqlalchemy import text
from sqlalchemy.future import select

async def main():
    print("⏳ 12 Şanlı rozet ve ilişki köprüleri veritabanına işleniyor...")
    
    db_gen = get_db()
    db = await db_gen.__anext__()
    
    try:
        conn = await db.connection()
        print("🧹 Sadece eski rozet tabloları temizleniyor...")
        await conn.run_sync(lambda sync_conn: sync_conn.execute(text("DROP TABLE IF EXISTS user_badges CASCADE;")))
        await conn.run_sync(lambda sync_conn: sync_conn.execute(text("DROP TABLE IF EXISTS badges CASCADE;")))
        
        await conn.run_sync(user_badges.metadata.create_all)
        print("✅ Rozet tabloları yeni kolonlarla sıfırdan senkronize edildi.")
        
        # Frontend kodundaki b.id ve animasyon eşleşmelerine göre tam liste
        target_badges = [
            # POMODORO / ODAKLANMA ROZETLERİ (Frontend ID'leri ile birebir uyumlu)
            Badge(title="İlk Adım", description="İlk odaklanma oturumunu tamamla!", icon="step.json", badge_type="first", requirement=1, xp_reward=50, rarity="common"),
            Badge(title="Kıvılcım", description="5 odaklanma oturumu tamamla!", icon="fire.json", badge_type="focus5", requirement=5, xp_reward=120, rarity="rare"),
            Badge(title="Güneşli", description="25 odaklanma oturumu tamamla!", icon="sun.json", badge_type="focus25", requirement=25, xp_reward=300, rarity="epic"),
            Badge(title="Keskin", description="100 odaklanma oturumu tamamla!", icon="bolt.json", badge_type="focus100", requirement=100, xp_reward=1000, rarity="legendary"),
            
            # DİĞER ROZETLER (Görseldeki 12'li matrisi tamamlamak için)
            Badge(title="Güç", description="Görevlerini tamamlamaya baş!", icon="target.json", badge_type="completed_tasks", requirement=1, xp_reward=100, rarity="common"),
            Badge(title="Tempo", description="Üst üste aktiviteleri sürdür!", icon="run.json", badge_type="completed_tasks", requirement=5, xp_reward=100, rarity="common"),
            Badge(title="Yükselen", description="Performansını zirveye taşı!", icon="rocket.json", badge_type="completed_tasks", requirement=10, xp_reward=100, rarity="common"),
            Badge(title="Yörünge", description="Uzun süreli odaklanma sağla!", icon="galaxy.json", badge_type="completed_tasks", requirement=20, xp_reward=100, rarity="common"),
            Badge(title="Efsane", description="Büyük başarılara imza at!", icon="trophy.json", badge_type="completed_tasks", requirement=50, xp_reward=100, rarity="common"),
            Badge(title="Uzaylı", description="Sınırları zorla!", icon="star.json", badge_type="completed_tasks", requirement=75, xp_reward=100, rarity="common"),
            Badge(title="Pomodoro Kralı", description="Kampüsün lideri ol!", icon="crown.json", badge_type="completed_tasks", requirement=100, xp_reward=100, rarity="common"),
            Badge(title="Zirve", description="Tüm aşamaları tamamla!", icon="diamond.json", badge_type="completed_tasks", requirement=150, xp_reward=200, rarity="common")
        ]
        
        db.add_all(target_badges)
        await db.commit()
        print("🎖️ 12 Başarı rozeti frontend ile uyumlu şekilde veritabanına işlendi!")
        
    except Exception as e:
        print(f"❌ Hata oluştu: {e}")
    finally:
        await db_gen.aclose()

if __name__ == "__main__":
    asyncio.run(main())