// ======================================
// REMAINDER DASHBOARD JS
// ======================================

document.addEventListener("DOMContentLoaded", () => {

    // ======================================
    // LIVE CLOCK
    // ======================================

    const clock = document.getElementById("clock");

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
    setInterval(updateClock, 1000);

    // ======================================
    // GREETING MESSAGE
    // ======================================

    const greeting =
        document.getElementById("greeting");

    const currentHour =
        new Date().getHours();

    if (currentHour < 12) {

        greeting.innerHTML =
            "Good Morning ☀️";

    }
    else if (currentHour < 18) {

        greeting.innerHTML =
            "Good Afternoon 🌤️";

    }
    else {

        greeting.innerHTML =
            "Good Evening 🌙";
    }

    // ======================================
    // DARK MODE
    // ======================================

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

        const isDark =
            document.body.classList.contains("dark");

        localStorage.setItem(
            "theme",
            isDark ? "dark" : "light"
        );

        themeBtn.innerHTML =
            isDark ? "☀️" : "🌙";
    });

    // ======================================
    // CALENDAR
    // ======================================

    const calendar =
        document.getElementById("calendar");

    const monthTitle =
        document.getElementById("monthTitle");

    function generateCalendar() {

        calendar.innerHTML = "";

        const today =
            new Date();

        const year =
            today.getFullYear();

        const month =
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

        // Empty boxes

        for (let i = 0; i < firstDay; i++) {

            const blank =
                document.createElement("div");

            blank.classList.add("blank");

            calendar.appendChild(blank);
        }

        // Days

        for (let day = 1; day <= daysInMonth; day++) {

            const dayBox =
                document.createElement("div");

            dayBox.classList.add("day");

            dayBox.textContent = day;

            if (day === currentDate) {

                dayBox.classList.add("today");
            }

            calendar.appendChild(dayBox);
        }
    }

    generateCalendar();

    // ======================================
    // FLOATING BUTTON EFFECT
    // ======================================

    const addBtn =
        document.querySelector(".add-btn");

    if (addBtn) {

        addBtn.addEventListener(
            "mouseenter",
            () => {

                addBtn.style.transform =
                    "scale(1.1) rotate(90deg)";
            }
        );

        addBtn.addEventListener(
            "mouseleave",
            () => {

                addBtn.style.transform =
                    "scale(1) rotate(0deg)";
            }
        );
    }

    // ======================================
    // ACTIVE NAVBAR LINK
    // ======================================

    const navLinks =
        document.querySelectorAll(
            ".nav-link"
        );

    navLinks.forEach(link => {

        link.addEventListener(
            "click",
            function () {

                navLinks.forEach(item => {

                    item.classList.remove(
                        "active"
                    );
                });

                this.classList.add(
                    "active"
                );
            }
        );
    });

    // ======================================
    // MOBILE MENU AUTO CLOSE
    // ======================================

    const mobileLinks =
        document.querySelectorAll(
            ".mobile-link"
        );

    mobileLinks.forEach(link => {

        link.addEventListener(
            "click",
            () => {

                const menu =
                    document.getElementById(
                        "mobileMenu"
                    );

                const bsOffcanvas =
                    bootstrap.Offcanvas.getInstance(
                        menu
                    );

                if (bsOffcanvas) {

                    bsOffcanvas.hide();
                }
            }
        );
    });

    // ======================================
    // STATS PLACEHOLDER
    // (Replace with API later)
    // ======================================

    const todayTasks =
        document.getElementById(
            "todayTasks"
        );

    const upcomingTasks =
        document.getElementById(
            "upcomingTasks"
        );

    const completedTasks =
        document.getElementById(
            "completedTasks"
        );

    if (todayTasks)
        todayTasks.textContent = "0";

    if (upcomingTasks)
        upcomingTasks.textContent = "0";

    if (completedTasks)
        completedTasks.textContent = "0";

    // ======================================
    // NOTIFICATION BUTTON
    // ======================================

    const notificationBtn =
        document.querySelector(
            ".notification-btn"
        );

    if (notificationBtn) {

        notificationBtn.addEventListener(
            "click",
            () => {

                alert(
                    "No new notifications 🔔"
                );
            }
        );
    }

});