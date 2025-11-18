from http.client import HTTPException
from fastapi import APIRouter
from sqlmodel import Session, select
from ..database import engine
from ..models import User, Habit
from datetime import date, timedelta

router = APIRouter()

@router.post("/add")
def add_habit(username: str, habit_name: str, habit_type: str = "good"):
    with Session(engine) as session:
        user = session.exec(select(User).where(User.username == username)).first()
        if not user:
            return {"error": "User not found"}

        # 🔥 Count existing habits
        all_habits = session.exec(select(Habit).where(Habit.user_id == user.id)).all()

        # 1️⃣ Limit total habits to 10
        if len(all_habits) >= 10:
            return {"error": "You can only have **10 habits maximum**."}

        # 2️⃣ Limit bad habits to 2
        if habit_type == "bad":
            bad_count = sum(1 for h in all_habits if h.type == "bad")
            if bad_count >= 2:
                return {"error": "You can only add **2 bad habits maximum**."}

        # ✔ If limits OK → add habit
        habit = Habit(
            user_id=user.id,
            name=habit_name,
            type=habit_type
        )
        session.add(habit)
        session.commit()
        session.refresh(habit)

        return {"message": "Habit added", "habit": habit}




from ..utils.points import calculate_points


@router.post("/complete")
def complete_habit(habit_id: int):
    with Session(engine) as session:
        habit = session.get(Habit, habit_id)
        if not habit:
            return {"error": "Habit not found"}

        user = session.get(User, habit.user_id)

        today = date.today()
        yesterday = today - timedelta(days=1)

        # First time completing the habit
        if habit.last_completed is None:
            habit.streak = 1

        # If completed yesterday → continue streak
        elif habit.last_completed == yesterday:
            habit.streak += 1

        # If missed a day → reset streak
        else:
            habit.streak = 1

        # Set last completed to today
        habit.last_completed = today


        # Calculate reward
        reward = calculate_points(habit.type, habit.streak)

        user.coins += reward

        # Save changes
        session.add(habit)
        session.add(user)
        session.commit()

        return {
            "message": "Habit completed!",
            "habit_id": habit.id,
            "new_streak": habit.streak,
            "reward": reward,
            "total_coins": user.coins
        }

@router.get("/list")
def list_habits(username: str):
    with Session(engine) as session:
        user = session.exec(select(User).where(User.username == username)).first()
        if not user:
            return {"error": "User not found"}

        habits = session.exec(select(Habit).where(Habit.user_id == user.id)).all()

        return {"habits": habits}


@router.put("/edit")
def edit_habit(habit_id: int, new_name: str):
    with Session(engine) as session:
        habit = session.get(Habit, habit_id)
        if not habit:
            raise HTTPException(status_code=404, detail="Habit not found")

        habit.name = new_name
        session.add(habit)
        session.commit()
        session.refresh(habit)

        return {"message": "Habit updated", "habit": habit}


@router.delete("/delete")
def delete_habit(habit_id: int):
    with Session(engine) as session:
        habit = session.get(Habit, habit_id)
        if not habit:
            raise HTTPException(status_code=404, detail="Habit not found")

        session.delete(habit)
        session.commit()

        return {"message": "Habit deleted"}
