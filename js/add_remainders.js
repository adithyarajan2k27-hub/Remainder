// ==========================================
// REMAINDER V3
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        // ==================================
        // DARK MODE
        // ==================================

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

            themeBtn.innerHTML = "☀️";
        }

        themeBtn.addEventListener(
            "click",
            () => {

                document.body.classList.toggle(
                    "dark"
                );

                const isDark =
                    document.body.classList.contains(
                        "dark"
                    );

                localStorage.setItem(
                    "theme",
                    isDark
                    ? "dark"
                    : "light"
                );

                themeBtn.innerHTML =
                    isDark
                    ? "☀️"
                    : "🌙";
            }
        );

        // ==================================
        // PRIORITY SELECTION
        // ==================================

        const priorityChips =
            document.querySelectorAll(
                ".priority-chip"
            );

        const priorityInput =
            document.getElementById(
                "priority"
            );

        priorityChips.forEach(
            chip => {

                chip.addEventListener(
                    "click",
                    () => {

                        priorityChips.forEach(
                            item =>
                            item.classList.remove(
                                "active"
                            )
                        );

                        chip.classList.add(
                            "active"
                        );

                        priorityInput.value =
                            chip.dataset.value;
                    }
                );
            }
        );

        // ==================================
        // CATEGORY SELECTION
        // ==================================

        const categoryCards =
            document.querySelectorAll(
                ".category-card"
            );

        const categoryInput =
            document.getElementById(
                "category"
            );

        categoryCards.forEach(
            card => {

                card.addEventListener(
                    "click",
                    () => {

                        categoryCards.forEach(
                            item =>
                            item.classList.remove(
                                "active"
                            )
                        );

                        card.classList.add(
                            "active"
                        );

                        categoryInput.value =
                            card.dataset.value;
                    }
                );
            }
        );

        // ==================================
        // FORM SUBMIT
        // ==================================

        const reminderForm =
            document.getElementById(
                "reminderForm"
            );

        reminderForm.addEventListener(
            "submit",
            saveReminder
        );

        function saveReminder(e){

            e.preventDefault();

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
                priorityInput.value;

            const category =
                categoryInput.value;

            if(
                !title ||
                !date ||
                !time
            ){

                showToast(
                    "Please fill all required fields ⚠️"
                );

                return;
            }

            const reminder = {

                id: Date.now(),

                title,

                description,

                date,

                time,

                priority,

                category,

                completed:false,

                createdAt:
                new Date().toISOString()
            };

            const reminders =
                JSON.parse(
                    localStorage.getItem(
                        "reminders"
                    )
                ) || [];

            reminders.push(
                reminder
            );

            localStorage.setItem(
                "reminders",
                JSON.stringify(
                    reminders
                )
            );

            showToast(
                "Reminder Added Successfully 🎉"
            );

            reminderForm.reset();

            setTimeout(
                () => {

                    window.location.href =
                        "home.html";

                },
                1200
            );
        }

        // ==================================
        // TOAST
        // ==================================

        function showToast(message){

            const oldToast =
                document.querySelector(
                    ".custom-toast"
                );

            if(oldToast){

                oldToast.remove();
            }

            const toast =
                document.createElement(
                    "div"
                );

            toast.className =
                "custom-toast";

            toast.innerHTML =
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
                50
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
                        300
                    );

                },
                2500
            );
        }

        // ==================================
        // SET MINIMUM DATE
        // ==================================

        const dateInput =
            document.getElementById(
                "date"
            );

        const today =
            new Date()
            .toISOString()
            .split("T")[0];

        dateInput.min = today;
    }
);