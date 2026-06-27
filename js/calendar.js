// ==========================================
// CALENDAR.JS
// ==========================================

let currentDate = new Date();
let selectedDate = null;

let remainders =
    JSON.parse(
        localStorage.getItem("remainders")
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
        .getElementById("searchRemainder")
        .addEventListener(
            "input",
            searchRemainders
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

    const dayRemainders =
        remainders.filter(
            remainder =>
                remainder.date === date
        );

    if (
        dayRemainders.some(
            remainder =>
                !remainder.completed
        )
    ) {

        html +=
            `<span class="dot dot-remainder"></span>`;
    }

    if (
        dayRemainders.some(
            remainder =>
                remainder.completed
        )
    ) {

        html +=
            `<span class="dot dot-completed"></span>`;
    }

    if (
        dayRemainders.some(
            remainder =>
                !remainder.completed &&
                new Date(
                    `${remainder.date}T${remainder.time}`
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

    const dayRemainders =
        remainders.filter(
            remainder =>
                remainder.date === date
        );

    const container =
        document.getElementById(
            "dayRemainders"
        );

    if (
        dayRemainders.length === 0
    ) {

        container.innerHTML =
            "<p>No remainders for this day.</p>";

        return;
    }

    container.innerHTML =
        dayRemainders
            .map(
                remainder => `

        <div class="remainder-item">

            <h6>
                ${remainder.title}
            </h6>

            <small>
                ⏰ ${remainder.time}
            </small>

            <br>

            <small>
                ${remainder.priority}
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
        remainders.filter(
            remainder =>
                remainder.date === today
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

function searchRemainders() {

    const query =
        document
            .getElementById(
                "searchRemainder"
            )
            .value
            .toLowerCase();

    const results =
        remainders.filter(
            remainder =>

                remainder.title
                    .toLowerCase()
                    .includes(
                        query
                    )

                ||

                (
                    remainder.description || ""
                )
                    .toLowerCase()
                    .includes(
                        query
                    )
        );

    const container =
        document.getElementById(
            "dayRemainders"
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
            "<p>No matching remainders found.</p>";

        return;
    }

    container.innerHTML =
        results
            .map(
                remainder => `

        <div class="remainder-item">

            <h6>
                ${remainder.title}
            </h6>

            <small>
                📅 ${remainder.date}
            </small>

            <br>

            <small>
                ⏰ ${remainder.time}
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