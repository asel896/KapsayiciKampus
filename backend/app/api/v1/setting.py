from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.api import deps
from app.models.user import User
from app.models.setting import UserSetting
from app.schemas.setting import SettingResponse, SettingUpdate

router = APIRouter(prefix="/settings", tags=["Kullanıcı Ayarları"])

@router.get("", response_model=SettingResponse)
async def get_user_settings(
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """Kullanıcının özel pomodoro, short ve long mola sürelerini getirir."""
    result = await db.execute(
        select(UserSetting).where(UserSetting.user_id == current_user.id)
    )
    user_setting = result.scalar_one_or_none()
    
    # Eğer veritabanında bu kullanıcı için henüz satır oluşmadıysa varsayılan değerlerle oluşturuyoruz
    if not user_setting:
        user_setting = UserSetting(user_id=current_user.id, pomodoro=25, short=5, long=15)
        db.add(user_setting)
        await db.commit()
        await db.refresh(user_setting)
        
    return user_setting

@router.put("", response_model=SettingResponse)
async def update_user_settings(
    payload: SettingUpdate,
    db: AsyncSession = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
):
    """Kullanıcının pomodoro, short ve long mola sürelerini günceller."""
    result = await db.execute(
        select(UserSetting).where(UserSetting.user_id == current_user.id)
    )
    user_setting = result.scalar_one_or_none()
    
    if not user_setting:
        user_setting = UserSetting(user_id=current_user.id)
        db.add(user_setting)
        
    user_setting.pomodoro = payload.pomodoro
    user_setting.short = payload.short
    user_setting.long = payload.long
    
    await db.commit()
    await db.refresh(user_setting)
    return user_setting