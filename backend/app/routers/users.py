from fastapi import APIRouter
from sqlmodel import Session, select
from ..database import engine
from ..models import User

router = APIRouter()

@router.post("/register")
def register_user(username: str):
    with Session(engine) as session:
        user = session.exec(select(User).where(User.username == username)).first()
        if user:
            return {"message": "User already exists", "user": user}

        new_user = User(username=username)
        session.add(new_user)
        session.commit()
        session.refresh(new_user)
        return {"message": "User registered", "user": new_user}

