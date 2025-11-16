from datetime import date, datetime
from sqlmodel import SQLModel, Field
from typing import Optional


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str
    coins: int = 0


class Habit(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int
    name: str
    type: str = "good"        # "good" or "bad"
    streak: int = 0
    last_completed: Optional[date] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
