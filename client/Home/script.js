const time_element = document.getElementById("time");
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function update_time() {
    const today_date = new Date();
    const time = today_date.getHours() + ":" + today_date.getMinutes();
    const day = days[today_date.getDay()];
    const date = today_date.getDate() + "/" + today_date.getMonth() + "/" + today_date.getFullYear();
    time_element.innerText = date + " " + day;
}

update_time();
setInterval(() => {
    update_time();
}, 60000);

function complete_task(event) {
    event.target.classList.toggle("completed");
}

const tasks = document.getElementsByClassName("task");
Array.from(tasks).forEach(element => {
    element.addEventListener("click", complete_task);
});