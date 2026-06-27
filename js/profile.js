// ==========================================
// PROFILE.JS
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    loadTheme();
    loadProfile();
    loadStatistics();
    loadAchievements();
    loadRecentActivity();

    setupProfileEditing();
    setupProfilePhoto();

    setupExportData();
    setupClearData();
    setupLogout();

});

// ==========================================
// PROFILE DATA
// ==========================================

function getProfile() {

    return JSON.parse(
        localStorage.getItem("profile")
    ) || {

        name: "Guest User",

        email: "guest@example.com",

        mobile: "Not Added",

        country: "India",

        occupation: "Student",

        joinDate:
            new Date().toLocaleDateString(
                "en-US",
                {
                    month: "long",
                    year: "numeric"
                }
            ),

        image:
            "https://ui-avatars.com/api/?name=Guest+User&background=9333ea&color=fff&size=256"
    };
}

function saveProfile(profile) {

    localStorage.setItem(
        "profile",
        JSON.stringify(profile)
    );
}

// ==========================================
// LOAD PROFILE
// ==========================================

function loadProfile() {

    const profile = getProfile();

    document.getElementById(
        "profileName"
    ).textContent =
        profile.name;

    document.getElementById(
        "profileEmail"
    ).textContent =
        profile.email;

    document.getElementById(
        "fullName"
    ).textContent =
        profile.name;

    document.getElementById(
        "emailText"
    ).textContent =
        profile.email;

    document.getElementById(
        "mobileText"
    ).textContent =
        profile.mobile;

    document.getElementById(
        "countryText"
    ).textContent =
        profile.country;

    document.getElementById(
        "occupationText"
    ).textContent =
        profile.occupation;

    document.getElementById(
        "joinDate"
    ).textContent =
        profile.joinDate;
    document.getElementById(
    "profileImage"
).src =
    profile.image;

document.getElementById(
    "bannerName"
).textContent =
    profile.name;

document.getElementById(
    "bannerGreeting"
).textContent =
    `Welcome back, ${profile.name}. Keep your streak alive and crush today's goals.`;
}

// ==========================================
// PROFILE EDIT
// ==========================================

function setupProfileEditing() {

    const profile =
        getProfile();

    document.getElementById(
        "nameInput"
    ).value =
        profile.name;

    document.getElementById(
        "emailInput"
    ).value =
        profile.email;

    document.getElementById(
        "mobileInput"
    ).value =
        profile.mobile;

    document.getElementById(
        "countryInput"
    ).value =
        profile.country;

    document.getElementById(
        "occupationInput"
    ).value =
        profile.occupation;

    document
        .getElementById(
            "saveProfileBtn"
        )
        .addEventListener(
            "click",
            () => {

                profile.name =
                    document.getElementById(
                        "nameInput"
                    ).value;

                profile.email =
                    document.getElementById(
                        "emailInput"
                    ).value;

                profile.mobile =
                    document.getElementById(
                        "mobileInput"
                    ).value;

                profile.country =
                    document.getElementById(
                        "countryInput"
                    ).value;

                profile.occupation =
                    document.getElementById(
                        "occupationInput"
                    ).value;

                saveProfile(profile);

                location.reload();
            }
        );
}

// ==========================================
// PROFILE PHOTO
// ==========================================

function setupProfilePhoto() {

    const upload =
        document.getElementById(
            "profileUpload"
        );

    document
        .getElementById(
            "changePhotoBtn"
        )
        .addEventListener(
            "click",
            () => {

                upload.click();
            }
        );

    upload.addEventListener(
        "change",
        event => {

            const file =
                event.target.files[0];

            if (!file) return;

            const reader =
                new FileReader();

            reader.onload =
                function(e) {

                    const profile =
                        getProfile();

                    profile.image =
                        e.target.result;

                    saveProfile(profile);

                    document.getElementById(
                        "profileImage"
                    ).src =
                        profile.image;
                };

            reader.readAsDataURL(
                file
            );
        }
    );
}

// ==========================================
// STATISTICS
// ==========================================

function loadStatistics() {

    const reminders =
        JSON.parse(
            localStorage.getItem(
                "reminders"
            )
        ) || [];

    const streakData =
        JSON.parse(
            localStorage.getItem(
                "streakData"
            )
        ) || {
            streak: 0,
            bestStreak: 0
        };

    const total =
        reminders.length;

    const completed =
        reminders.filter(
            reminder =>
                reminder.completed
        ).length;

    const overdue =
        reminders.filter(
            reminder => {

                if (
                    reminder.completed
                )
                    return false;

                return (
                    new Date(
                        `${reminder.date}T${reminder.time}`
                    ) <
                    new Date()
                );
            }
        ).length;

    const completionRate =
        total > 0
            ? Math.round(
                  (completed /
                      total) *
                      100
              )
            : 0;

    document.getElementById(
        "currentStreak"
    ).textContent =
        streakData.streak;

    document.getElementById(
        "bestStreak"
    ).textContent =
        streakData.bestStreak;

    document.getElementById(
        "completedTasks"
    ).textContent =
        completed;

    document.getElementById(
        "totalTasks"
    ).textContent =
        total;

    document.getElementById(
        "completionRate"
    ).textContent =
        completionRate + "%";

    document.getElementById(
        "productivityScore"
    ).textContent =
        completionRate + "%";

    document.getElementById(
        "overdueTasks"
    ).textContent =
        overdue;

    updateProductivityLevel(
        completionRate
    );
    if (
    !streakData.bestStreak ||
    streakData.bestStreak < streakData.streak
) {

    streakData.bestStreak =
        streakData.streak;

    localStorage.setItem(
        "streakData",
        JSON.stringify(streakData)
    );
}
}

