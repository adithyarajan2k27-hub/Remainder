// ==========================================
// EDIT REMINDER JS
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    initializeTheme();

    loadReminder();

    setupPrioritySelection();

    setupCategorySelection();

    setupFormSubmit();

});

// ==========================================
// URL PARAM
// ==========================================

const params =
    new URLSearchParams(
        window.location.search
    );

const reminderId =
    Number(
        params.get("id")
    );

// ==========================================
// LOAD REMINDER
// ==========================================

function loadReminder() {

    const reminders =
        JSON.parse(
            localStorage.getItem(
                "reminders"
            )
        ) || [];

    const reminder =
        reminders.find(
            item =>
            item.id === reminderId
        );

    if (!reminder) {

        alert(
            "Reminder not found!"
        );

        window.location.href =
            "home.html";

        return;
    }

    document.getElementById(
        "title"
    ).value =
        reminder.title || "";

    document.getElementById(
        "description"
    ).value =
        reminder.description || "";

    document.getElementById(
        "date"
    ).value =
        reminder.date || "";

    document.getElementById(
        "time"
    ).value =
        reminder.time || "";

    document.getElementById(
        "priority"
    ).value =
        reminder.priority || "";

    document.getElementById(
        "category"
    ).value =
        reminder.category || "";

    // Activate saved priority

    document
        .querySelectorAll(
            ".priority-chip"
        )
        .forEach(chip => {

            if (
                chip.dataset.value ===
                reminder.priority
            ) {

                chip.classList.add(
                    "active"
                );
            }

        });

    // Activate saved category

    document
        .querySelectorAll(
            ".category-card"
        )
        .forEach(card => {

            if (
                card.dataset.value ===
                reminder.category
            ) {

                card.classList.add(
                    "active"
                );
            }

        });

}

// ==========================================
// PRIORITY
// ==========================================

function setupPrioritySelection() {

    const chips =
        document.querySelectorAll(
            ".priority-chip"
        );

    chips.forEach(chip => {

        chip.addEventListener(
            "click",
            () => {

                chips.forEach(item =>
                    item.classList.remove(
                        "active"
                    )
                );

                chip.classList.add(
                    "active"
                );

                document.getElementById(
                    "priority"
                ).value =
                    chip.dataset.value;

            }
        );

    });

}

// ==========================================
// CATEGORY
// ==========================================

function setupCategorySelection() {

    const cards =
        document.querySelectorAll(
            ".category-card"
        );

    cards.forEach(card => {

        card.addEventListener(
            "click",
            () => {

                cards.forEach(item =>
                    item.classList.remove(
                        "active"
                    )
                );

                card.classList.add(
                    "active"
                );

                document.getElementById(
                    "category"
                ).value =
                    card.dataset.value;

            }
        );

    });

}

// ==========================================
// UPDATE REMINDER
// ==========================================

function setupFormSubmit() {

    const form =
        document.getElementById(
            "editReminderForm"
        );

    form.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            const title =
                document.getElementById(
                    "title"
                ).value.trim();

            const description =
                document.getElementById(
                    "description"
                ).value.trim();

            const date =
                document.getElementById(
                    "date"
                ).value;

            const time =
                document.getElementById(
                    "time"
                ).value;

            const priority =
                document.getElementById(
                    "priority"
                ).value;

            const category =
                document.getElementById(
                    "category"
                ).value;

            if (
                !title ||
                !date ||
                !time ||
                !priority ||
                !category
            ) {

                alert(
                    "Please complete all fields."
                );

                return;
            }

            const reminders =
                JSON.parse(
                    localStorage.getItem(
                        "reminders"
                    )
                ) || [];

            const index =
                reminders.findIndex(
                    item =>
                    item.id === reminderId
                );

            if (
                index === -1
            ) {

                alert(
                    "Reminder not found."
                );

                return;
            }

            reminders[index] = {

                ...reminders[index],

                title,
                description,
                date,
                time,
                priority,
                category
            };

            localStorage.setItem(
                "reminders",
                JSON.stringify(
                    reminders
                )
            );

            showToast(
                "Reminder Updated 🎉"
            );

            setTimeout(
                () => {

                    window.location.href =
                        "home.html";

                },
                1500
            );

        }
    );

}

// ==========================================
// TOAST
// ==========================================

function showToast(message) {

    const toast =
        document.createElement(
            "div"
        );

    toast.className =
        "custom-toast";

    toast.textContent =
        message;

    document.body.appendChild(
        toast
    );

    setTimeout(
        () => {

            toast.classList.add(
                "show"
            );

        },
        100
    );

    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

            setTimeout(
                () => {

                    toast.remove();

                },
                400
            );

        },
        2000
    );

}

// ==========================================
// THEME
// ==========================================

function initializeTheme() {

    const themeBtn =
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

        themeBtn.innerHTML =
            "☀️";
    }

    themeBtn.addEventListener(
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

            themeBtn.innerHTML =
                dark
                ? "☀️"
                : "🌙";

        }
    );

}