// Default admin account
const ADMIN = { username: "admin", password: "rofizaidan" };

// Load employees or initialize
let employees = JSON.parse(localStorage.getItem("employees")) || [];

// Login function
function login() {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();
  const error = document.getElementById("error");

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
  } else {
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
  list.innerHTML = "";
  employees.forEach((e, i) => {
    const li = document.createElement("li");
    li.innerHTML = `${e.username} 
      <button onclick="deleteEmployee(${i})">Delete</button>`;
    list.appendChild(li);
  });
}

// Add employee
function addEmployee() {
  const newUser = document.getElementById("newUser").value.trim();
  const newPass = document.getElementById("newPass").value.trim();
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

  document.getElementById("welcome").textContent = `Hello, ${emp.username}`;
  renderLogs();
}

function renderLogs() {
  const emp = JSON.parse(localStorage.getItem("employee"));
  const list = document.getElementById("logList");
  list.innerHTML = "";
  emp.logs.forEach(log => {
    const li = document.createElement("li");
    li.textContent = `${log.action} at ${log.time}`;
    list.appendChild(li);
  });
}

// Employee check in/out
function checkIn() {
  addLog("Check In");
}
function checkOut() {
  addLog("Check Out");
}

function addLog(action) {
  const emp = JSON.parse(localStorage.getItem("employee"));
  const now = new Date().toLocaleString();
  emp.logs.push({ action, time: now });
  localStorage.setItem("employee", JSON.stringify(emp));

  // update localStorage main list
  employees = employees.map(e => 
    e.username === emp.username ? emp : e
  );
  localStorage.setItem("employees", JSON.stringify(employees));
  renderLogs();
}