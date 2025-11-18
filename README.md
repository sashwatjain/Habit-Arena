# 🏆 **FINAL README.md WITH SVG LOGO**

```md
<p align="center">
  <img src="frontend/assets/logo.svg" alt="Habit Arena Logo" width="220"/>
</p>

<h1 align="center">🌟 HABIT ARENA 🌟</h1>
<h3 align="center">“Turn your habits into a game. Win your life like a warrior.”</h3>

<p align="center">
Inspired by <strong>Atomic Habits</strong> by <em>James Clear</em>
</p>

---

🚀 **LIVE GAME:** https://thehabitarena.netlify.app/  
🎮 **Version:** V1 (Public Preview)  
🧠 **Tech Stack:** FastAPI + SQLModel + Vanilla JS + Netlify + Render

---

## 🧩 **What is Habit Arena?**

Habit Arena is a **multiplayer habit-building game** where players:  
- Create good habits ⚔️  
- Track their consistency 🔥  
- Earn coins for completing habits 💰  
- Lose coins for bad habits 😢  
- Maintain streaks for bonus rewards 🔥💥  
- Climb the **Global Leaderboard** 🏆  
- Build discipline like a true warrior  

A blend of **Atomic Habits** + **Casual RPG Game Design**, built entirely with Python + JS.

---

## 🧪 **LIVE FEATURES (V1)**

### ✔️ **User System**
- Username + password login  
- Secure password hashing  
- Persistent user data  
- Background music + UI sound effects  

### ✔️ **Habit System**
- Add habits (limit: 10 per user)  
- Max 2 bad habits  
- Complete each habit once per day  
- Daily streak logic  
- Penalties for bad habits  
- Animated reward & penalty effects  

### ✔️ **Leaderboard**
- Ranks sorted by coins  
- SVG rank badges (gold, silver, bronze)  
- Smooth animations  

### ✔️ **UI & Experience**
- Animated SVG logo  
- Gradient dark theme  
- Hover & click sound effects  
- Beautiful error popups  
- Smooth transitions  

🎯 **V1 = Completely playable & addictive.**

---

## 🏗️ **Tech Stack**

### 🖥️ Frontend
- HTML5  
- CSS3 (glassmorphism + gradients + animations)  
- Vanilla JavaScript  
- Animated SVGs  
- Netlify Free Hosting  

### ⚙️ Backend
- FastAPI  
- SQLModel  
- SQLite (V1)  
- Passlib bcrypt hashing  
- CORS-enabled  
- Render Free Tier Hosting  

---

## 🗂️ **Folder Structure**

```

habit-arena/
│
├── backend/
│   ├── app/
│   │   ├── routers/
│   │   ├── utils/
│   │   ├── database.py
│   │   ├── main.py
│   ├── requirements.txt
│
└── frontend/
├── index.html
├── dashboard.html
├── leaderboard.html
├── style.css
├── script.js
├── assets/
├── logo.svg
├── coin.svg
├── sounds/

````

---

## 🧪 **Run Locally**

### Backend

```bash
cd backend
python -m venv venv
venv/Scripts/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
````

### Frontend

```bash
cd frontend
npx serve .
```

---

## 📕 **Core Game Logic**

### 🎁 Reward System

```
good habit  → +10 coins + streak bonus  
bad habit   → -5 coins  
streak bonus → +1 per day  
```

### ⏳ Daily Reset

* Habits reset every midnight
* Missing a day breaks streak

### 🔐 Auth

* Password hashing with bcrypt

---

## 🏆 **Upcoming Features (V2)**

* ⚔️ 7-Day Challenge Arena
* 👥 Friend system
* 🛡️ Streak protection
* 🛒 Shop (skins, boosters, troop packs)
* 📱 Mobile app version
* 🔄 Move DB to PostgreSQL
* 🎨 Full UI redesign

---

## ⭐ Credits

**Developed by:** Sashwat Jain
**Inspired by:** *Atomic Habits* — James Clear
Built with 💙, discipline, and creativity.

---

<p align="center">

  <!-- Netlify -->
  <img src="https://img.shields.io/badge/Hosted%20on-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" />

  <!-- Render -->
  <img src="https://img.shields.io/badge/Backend%20on-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white" />

  <!-- FastAPI -->
  <img src="https://img.shields.io/badge/API-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />

  <!-- Python -->
  <img src="https://img.shields.io/badge/Backend-Python%203.11-3776AB?style=for-the-badge&logo=python&logoColor=white" />

  <!-- JavaScript -->
  <img src="https://img.shields.io/badge/Frontend-JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />

  <!-- SQLModel -->
  <img src="https://img.shields.io/badge/Database-SQLModel-4b8bbe?style=for-the-badge&logo=sqlite&logoColor=white" />

</p>

