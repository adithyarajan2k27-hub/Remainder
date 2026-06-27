// ==========================================
// ADD REMAINDER JS
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    initializeTheme();

    setupPrioritySelection();

    setupCategorySelection();

    setupFormSubmit();

    setMinimumDate();

});

// ==========================================
// MINIMUM DATE = TODAY
// ==========================================

function setMinimumDate() {

    const today =
        new Date()
        .toISOString()
        .split("T")[0];

    document.getElementById(
        "date"
    ).min = today;
}

// ==========================================
// PRIORITY SELECTION
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
// CATEGORY SELECTION
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
// FORM SUBMIT
// ==========================================

function setupFormSubmit() {

    const form =
        document.getElementById(
            "remainderForm"
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
                    "Please fill all required fields."
                );

                return;
            }

            const remainders =
                JSON.parse(
                    localStorage.getItem(
                        "remainders"
                    )
                ) || [];

            const remainder = {

                id: Date.now(),

                title,

                description,

                date,

                time,

                priority,

                category,

                completed: false,

                createdAt:
                    new Date().toISOString()
            };

            remainders.push(
                remainder
            );

            localStorage.setItem(
                "remainders",
                JSON.stringify(
                    remainders
                )
            );

            showToast(
                "Remainder Created 🎉"
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
// DARK MODE
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