from fastapi import APIRouter
from sqlmodel import Session, select
from ..database import engine
from ..models import User
from ..utils.auth import hash_password, verify_password

router = APIRouter()

@router.post("/register")
def register(username: str, password: str):
    with Session(engine) as session:
        existing = session.exec(select(User).where(User.username == username)).first()
        if existing:
            return {"error": "Username already exists"}

        user = User(
            username=username,
            password_hash=hash_password(password)
        )

        session.add(user)
        session.commit()
        session.refresh(user)

        return {"message": "Registered", "user_id": user.id}

# ⭐ INFO ⭐
@router.get("/info")
def get_user_info(username: str):
    with Session(engine) as session:
        user = session.exec(select(User).where(User.username == username)).first()
        if not user:
            return {"error": "User not found"}

        return {
            "id": user.id,
            "username": user.username,
            "coins": user.coins
        }
#  ⭐ LOGIN ⭐    
@router.post("/login")
def login(username: str, password: str):
    with Session(engine) as session:
        user = session.exec(select(User).where(User.username == username)).first()
        if not user:
            return {"error": "User not found"}

        if not verify_password(password, user.password_hash):
            return {"error": "Invalid password"}

        return {
            "message": "Login successful",
            "username": user.username,
            "coins": user.coins,
            "user_id": user.id
        }
  