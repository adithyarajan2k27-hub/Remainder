// ==========================================
// REMAINDERS PAGE JS
// ==========================================

let remainders = [];
let filteredRemainders = [];

// ==========================================
// INIT
// ==========================================

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

document.addEventListener("DOMContentLoaded", () => {

    loadTheme();

    loadRemainders();

    updateStats();

    renderRemainders();

    setupSearch();

    setupFilters();

});

// ==========================================
// GET REMAINDERS
// ==========================================

function loadRemainders() {

    remainders =
        JSON.parse(
            localStorage.getItem("remainders")
        ) || [];

    filteredRemainders = [...remainders];
}

// ==========================================
// STATS
// ==========================================

function updateStats() {

    const today =
        new Date()
        .toISOString()
        .split("T")[0];

    const pending =
        remainders.filter(
            remainder => !remainder.completed
        ).length;

    const completed =
        remainders.filter(
            remainder => remainder.completed
        ).length;

    const overdue =
        remainders.filter(remainder => {

            if (remainder.completed)
                return false;

            return new Date(
                `${remainder.date}T${remainder.time}`
            ) < new Date();

        }).length;

    document.getElementById(
        "allCount"
    ).innerText = remainders.length;

    document.getElementById(
        "pendingCount"
    ).innerText = pending;

    document.getElementById(
        "completedCount"
    ).innerText = completed;

    document.getElementById(
        "overdueCount"
    ).innerText = overdue;
}

// ==========================================
// RENDER
// ==========================================

function renderRemainders() {

    const container =
        document.getElementById(
            "remainderContainer"
        );

    container.innerHTML = "";

    if (filteredRemainders.length === 0) {

        container.innerHTML = `

        <div class="col-12">

            <div class="empty-state glass-card">

                <i class="bi bi-calendar-x"></i>

                <h3>No Remainders Found</h3>

                <p>
                    Try changing filters or add a new remainder.
                </p>

            </div>

        </div>

        `;

        return;
    }

    filteredRemainders.forEach(remainder => {

        const overdue =
            !remainder.completed &&
            new Date(
                `${remainder.date}T${remainder.time}`
            ) < new Date();

        let badgeClass = "low";

        if (
            remainder.priority === "Medium"
        ) {

            badgeClass = "medium";
        }

        if (
            remainder.priority === "High"
        ) {

            badgeClass = "high";
        }

        const card = document.createElement("div");

        card.className = "col-lg-4 col-md-6";

        card.innerHTML = `

        <div class="remainder-card">

            <div class="card-header-top">

                <div>

                    <div class="remainder-title">

                        ${remainder.title}

                    </div>

                </div>

                <div>

                    <span class="priority-badge ${badgeClass}">

                        ${remainder.priority}

                    </span>

                </div>

            </div>

            <div class="remainder-meta">

                📅 ${remainder.date}

                <br>

                ⏰ ${remainder.time}

            </div>

            <div class="category-chip">

                ${remainder.category || "General"}

            </div>

            <div class="remainder-description">

                ${remainder.description || "No description"}

            </div>

            ${
                remainder.completed
                ? `
                <div class="mt-3">
                    <span class="completed-badge">
                        ✓ COMPLETED
                    </span>
                </div>
                `
                : ""
            }

            ${
                overdue
                ? `
                <div class="mt-3">
                    <span class="overdue-badge">
                        ⚠ OVERDUE
                    </span>
                </div>
                `
                : ""
            }

            <div class="card-actions">

                ${
                    !remainder.completed
                    ? `
                    <button
                        class="action-btn complete-btn"
                        onclick="completeRemainder(${remainder.id})">

                        ✓ Complete

                    </button>
                    `
                    : ""
                }

                <button
                    class="action-btn edit-btn"
                    onclick="editRemainder(${remainder.id})">

                    ✏ Edit

                </button>

                <button
                    class="action-btn delete-btn"
                    onclick="deleteRemainder(${remainder.id})">

                    🗑 Delete

                </button>

            </div>

        </div>

        `;

        container.appendChild(card);

    });

}

// ==========================================
// SEARCH
// ==========================================

function setupSearch() {

    document
        .getElementById("searchInput")
        .addEventListener("input", applyFilters);
}

