// ==========================================
// CALENDAR.JS
// ==========================================

let currentDate = new Date();
let selectedDate = null;

let reminders =
    JSON.parse(
        localStorage.getItem("reminders")
    ) || [];

let streakData =
    JSON.parse(
        localStorage.getItem("streakData")
    ) || {
        streak: 0,
        streakDates: []
    };

// ==========================================
// INIT
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeTheme();

        generateCalendar();

        updateStatistics();

        setupEvents();

    }
);

// ==========================================
// EVENTS
// ==========================================

function setupEvents() {

    document
        .getElementById("prevMonth")
        .addEventListener(
            "click",
            () => {

                currentDate.setMonth(
                    currentDate.getMonth() - 1
                );

                generateCalendar();

            }
        );

    document
        .getElementById("nextMonth")
        .addEventListener(
            "click",
            () => {

                currentDate.setMonth(
                    currentDate.getMonth() + 1
                );

                generateCalendar();

            }
        );

    document
        .getElementById("todayBtn")
        .addEventListener(
            "click",
            () => {

                currentDate =
                    new Date();

                generateCalendar();

            }
        );

    document
        .getElementById("searchReminder")
        .addEventListener(
            "input",
            searchReminders
        );
}

// ==========================================
// GENERATE CALENDAR
// ==========================================

function generateCalendar() {

    const grid =
        document.getElementById(
            "calendarGrid"
        );

    grid.innerHTML = "";

    const year =
        currentDate.getFullYear();

    const month =
        currentDate.getMonth();

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

    document.getElementById(
        "monthYear"
    ).textContent =
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

    const prevMonthDays =
        new Date(
            year,
            month,
            0
        ).getDate();

    // Previous month dates

    for (
        let i = firstDay;
        i > 0;
        i--
    ) {

        const day =
            document.createElement(
                "div"
            );

        day.className =
            "calendar-day other-month";

        day.innerHTML =
            `<div class="day-number">
                ${prevMonthDays - i + 1}
            </div>`;

        grid.appendChild(day);
    }

    // Current month dates

    for (
        let date = 1;
        date <= daysInMonth;
        date++
    ) {

        const fullDate =
            formatDate(
                year,
                month + 1,
                date
            );

        const day =
            document.createElement(
                "div"
            );

        day.className =
            "calendar-day";

        if (
            isToday(fullDate)
        ) {
            day.classList.add(
                "today"
            );
        }

        if (
            selectedDate ===
            fullDate
        ) {
            day.classList.add(
                "selected"
            );
        }

        const indicators =
            getIndicators(
                fullDate
            );

        day.innerHTML = `

            <div class="day-number">
                ${date}
            </div>

            <div class="indicators">
                ${indicators}
            </div>

        `;

        day.addEventListener(
            "click",
            () => {

                selectedDate =
                    fullDate;

                showDateDetails(
                    fullDate
                );

                generateCalendar();

            }
        );

        grid.appendChild(day);
    }

    // Remaining cells

    const totalCells =
        firstDay +
        daysInMonth;

    const remaining =
        42 - totalCells;

    for (
        let i = 1;
        i <= remaining;
        i++
    ) {

        const day =
            document.createElement(
                "div"
            );

        day.className =
            "calendar-day other-month";

        day.innerHTML =
            `<div class="day-number">
                ${i}
            </div>`;

        grid.appendChild(day);
    }
}

// ==========================================
// INDICATORS
// ==========================================

function getIndicators(date) {

    let html = "";

    const dayReminders =
        reminders.filter(
            reminder =>
                reminder.date === date
        );

    if (
        dayReminders.some(
            reminder =>
                !reminder.completed
        )
    ) {

        html +=
            `<span class="dot dot-reminder"></span>`;
    }

    if (
        dayReminders.some(
            reminder =>
                reminder.completed
        )
    ) {

        html +=
            `<span class="dot dot-completed"></span>`;
    }

    if (
        dayReminders.some(
            reminder =>
                !reminder.completed &&
                new Date(
                    `${reminder.date}T${reminder.time}`
                ) < new Date()
        )
    ) {

        html +=
            `<span class="dot dot-overdue"></span>`;
    }

    if (
        streakData.streakDates &&
        streakData.streakDates.includes(
            date
        )
    ) {

        html +=
            `<span class="dot dot-streak"></span>`;
    }

    return html;
}

// ==========================================
// DATE DETAILS
// ==========================================

function showDateDetails(date) {

    document.getElementById(
        "selectedDate"
    ).innerHTML =

        `<strong>${date}</strong>`;

    const dayReminders =
        reminders.filter(
            reminder =>
                reminder.date === date
        );

    const container =
        document.getElementById(
            "dayReminders"
        );

    if (
        dayReminders.length === 0
    ) {

        container.innerHTML =
            "<p>No reminders for this day.</p>";

        return;
    }

    container.innerHTML =
        dayReminders
            .map(
                reminder => `

        <div class="reminder-item">

            <h6>
                ${reminder.title}
            </h6>

            <small>
                ⏰ ${reminder.time}
            </small>

            <br>

            <small>
                ${reminder.priority}
            </small>

        </div>

    `
            )
            .join("");
}

// ==========================================
// STATS
// ==========================================

function updateStatistics() {

    const today =
        new Date()
        .toISOString()
        .split("T")[0];

    const todayTasks =
        reminders.filter(
            reminder =>
                reminder.date === today
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

    document.getElementById(
        "todayTasks"
    ).textContent =
        todayTasks;

    document.getElementById(
        "upcomingTasks"
    ).textContent =
        upcoming;

    document.getElementById(
        "completedTasks"
    ).textContent =
        completed;

    document.getElementById(
        "streakCount"
    ).textContent =
        `🔥 ${streakData.streak || 0}`;
}

// ==========================================
// SEARCH
// ==========================================

function searchReminders() {

    const query =
        document
            .getElementById(
                "searchReminder"
            )
            .value
            .toLowerCase();

    const results =
        reminders.filter(
            reminder =>

                reminder.title
                    .toLowerCase()
                    .includes(
                        query
                    )

                ||

                (
                    reminder.description || ""
                )
                    .toLowerCase()
                    .includes(
                        query
                    )
        );

    const container =
        document.getElementById(
            "dayReminders"
        );

    if (
        query === ""
    ) {

        container.innerHTML =
            "No date selected";

        return;
    }

    if (
        results.length === 0
    ) {

        container.innerHTML =
            "<p>No matching reminders found.</p>";

        return;
    }

    container.innerHTML =
        results
            .map(
                reminder => `

        <div class="reminder-item">

            <h6>
                ${reminder.title}
            </h6>

            <small>
                📅 ${reminder.date}
            </small>

            <br>

            <small>
                ⏰ ${reminder.time}
            </small>

        </div>

    `
            )
            .join("");
}

// ==========================================
// HELPERS
// ==========================================

function isToday(date) {

    return (
        date ===
        new Date()
            .toISOString()
            .split("T")[0]
    );
}

function formatDate(
    year,
    month,
    day
) {

    return `${year}-${String(month)
        .padStart(2, "0")}-${String(day)
        .padStart(2, "0")}`;
}

// ==========================================
// THEME
// ==========================================

function initializeTheme() {

    const btn =
        document.getElementById(
            "themeBtn"
        );

    const savedTheme =
        localStorage.getItem(
            "theme"
        );

    if (
        savedTheme === "dark"
    ) {

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