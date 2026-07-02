// ==========================================
// EDIT REMAINDER JS
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    initializeTheme();

    loadRemainder();

    setupPrioritySelection();

    setupCategorySelection();

    setupFormSubmit();

});

const currentUser =
    JSON.parse(
        localStorage.getItem(
            "currentUser"
        )
    );

if (!currentUser) {

    window.location.href =
        "login.html";
}

// ==========================================
// URL PARAM
// ==========================================

const params =
    new URLSearchParams(
        window.location.search
    );

const remainderId =
    Number(
        params.get("id")
    );

// ==========================================
// LOAD REMAINDER
// ==========================================

function loadRemainder() {

    const remainders =
        JSON.parse(
            localStorage.getItem(
                "remainders"
            )
        ) || [];

    const remainder =
        remainders.find(
            item =>
            item.id === remainderId
        );

    if (!remainder) {

        alert(
            "Remainder not found!"
        );

        window.location.href =
            "home.html";

        return;
    }

    document.getElementById(
        "title"
    ).value =
        remainder.title || "";

    document.getElementById(
        "description"
    ).value =
        remainder.description || "";

    document.getElementById(
        "date"
    ).value =
        remainder.date || "";

    document.getElementById(
        "time"
    ).value =
        remainder.time || "";

    document.getElementById(
        "priority"
    ).value =
        remainder.priority || "";

    document.getElementById(
        "category"
    ).value =
        remainder.category || "";

    // Activate saved priority

    document
        .querySelectorAll(
            ".priority-chip"
        )
        .forEach(chip => {

            if (
                chip.dataset.value ===
                remainder.priority
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
                remainder.category
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
// UPDATE REMAINDER
// ==========================================

function setupFormSubmit() {

    const form =
        document.getElementById(
            "editRemainderForm"
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

            const remainders =
                JSON.parse(
                    localStorage.getItem(
                        "remainders"
                    )
                ) || [];

            const index =
                remainders.findIndex(
                    item =>
                    item.id === remainderId
                );

            if (
                index === -1
            ) {

                alert(
                    "Remainder not found."
                );

                return;
            }

            remainders[index] = {

                ...remainders[index],

                title,
                description,
                date,
                time,
                priority,
                category
            };

            localStorage.setItem(
                "remainders",
                JSON.stringify(
                    remainders
                )
            );

            showToast(
                "Remainder Updated 🎉"
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