// ==========================================
// FILTERS
// ==========================================

function setupFilters() {

    document
        .getElementById("filterSelect")
        .addEventListener("change", applyFilters);

    document
        .getElementById("sortSelect")
        .addEventListener("change", applyFilters);
}

// ==========================================
// APPLY FILTERS
// ==========================================

function applyFilters() {

    const search =
        document.getElementById(
            "searchInput"
        ).value.toLowerCase();

    const filter =
        document.getElementById(
            "filterSelect"
        ).value;

    const sort =
        document.getElementById(
            "sortSelect"
        ).value;

    const today =
        new Date()
        .toISOString()
        .split("T")[0];

    filteredRemainders =
        remainders.filter(remainder => {

            const matchSearch =

                remainder.title
                    .toLowerCase()
                    .includes(search)

                ||

                (remainder.description || "")
                    .toLowerCase()
                    .includes(search);

            if (!matchSearch)
                return false;

            switch(filter) {

                case "pending":
                    return !remainder.completed;

                case "completed":
                    return remainder.completed;

                case "today":
                    return remainder.date === today;

                case "upcoming":
                    return remainder.date > today;

                case "overdue":
                    return !remainder.completed &&
                        remainder.date < today;

                case "high":
                    return remainder.priority === "High";

                case "medium":
                    return remainder.priority === "Medium";

                case "low":
                    return remainder.priority === "Low";

                default:
                    return true;
            }

        });

    applySorting(sort);

    renderRemainders();
}

// ==========================================
// SORT
// ==========================================

function applySorting(sort) {

    filteredRemainders.sort((a,b)=>{

        switch(sort){

            case "dateAsc":

                return new Date(
                    `${a.date}T${a.time}`
                ) -
                new Date(
                    `${b.date}T${b.time}`
                );

            case "dateDesc":

                return new Date(
                    `${b.date}T${b.time}`
                ) -
                new Date(
                    `${a.date}T${a.time}`
                );

            case "priority":

                const order = {
                    High:3,
                    Medium:2,
                    Low:1
                };

                return order[b.priority]
                    - order[a.priority];

            case "created":

                return new Date(
                    b.createdAt
                ) -
                new Date(
                    a.createdAt
                );

            default:

                return 0;
        }

    });

}

// ==========================================
// COMPLETE
// ==========================================

function completeRemainder(id) {

    const index =
        remainders.findIndex(
            remainder =>
                remainder.id === id
        );

    if(index === -1)
        return;

    remainders[index].completed = true;

    remainders[index].completedDate =
        new Date()
        .toISOString()
        .split("T")[0];

    localStorage.setItem(
        "remainders",
        JSON.stringify(remainders)
    );

    updateStreak();

    refreshPage();
}

// ==========================================
// DELETE
// ==========================================

function deleteRemainder(id) {

    if(
        !confirm(
            "Delete this remainder?"
        )
    ){
        return;
    }

    remainders =
        remainders.filter(
            remainder =>
                remainder.id !== id
        );

    localStorage.setItem(
        "remainders",
        JSON.stringify(remainders)
    );

    refreshPage();
}

// ==========================================
// EDIT
// ==========================================

function editRemainder(id) {

    window.location.href =
        `edit_remainder.html?id=${id}`;
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

            streak:0,
            lastCompletedDate:null,
            streakDates:[]
        };

    if(
        streakData.lastCompletedDate ===
        today
    ){
        return;
    }

    if(
        streakData.lastCompletedDate
    ){

        const previous =
            new Date(
                streakData.lastCompletedDate
            );

        const current =
            new Date(today);

        const diff =
            Math.floor(
                (current - previous)
                /
                (1000*60*60*24)
            );

        if(diff === 1){

            streakData.streak++;

        }else{

            streakData.streak = 1;
        }

    }else{

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
// REFRESH
// ==========================================

function refreshPage() {

    loadRemainders();

    updateStats();

    applyFilters();
}

// ==========================================
// THEME
// ==========================================

function loadTheme() {

    const btn =
        document.getElementById(
            "themeBtn"
        );

    const saved =
        localStorage.getItem(
            "theme"
        );

    if(saved === "dark"){

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