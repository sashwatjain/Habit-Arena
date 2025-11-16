const API_BASE = "http://127.0.0.1:8000";   // your backend

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
        loadHabits();
    }
}

// FETCH HABITS
function loadHabits() {
    const username = localStorage.getItem("username");

    fetch(`${API_BASE}/habits/list?username=${username}`)
        .then(res => res.json())
        .then(data => {
            const list = document.getElementById("habitList");
            list.innerHTML = "";

            data.habits.forEach(habit => {
                list.innerHTML += `
                    <div class="habit-box">
                        ${habit.name} (${habit.type}) — Streak: ${habit.streak}
                        <button class="complete-btn" onclick="completeHabit(${habit.id})">Complete</button>
                    </div>
                `;
            });
        });
}

// ADD NEW HABIT
function addHabit() {
    const username = localStorage.getItem("username");
    const name = document.getElementById("habitNameInput").value;
    const type = document.getElementById("habitTypeSelect").value;

    if (!name) return alert("Enter habit name!");

    fetch(`${API_BASE}/habits/add?username=${username}&habit_name=${name}&habit_type=${type}`, {
        method: "POST"
    }).then(() => loadHabits());
}

// COMPLETE HABIT
function completeHabit(id) {
    fetch(`${API_BASE}/habits/complete?habit_id=${id}`, {
        method: "POST"
    })
    .then(res => res.json())
    .then(data => {
        alert(`+${data.reward} coins!`);
        loadHabits();
    });
}
