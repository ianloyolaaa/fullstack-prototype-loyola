let currentUser = null;
let editingEmail = null;
let editingEmployee = null;

const STORAGE_KEY = "ipt_demo_v1";
window.db = { accounts: [], departments: [], employees: [], requests: [] };

/* --- STORAGE --- */
function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(window.db));
}

function loadFromStorage() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    window.db.accounts = [
      { first: "Admin", last: "User", email: "admin@example.com", password: "Password123!", role: "admin", verified: true }
    ];
    window.db.departments = [
      { id: 1, name: "Engineering" },
      { id: 2, name: "HR" }
    ];
    window.db.employees = [];
    window.db.requests = [];
    saveToStorage();
  } else {
    window.db = JSON.parse(data);
  }
}

/* --- NAVIGATION --- */
function navigateTo(hash) { window.location.hash = hash; }

function handleRouting() {
  let hash = window.location.hash || "#/";
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));

  const route = hash.replace("#/", "") || "home";
  const page = document.getElementById(route + "-page");
  if (!page) return navigateTo("#/");

  const protectedRoutes = ["profile", "requests"];
  const adminRoutes = ["accounts", "departments", "employees"];

  if (protectedRoutes.includes(route) && !currentUser) return navigateTo("#/login");
  if (adminRoutes.includes(route) && (!currentUser || currentUser.role !== "admin")) return navigateTo("#/");

  page.classList.add("active");

  if (route === "profile") renderProfile();
  if (route === "accounts") renderAccounts();
  if (route === "departments") renderDepartments();
  if (route === "employees") renderEmployees();
  if (route === "requests") renderRequests();
}

window.addEventListener("hashchange", handleRouting);

/* --- AUTH --- */
function setAuthState(isAuth, user = null) {
  const body = document.body;
  if (isAuth) {
    currentUser = user;
    body.classList.remove("not-authenticated");
    body.classList.add("authenticated");

    if (user.role === "admin") body.classList.add("is-admin");
    else body.classList.remove("is-admin");

    document.getElementById("navUsername").textContent = user.first;
  } else {
    currentUser = null;
    body.className = "not-authenticated";
  }
}

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("auth_token");
  setAuthState(false);
  navigateTo("#/");
});

/* --- REGISTER --- */
registerForm.addEventListener("submit", function (e) {
  e.preventDefault();
  if (window.db.accounts.find(a => a.email === regEmail.value)) return alert("Email already exists");

  window.db.accounts.push({
    first: regFirst.value,
    last: regLast.value,
    email: regEmail.value,
    password: regPass.value,
    role: "user",
    verified: false
  });

  saveToStorage();
  localStorage.setItem("unverified_email", regEmail.value);
  navigateTo("#/verify");
});

/* --- VERIFY --- */
verifyBtn.addEventListener("click", () => {
  const email = localStorage.getItem("unverified_email");
  const user = window.db.accounts.find(a => a.email === email);
  if (user) user.verified = true;
  saveToStorage();
  navigateTo("#/login");
});

/* --- LOGIN --- */
loginForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const user = window.db.accounts.find(a =>
    a.email === loginEmail.value &&
    a.password === loginPass.value &&
    a.verified
  );
  if (!user) return alert("Invalid login");

  localStorage.setItem("auth_token", user.email);
  setAuthState(true, user);
  navigateTo("#/profile");
});

/* --- PROFILE --- */
function renderProfile() {
  profileContent.innerHTML = `
    <p>Name: ${currentUser.first} ${currentUser.last}</p>
    <p>Email: ${currentUser.email}</p>
    <p>Role: ${currentUser.role}</p>
  `;
}

/* --- ACCOUNTS CRUD --- */
function renderAccounts() {
  let html = `<table border="1"><tr><th>Name</th><th>Email</th><th>Role</th><th>Verified</th><th>Actions</th></tr>`;
  window.db.accounts.forEach(acc => {
    html += `<tr>
      <td>${acc.first} ${acc.last}</td>
      <td>${acc.email}</td>
      <td>${acc.role}</td>
      <td>${acc.verified ? "✔" : "—"}</td>
      <td>
        <button onclick="editAccount('${acc.email}')">Edit</button>
        <button onclick="deleteAccount('${acc.email}')">Delete</button>
      </td>
    </tr>`;
  });
  html += "</table>";
  accountsTable.innerHTML = html;
}

addAccountBtn.addEventListener("click", () => { editingEmail = null; accountFormContainer.style.display = "block"; });

