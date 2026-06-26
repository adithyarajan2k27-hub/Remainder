// ==========================================
// REMAINDER HOME.JS
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    loadTheme();
    startClock();
    setGreeting();

    updateStats();
    generateCalendar();
    loadReminders();

});

// ==========================================
// GET REMINDERS
// ==========================================

function getReminders() {

    return JSON.parse(
        localStorage.getItem("reminders")
    ) || [];
}

// ==========================================
// SAVE REMINDERS
// ==========================================

function saveReminders(reminders) {

    localStorage.setItem(
        "reminders",
        JSON.stringify(reminders)
    );
}

// ==========================================
// THEME
// ==========================================

function loadTheme() {

    const themeBtn =
        document.getElementById("themeBtn");

    const savedTheme =
        localStorage.getItem("theme");

    if (savedTheme === "dark") {

        document.body.classList.add("dark");

        themeBtn.innerHTML = "☀️";
    }

    themeBtn.addEventListener("click", () => {

        document.body.classList.toggle("dark");

        const darkMode =
            document.body.classList.contains("dark");

        localStorage.setItem(
            "theme",
            darkMode ? "dark" : "light"
        );

        themeBtn.innerHTML =
            darkMode ? "☀️" : "🌙";

    });

}

// ==========================================
// CLOCK
// ==========================================

function startClock() {

    const clock =
        document.getElementById("clock");

    function updateClock() {

        const now = new Date();

        clock.innerHTML =
            now.toLocaleTimeString();
    }

    updateClock();

    setInterval(
        updateClock,
        1000
    );
}

// ==========================================
// GREETING
// ==========================================

function setGreeting() {

    const greeting =
        document.getElementById("greeting");

    const hour =
        new Date().getHours();

    if (hour < 12) {

        greeting.innerHTML =
            "Good Morning ☀️";

    } else if (hour < 18) {

        greeting.innerHTML =
            "Good Afternoon 🌤️";

    } else {

        greeting.innerHTML =
            "Good Evening 🌙";
    }
}

// ==========================================
// UPDATE DASHBOARD
// ==========================================

function updateStats() {

    const reminders =
        getReminders();

    const today =
        new Date()
        .toISOString()
        .split("T")[0];

    const todayTasks =
        reminders.filter(
            reminder =>
                reminder.date === today &&
                !reminder.completed
        ).length;

    const upcoming =
        reminders.filter(
            reminder =>
                reminder.date > today &&
                !reminder.completed
        ).length;

    const completed =
        reminders.filter(
            reminder =>
                reminder.completed
        ).length;

    const streakData =
        JSON.parse(
            localStorage.getItem(
                "streakData"
            )
        ) || {
            streak: 0
        };

    document.getElementById(
        "todayTasks"
    ).innerHTML = todayTasks;

    document.getElementById(
        "upcomingTasks"
    ).innerHTML = upcoming;

    document.getElementById(
        "completedTasks"
    ).innerHTML = completed;

    document.getElementById(
        "streakCount"
    ).innerHTML =
        `🔥${streakData.streak}`;

    // Completion Rate

    const total =
        reminders.length;

    const completionRate =
        total === 0
            ? 0
            : Math.round(
                (completed / total) * 100
            );

    document.getElementById(
        "completionRate"
    ).innerHTML =
        completionRate + "%";
}

// ==========================================
// TOP 5 DEADLINES
// ==========================================

function getUpcomingReminders() {

    return getReminders()

        .filter(
            reminder =>
                !reminder.completed
        )

        .sort((a, b) => {

            const first =
                new Date(
                    `${a.date}T${a.time}`
                );

            const second =
                new Date(
                    `${b.date}T${b.time}`
                );

            return first - second;
        })

        .slice(0, 5);
}

// ==========================================
// LOAD REMINDERS
// ==========================================

function loadReminders() {

    const reminderList =
        document.getElementById(
            "reminderList"
        );

    reminderList.innerHTML = "";

    const reminders =
        getUpcomingReminders();

    if (reminders.length === 0) {

        reminderList.innerHTML = `

        <div class="empty-state">

            <i class="bi bi-calendar-heart"></i>

            <h4>
                No Upcoming Reminders
            </h4>

            <p>
                Click + to create one.
            </p>

        </div>

        `;

        return;
    }

    reminders.forEach(reminder => {

        const card =
            document.createElement("div");

        card.classList.add(
            "reminder-card"
        );

        const overdue =
            isOverdue(
                reminder.date,
                reminder.time
            );

        card.innerHTML = `

        <div class="task-top">

            <div>

                <h5 class="reminder-title">
                    ${reminder.title}
                </h5>

                <div class="reminder-meta">

                    📅 ${reminder.date}

                    <br>

                    ⏰ ${reminder.time}

                </div>

                ${
                    overdue
                    ? `<div class="overdue">
                       ⚠ Overdue
                       </div>`
                    : ""
                }

                <div class="countdown">

                    ⏳ ${getCountdown(
                        reminder.date,
                        reminder.time
                    )}

                </div>

            </div>

            <div class="priority-badge">

                ${reminder.priority}

            </div>

        </div>

        <p class="mt-3">
            ${reminder.description || ""}
        </p>

        <div class="task-actions">

            <input
                type="checkbox"
                class="complete-checkbox"
                data-id="${reminder.id}">

            <button
                class="edit-btn"
                data-id="${reminder.id}">

                ✏️ Edit

            </button>

            <button
                class="delete-btn"
                data-id="${reminder.id}">

                🗑️ Delete

            </button>

        </div>

        `;

        reminderList.appendChild(card);

    });

    addDeleteEvents();
    addCompleteEvents();
    addEditEvents();
}

