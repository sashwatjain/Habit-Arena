// const API_BASE = "http://127.0.0.1:8000";   // your backend
const API_BASE = "https://habit-arena.onrender.com";

// Coin sound effect
const coinSound = new Audio("assets/sounds/coin.mp3");
coinSound.volume = 0.8;  // not too loud

// Sad coin drop sound
const sadCoinSound = new Audio("assets/sounds/sad_coin.mp3");
sadCoinSound.volume = 0.8;

// 🔊 Global Click Sound
const clickSound = new Audio("assets/sounds/click.mp3");
clickSound.volume = 0.4; // adjust loudness


const hoverSound = new Audio("assets/sounds/hover.mp3");
hoverSound.volume = 0.4;



// LOGIN FUNCTION
function login() {
    const username = document.getElementById("usernameInput").value;

    if (!username) return alert("Enter username!");

    fetch(`${API_BASE}/users/register?username=${username}`, {
        method: "POST"
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            showError(data.error);   // ⬅️ USE POPUP
            return;
        }
        localStorage.setItem("username", username);
        window.location.href = "dashboard.html";
    });
}

// LOAD DASHBOARD
window.onload = function() {
    if (window.location.pathname.includes("dashboard")) {
        const username = localStorage.getItem("username");
        if (!username) window.location.href = "login.html";

        document.getElementById("usernameDisplay").innerText = username;
        loadUserInfo();
        loadHabits();
    }
}

// LOAD HABITS
function loadHabits() {
    const username = localStorage.getItem("username");

    fetch(`${API_BASE}/habits/list?username=${username}`)
        .then(res => res.json())
        .then(data => {

            // ⭐ ERROR CHECK
            if (data.error) {
                showError(data.error);
                return;
            }

            const list = document.getElementById("habitList");
            list.innerHTML = "";

            // ⭐ SAFE: data.habits now guaranteed to exist
            data.habits.forEach(habit => {

                const completedToday =
                    habit.last_completed &&
                    new Date(habit.last_completed).toDateString() === new Date().toDateString();

                const cardClass = habit.type === "good" ? "habit-good" : "habit-bad";

                list.innerHTML += `
                    <div class="habit-card ${cardClass}">
                        <div class="habit-header">
                            <span class="habit-name">${habit.name}</span>
                        </div>

                        <div class="habit-details">
                            Streak: ${habit.streak}
                        </div>

                        <div class="habit-actions">
                            <button class="habit-btn complete-btn"
                                onclick="completeHabit(${habit.id})"
                                ${completedToday ? "disabled" : ""}>
                                ${completedToday ? "Done" : "Complete"}
                            </button>

                            <button class="habit-btn edit-btn" onclick="editHabit(${habit.id})">Edit</button>
                            <button class="habit-btn delete-btn" onclick="deleteHabit(${habit.id})">Delete</button>
                        </div>
                    </div>
                `;
            });
        })
        .catch(err => console.error("LOAD HABITS ERROR:", err));
}



// ADD NEW HABIT
function addHabit() {
    const nameField = document.getElementById("habitInput");
    const typeField = document.getElementById("habitType");

    // SAFETY CHECKS
    if (!nameField) {
        console.error("ERROR: habitInput not found in HTML");
        showError("Habit input field is missing.");
        return;
    }

    if (!typeField) {
        console.error("ERROR: habitType not found in HTML");
        showError("Habit type dropdown is missing.");
        return;
    }

    const habitName = nameField.value;
    const habitType = typeField.value;
    const username = localStorage.getItem("username");

    if (!habitName.trim()) {
        showError("Please enter a habit name.");  // ⬅️ FIXED
        return;
    }

    fetch(`${API_BASE}/habits/add?username=${username}&habit_name=${encodeURIComponent(habitName)}&habit_type=${habitType}`, {
        method: "POST"
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            showError(data.error);   // ⬅️ POPUP TRIGGER
            return;
        }

        loadHabits();
        nameField.value = "";   // ⬅️ Clear input
    })
    .catch(err => {
        showError("Unable to add habit. Check your server.");
        console.error(err);
    });
}





