// ===== Portfolio Enhancements (Theme, UX) =====
(function () {
  const THEME_KEY = 'theme';

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch (_) {}
    const toggle = document.getElementById('themeToggle');
    if (toggle) toggle.textContent = theme === 'light' ? '🌙' : '🌞';
  }

  function initTheme() {
    let theme = 'dark';
    try {
      theme = localStorage.getItem(THEME_KEY) || (
        window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
      );
    } catch (_) {}
    setTheme(theme);
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        const next = (document.documentElement.getAttribute('data-theme') === 'light') ? 'dark' : 'light';
        setTheme(next);
      });
    }
  }

  function initYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }

  function initSmoothScroll() {
    const anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach((a) => {
      a.addEventListener('click', (e) => {
        const targetId = a.getAttribute('href');
        if (!targetId || targetId === '#') return;
        const id = targetId.slice(1);
        const el = document.getElementById(id);
        if (!el) return;
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initYear();
    initTheme();
    initSmoothScroll();
  });
})();

// ===== Existing minimal Absence App helpers (kept for admin/employee pages) =====
// Default admin account
const ADMIN = { username: "admin", password: "rofizaidan" };

// Load employees or initialize
let employees = JSON.parse(localStorage.getItem("employees")) || [];

// Login function
function login() {
  const userInput = document.getElementById("username");
  const passInput = document.getElementById("password");
  const error = document.getElementById("error");
  if (!userInput || !passInput) return; // Not on login page

  const user = userInput.value.trim();
  const pass = passInput.value.trim();

  if (user === ADMIN.username && pass === ADMIN.password) {
    localStorage.setItem("role", "admin");
    window.location.href = "admin.html";
    return;
  }

  const emp = employees.find(e => e.username === user && e.password === pass);
  if (emp) {
    localStorage.setItem("role", "employee");
    localStorage.setItem("employee", JSON.stringify(emp));
    window.location.href = "employee.html";
  } else if (error) {
    error.textContent = "Invalid username or password";
  }
}

// Logout
function logout() {
  localStorage.removeItem("role");
  localStorage.removeItem("employee");
  window.location.href = "index.html";
}

// Render employees list (for admin)
function renderEmployees() {
  const list = document.getElementById("employeeList");
  if (!list) return;
  list.innerHTML = "";
  employees.forEach((e, i) => {
    const li = document.createElement("li");
    li.innerHTML = `${e.username} <button onclick="deleteEmployee(${i})">Delete</button>`;
    list.appendChild(li);
  });
}

// Add employee
function addEmployee() {
  const newUserEl = document.getElementById("newUser");
  const newPassEl = document.getElementById("newPass");
  if (!newUserEl || !newPassEl) return;
  const newUser = newUserEl.value.trim();
  const newPass = newPassEl.value.trim();
  if (!newUser || !newPass) return alert("Fill all fields");

  employees.push({ username: newUser, password: newPass, logs: [] });
  localStorage.setItem("employees", JSON.stringify(employees));
  renderEmployees();
  alert("Employee added!");
}

// Delete employee
function deleteEmployee(index) {
  employees.splice(index, 1);
  localStorage.setItem("employees", JSON.stringify(employees));
  renderEmployees();
}

// Employee page
function showEmployeeDashboard() {
  const emp = JSON.parse(localStorage.getItem("employee"));
  if (!emp) {
    window.location.href = "index.html";
    return;
  }

  const welcome = document.getElementById("welcome");
  if (welcome) welcome.textContent = `Hello, ${emp.username}`;
  renderLogs();
}

function renderLogs() {
  const emp = JSON.parse(localStorage.getItem("employee"));
  const list = document.getElementById("logList");
  if (!emp || !list) return;
  list.innerHTML = "";
  emp.logs.forEach(log => {
    const li = document.createElement("li");
    li.textContent = `${log.action} at ${log.time}`;
    list.appendChild(li);
  });
}

// Employee check in/out
function checkIn() { addLog("Check In"); }
function checkOut() { addLog("Check Out"); }

function addLog(action) {
  const emp = JSON.parse(localStorage.getItem("employee"));
  if (!emp) return;
  const now = new Date().toLocaleString();
  emp.logs.push({ action, time: now });
  localStorage.setItem("employee", JSON.stringify(emp));

  // update localStorage main list
  employees = employees.map(e => e.username === emp.username ? emp : e);
  localStorage.setItem("employees", JSON.stringify(employees));
  renderLogs();
}