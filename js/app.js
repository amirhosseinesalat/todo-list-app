const taskInput = document.getElementById("task-input");
const dateInput = document.getElementById("date-input");
const addButton = document.getElementById("add-button");
const editButton = document.getElementById("edit-button");
const alertMessage = document.getElementById("alert-message");
const todosTbody = document.querySelector("tbody");
const deleteAllButton = document.getElementById("delete-all-button");
const filterTodos = document.querySelectorAll(".filter-todos");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

const saveToLocalStorage = () => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

const generateId = () => {
  return Math.round(Math.random() * Math.random() * 10000000000);
};

const showAlert = (message, type) => {
  alertMessage.innerHTML = "";
  const alert = document.createElement("p");
  alert.innerText = message;
  alert.classList.add("alert");
  alert.classList.add(`alert-${type}`);
  alertMessage.append(alert);
  setTimeout(() => {
    alert.style.display = "none";
  }, 2000);
};
const displayTodos = (data) => {
  const todoList = data || todos;
  todosTbody.innerHTML = "";
  if (!todoList.length) {
    todosTbody.innerHTML = "<tr><td colspan='4'> todo not found!</td> </tr>";
    return;
  }
  todoList.forEach((todo) => {
    todosTbody.innerHTML += `
    <tr>
      <td>${todo.task}</td>
      <td>${todo.date || "no date"}</td>
      <td>${todo.completed ? "completed" : "pending"}</td>
      <td>
      <button onclick="toggleHandler(${todo.id})">${
      todo.completed ? "Undo" : "Do"
    }</button>
      <button onclick="editHandler(${todo.id})">Edit</button>
      <button onclick="deleteHandler(${todo.id})">Delete</button>
      </td>
    </tr>
    
    `;
  });
};
const addHandler = () => {
  const task = taskInput.value;
  const date = dateInput.value;
  const todo = {
    id: generateId(),
    completed: false,
    task: task,
    date: date,
  };
  if (task) {
    todos.push(todo);
    saveToLocalStorage();
    displayTodos();
    taskInput.value = "";
    dateInput.value = "";
    showAlert("Todo added successfully", "successful");
  } else {
    showAlert("Please enter a todo", "error");
  }
};
const deleteAllHandler = () => {
  if (todos.length) {
    todos = [];
    saveToLocalStorage();
    displayTodos();
    showAlert("all todos deleted successfully", "successful");
  } else {
    showAlert("no todos to clear", "error");
  }
};
const deleteHandler = (id) => {
  const newTodos = todos.filter((todo) => todo.id !== id);
  todos = newTodos;
  saveToLocalStorage();
  displayTodos();
  showAlert("todo deleted", "successful");
};
const toggleHandler = (id) => {
  const todo = todos.find((todo) => todo.id === id);
  todo.completed = !todo.completed;
  saveToLocalStorage();
  displayTodos();
  showAlert("todo edited", "successful");
};
const editHandler = (id) => {
  const todo = todos.find((todo) => todo.id === id);
  taskInput.value = todo.task;
  dateInput.value = todo.date;
  addButton.style.display = "none";
  editButton.style.display = "inline-block";
  editButton.style.backgroundColor = "rgba(42, 233, 68, 0.53)";
  editButton.dataset.id = id;
};
const applyHandler = (event) => {
  const id = Number(event.target.dataset.id);
  const todo = todos.find((todo) => todo.id === id);
  todo.task = taskInput.value;
  todo.date = dateInput.value;
  taskInput.value = "";
  dateInput.value = "";
  addButton.style.display = "inline-block";
  editButton.style.display = "none";
  saveToLocalStorage();
  displayTodos();
  showAlert("todo edited successfully", "successful");
};
const filterHandler = (event) => {
  let filterTodos = null;
  const filter = event.target.dataset.filter;
  switch (filter) {
    case "pending":
      filterTodos = todos.filter((todo) => todo.completed === false);
      break;
    case "completed":
      filterTodos = todos.filter((todo) => todo.completed === true);
      break;
    default:
      filterTodos = todos;
      break;
  }
  displayTodos(filterTodos);
};
window.addEventListener("load", () => displayTodos());
addButton.addEventListener("click", addHandler);
deleteAllButton.addEventListener("click", deleteAllHandler);
editButton.addEventListener("click", applyHandler);
filterTodos.forEach((button) => {
  button.addEventListener("click", filterHandler);
});
