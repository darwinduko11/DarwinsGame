const defaultStudents = [
  "Student 1", "Student 2", "Student 3", "Student 4", "Student 5",
  "Student 6", "Student 7", "Student 8", "Student 9", "Student 10"
];

let students = JSON.parse(localStorage.getItem("students")) || defaultStudents.map(name => ({
  name, reading: false, writing: false
}));
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const save = (key, value) => localStorage.setItem(key, JSON.stringify(value));

function updateDateTime() {
  const now = new Date();
  document.getElementById("today").textContent = now.toLocaleDateString(undefined, {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });
  document.getElementById("currentTime").textContent = now.toLocaleTimeString([], {
    hour: "2-digit", minute: "2-digit"
  });
}
setInterval(updateDateTime, 1000);
updateDateTime();

function renderStudents() {
  document.getElementById("studentList").innerHTML = students.map((student, index) => `
    <div class="student-row">
      <div class="student-name">
        <span class="student-number">${index + 1}</span>${student.name}
      </div>
      <div class="student-actions">
        <button class="${student.reading ? "selected" : ""}" data-action="reading" data-index="${index}">📖 Reading</button>
        <button class="${student.writing ? "selected" : ""}" data-action="writing" data-index="${index}">✍️ Writing</button>
      </div>
    </div>
  `).join("");
  document.getElementById("studentCount").textContent = students.length;
}

function renderTasks() {
  const list = document.getElementById("taskList");
  list.innerHTML = tasks.length ? tasks.map((task, index) => `
    <div class="task-item ${task.done ? "done" : ""}">
      <input type="checkbox" ${task.done ? "checked" : ""} data-task="${index}">
      <span class="task-title">${escapeHtml(task.title)}</span>
      <span class="task-meta">${task.type}</span>
      <button class="delete-task" data-delete="${index}" title="Delete task">×</button>
    </div>
  `).join("") : `<p class="muted">No tasks yet. Add your first reminder above.</p>`;

  document.getElementById("completedCount").textContent = tasks.filter(task => task.done).length;
  document.getElementById("openCount").textContent = tasks.filter(task => !task.done).length;
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[character]));
}

document.getElementById("studentList").addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const student = students[button.dataset.index];
  student[button.dataset.action] = !student[button.dataset.action];
  save("students", students);
  renderStudents();
});

document.getElementById("resetStudents").addEventListener("click", () => {
  students = defaultStudents.map(name => ({ name, reading: false, writing: false }));
  save("students", students);
  renderStudents();
});

document.getElementById("taskForm").addEventListener("submit", event => {
  event.preventDefault();
  tasks.unshift({
    title: document.getElementById("taskInput").value.trim(),
    type: document.getElementById("taskType").value,
    priority: document.getElementById("taskPriority").value,
    done: false
  });
  save("tasks", tasks);
  event.target.reset();
  renderTasks();
});

document.getElementById("taskList").addEventListener("click", event => {
  if (event.target.dataset.task !== undefined) {
    tasks[event.target.dataset.task].done = event.target.checked;
    save("tasks", tasks);
    renderTasks();
  }
  if (event.target.dataset.delete !== undefined) {
    tasks.splice(event.target.dataset.delete, 1);
    save("tasks", tasks);
    renderTasks();
  }
});

document.querySelectorAll(".tool-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tool-tab, .tool-content").forEach(item => item.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tool).classList.add("active");
  });
});

const pronounQuestions = [
  "Maria is reading. ___ is reading.",
  "The boys are writing. ___ are writing.",
  "David and I are studying. ___ are studying.",
  "The book is new. ___ is new."
];
let pronounIndex = 0;
document.getElementById("newPronoun").addEventListener("click", () => {
  pronounIndex = (pronounIndex + 1) % pronounQuestions.length;
  document.getElementById("pronounQuestion").textContent = pronounQuestions[pronounIndex];
});

document.querySelectorAll("#soundGrid button").forEach(button => {
  button.addEventListener("click", () => {
    document.getElementById("soundResult").textContent =
      `Ask: Can you say three words that begin with the ${button.dataset.sound.toUpperCase()} sound?`;
  });
});

const notes = document.getElementById("notes");
notes.value = localStorage.getItem("notes") || "";
let noteTimer;
notes.addEventListener("input", () => {
  clearTimeout(noteTimer);
  noteTimer = setTimeout(() => {
    localStorage.setItem("notes", notes.value);
    document.getElementById("savedMessage").textContent = "Saved";
    setTimeout(() => document.getElementById("savedMessage").textContent = "", 1500);
  }, 400);
});

document.getElementById("themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
});
if (localStorage.getItem("darkMode") === "true") document.body.classList.add("dark");

renderStudents();
renderTasks();
