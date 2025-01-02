/*
---- DEFINITIONS ----
*/

// TODO LIST VARIABLES
let tasks_data = [];
const task_id_prefix = "TASK_ID-"

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

function change_task_data_value(task_id, key, value) {
    tasks_data[tasks_data.findIndex(value => value["task_id"] == task_id)][key] = value;
}

function complete_task(event) {
    // Change the element state
    event.target.classList.toggle("completed");
    const task_name = event.target.innerText;
    const task_id = event.target.dataset["id"];

    // Update the current_tasks and completed_tasks list and store it to local storage
    change_task_data_value(task_id, "completed", event.target.classList.contains("completed"));
    store_data();
}

current_id = 0
function generate_id() {
    current_id += 1;
    result = current_id.toString();
    if(result.length < 5) {
        const zero_length = 5 - result.length;
        for (let index = 0; index < zero_length; index++) {
            console.log(index);
            result = "0" + result;
        }
    }
    result = task_id_prefix+result;
    return result;
}

function add_task_element(task_name, task_id=null, completed=false) {
    // Generate new id if not specified
    task_id = task_id || generate_id();

    // Create task element
    const new_task = document.createElement("li");
    new_task.className = "task"+(completed?" completed":"");
    new_task.dataset["id"] = task_id;
    new_task.innerText = task_name;
    new_task.addEventListener("click", complete_task);
    
    const delete_btn = document.createElement("button");
    delete_btn.className = "delete-btn";
    delete_btn.dataset["id"] = task_id;
    delete_btn.addEventListener("click", () => remove_task(task_id));

    const trash_icon = document.createElement("img");
    trash_icon.src = "../public/bin.png";
    trash_icon.alt = "Trash Icon";
    trash_icon.width = 40;

    delete_btn.appendChild(trash_icon);
    new_task.appendChild(delete_btn);
    tasks_container.appendChild(new_task);
}

function add_task(task_name) {
    // Clear task name input
    task_name_input.value = ""
    
    // Add task element
    const task_id = generate_id();
    add_task_element(task_name, task_id);
    
    // Add to the current task & update to the local storage
    tasks_data.push({task_name, task_id, completed: false});
    store_data();
}

function remove_task(task_id, task_element=null) {
    // Remove element from container
    if(task_element) {
        tasks_container.removeChild(task_element);
    }
    else {
        tasks_container.removeChild(Array.from(tasks_container.children).find(value => value.dataset["id"] == task_id));
    }
    
    // Remove data and store it to the localStorage
    tasks_data.splice(tasks_data.findIndex(value => value["task_id"] == task_id), 1);
    store_data();
}

function store_data() {
    console.log(tasks_data);
    window.localStorage.setItem("tasks-data", JSON.stringify(tasks_data));
    window.localStorage.setItem("task-id", current_id);
}

function update_from_storage() {
    tasks_data = JSON.parse(window.localStorage.getItem("tasks-data") || "[]");
    current_id = Number.parseInt(window.localStorage.getItem("task-id") || "0");

    tasks_data.forEach(task_data => {
        add_task_element(task_data["task_name"], task_data["task_id"], task_data["completed"])
    });

}

update_from_storage();

/* ---- Events ---- */

const tasks = document.getElementsByClassName("task");
Array.from(tasks).forEach(element => {
    element.addEventListener("click", complete_task);
});

add_button.addEventListener("click", () => add_task(task_name_input.value));

window.addEventListener("keydown", e => {
    console.log(e.key);
    if(e.key == "Enter") {
        add_task(task_name_input.value);
    }
})