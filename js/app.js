// Variables globales
let balance = localStorage.getItem("balance") ? parseInt(localStorage.getItem("balance")) : 0;
let progress = localStorage.getItem("progress") ? parseInt(localStorage.getItem("progress")) : 0;
let achievements = JSON.parse(localStorage.getItem("achievements") || '["🌱 Bienvenido a EduToken"]');

// Función: guardar datos
function saveData() {
  localStorage.setItem("balance", balance);
  localStorage.setItem("progress", progress);
  localStorage.setItem("achievements", JSON.stringify(achievements));
}

// Página principal (index.html)
if (document.getElementById("balance")) {
  const balanceEl = document.getElementById("balance");
  const earnBtn = document.getElementById("earnBtn");

  balanceEl.innerText = `${balance} tokens`;

  earnBtn.addEventListener("click", () => {
    balance += 5;
    progress += 10; // aumenta el progreso
    balanceEl.innerText = `${balance} tokens`;
    alert("¡Completaste un reto y ganaste 5 tokens!");
    if (progress >= 100) {
      progress = 100;
      if (!achievements.includes("🏅 Completaste tu primer nivel")) {
        achievements.push("🏅 Completaste tu primer nivel");
        alert("🎉 ¡Nuevo logro desbloqueado!");
      }
    }
    saveData();
  });

  document.querySelectorAll(".start-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      alert("Próximamente podrás acceder al contenido del curso 🎓");
    });
  });
}

// Dashboard (dashboard.html)
if (document.getElementById("progress-fill")) {
  const progressFill = document.getElementById("progress-fill");
  const progressText = document.getElementById("progress-text");
  const list = document.getElementById("achievement-list");

  progressFill.style.width = `${progress}%`;
  progressText.innerText = `Nivel ${Math.floor(progress / 25) + 1} - ${progress}% completado`;

  // Mostrar logros
  list.innerHTML = "";
  achievements.forEach(a => {
    const li = document.createElement("li");
    li.textContent = a;
    list.appendChild(li);
  });
}


// ===== LOGIN FUNCTIONALITY =====
if (document.getElementById("loginForm")) {
  const form = document.getElementById("loginForm");
  const errorMsg = document.getElementById("error-msg");

  // Datos válidos (usuario permitido)
  const validUser = {
    username: "20243ds004",
    password: "asd"
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (username === validUser.username && password === validUser.password) {
      localStorage.setItem("loggedIn", "true");
      window.location.href = "index.html";
    } else {
      errorMsg.textContent = "Usuario o contraseña incorrectos ❌";
    }
  });
}

// ===== PROTECCIÓN DE PÁGINAS =====
const protectedPages = ["index.html", "dashboard.html"];

const currentPage = window.location.pathname.split("/").pop();

if (protectedPages.includes(currentPage)) {
  const loggedIn = localStorage.getItem("loggedIn");
  if (!loggedIn) {
    window.location.href = "login.html";
  }
}


function logout() {
  localStorage.removeItem("loggedIn");
  window.location.href = "login.html";
}

