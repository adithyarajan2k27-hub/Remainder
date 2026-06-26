// ==========================================
// REMINDERS PAGE JS
// ==========================================

let reminders = [];
let filteredReminders = [];

// ==========================================
// INIT
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    loadTheme();

    loadReminders();

    updateStats();

    renderReminders();

    setupSearch();

    setupFilters();

});

// ==========================================
// GET REMINDERS
// ==========================================

function loadReminders() {

    reminders =
        JSON.parse(
            localStorage.getItem("reminders")
        ) || [];

    filteredReminders = [...reminders];
}

// ==========================================
// STATS
// ==========================================

function updateStats() {

    const today =
        new Date()
        .toISOString()
        .split("T")[0];

    const pending =
        reminders.filter(
            reminder => !reminder.completed
        ).length;

    const completed =
        reminders.filter(
            reminder => reminder.completed
        ).length;

    const overdue =
        reminders.filter(reminder => {

            if (reminder.completed)
                return false;

            return new Date(
                `${reminder.date}T${reminder.time}`
            ) < new Date();

        }).length;

    document.getElementById(
        "allCount"
    ).innerText = reminders.length;

    document.getElementById(
        "pendingCount"
    ).innerText = pending;

    document.getElementById(
        "completedCount"
    ).innerText = completed;

    document.getElementById(
        "overdueCount"
    ).innerText = overdue;
}

// ==========================================
// RENDER
// ==========================================

function renderReminders() {

    const container =
        document.getElementById(
            "reminderContainer"
        );

    container.innerHTML = "";

    if (filteredReminders.length === 0) {

        container.innerHTML = `

        <div class="col-12">

            <div class="empty-state glass-card">

                <i class="bi bi-calendar-x"></i>

                <h3>No Reminders Found</h3>

                <p>
                    Try changing filters or add a new reminder.
                </p>

            </div>

        </div>

        `;

        return;
    }

    filteredReminders.forEach(reminder => {

        const overdue =
            !reminder.completed &&
            new Date(
                `${reminder.date}T${reminder.time}`
            ) < new Date();

        let badgeClass = "low";

        if (
            reminder.priority === "Medium"
        ) {

            badgeClass = "medium";
        }

        if (
            reminder.priority === "High"
        ) {

            badgeClass = "high";
        }

        const card = document.createElement("div");

        card.className = "col-lg-4 col-md-6";

        card.innerHTML = `

        <div class="reminder-card">

            <div class="card-header-top">

                <div>

                    <div class="reminder-title">

                        ${reminder.title}

                    </div>

                </div>

                <div>

                    <span class="priority-badge ${badgeClass}">

                        ${reminder.priority}

                    </span>

                </div>

            </div>

            <div class="reminder-meta">

                📅 ${reminder.date}

                <br>

                ⏰ ${reminder.time}

            </div>

            <div class="category-chip">

                ${reminder.category || "General"}

            </div>

            <div class="reminder-description">

                ${reminder.description || "No description"}

            </div>

            ${
                reminder.completed
                ? `
                <div class="mt-3">
                    <span class="completed-badge">
                        ✓ COMPLETED
                    </span>
                </div>
                `
                : ""
            }

            ${
                overdue
                ? `
                <div class="mt-3">
                    <span class="overdue-badge">
                        ⚠ OVERDUE
                    </span>
                </div>
                `
                : ""
            }

            <div class="card-actions">

                ${
                    !reminder.completed
                    ? `
                    <button
                        class="action-btn complete-btn"
                        onclick="completeReminder(${reminder.id})">

                        ✓ Complete

                    </button>
                    `
                    : ""
                }

                <button
                    class="action-btn edit-btn"
                    onclick="editReminder(${reminder.id})">

                    ✏ Edit

                </button>

                <button
                    class="action-btn delete-btn"
                    onclick="deleteReminder(${reminder.id})">

                    🗑 Delete

                </button>

            </div>

        </div>

        `;

        container.appendChild(card);

    });

}

// ==========================================
// SEARCH
// ==========================================

function setupSearch() {

    document
        .getElementById("searchInput")
        .addEventListener("input", applyFilters);
}

// ==========================================
// FILTERS
// ==========================================

function setupFilters() {

    document
        .getElementById("filterSelect")
        .addEventListener("change", applyFilters);

    document
        .getElementById("sortSelect")
        .addEventListener("change", applyFilters);
}

// ==========================================
// APPLY FILTERS
// ==========================================

