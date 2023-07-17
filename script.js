var tasks = [];

// Function to add a new task
function addTask() {
  var taskInput = document.getElementById("taskInput");
  var taskList = document.getElementById("taskList");

  if (taskInput.value === "") {
    return;
  }

  var task = {
    id: Date.now(),
    name: taskInput.value,
    completed: false
  };

  tasks.push(task);
  saveTasks();

  var taskItem = createTaskItem(task);
  taskList.appendChild(taskItem);

  taskInput.value = "";
  updateSummary();
}

// Function to create a new task item
function createTaskItem(task) {
  var taskItem = document.createElement("li");
  taskItem.setAttribute("data-id", task.id);

  var taskCheckbox = document.createElement("input");
  taskCheckbox.setAttribute("type", "checkbox");
  taskCheckbox.checked = task.completed;
  taskCheckbox.addEventListener("change", toggleTaskCompletion);
  taskItem.appendChild(taskCheckbox);

  var taskText = document.createElement("span");
  taskText.textContent = task.name;
  if (task.completed) {
    taskText.classList.add("completed");
  }
  taskItem.appendChild(taskText);

  var deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", deleteTask);
  taskItem.appendChild(deleteButton);

  return taskItem;
}

// Function to toggle the completion status of a task
function toggleTaskCompletion(event) {
  var taskId = parseInt(event.target.parentElement.getAttribute("data-id"));
  var task = tasks.find(task => task.id === taskId);
  task.completed = event.target.checked;
  saveTasks();

  var taskText = event.target.nextElementSibling;
  if (event.target.checked) {
    taskText.classList.add("completed");
  } else {
    taskText.classList.remove("completed");
  }

  updateSummary();
}

// Function to delete a task
function deleteTask(event) {
  var taskId = parseInt(event.target.parentElement.getAttribute("data-id"));
  var taskIndex = tasks.findIndex(task => task.id === taskId);
  tasks.splice(taskIndex, 1);
  saveTasks();

  event.target.parentElement.remove();

  updateSummary();
}

// Function to filter tasks based on selected filter option
function filterTasks() {
  var filter = document.getElementById("filter").value;
  var taskItems = document.querySelectorAll("#taskList li");

  taskItems.forEach(taskItem => {
    var taskId = parseInt(taskItem.getAttribute("data-id"));
    var task = tasks.find(task => task.id === taskId);

    if (filter === "all") {
      taskItem.style.display = "block";
    } else if (filter === "completed") {
      if (task.completed) {
        taskItem.style.display = "block";
      } else {
        taskItem.style.display = "none";
      }
    } else if (filter === "active") {
      if (!task.completed) {
        taskItem.style.display = "block";
      } else {
        taskItem.style.display = "none";
      }
    }
  });
}

// Function to clear completed tasks
function clearCompleted() {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();

  var taskItems = document.querySelectorAll("#taskList li");
  taskItems.forEach(taskItem => {
    if (taskItem.querySelector("input[type='checkbox']").checked) {
      taskItem.remove();
    }
  });

  updateSummary();
}

// Function to save tasks to local storage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Function to load tasks from local storage
function loadTasks() {
  var storedTasks = localStorage.getItem("tasks");
  if (storedTasks) {
    tasks = JSON.parse(storedTasks);
    tasks.forEach(task => {
      var taskItem = createTaskItem(task);
      document.getElementById("taskList").appendChild(taskItem);
    });
  }
  updateSummary();
}

// Function to update the summary of completed and total tasks
function updateSummary() {
  var totalTasks = tasks.length;
  var completedTasks = tasks.filter(task => task.completed).length;
  var summary = document.getElementById("summary");
  summary.textContent = `${completedTasks} completed out of ${totalTasks}`;
}

// Load tasks from local storage when the page loads
loadTasks();
