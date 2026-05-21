from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship
from app.database.session import Base

# Çoka çok (Many-to-Many) ilişki tablosu: Hangi kullanıcıda hangi rozetler var?
user_badges = Table(
    "user_badges",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    Column("badge_id", Integer, ForeignKey("badges.id", ondelete="CASCADE"), primary_key=True)
)

class Badge(Base):
    __tablename__ = "badges"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, unique=True, nullable=False)        # Örn: "İlk Adım", "Pomodoro Canavarı"
    description = Column(String, nullable=False)  # Örn: "İlk yapay zeka görevini tamamladın!"
    icon = Column(String, nullable=False)         # Örn: "award", "fire", "brain" (Frontend ikon kodları)
    badge_type = Column(String, nullable=False)   # Örn: "ai_tasks", "total_xp", "pomodoro"
    requirement = Column(Integer, nullable=False)  # Örn: 5 (5 görev tamamlayınca açılsın diye sayısal sınır)

    xp_reward = Column(Integer, default=100, nullable=False)  # Örn: +100 XP
    rarity = Column(String, default="COMMON", nullable=False)

    # Kullanıcılar ile ilişki
    users = relationship("User", secondary=user_badges, back_populates="badges")