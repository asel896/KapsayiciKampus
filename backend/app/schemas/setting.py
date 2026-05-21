from pydantic import BaseModel

class SettingResponse(BaseModel):
    pomodoro: int
    short: int
    long: int

    class Config:
        from_attributes = True

class SettingUpdate(BaseModel):
    pomodoro: int
    short: int
    long: int