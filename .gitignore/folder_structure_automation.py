import os

structure = [
    "habit-arena/backend/app/routers",
    "habit-arena/backend/app/utils",
    "habit-arena/frontend"
]

files = [
    "backend/app/main.py",
    "backend/app/database.py",
    "backend/app/models.py",
    "backend/app/schemas.py",
    "backend/app/routers/users.py",
    "backend/app/routers/habits.py",
    "backend/app/routers/leaderboard.py",
    "backend/app/routers/challenges.py",
    "backend/app/utils/points.py",
    "backend/app/utils/auth.py",
    "backend/requirements.txt",
    "backend/README.md",
    "frontend/index.html",
    "frontend/style.css",
    "frontend/script.js",
    "README.md",
]

for folder in structure:
    os.makedirs(folder, exist_ok=True)

for file in files:
    open(f"habit-arena/{file}", "w").close()

print("🎉 Folder structure created!")
