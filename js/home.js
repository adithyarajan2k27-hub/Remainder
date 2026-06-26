// =========================================
// REMAINDER DASHBOARD V3
// =========================================

document.addEventListener("DOMContentLoaded", () => {

    // =====================================
    // CLOCK
    // =====================================

    const clock =
        document.getElementById("clock");

    function updateClock() {

        const now = new Date();

        clock.textContent =
            now.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            });
    }

    updateClock();

    setInterval(
        updateClock,
        1000
    );

    // =====================================
    // GREETING
    // =====================================

    const greeting =
        document.getElementById(
            "greeting"
        );

    const hour =
        new Date().getHours();

    if(hour < 12){

        greeting.innerHTML =
            "Good Morning ☀️";

    }
    else if(hour < 18){

        greeting.innerHTML =
            "Good Afternoon 🌤️";

    }
    else{

        greeting.innerHTML =
            "Good Evening 🌙";
    }

    // =====================================
    // DARK MODE
    // =====================================

    const themeBtn =
        document.getElementById(
            "themeBtn"
        );

    const savedTheme =
        localStorage.getItem(
            "theme"
        );

    if(savedTheme === "dark"){

        document.body.classList.add(
            "dark"
        );

        themeBtn.innerHTML =
            "☀️";
    }

    themeBtn.addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "dark"
            );

            const darkMode =
                document.body.classList.contains(
                    "dark"
                );

            localStorage.setItem(
                "theme",
                darkMode
                    ? "dark"
                    : "light"
            );

            themeBtn.innerHTML =
                darkMode
                    ? "☀️"
                    : "🌙";
        }
    );

    // =====================================
    // CALENDAR
    // =====================================

    generateCalendar();

    function generateCalendar(){

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

        const currentYear =
            today.getFullYear();

        const currentMonth =
            today.getMonth();

        const currentDate =
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

        monthTitle.textContent =
            `${monthNames[currentMonth]} ${currentYear}`;

        const firstDay =
            new Date(
                currentYear,
                currentMonth,
                1
            ).getDay();

        const daysInMonth =
            new Date(
                currentYear,
                currentMonth + 1,
                0
            ).getDate();

        for(
            let i = 0;
            i < firstDay;
            i++
        ){

            const blank =
                document.createElement(
                    "div"
                );

            blank.classList.add(
                "blank"
            );

            calendar.appendChild(
                blank
            );
        }

        for(
            let day = 1;
            day <= daysInMonth;
            day++
        ){

            const dayBox =
                document.createElement(
                    "div"
                );

            dayBox.classList.add(
                "day"
            );

            dayBox.textContent =
                day;

            if(
                day === currentDate
            ){

                dayBox.classList.add(
                    "today"
                );
            }

            calendar.appendChild(
                dayBox
            );
        }
    }

    // =====================================
    // LOAD REMINDERS
    // =====================================

    loadReminders();

    function loadReminders(){

        const reminderList =
            document.getElementById(
                "reminderList"
            );

        const reminders =
            JSON.parse(
                localStorage.getItem(
                    "reminders"
                )
            ) || [];

        reminderList.innerHTML = "";

        if(reminders.length === 0){

            reminderList.innerHTML = `
                <div class="empty-state">

                    <i class="bi bi-calendar2-heart"></i>

                    <h4>
                        No Reminders Yet
                    </h4>

                    <p>
                        Tap the + button and create your first reminder.
                    </p>

                </div>
            `;

            updateStats(0);

            return;
        }

        reminders.forEach(
            reminder => {

                const card =
                    document.createElement(
                        "div"
                    );

                card.className =
                    "reminder-card";

                card.innerHTML = `

                    <div class="d-flex justify-content-between align-items-start">

                        <div>

                            <div class="reminder-title">
                                ${reminder.title}
                            </div>

                            <div class="reminder-meta mt-2">

                                📅 ${reminder.date}
                                <br>

                                ⏰ ${reminder.time}
                                <br>

                                🏷️ ${reminder.category}
                                <br>

                                ⭐ ${reminder.priority}

                            </div>

                        </div>

                        <div>

                            <button
                                class="btn btn-sm btn-outline-danger delete-btn"
                                data-id="${reminder.id}">

                                <i class="bi bi-trash"></i>

                            </button>

                        </div>

                    </div>

                    ${
                        reminder.description
                        ?
                        `<p class="mt-3 mb-0">
                            ${reminder.description}
                        </p>`
                        :
                        ""
                    }
                `;

                reminderList.appendChild(
                    card
                );
            }
        );

        updateStats(
            reminders.length
        );

        addDeleteEvents();
    }

    // =====================================
    // DELETE REMINDER
    // =====================================

    function addDeleteEvents(){

        const deleteButtons =
            document.querySelectorAll(
                ".delete-btn"
            );

        deleteButtons.forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const id =
                            Number(
                                button.dataset.id
                            );

                        let reminders =
                            JSON.parse(
                                localStorage.getItem(
                                    "reminders"
                                )
                            ) || [];

                        reminders =
                            reminders.filter(
                                item =>
                                item.id !== id
                            );

                        localStorage.setItem(
                            "reminders",
                            JSON.stringify(
                                reminders
                            )
                        );

                        loadReminders();
                    }
                );
            }
        );
    }

    // =====================================
    // STATS
    // =====================================

    function updateStats(total){

        document.getElementById(
            "todayTasks"
        ).textContent = total;

        document.getElementById(
            "upcomingTasks"
        ).textContent = total;

        document.getElementById(
            "completedTasks"
        ).textContent = 0;
    }

    // =====================================
    // NOTIFICATION BUTTON
    // =====================================

    const notifyBtn =
        document.querySelector(
            ".notify-btn"
        );

    notifyBtn.addEventListener(
        "click",
        () => {

            const reminders =
                JSON.parse(
                    localStorage.getItem(
                        "reminders"
                    )
                ) || [];

            alert(
                `You currently have ${reminders.length} reminder(s). 🔔`
            );
        }
    );

});