function applyFilters() {

    const search =
        document.getElementById(
            "searchInput"
        ).value.toLowerCase();

    const filter =
        document.getElementById(
            "filterSelect"
        ).value;

    const sort =
        document.getElementById(
            "sortSelect"
        ).value;

    const today =
        new Date()
        .toISOString()
        .split("T")[0];

    filteredReminders =
        reminders.filter(reminder => {

            const matchSearch =

                reminder.title
                    .toLowerCase()
                    .includes(search)

                ||

                (reminder.description || "")
                    .toLowerCase()
                    .includes(search);

            if (!matchSearch)
                return false;

            switch(filter) {

                case "pending":
                    return !reminder.completed;

                case "completed":
                    return reminder.completed;

                case "today":
                    return reminder.date === today;

                case "upcoming":
                    return reminder.date > today;

                case "overdue":
                    return !reminder.completed &&
                        reminder.date < today;

                case "high":
                    return reminder.priority === "High";

                case "medium":
                    return reminder.priority === "Medium";

                case "low":
                    return reminder.priority === "Low";

                default:
                    return true;
            }

        });

    applySorting(sort);

    renderReminders();
}

// ==========================================
// SORT
// ==========================================

function applySorting(sort) {

    filteredReminders.sort((a,b)=>{

        switch(sort){

            case "dateAsc":

                return new Date(
                    `${a.date}T${a.time}`
                ) -
                new Date(
                    `${b.date}T${b.time}`
                );

            case "dateDesc":

                return new Date(
                    `${b.date}T${b.time}`
                ) -
                new Date(
                    `${a.date}T${a.time}`
                );

            case "priority":

                const order = {
                    High:3,
                    Medium:2,
                    Low:1
                };

                return order[b.priority]
                    - order[a.priority];

            case "created":

                return new Date(
                    b.createdAt
                ) -
                new Date(
                    a.createdAt
                );

            default:

                return 0;
        }

    });

}

// ==========================================
// COMPLETE
// ==========================================

function completeReminder(id) {

    const index =
        reminders.findIndex(
            reminder =>
                reminder.id === id
        );

    if(index === -1)
        return;

    reminders[index].completed = true;

    reminders[index].completedDate =
        new Date()
        .toISOString()
        .split("T")[0];

    localStorage.setItem(
        "reminders",
        JSON.stringify(reminders)
    );

    updateStreak();

    refreshPage();
}

// ==========================================
// DELETE
// ==========================================

function deleteReminder(id) {

    if(
        !confirm(
            "Delete this reminder?"
        )
    ){
        return;
    }

    reminders =
        reminders.filter(
            reminder =>
                reminder.id !== id
        );

    localStorage.setItem(
        "reminders",
        JSON.stringify(reminders)
    );

    refreshPage();
}

// ==========================================
// EDIT
// ==========================================

function editReminder(id) {

    window.location.href =
        `edit_reminder.html?id=${id}`;
}

// ==========================================
// STREAK
// ==========================================

function updateStreak() {

    const today =
        new Date()
        .toISOString()
        .split("T")[0];

    let streakData =
        JSON.parse(
            localStorage.getItem(
                "streakData"
            )
        ) || {

            streak:0,
            lastCompletedDate:null,
            streakDates:[]
        };

    if(
        streakData.lastCompletedDate ===
        today
    ){
        return;
    }

    if(
        streakData.lastCompletedDate
    ){

        const previous =
            new Date(
                streakData.lastCompletedDate
            );

        const current =
            new Date(today);

        const diff =
            Math.floor(
                (current - previous)
                /
                (1000*60*60*24)
            );

        if(diff === 1){

            streakData.streak++;

        }else{

            streakData.streak = 1;
        }

    }else{

        streakData.streak = 1;
    }

    streakData.lastCompletedDate =
        today;

    streakData.streakDates.push(
        today
    );

    localStorage.setItem(
        "streakData",
        JSON.stringify(streakData)
    );
}

// ==========================================
// REFRESH
// ==========================================

function refreshPage() {

    loadReminders();

    updateStats();

    applyFilters();
}

// ==========================================
// THEME
// ==========================================

function loadTheme() {

    const btn =
        document.getElementById(
            "themeBtn"
        );

    const saved =
        localStorage.getItem(
            "theme"
        );

    if(saved === "dark"){

        document.body.classList.add(
            "dark"
        );

        btn.innerHTML = "☀️";
    }

    btn.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "dark"
            );

            const dark =
                document.body.classList.contains(
                    "dark"
                );

            localStorage.setItem(
                "theme",
                dark
                ? "dark"
                : "light"
            );

            btn.innerHTML =
                dark
                ? "☀️"
                : "🌙";
        }
    );
}