// ==========================================
// PRODUCTIVITY LEVEL
// ==========================================

function updateProductivityLevel(
    rate
) {

    let level =
        "⭐ Productivity Explorer";

    if (rate >= 90)
        level =
            "👑 Productivity Master";

    else if (rate >= 75)
        level =
            "🚀 Advanced Performer";

    else if (rate >= 50)
        level =
            "🔥 Consistent Worker";

    document.querySelector(
        ".profile-level"
    ).textContent =
        level;
}

// ==========================================
// ACHIEVEMENTS
// ==========================================

function loadAchievements() {

    const reminders =
        JSON.parse(
            localStorage.getItem(
                "reminders"
            )
        ) || [];

    const streakData =
        JSON.parse(
            localStorage.getItem(
                "streakData"
            )
        ) || {
            streak: 0
        };

    const completed =
        reminders.filter(
            reminder =>
                reminder.completed
        ).length;

    const badges = [

        {
            icon: "🔥",
            title:
                "7 Day Streak",
            unlocked:
                streakData.streak >=
                7
        },

        {
            icon: "🏆",
            title:
                "30 Day Streak",
            unlocked:
                streakData.streak >=
                30
        },

        {
            icon: "💯",
            title:
                "100 Tasks Completed",
            unlocked:
                completed >= 100
        },

        {
            icon: "⚡",
            title:
                "Productivity Master",
            unlocked:
                completed >= 250
        }
    ];

    const container =
        document.getElementById(
            "badgeContainer"
        );

    container.innerHTML =
        badges
            .map(
                badge =>

                    `
        <div class="badge-item ${
            badge.unlocked
                ? "unlocked"
                : "locked"
        }">

            <h3>${badge.icon}</h3>

            <p>
                ${badge.title}
            </p>

        </div>
        `
            )
            .join("");
}

// ==========================================
// RECENT ACTIVITY
// ==========================================

function loadRecentActivity() {

    const reminders =
        JSON.parse(
            localStorage.getItem(
                "reminders"
            )
        ) || [];

    const container =
        document.getElementById(
            "activityContainer"
        );

    if (
        reminders.length === 0
    ) {

        container.innerHTML =

            `
            <div class="activity-item">
                No recent activity.
            </div>
            `;

        return;
    }

    const recent =
        reminders
            .slice(-5)
            .reverse();

    container.innerHTML =
        recent
            .map(
                reminder =>

                    `
            <div class="activity-item">

                ${
                    reminder.completed
                        ? "✅ Completed"
                        : "📝 Added"
                }

                :

                ${
                    reminder.title
                }

            </div>
            `
            )
            .join("");
}

// ==========================================
// EXPORT DATA
// ==========================================

function setupExportData() {

    document
        .getElementById(
            "exportBtn"
        )
        .addEventListener(
            "click",
            () => {

                const data = {

                    profile:
                        JSON.parse(
                            localStorage.getItem(
                                "profile"
                            )
                        ),

                    reminders:
                        JSON.parse(
                            localStorage.getItem(
                                "reminders"
                            )
                        ),

                    streakData:
                        JSON.parse(
                            localStorage.getItem(
                                "streakData"
                            )
                        )
                };

                const blob =
                    new Blob(
                        [
                            JSON.stringify(
                                data,
                                null,
                                2
                            )
                        ],
                        {
                            type:
                                "application/json"
                        }
                    );

                const link =
                    document.createElement(
                        "a"
                    );

                link.href =
                    URL.createObjectURL(
                        blob
                    );

                link.download =
                    "remainder-backup.json";

                link.click();
            }
        );
}

// ==========================================
// CLEAR DATA
// ==========================================

function setupClearData() {

    document
        .getElementById(
            "clearBtn"
        )
        .addEventListener(
            "click",
            () => {

                const confirmDelete =
                    confirm(
                        "Delete all app data permanently?"
                    );

                if (
                    !confirmDelete
                )
                    return;

                localStorage.clear();

                alert(
                    "All data deleted."
                );

                location.reload();
            }
        );
}

// ==========================================
// DARK MODE
// ==========================================

function loadTheme() {

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
    }

    document
        .getElementById(
            "themeBtn"
        )
        .addEventListener(
            "click",
            toggleTheme
        );

    document
        .getElementById(
            "toggleThemeBtn"
        )
        .addEventListener(
            "click",
            toggleTheme
        );
}

function toggleTheme() {

    document.body.classList.toggle(
        "dark"
    );

    localStorage.setItem(
        "theme",

        document.body.classList.contains(
            "dark"
        )
            ? "dark"
            : "light"
    );
}

function setupLogout(){

    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );

    const modal =
        document.getElementById(
            "logoutModal"
        );

    const cancelBtn =
        document.getElementById(
            "cancelLogout"
        );

    const confirmBtn =
        document.getElementById(
            "confirmLogout"
        );

    logoutBtn.addEventListener(
        "click",
        () => {

            modal.classList.add(
                "show"
            );

        }
    );

    cancelBtn.addEventListener(
        "click",
        () => {

            modal.classList.remove(
                "show"
            );

        }
    );

    confirmBtn.addEventListener(
        "click",
        () => {

            localStorage.removeItem(
                "currentUser"
            );

            window.location.href =
                "login.html";

        }
    );

}