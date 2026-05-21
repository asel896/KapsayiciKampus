from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.database.session import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    
    text = Column(String, nullable=False)
    done = Column(Boolean, default=False, nullable=False)
    pomodoros = Column(Integer, default=1, nullable=False)
    completed_pomodoros = Column(Integer, default=0, nullable=False)
    
    created_at = Column(DateTime, server_default=func.now(), nullable=False)

    # 🎯 Sadece string isim
    user = relationship("User", back_populates="tasks")