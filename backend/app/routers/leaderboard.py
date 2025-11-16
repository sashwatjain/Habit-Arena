from fastapi import APIRouter
from sqlmodel import Session, select
from ..database import engine
from ..models import User

router = APIRouter()

@router.get("/")
def get_leaderboard():
    with Session(engine) as session:
        users = session.exec(select(User).order_by(User.coins.desc())).all()
        return users
