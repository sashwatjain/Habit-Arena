from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import create_db_and_tables
from .routers import users, habits, leaderboard

app = FastAPI(title="HABIT ARENA API", version="0.1")

# ⭐⭐⭐ CORS MUST BE ATTACHED BEFORE ANY ROUTERS ⭐⭐⭐
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://thehabitarena.netlify.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    # Use SQLModel’s standard function

@app.get("/")
def home():
    return {"message": "Welcome to HABIT ARENA API!"}

@app.get("/healthz")
def health():
    return {"status": "ok"}


# Routers (after CORS)
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(habits.router, prefix="/habits", tags=["Habits"])
app.include_router(leaderboard.router, prefix="/leaderboard", tags=["Leaderboard"])