saveAccountBtn.addEventListener("click", () => {
  if (editingEmail) {
    const acc = window.db.accounts.find(a => a.email === editingEmail);
    acc.first = accFirst.value; acc.last = accLast.value; acc.email = accEmail.value; acc.role = accRole.value; acc.verified = accVerified.checked;
    if (accPass.value) acc.password = accPass.value;
  } else {
    window.db.accounts.push({
      first: accFirst.value,
      last: accLast.value,
      email: accEmail.value,
      password: accPass.value,
      role: accRole.value,
      verified: accVerified.checked
    });
  }
  saveToStorage(); cancelForm(); renderAccounts();
});

function editAccount(email) {
  const acc = window.db.accounts.find(a => a.email === email);
  editingEmail = email;
  accFirst.value = acc.first; accLast.value = acc.last; accEmail.value = acc.email; accRole.value = acc.role; accVerified.checked = acc.verified;
  accountFormContainer.style.display = "block";
}

function deleteAccount(email) {
  if (email === currentUser.email) return alert("Cannot delete your own account!");
  if (!confirm("Delete account?")) return;
  window.db.accounts = window.db.accounts.filter(a => a.email !== email);
  saveToStorage(); renderAccounts();
}

cancelBtn.addEventListener("click", () => {
  accountFormContainer.style.display = "none";
  accFirst.value = ""; accLast.value = ""; accEmail.value = ""; accPass.value = "";
  editingEmail = null;
});

/* --- DEPARTMENTS --- */
function renderDepartments() {
  let html = `<table border="1"><tr><th>Name</th><th>Actions</th></tr>`;
  window.db.departments.forEach(d => { html += `<tr><td>${d.name}</td><td><button onclick="alert('Edit not implemented')">Edit</button></td></tr>`; });
  html += "</table>";
  departmentsTable.innerHTML = html;
}

addDepartmentBtn.addEventListener("click", () => { alert("Add Department not implemented"); });

/* --- EMPLOYEES --- */
function renderEmployees() {
  let html = `<table border="1"><tr><th>ID</th><th>User</th><th>Position</th><th>Dept</th><th>Actions</th></tr>`;
  window.db.employees.forEach(emp => {
    const acc = window.db.accounts.find(a => a.email === emp.email);
    const dept = window.db.departments.find(d => d.id === emp.deptId);
    html += `<tr>
      <td>${emp.id}</td>
      <td>${emp.email}</td>
      <td>${emp.position}</td>
      <td>${dept ? dept.name : "-"}</td>
      <td><button onclick="alert('Edit not implemented')">Edit</button></td>
    </tr>`;
  });
  html += "</table>";
  employeesTable.innerHTML = html;
}

addEmployeeBtn.addEventListener("click", () => {
  const email = prompt("Enter User Email for employee");
  const acc = window.db.accounts.find(a => a.email === email);
  if (!acc) return alert("User not found");

  const deptName = prompt("Department name");
  const dept = window.db.departments.find(d => d.name === deptName);
  if (!dept) return alert("Department not found");

  const id = prompt("Employee ID");
  const position = prompt("Position");

  window.db.employees.push({ id, email, position, deptId: dept.id });
  saveToStorage(); renderEmployees();
});

/* --- REQUESTS --- */
function renderRequests() {
  let html = `<table border="1"><tr><th>Type</th><th>Items</th><th>Status</th><th>Date</th></tr>`;
  const userRequests = window.db.requests.filter(r => r.employeeEmail === currentUser.email);
  userRequests.forEach(r => {
    html += `<tr>
      <td>${r.type}</td>
      <td>${r.items.map(i => `${i.name} (${i.qty})`).join(", ")}</td>
      <td>${r.status}</td>
      <td>${r.date}</td>
    </tr>`;
  });
  html += "</table>";
  requestsTable.innerHTML = html;
}

addRequestBtn.addEventListener("click", () => {
  const type = prompt("Request type (Equipment/Leave/Resources)");
  const items = [];
  let more = true;
  while (more) {
    const name = prompt("Item name");
    if (!name) break;
    const qty = prompt("Quantity");
    items.push({ name, qty });
    more = confirm("Add another item?");
  }
  if (items.length === 0) return alert("No items added");

  window.db.requests.push({
    type,
    items,
    status: "Pending",
    date: new Date().toLocaleDateString(),
    employeeEmail: currentUser.email
  });
  saveToStorage(); renderRequests();
});

/* --- INIT --- */
loadFromStorage();

const token = localStorage.getItem("auth_token");
if (token) {
  const user = window.db.accounts.find(a => a.email === token);
  if (user) setAuthState(true, user);
}

if (!window.location.hash) navigateTo("#/");
handleRouting();
