/*
---- DEFINITIONS ----
*/

// TODO LIST VARIABLES
const current_tasks = (window.localStorage.getItem("current-tasks") || "").split(",");
const completed_tasks = (window.localStorage.getItem("completed-tasks") || "").split(",");

const tasks_container = document.getElementById("task-list");
const add_button = document.getElementById("task-add");
const task_name_input = document.getElementById("task-name");

// OTHER VARIABLES
const time_element = document.getElementById("time");
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/*
---- FUNCTIONS ----
*/

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
    task_name = event.target.innerText;
    delete current_tasks[current_tasks.indexOf(task_name)];
    completed_tasks.push(task_name);
    store_data();
}

current_id = 0
function generate_id() {
    current_id += 1;
    result = current_id.toString();
    if(result.length < 5) {
        for (let index = 0; index < (5 - result); index++) {
            result = "0" + result;
        }
    }
    result = "TASK_ID-"+result;
    return result;
}

function add_task(task_name) {
    const new_list = document.createElement("li");
    new_list.className = "task";
    new_list.dataset["id"] = generate_id();
    new_list.innerText = task_name;
    new_list.addEventListener("click", complete_task);
    tasks_container.appendChild(new_list);
    current_tasks.push(task_name);
    store_data();
}

function store_data() {
    console.log(current_tasks);
    console.log(completed_tasks);
    window.localStorage.setItem("current-tasks", current_tasks.join(","));
    window.localStorage.setItem("completed-tasks", completed_tasks.join(","));
}

/* ---- Events ---- */

const tasks = document.getElementsByClassName("task");
Array.from(tasks).forEach(element => {
    element.addEventListener("click", complete_task);
});

add_button.addEventListener("click", () => add_task(task_name_input.value));