// ==========================================
// DELETE
// ==========================================

function addDeleteEvents() {

    document
        .querySelectorAll(".delete-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        Number(
                            button.dataset.id
                        );

                    let reminders =
                        getReminders();

                    reminders =
                        reminders.filter(
                            reminder =>
                                reminder.id !== id
                        );

                    saveReminders(
                        reminders
                    );

                    refreshDashboard();
                }
            );
        });
}

// ==========================================
// COMPLETE
// ==========================================

function addCompleteEvents() {

    document
        .querySelectorAll(
            ".complete-checkbox"
        )
        .forEach(box => {

            box.addEventListener(
                "change",
                () => {

                    const id =
                        Number(
                            box.dataset.id
                        );

                    const reminders =
                        getReminders();

                    const reminder =
                        reminders.find(
                            item =>
                                item.id === id
                        );

                    if (!reminder)
                        return;

                    reminder.completed = true;

                    reminder.completedDate =
                        new Date()
                        .toISOString()
                        .split("T")[0];

                    saveReminders(
                        reminders
                    );

                    updateStreak();

                    refreshDashboard();
                }
            );
        });
}

// ==========================================
// EDIT
// ==========================================

function addEditEvents() {

    document
        .querySelectorAll(".edit-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const id =
                        button.dataset.id;

                    window.location.href =
                        `edit_reminder.html?id=${id}`;
                }
            );
        });
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

            streak: 0,

            lastCompletedDate: null,

            streakDates: []
        };

    if (
        streakData.lastCompletedDate ===
        today
    ) {
        return;
    }

    if (
        streakData.lastCompletedDate
    ) {

        const previous =
            new Date(
                streakData.lastCompletedDate
            );

        const current =
            new Date(today);

        const difference =
            Math.floor(
                (current - previous) /
                (1000 * 60 * 60 * 24)
            );

        if (difference === 1) {

            streakData.streak++;

        } else {

            streakData.streak = 1;
        }

    } else {

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
// CALENDAR
// ==========================================

function generateCalendar() {

    const calendar =
        document.getElementById(
            "calendar"
        );

    const monthTitle =
        document.getElementById(
            "monthTitle"
        );

    calendar.innerHTML = "";

    const today =
        new Date();

    const year =
        today.getFullYear();

    const month =
        today.getMonth();

    const currentDay =
        today.getDate();

    const monthNames = [

        "January",
        "February",
        "March",
        "April",
        "May",
        "June",

        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    monthTitle.innerHTML =
        `${monthNames[month]} ${year}`;

    const firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();

    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();

    const reminders =
        getReminders();

    const reminderDates =
        reminders.map(
            reminder =>
                reminder.date
        );

    const streakData =
        JSON.parse(
            localStorage.getItem(
                "streakData"
            )
        ) || {

            streakDates: []
        };

    for (
        let i = 0;
        i < firstDay;
        i++
    ) {

        const blank =
            document.createElement("div");

        blank.classList.add("blank");

        calendar.appendChild(blank);
    }

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const box =
            document.createElement("div");

        box.classList.add("day");

        box.innerHTML = day;

        const dateString =
            `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        if (
            reminderDates.includes(
                dateString
            )
        ) {

            box.classList.add(
                "reminder-day"
            );
        }

        if (
            streakData.streakDates.includes(
                dateString
            )
        ) {

            box.classList.add(
                "streak-day"
            );
        }

        if (
            day === currentDay
        ) {

            box.classList.add(
                "today"
            );
        }

        calendar.appendChild(box);
    }
}

// ==========================================
// COUNTDOWN
// ==========================================

function getCountdown(
    date,
    time
) {

    const target =
        new Date(
            `${date}T${time}`
        );

    const now =
        new Date();

    const diff =
        target - now;

    if (diff <= 0) {

        return "Expired";
    }

    const days =
        Math.floor(
            diff /
            (1000 * 60 * 60 * 24)
        );

    const hours =
        Math.floor(
            (
                diff %
                (1000 * 60 * 60 * 24)
            )
            /
            (1000 * 60 * 60)
        );

    return `${days}d ${hours}h left`;
}

// ==========================================
// OVERDUE
// ==========================================

function isOverdue(
    date,
    time
) {

    return new Date(
        `${date}T${time}`
    ) < new Date();
}

// ==========================================
// REFRESH
// ==========================================

function refreshDashboard() {

    updateStats();

    generateCalendar();

    loadReminders();
}