// COMPLETE HABIT
function completeHabit(id) {
    fetch(`${API_BASE}/habits/complete?habit_id=${id}`, {
        method: "POST"
    })
    .then(async res => {

        // If backend rejects (already completed today)
        if (!res.ok) {
            const err = await res.json();
            alert(err.detail);   // Example: "Habit already completed today"
            return;
        }

        return res.json();
    })
    .then(data => {
        if (!data) return;  // stop if error occurred

        // ⭐ Floating +coins animation
        if (data.reward >= 0) {
            showRewardAnimation(data.reward);
        } else {
            showNegativeRewardAnimation(data.reward); // negative reward
        }

        if (data.error) {
            showError(data.error);  // ⬅️ STOP + SHOW ERROR
            return;
        }

        

        // ⭐ Update header coins + habits list
        loadUserInfo();
        loadHabits();

        // ⭐ Coin pop animation on reward
        const coinIcon = document.getElementById("coinIcon");
        if (coinIcon) {
            coinIcon.style.animation = "coinPop 0.9s ease";
            setTimeout(() => {
                coinIcon.style.animation = "coinGlow 3s ease-in-out infinite";
            }, 900);
        }
    });
}



// LOAD USER INFO
function loadUserInfo() {
    const username = localStorage.getItem("username");

    fetch(`${API_BASE}/users/info?username=${username}`)
        .then(res => res.json())
        .then(data => {
            if (data.error) return;

            document.getElementById("coinCount").textContent = data.coins;
        });
}

// SHOW REWARD ANIMATION
function showRewardAnimation(amount) {
    // Play sound
    if (coinSound) {
        coinSound.currentTime = 0;  // restart sound
        coinSound.play();
    }

    const anim = document.createElement("div");
    anim.className = "reward-animation";

    anim.innerHTML = `
        <div class="reward-content">
            <img src="assets/coin.svg" class="reward-coin">
            <span class="reward-text">+${amount}</span>
        </div>
    `;

    document.body.appendChild(anim);

    setTimeout(() => anim.remove(), 1500);
}

// SHOW NEGATIVE REWARD ANIMATION
function showNegativeRewardAnimation(amount) {
    // Play sad coin drop sound
    if (sadCoinSound) {
        sadCoinSound.currentTime = 0;
        sadCoinSound.play();
    }
    const anim = document.createElement("div");
    anim.className = "negative-reward-animation";

    anim.innerHTML = `
        <div class="negative-content">
            <img src="assets/coin.svg" class="negative-coin">
            <span class="negative-text">${amount}</span>
        </div>
    `;

    document.body.appendChild(anim);

    setTimeout(() => anim.remove(), 1500);
}



// EDIT HABIT
function editHabit(id) {
    const newName = prompt("Enter new habit name:");

    if (!newName || newName.trim() === "") return;

    fetch(`${API_BASE}/habits/edit?habit_id=${id}&new_name=${encodeURIComponent(newName)}`, {
        method: "PUT"
    })
    .then(res => res.json())
    .then(() => {
        loadHabits();
    }
);
}

