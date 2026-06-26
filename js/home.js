const clock = document.getElementById("clock");

function updateClock() {

    const now = new Date();

    clock.innerHTML = now.toLocaleTimeString();
}

setInterval(updateClock,1000);

updateClock();

const themeBtn = document.getElementById("themeBtn");

themeBtn.addEventListener("click",()=>{

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){
        themeBtn.innerHTML = "☀️";
    }
    else{
        themeBtn.innerHTML = "🌙";
    }
});

const countdown = document.getElementById("countdown");

const targetDate = new Date();

targetDate.setDate(targetDate.getDate() + 5);

function updateCountdown(){

    const now = new Date();

    const diff = targetDate - now;

    const days = Math.floor(
        diff / (1000 * 60 * 60 * 24)
    );

    const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24))
        /
        (1000 * 60 * 60)
    );

    const minutes = Math.floor(
        (diff % (1000 * 60 * 60))
        /
        (1000 * 60)
    );

    countdown.innerHTML =
        `${days}d ${hours}h ${minutes}m`;
}

setInterval(updateCountdown,1000);

updateCountdown();