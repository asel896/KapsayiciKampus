from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from app.database.session import Base

class UserSetting(Base):
    # 🎯 KRİTİK: Hocanın dökümanındaki tablo adı 'settings'
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)
    
    # Dökümandaki Sütunlar (Dakika cinsinden ayarlar)
    pomodoro = Column(Integer, nullable=False, default=25)  # Varsayılan 25 dk
    short = Column(Integer, nullable=False, default=5)      # Varsayılan 5 dk
    long = Column(Integer, nullable=False, default=15)      # Varsayılan 15 dk

    # User modeli ile ilişki
    user = relationship("User", back_populates="settings")