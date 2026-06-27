// ==========================================
// ANALYTICS.JS
// ==========================================

let remainders =
    JSON.parse(
        localStorage.getItem("remainders")
    ) || [];

let streakData =
    JSON.parse(
        localStorage.getItem("streakData")
    ) || {
        streak: 0,
        bestStreak: 0,
        streakDates: []
    };

// ==========================================
// INIT
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadTheme();

        calculateAnalytics();

        generateCharts();

        generateInsights();

    }
);

// ==========================================
// ANALYTICS
// ==========================================

function calculateAnalytics() {

    const total =
        remainders.length;

    const completed =
        remainders.filter(
            remainder =>
                remainder.completed
        ).length;

    const pending =
        remainders.filter(
            remainder =>
                !remainder.completed
        ).length;

    const completionRate =
        total > 0
            ? Math.round(
                  (completed / total) * 100
              )
            : 0;

    // KPI Cards

    document.getElementById(
        "totalTasks"
    ).textContent = total;

    document.getElementById(
        "completedTasks"
    ).textContent = completed;

    document.getElementById(
        "pendingTasks"
    ).textContent = pending;

    document.getElementById(
        "completionRate"
    ).textContent =
        completionRate + "%";

    document.getElementById(
        "productivityScore"
    ).textContent =
        completionRate + "%";

    // Streak

    document.getElementById(
        "currentStreak"
    ).textContent =
        streakData.streak || 0;

    document.getElementById(
        "bestStreak"
    ).textContent =
        streakData.bestStreak || 0;

    // Priority Counts

    const high =
        remainders.filter(
            remainder =>
                remainder.priority === "High"
        ).length;

    const medium =
        remainders.filter(
            remainder =>
                remainder.priority === "Medium"
        ).length;

    const low =
        remainders.filter(
            remainder =>
                remainder.priority === "Low"
        ).length;

    document.getElementById(
        "highPriority"
    ).textContent = high;

    document.getElementById(
        "mediumPriority"
    ).textContent = medium;

    document.getElementById(
        "lowPriority"
    ).textContent = low;

    // Today's Summary

    const today =
        new Date()
            .toISOString()
            .split("T")[0];

    const todayTasks =
        remainders.filter(
            remainder =>
                remainder.date === today
        );

    const todayCompleted =
        todayTasks.filter(
            remainder =>
                remainder.completed
        ).length;

    const todayRemaining =
        todayTasks.length -
        todayCompleted;

    document.getElementById(
        "todayTotal"
    ).textContent =
        todayTasks.length;

    document.getElementById(
        "todayCompleted"
    ).textContent =
        todayCompleted;

    document.getElementById(
        "todayRemaining"
    ).textContent =
        todayRemaining;
}

// ==========================================
// CHARTS
// ==========================================

function generateCharts() {

    generateProductivityChart();

    generateStatusChart();

    generateCategoryChart();

    generateMonthlyChart();
}

// ==========================================
// PRODUCTIVITY SCORE
// ==========================================

function generateProductivityChart() {

    const completed =
        remainders.filter(
            remainder =>
                remainder.completed
        ).length;

    const pending =
        remainders.length -
        completed;

    new Chart(

        document.getElementById(
            "productivityChart"
        ),

        {
            type: "doughnut",

            data: {

                labels: [
                    "Completed",
                    "Remaining"
                ],

                datasets: [{
                    data: [
                        completed,
                        pending
                    ],

                    backgroundColor: [
                        "#9333ea",
                        "#e5e7eb"
                    ],

                    borderWidth: 0
                }]
            },

            options: {

                responsive: true,

                plugins: {

                    legend: {
                        display: false
                    }
                }
            }
        }
    );
}

// ==========================================
// STATUS CHART
// ==========================================

