/*
---- DEFINITIONS ----
*/

// TASK LIST VARIABLES
let tasks_data = [];
const task_id_prefix = "TASK_ID-";

const tasks_container = document.getElementById("task-list");
const add_button = document.getElementById("task-add");
const task_name_input = document.getElementById("task-name");

// DATA ACTION VARIABLES
const import_btn = document.getElementById("import-btn");
const export_btn = document.getElementById("export-btn");

// POP UP VARIABLES
const notification_popup_container = document.getElementById("notification-popup");
const notification_message = document.getElementById("notification-message");
const close_notification_btn = document.getElementById("close-notification");
let close_notification_timeout = setTimeout(() => {}, 0);

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
    const date = today_date.getDate() + "/" + (today_date.getMonth() + 1) + "/" + today_date.getFullYear();
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
    if (event.target.tagName != "LI") {
        return;
    }

    event.target.classList.toggle("completed");
    const task_name = event.target.innerText;
    const task_id = event.target.dataset["id"];

    // Update the current_tasks and completed_tasks list and store it to local storage
    change_task_data_value(task_id, "completed", event.target.classList.contains("completed"));
    store_data();
}

current_id = 0;
function generate_id() {
    current_id += 1;
    result = current_id.toString();
    if (result.length < 5) {
        const zero_length = 5 - result.length;
        for (let index = 0; index < zero_length; index++) {
            result = "0" + result;
        }
    }
    result = task_id_prefix + result;
    return result;
}

function add_task_element(task_name, task_id = null, completed = false) {
    // Generate new id if not specified
    task_id = task_id || generate_id();

    // Create task element
    const new_task = document.createElement("li");
    new_task.className = "task" + (completed ? " completed" : "");
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
    task_name_input.value = "";

    // Add task element
    const task_id = generate_id();
    add_task_element(task_name, task_id);

    // Add to the current task & update to the local storage
    tasks_data.push({ task_name, task_id, completed: false });
    store_data();
}

function remove_task(task_id, task_element = null) {
    // Remove element from container
    if (task_element) {
        tasks_container.removeChild(task_element);
    }
    else {
        tasks_container.removeChild(Array.from(tasks_container.children).find(value => value.dataset["id"] == task_id));
    }

    // Remove data and store it to the localStorage
    const task_index = tasks_data.findIndex(value => value["task_id"] == task_id);
    try {
        let task_name = tasks_data[task_index]["task_name"];
        tasks_data.splice(task_index, 1);
        store_data();
        popup_message(`Task: "${task_name}" has been deleted!`, 3000);
    }
    catch (e) {
        console.error(e);
    }
}

function download_file(filename, text) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}


function export_data() {
    const today_date = new Date();
    download_file(`TaskData ${today_date.getHours()}:${today_date.getMinutes()}:${today_date.getSeconds()} ${today_date.getDate()}-${(today_date.getMonth() + 1)}-${today_date.getFullYear()}.json`, JSON.stringify({ tasks_data, current_id }));
}

function import_data() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = ".json";
    input.addEventListener("change", (e) => {
        file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = readerEvent => {
            const data = JSON.parse(readerEvent.target.result); // this is the content!
            tasks_data = data["tasks_data"];
            current_id = data["current_id"];
            update_tasks_data();
            store_data();
            popup_message("Successfully Import Data!", 5000);
        };
    });
    input.click();
}

function store_data() {
    window.localStorage.setItem("tasks-data", JSON.stringify(tasks_data));
    window.localStorage.setItem("task-id", current_id);
}

function update_from_storage() {
    tasks_data = JSON.parse(window.localStorage.getItem("tasks-data") || "[]");
    current_id = Number.parseInt(window.localStorage.getItem("task-id") || "0");
    update_tasks_data();
}

function update_tasks_data() {
    Array.from(tasks_container.children).forEach(element => {
        tasks_container.removeChild(element);
    });

    tasks_data.forEach(task_data => {
        add_task_element(task_data["task_name"], task_data["task_id"], task_data["completed"]);
    });
}

update_from_storage();

function popup_message(message, timeout=5000) {
    notification_popup_container.classList.add("active");
    notification_message.innerText = message;
    clearTimeout(close_notification_timeout);
    close_notification_timeout = setTimeout(() => {
        notification_popup_container.classList.remove("active");
    }, timeout);
}

/* ---- Events ---- */

// Add Task Button Event
add_button.addEventListener("click", () => add_task(task_name_input.value));
// Export Tasks Data Button Event
export_btn.addEventListener("click", export_data);
// Import Tasks Data Button Event
import_btn.addEventListener("click", import_data);

// Enter to Add Task Event
window.addEventListener("keydown", e => {
    if (e.key == "Enter") {
        add_task(task_name_input.value);
    }
});

// Close Notification Button Event
close_notification_btn.addEventListener("click", () => {
    notification_popup_container.classList.remove("active");
    clearTimeout(close_notification_timeout);
})