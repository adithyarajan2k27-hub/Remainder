// ==========================================
// REMAINDER HOME.JS
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    loadTheme();
    startClock();
    setGreeting();

    updateStats();
    generateCalendar();
    loadRemainders();

});

// ==========================================
// GET REMAINDERS
// ==========================================

function getRemainders() {

    return JSON.parse(
        localStorage.getItem("remainders")
    ) || [];
}

// ==========================================
// SAVE REMAINDERS
// ==========================================

function saveRemainders(remainders) {

    localStorage.setItem(
        "remainders",
        JSON.stringify(remainders)
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

    const remainders =
        getRemainders();

    const today =
        new Date()
        .toISOString()
        .split("T")[0];

    const todayTasks =
        remainders.filter(
            remainder =>
                remainder.date === today &&
                !remainder.completed
        ).length;

    const upcoming =
        remainders.filter(
            remainder =>
                remainder.date > today &&
                !remainder.completed
        ).length;

    const completed =
        remainders.filter(
            remainder =>
                remainder.completed
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
        remainders.length;

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

function getUpcomingRemainders() {

    return getRemainders()

        .filter(
            remainder =>
                !remainder.completed
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
// LOAD REMAINDERS
// ==========================================

function loadRemainders() {

    const remainderList =
        document.getElementById(
            "remainderList"
        );

    remainderList.innerHTML = "";

    const remainders =
        getUpcomingRemainders();

    if (remainders.length === 0) {

        remainderList.innerHTML = `

        <div class="empty-state">

            <i class="bi bi-calendar-heart"></i>

            <h4>
                No Upcoming Remainders
            </h4>

            <p>
                Click + to create one.
            </p>

        </div>

        `;

        return;
    }

    remainders.forEach(remainder => {

        const card =
            document.createElement("div");

        card.classList.add(
            "remainder-card"
        );

        const overdue =
            isOverdue(
                remainder.date,
                remainder.time
            );

        card.innerHTML = `

        <div class="task-top">

            <div>

                <h5 class="remainder-title">
                    ${remainder.title}
                </h5>

                <div class="remainder-meta">

                    📅 ${remainder.date}

                    <br>

                    ⏰ ${remainder.time}

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
                        remainder.date,
                        remainder.time
                    )}

                </div>

            </div>

            <div class="priority-badge">

                ${remainder.priority}

            </div>

        </div>

        <p class="mt-3">
            ${remainder.description || ""}
        </p>

        <div class="task-actions">

            <input
                type="checkbox"
                class="complete-checkbox"
                data-id="${remainder.id}">

            <button
                class="edit-btn"
                data-id="${remainder.id}">

                ✏️ Edit

            </button>

            <button
                class="delete-btn"
                data-id="${remainder.id}">

                🗑️ Delete

            </button>

        </div>

        `;

        remainderList.appendChild(card);

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

                    let remainders =
                        getRemainders();

                    remainders =
                        remainders.filter(
                            remainder =>
                                remainder.id !== id
                        );

                    saveRemainders(
                        remainders
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

                    const remainders =
                        getRemainders();

                    const remainder =
                        remainders.find(
                            item =>
                                item.id === id
                        );

                    if (!remainder)
                        return;

                    remainder.completed = true;

                    remainder.completedDate =
                        new Date()
                        .toISOString()
                        .split("T")[0];

                    saveRemainders(
                        remainders
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
                        `edit_remainder.html?id=${id}`;
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

    const remainders =
        getRemainders();

    const remainderDates =
        remainders.map(
            remainder =>
                remainder.date
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
            remainderDates.includes(
                dateString
            )
        ) {

            box.classList.add(
                "remainder-day"
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

    loadRemainders();
}