function generateStatusChart() {

    const completed =
        remainders.filter(
            remainder =>
                remainder.completed
        ).length;

    const pending =
        remainders.filter(
            remainder =>
                !remainder.completed
        ).length;

    const overdue =
        remainders.filter(
            remainder => {

                if (
                    remainder.completed
                ) return false;

                return new Date(
                    `${remainder.date}T${remainder.time}`
                ) < new Date();
            }
        ).length;

    new Chart(

        document.getElementById(
            "statusChart"
        ),

        {
            type: "doughnut",

            data: {

                labels: [
                    "Completed",
                    "Pending",
                    "Overdue"
                ],

                datasets: [{

                    data: [
                        completed,
                        pending,
                        overdue
                    ],

                    backgroundColor: [

                        "#10b981",
                        "#9333ea",
                        "#ef4444"
                    ]
                }]
            },

            options: {

                responsive: true
            }
        }
    );
}

// ==========================================
// CATEGORY CHART
// ==========================================

function generateCategoryChart() {

    const categories = {};

    remainders.forEach(
        remainder => {

            const category =
                remainder.category ||
                "General";

            categories[category] =
                (categories[category] || 0) + 1;
        }
    );

    new Chart(

        document.getElementById(
            "categoryChart"
        ),

        {
            type: "pie",

            data: {

                labels:
                    Object.keys(
                        categories
                    ),

                datasets: [{

                    data:
                        Object.values(
                            categories
                        ),

                    backgroundColor: [

                        "#ec4899",
                        "#9333ea",
                        "#3b82f6",
                        "#10b981",
                        "#f59e0b",
                        "#ef4444"
                    ]
                }]
            },

            options: {

                responsive: true
            }
        }
    );
}

// ==========================================
// MONTHLY PRODUCTIVITY
// ==========================================

function generateMonthlyChart() {

    const months = [
        "Jan","Feb","Mar","Apr",
        "May","Jun","Jul","Aug",
        "Sep","Oct","Nov","Dec"
    ];

    const monthlyData =
        new Array(12).fill(0);

    remainders.forEach(
        remainder => {

            if (
                remainder.completed
            ) {

                const month =
                    new Date(
                        remainder.date
                    ).getMonth();

                monthlyData[month]++;
            }
        }
    );

    new Chart(

        document.getElementById(
            "monthlyChart"
        ),

        {
            type: "bar",

            data: {

                labels: months,

                datasets: [{

                    label:
                    "Completed Tasks",

                    data:
                    monthlyData,

                    backgroundColor:
                    "#9333ea",

                    borderRadius: 10
                }]
            },

            options: {

                responsive: true,

                plugins: {

                    legend: {
                        display: false
                    }
                }
            }
        }
    );
}

// ==========================================
// SMART INSIGHTS
// ==========================================

function generateInsights() {

    const container =
        document.getElementById(
            "insightsContainer"
        );

    const total =
        remainders.length;

    const completed =
        remainders.filter(
            remainder =>
                remainder.completed
        ).length;

    const completionRate =
        total > 0
            ? Math.round(
                (completed / total) * 100
              )
            : 0;

    const overdue =
        remainders.filter(
            remainder => {

                if (
                    remainder.completed
                ) return false;

                return new Date(
                    `${remainder.date}T${remainder.time}`
                ) < new Date();
            }
        ).length;

    const categories = {};

    remainders.forEach(
        remainder => {

            const category =
                remainder.category ||
                "General";

            categories[category] =
                (categories[category] || 0) + 1;
        }
    );

    let topCategory =
        "General";

    let maxCount = 0;

    for (
        const category
        in categories
    ) {

        if (
            categories[category] >
            maxCount
        ) {

            maxCount =
                categories[category];

            topCategory =
                category;
        }
    }

    const insights = [

        `🔥 You have completed ${completionRate}% of your remainders.`,

        `📚 Your most active category is "${topCategory}".`,

        `⚠ You currently have ${overdue} overdue remainders.`,

        `🏆 Your current streak is ${streakData.streak || 0} days.`

    ];

    container.innerHTML =
        insights.map(
            insight =>

            `<div class="insight-card">
                ${insight}
            </div>`
        ).join("");
}

// ==========================================
// DARK MODE
// ==========================================

function loadTheme() {

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