const API_BASE = "http://127.0.0.1:8000";   // your backend
// Coin sound effect
const coinSound = new Audio("assets/sounds/coin.mp3");
coinSound.volume = 0.6;  // not too loud

// Sad coin drop sound
const sadCoinSound = new Audio("assets/sounds/sad_coin.mp3");
sadCoinSound.volume = 0.5;



// LOGIN FUNCTION
function login() {
    const username = document.getElementById("usernameInput").value;

    if (!username) return alert("Enter username!");

    fetch(`${API_BASE}/users/register?username=${username}`, {
        method: "POST"
    })
    .then(res => res.json())
    .then(data => {
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
            const list = document.getElementById("habitList");
            list.innerHTML = "";

            // ⬇⬇⬇ EXACT PLACE TO ADD THE BLOCK
            data.habits.forEach(habit => {

                // ⭐ MUST BE HERE BEFORE BUILDING CARD
                const completedToday =
                    habit.last_completed &&
                    new Date(habit.last_completed).toDateString() === new Date().toDateString();

                // ⭐ NOW build the card BELOW this line
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
        });
}



// ADD NEW HABIT
function addHabit() {
    const nameField = document.getElementById("habitInput");
    const typeField = document.getElementById("habitType");

    // SAFETY CHECKS
    if (!nameField) {
        console.error("ERROR: habitInput not found in HTML");
        alert("Your habit input field is missing.");
        return;
    }

    if (!typeField) {
        console.error("ERROR: habitType not found in HTML");
        alert("Habit type dropdown is missing.");
        return;
    }

    const habitName = nameField.value;
    const habitType = typeField.value;
    const username = localStorage.getItem("username");

    if (!habitName.trim()) {
        alert("Please enter a habit name.");
        return;
    }

    fetch(`${API_BASE}/habits/add?username=${username}&habit_name=${encodeURIComponent(habitName)}&habit_type=${habitType}`, {
        method: "POST"
    })
    .then(res => res.json())
    .then(() => {
        nameField.value = "";
        loadHabits();
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
    const anim = document.createElement("div");
    anim.className = "negative-reward-animation";

    anim.innerHTML = `
        <div class="negative-content">
            <img src="assets/coin.svg" class="negative-coin">
            <span class="negative-text">${amount}</span>
        </div>
    `;

    document.body.appendChild(anim);

    // Play sad coin drop sound
    if (sadCoinSound) {
        sadCoinSound.currentTime = 0;
        sadCoinSound.play();
    }

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
    });
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
