// ===============================
// TO-DO LIST APPLICATION
// ===============================


// Get HTML elements
const todoForm = document.getElementById("todo-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const taskCount = document.getElementById("task-count");
const clearCompletedButton =
    document.getElementById("clear-completed");

const filterButtons =
    document.querySelectorAll("[data-filter]");


// Application state
let tasks = JSON.parse(
    localStorage.getItem("todoTasks")
) || [];

let currentFilter = "all";


// ===============================
// SAVE TASKS
// ===============================

function saveTasks() {

    localStorage.setItem(
        "todoTasks",
        JSON.stringify(tasks)
    );
}


// ===============================
// RENDER TASKS
// ===============================

function renderTasks() {

    taskList.innerHTML = "";

    let filteredTasks = tasks;

    if (currentFilter === "active") {

        filteredTasks = tasks.filter(
            task => !task.completed
        );
    }

    if (currentFilter === "completed") {

        filteredTasks = tasks.filter(
            task => task.completed
        );
    }


    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.dataset.id = task.id;

        if (task.completed) {
            li.classList.add("completed");
        }


        const checkbox =
            document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.checked = task.completed;

        checkbox.setAttribute(
            "aria-label",
            `Mark ${task.text} as completed`
        );


        const taskText =
            document.createElement("span");

        taskText.textContent = task.text;


        const editButton =
            document.createElement("button");

        editButton.type = "button";

        editButton.textContent = "Edit";

        editButton.className = "edit-button";


        const deleteButton =
            document.createElement("button");

        deleteButton.type = "button";

        deleteButton.textContent = "Delete";

        deleteButton.className = "delete-button";


        // Complete task
        checkbox.addEventListener(
            "change",
            () => {

                toggleTask(task.id);
            }
        );


        // Edit task
        editButton.addEventListener(
            "click",
            () => {

                editTask(task.id);
            }
        );


        // Delete task
        deleteButton.addEventListener(
            "click",
            () => {

                deleteTask(task.id);
            }
        );


        li.appendChild(checkbox);

        li.appendChild(taskText);

        li.appendChild(editButton);

        li.appendChild(deleteButton);

        taskList.appendChild(li);

    });


    updateTaskCount();
}


// ===============================
// ADD TASK
// ===============================

todoForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        const text = taskInput.value.trim();

        if (text === "") {
            return;
        }


        const newTask = {

            id: Date.now(),

            text: text,

            completed: false
        };


        tasks.push(newTask);

        saveTasks();

        renderTasks();

        taskInput.value = "";

        taskInput.focus();
    }
);


// ===============================
// TOGGLE TASK
// ===============================

function toggleTask(id) {

    tasks = tasks.map(task => {

        if (task.id === id) {

            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;
    });


    saveTasks();

    renderTasks();
}


// ===============================
// EDIT TASK
// ===============================

function editTask(id) {

    const task =
        tasks.find(task => task.id === id);

    if (!task) {
        return;
    }


    const updatedText =
        prompt("Edit your task:", task.text);


    if (
        updatedText !== null &&
        updatedText.trim() !== ""
    ) {

        task.text = updatedText.trim();

        saveTasks();

        renderTasks();
    }
}


// ===============================
// DELETE TASK
// ===============================

function deleteTask(id) {

    tasks = tasks.filter(
        task => task.id !== id
    );


    saveTasks();

    renderTasks();
}


// ===============================
// FILTER TASKS
// ===============================

filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            currentFilter =
                button.dataset.filter;

            renderTasks();
        }
    );
});


// ===============================
// CLEAR COMPLETED TASKS
// ===============================

clearCompletedButton.addEventListener(
    "click",
    () => {

        tasks = tasks.filter(
            task => !task.completed
        );

        saveTasks();

        renderTasks();
    }
);


// ===============================
// TASK COUNT
// ===============================

function updateTaskCount() {

    const activeTasks =
        tasks.filter(
            task => !task.completed
        ).length;


    if (activeTasks === 1) {

        taskCount.textContent =
            "1 task remaining";

    } else {

        taskCount.textContent =
            `${activeTasks} tasks remaining`;
    }
}


// ===============================
// INITIAL RENDER
// ===============================

renderTasks();