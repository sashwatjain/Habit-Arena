from fastapi import FastAPI
from .database import init_db
from .routers import users, habits, leaderboard
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI(title="HABIT ARENA API", version="0.1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # allow any frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/")
def home():
    return {"message": "Welcome to HABIT ARENA API!"}

app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(habits.router, prefix="/habits", tags=["Habits"])
app.include_router(leaderboard.router, prefix="/leaderboard", tags=["Leaderboard"])
