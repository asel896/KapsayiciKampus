from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.database.session import Base

class Pomodoro(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    
    date = Column(String, nullable=False, default=func.to_char(func.now(), 'DD.MM.YYYY'))
    duration = Column(Integer, nullable=False)
    mode = Column(String, nullable=False, default="pomodoro")
    hour = Column(Integer, nullable=False, default=func.extract('hour', func.now()))
    
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    # 🎯 Sadece string isim
    user = relationship("User", back_populates="pomodoros")