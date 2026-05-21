from sqlalchemy import Column, Integer, String, Boolean, DateTime, func
from sqlalchemy.orm import relationship
from app.database.session import Base
from app.models.badge import user_badges

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)  # Veritabanındaki adıyla eşitledik
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    full_name = Column(String, nullable=True)
    campus_name = Column(String, nullable=True)
    
    # Oyunlaştırma ve Analitik Sütunları
    level = Column(Integer, default=1, nullable=False)
    xp = Column(Integer, default=0, nullable=False)
    total_xp = Column(Integer, default=0, nullable=False)
    total_sessions = Column(Integer, default=0, nullable=False)
    
    is_active = Column(Boolean(), default=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)

    # 🎯 İlişkiler
    tasks = relationship("Task", back_populates="user", cascade="all, delete-orphan")
    pomodoros = relationship("Pomodoro", back_populates="user", cascade="all, delete-orphan")
    settings = relationship("UserSetting", back_populates="user", uselist=False, cascade="all, delete-orphan")
    badges = relationship("Badge", secondary=user_badges, back_populates="users")