// DELETE HABIT
function deleteHabit(id) {
    if (!confirm("Are you sure you want to delete this habit?")) return;

    fetch(`${API_BASE}/habits/delete?habit_id=${id}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(() => {
        loadHabits();
    });
}


function loadLeaderboard() {
    fetch(`${API_BASE}/leaderboard`)
        .then(res => res.json())
        .then(data => {
            const box = document.getElementById("leaderboardList");
            if (!box) return;

            box.innerHTML = "";

            const rankIcons = {
                0: `
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="#facc15">
                        <path d="M12 2l2.39 4.84 5.34.78-3.86 3.76.91 5.32L12 14.77l-4.78 2.53.91-5.32L4.27 7.62l5.34-.78z"/>
                    </svg>
                `, // GOLD
                1: `
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="#d1d5db">
                        <path d="M12 2l2.39 4.84 5.34.78-3.86 3.76.91 5.32L12 14.77l-4.78 2.53.91-5.32L4.27 7.62l5.34-.78z"/>
                    </svg>
                `, // SILVER
                2: `
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="#f97316">
                        <path d="M12 2l2.39 4.84 5.34.78-3.86 3.76.91 5.32L12 14.77l-4.78 2.53.91-5.32L4.27 7.62l5.34-.78z"/>
                    </svg>
                `, // BRONZE
                default: `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#9ca3af">
                        <circle cx="12" cy="12" r="10"/>
                    </svg>
                ` // GREY RANK ICON
            };

            data.forEach((user, index) => {
                const icon = rankIcons[index] || rankIcons.default;

                box.innerHTML += `
                    <div class="leader-card">
                        <span class="rank-icon">${icon}</span>
                        <span>${user.username}</span>
                        <span class="lb-coins">${user.coins} 
                            <img src="assets/coin.svg" width="18" style="vertical-align: middle;">
                        </span>
                    </div>
                `;
            });
        });
}

if (window.location.pathname.includes("leaderboard.html")) {
    loadLeaderboard();

    // Optional: Auto refresh every 30 seconds
    setInterval(loadLeaderboard, 30000);
}


// LOGIN
function login() {
    const username = document.getElementById("usernameInput").value.trim();
    const password = document.getElementById("passwordInput").value.trim();

    if (!username || !password) {
        alert("Please enter username and password.");
        return;
    }

    fetch(`${API_BASE}/users/login?username=${username}&password=${password}`, {
        method: "POST"
    })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
                return;
            }

            localStorage.setItem("username", username);
            window.location.href = "dashboard.html";
        });
}


// REGISTER
function register() {
    const username = document.getElementById("usernameInput").value.trim();
    const password = document.getElementById("passwordInput").value.trim();

    if (!username || !password) {
        alert("Enter username & password first!");
        return;
    }

    fetch(`${API_BASE}/users/register?username=${username}&password=${password}`, {
        method: "POST"
    })
        .then(res => res.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
                return;
            }

            alert("Account created! You can now login.");
        });
}

window.addEventListener("DOMContentLoaded", () => {
    const logo = document.getElementById("arenaLogo");
    const sound = document.getElementById("logoSound");

    if (logo && sound) {
        logo.addEventListener("mouseenter", () => {
            sound.currentTime = 0;
            sound.play();
        });
    }
});


function enableBackgroundMusic() {
    const music = document.getElementById("bgMusic");
    if (!music) return;

    music.volume = 0.05; // soft background
    music.play().catch(() => { /* Browser blocked autoplay, waiting for click */ });
}

// First user interaction unlocks audio
function activateMusicUnlock() {
    const music = document.getElementById("bgMusic");
    if (!music) return;

    music.play().catch(() => { /* ignore */ });
    document.removeEventListener('click', activateMusicUnlock);
}

// On page load
window.addEventListener("DOMContentLoaded", () => {
    enableBackgroundMusic();
    document.addEventListener("click", activateMusicUnlock, { once: true });
});

document.addEventListener("click", (e) => {
    if (!(e.target instanceof Element)) return;

    if (e.target.closest("button")) {
        clickSound.currentTime = 0;
        clickSound.play();
    }
});


let lastClick = 0;

document.addEventListener("click", (e) => {
    if (!(e.target instanceof Element)) return;

    const btn = e.target.closest("button");
    if (!btn) return;

    const now = Date.now();
    if (now - lastClick < 120) return; // cooldown

    lastClick = now;
    clickSound.currentTime = 0;
    clickSound.play();
});


document.addEventListener("mouseenter", (e) => {
    if (!(e.target instanceof Element)) return;

    if (e.target.closest("button")) {
        hoverSound.currentTime = 0;
        hoverSound.play();
    }
}, true);
