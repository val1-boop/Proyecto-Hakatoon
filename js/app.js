/* ===========================================================
   EduToken - app.js (restructurado)
   - Login / Registro / Protección de páginas
   - Datos globales + guardado (localStorage)
   - Render dinámico de cursos (index.html)
   - Modal de info (index.html)
   - Apertura de course.html en nueva pestaña y lógica de curso
   =========================================================== */

/* ------------------ DATOS GLOBALES + GUARDADO ------------------ */
let balance = localStorage.getItem("balance") ? parseInt(localStorage.getItem("balance")) : 0;
let progress = localStorage.getItem("progress") ? parseInt(localStorage.getItem("progress")) : 0;
let achievements = JSON.parse(localStorage.getItem("achievements") || '["🌱 Bienvenido a EduToken"]');

function saveData() {
  localStorage.setItem("balance", balance);
  localStorage.setItem("progress", progress);
  localStorage.setItem("achievements", JSON.stringify(achievements));
}

/* ------------------ UTILIDADES (usuarios, emails, session) ------------------ */
function getStoredUsers() {
  const raw = localStorage.getItem("users");
  return raw ? JSON.parse(raw) : [];
}
function saveStoredUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  return re.test(email);
}

/* Helper para sesión */
function setLoggedIn(id, displayName) {
  localStorage.setItem("loggedIn", JSON.stringify({ id, displayName }));
}
function getLoggedUserId() {
  const raw = localStorage.getItem("loggedIn");
  if (!raw) return null;
  try {
    const obj = JSON.parse(raw);
    return obj.id || obj.displayName || null;
  } catch (e) {
    return raw;
  }
}

/* ------------------ LOGIN (login.html) ------------------ */
if (document.getElementById("loginForm")) {
  const form = document.getElementById("loginForm");
  const errorMsg = document.getElementById("error-msg");

  // Usuario interno por defecto
  const defaultUser = { username: "20243ds004", password: "asd" };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    errorMsg.textContent = "";

    const usernameInput = document.getElementById("username").value.trim();
    const passwordInput = document.getElementById("password").value.trim();

    // 1) Verificar usuario por defecto
    if (usernameInput === defaultUser.username && passwordInput === defaultUser.password) {
      setLoggedIn(defaultUser.username, "Alumno Predeterminado");
      window.location.href = "index.html";
      return;
    }

    // 2) Verificar usuarios registrados
    const users = getStoredUsers();
    const match = users.find(u =>
      (u.email.toLowerCase() === usernameInput.toLowerCase() || u.username === usernameInput) &&
      u.password === passwordInput
    );

    if (match) {
      setLoggedIn(match.email, match.fullName);
      window.location.href = "index.html";
      return;
    }

    errorMsg.textContent = "Usuario o contraseña incorrectos ❌";
  });
}

/* ------------------ REGISTRO (register.html) ------------------ */
if (document.getElementById("registerForm")) {
  const form = document.getElementById("registerForm");
  const err = document.getElementById("register-error");
  const ok = document.getElementById("register-success");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    err.textContent = "";
    ok.textContent = "";

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const emailConfirm = document.getElementById("emailConfirm").value.trim();
    const password = document.getElementById("passwordReg").value;
    const passwordConfirm = document.getElementById("passwordConfirm").value;

    if (!fullName) { err.textContent = "Por favor ingresa tu nombre completo."; return; }
    if (!email || !isValidEmail(email)) { err.textContent = "Ingresa un correo válido (ej: usuario@dominio.com)."; return; }
    if (email.toLowerCase() !== emailConfirm.toLowerCase()) { err.textContent = "Los correos no coinciden."; return; }
    if (password.length < 4) { err.textContent = "La contraseña debe tener al menos 4 caracteres."; return; }
    if (password !== passwordConfirm) { err.textContent = "Las contraseñas no coinciden."; return; }

    const users = getStoredUsers();
    const exists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) { err.textContent = "Ya existe una cuenta con este correo. Intenta iniciar sesión."; return; }

    const newUser = { fullName, email, username: email, password };
    users.push(newUser);
    saveStoredUsers(users);

    ok.textContent = "Registro exitoso ✅. Serás enviado a iniciar sesión...";
    setTimeout(() => { window.location.href = "login.html"; }, 1200);
  });
}

/* ------------------ PROTECCIÓN DE RUTAS (index/dashboard/course) ------------------ */
/* ------------------ PROTECCIÓN DE RUTAS (index/dashboard) - FIX ------------------ */
function getLoggedUser() {
  const raw = localStorage.getItem("loggedIn");
  if (!raw) return null;
  try {
    const obj = JSON.parse(raw);
    // aseguramos que venga en formato { id, displayName }
    return obj;
  } catch (e) {
    return null;
  }
}

(function protectPages() {
  const protectedPages = ["index.html", "dashboard.html", "course.html"];
  // Si la ruta es "/" (pop() -> "") tratamos como index.html
  const rawPage = window.location.pathname.split("/").pop();
  const currentPage = rawPage && rawPage.length > 0 ? rawPage : "index.html";

  if (protectedPages.includes(currentPage)) {
    const userObj = getLoggedUser();
    if (!userObj) {
      // No hay sesión =>forzar login
      window.location.href = "login.html";
    } else {
      // Poner nombre del usuario en el header si existe el elemento
      const userEl = document.getElementById("user-display");
      if (userEl) userEl.innerText = userObj.displayName || userObj.id || "Usuario";
    }
  }
})();


/* ------------------ HEADER: mostrar usuario y cerrar sesión ------------------ */
/* ------------------ CERRAR SESIÓN (opcional) - FIX ------------------ */
window.logout = function() {
  try {
    // Aseguramos guardar progreso/datos antes de cerrar (si existe la función)
    if (typeof saveData === "function") saveData();
  } catch (e) { /* no crítico */ }

  // Eliminamos la sesión y redirigimos
  localStorage.removeItem("loggedIn");
  // Si usas otros flags para sesión (por ejemplo: "sessionActive"), elimínalos aquí también.
  // localStorage.removeItem("sessionActive");
  window.location.href = "login.html";
};


/* ------------------ STORAGE: progreso por curso por usuario ------------------ */
function getCourseProgress() {
  return JSON.parse(localStorage.getItem("courseProgress") || "{}");
}
function saveCourseProgress(obj) {
  localStorage.setItem("courseProgress", JSON.stringify(obj));
}

/* ------------------ Completar módulo: asignar tokens y logros ------------------ */
function completeModuleForUser(courseId, moduleId, moduleTokenReward) {
  const user = getLoggedUserId();
  if (!user) { alert("No hay sesión activa."); return; }

  const progressObj = getCourseProgress();
  if (!progressObj[user]) progressObj[user] = {};
  if (!progressObj[user][courseId]) progressObj[user][courseId] = [];

  if (!progressObj[user][courseId].includes(moduleId)) {
    progressObj[user][courseId].push(moduleId);
    saveCourseProgress(progressObj);

    // Actualizar balance global y progreso visual
    balance = parseInt(localStorage.getItem("balance") || "0");
    balance += Number(moduleTokenReward);
    // Incremento de progreso general (simple heurística)
    progress = Math.min(100, progress + Math.round((moduleTokenReward / 5) * 5));
    // Añadir logro
    const logro = `✅ Completado ${courseId} - módulo ${moduleId}`;
    if (!achievements.includes(logro)) achievements.push(logro);

    saveData(); // guarda balance, progress, achievements

    alert(`¡Módulo completado! Has ganado ${moduleTokenReward} tokens.`);
  } else {
    alert("Ya completaste este módulo anteriormente.");
  }
}

/* ------------------ RENDER Y LÓGICA DE INDEX (cursos dinámicos) ------------------ */
if (document.getElementById("courses-container")) {
  const container = document.getElementById("courses-container");
  container.innerHTML = "";

  (window.courses || []).forEach(course => {
    const card = document.createElement("div");
    card.className = "course-card";
    card.innerHTML = `
      <h3>${course.title}</h3>
      <p>${course.intro}</p>
      <p><strong> Módulos: ${course.modules.length} </strong></p>
      <div style="display:flex; gap:8px; margin-top:12px;">
        <button data-course="${course.id}" class="start-btn">Iniciar curso</button>
        <button data-course="${course.id}" class="info-btn">Ver info</button>
      </div>
    `;
    container.appendChild(card);
  });

  document.querySelectorAll(".start-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const courseId = e.currentTarget.getAttribute("data-course");
      openCourseInNewTab(courseId);
    });
  });
}

/* ------------------ FUNCIONES PARA ABRIR CURSO ------------------ */
function openCourseInNewTab(courseId) {
  const url = `course.html?course=${encodeURIComponent(courseId)}`;
  window.open(url, "_blank");
}

/* ------------------ MODAL: info del curso ------------------ */
(function setupModal() {
  const modal = document.getElementById("courseModal");
  if (!modal) return;

  const modalTitle = document.getElementById("modal-title");
  const modalIntro = document.getElementById("modal-intro");
  const modalModulesList = document.getElementById("modal-modules-list");
  const modalStartBtn = document.getElementById("modal-start");
  const modalCloseBtn = document.getElementById("closeModal");
  const modalCloseSecondary = document.getElementById("modal-close-secondary");

  let currentModalCourseId = null;

  function openCourseModal(courseId) {
    const course = (window.courses || []).find(c => c.id === courseId);
    if (!course) return;
    currentModalCourseId = courseId;
    modalTitle.innerText = course.title;
    modalIntro.innerText = course.intro;

    modalModulesList.innerHTML = "";
    const user = getLoggedUserId();
    const allProgress = getCourseProgress();
    const completedForUser = (user && allProgress[user] && allProgress[user][courseId]) ? allProgress[user][courseId] : [];

    course.modules.forEach(m => {
      const li = document.createElement("li");
      const done = completedForUser.includes(m.id);
      li.innerHTML = `<span>${m.title}</span><span style="color:${done ? '#10B981' : '#FBBF24'}; font-weight:700;">${done ? 'Completado' : '+' + m.tokens + ' tok'}</span>`;
      modalModulesList.appendChild(li);
    });

    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    modalStartBtn.focus();
  }

  function closeCourseModal() {
    currentModalCourseId = null;
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  modalCloseBtn?.addEventListener("click", closeCourseModal);
  modalCloseSecondary?.addEventListener("click", closeCourseModal);
  modal?.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal-backdrop")) closeCourseModal();
  });

  modalStartBtn?.addEventListener("click", () => {
    if (!currentModalCourseId) return;
    openCourseInNewTab(currentModalCourseId);
    closeCourseModal();
  });

  document.querySelectorAll(".info-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const courseId = e.currentTarget.getAttribute("data-course");
      openCourseModal(courseId);
    });
  });
})();

/* ------------------ LÓGICA DE course.html ------------------ */
if (window.location.pathname.split("/").pop() === "course.html") {
  const params = new URLSearchParams(window.location.search);
  const courseId = params.get("course");
  const course = (window.courses || []).find(c => c.id === courseId);

  if (!course) {
    document.body.innerHTML = "<p>Curso no encontrado.</p>";
  } else {
    const titleEl = document.getElementById("course-title");
    const introEl = document.getElementById("course-intro");
    const balanceEl = document.getElementById("user-balance");
    const modulesList = document.getElementById("modules-list");
    const backBtn = document.getElementById("backDashboard");

    if (titleEl) titleEl.innerText = course.title;
    if (introEl) introEl.innerText = course.intro;
    if (balanceEl) balanceEl.innerText = localStorage.getItem("balance") || "0";
    if (modulesList) modulesList.innerHTML = "";

    const user = getLoggedUserId();
    const allProgress = getCourseProgress();
    const userCourseProgress = (user && allProgress[user] && allProgress[user][courseId]) ? allProgress[user][courseId] : [];

    course.modules.forEach(mod => {
      const div = document.createElement("div");
      div.className = "module";
      const isDone = userCourseProgress.includes(mod.id);

      div.innerHTML = `
        <div>
          <div style="font-weight:700">${mod.title}</div>
          <div style="font-size:0.9rem; color:#6B7280;">Recompensa: <span class="token-reward">${mod.tokens} tokens</span></div>
        </div>
        <div>
          <button class="complete-btn" data-mod="${mod.id}" ${isDone ? "disabled" : ""}>${isDone ? "Completo" : "Completar módulo"}</button>
        </div>
      `;
      modulesList.appendChild(div);
    });

    modulesList.addEventListener("click", (e) => {
      if (e.target.classList.contains("complete-btn")) {
        const modId = e.target.getAttribute("data-mod");
        const mod = course.modules.find(m => m.id === modId);
        completeModuleForUser(courseId, modId, mod.tokens);
        e.target.innerText = "Completado";
        e.target.disabled = true;
        const balEl = document.getElementById("user-balance");
        if (balEl) balEl.innerText = localStorage.getItem("balance") || "0";
      }
      if (e.target.classList.contains("ai-open-btn")) {
        const modId = e.target.getAttribute("data-mod");
        openAITutorForModule(courseId, modId);
      }
    });

    if (backBtn) {
      backBtn.addEventListener("click", () => {
        if (window.opener && !window.opener.closed) {
          window.close();
        } else {
          window.location.href = "dashboard.html";
        }
      });
    }
  }
}

/* ------------------ INDEX: token / reto / dashboard sync ------------------ */
(function initUIValues() {
  const balanceEl = document.getElementById("balance");
  const earnBtn = document.getElementById("earnBtn");
  if (balanceEl) balanceEl.innerText = `${balance} tokens`;

  if (earnBtn) {
    earnBtn.addEventListener("click", () => {
      balance += 5;
      progress = Math.min(100, progress + 10);
      if (balanceEl) balanceEl.innerText = `${balance} tokens`;
      if (progress >= 100) {
        progress = 100;
        if (!achievements.includes("🏅 Completaste tu primer nivel")) {
          achievements.push("🏅 Completaste tu primer nivel");
          alert("🎉 ¡Nuevo logro desbloqueado!");
        }
      }
      saveData();
      alert("¡Completaste un reto y ganaste 5 tokens!");
    });
  }

  const progressFill = document.getElementById("progress-fill");
  const progressText = document.getElementById("progress-text");
  const list = document.getElementById("achievement-list");
  if (progressFill) progressFill.style.width = `${progress}%`;
  if (progressText) progressText.innerText = `Nivel ${Math.floor(progress / 25) + 1} - ${progress}% completado`;
  if (list) {
    list.innerHTML = "";
    achievements.forEach(a => {
      const li = document.createElement("li");
      li.textContent = a;
      list.appendChild(li);
    });
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  const userDisplay = document.getElementById("user-display");
  const logoutBtn = document.getElementById("btn-logout");

  const logged = localStorage.getItem("loggedIn");
  let userName = "Invitado";

  if (logged) {
    try {
      const userObj = JSON.parse(logged);
      userName = userObj.displayName || userObj.id || "Invitado";
    } catch (e) {
      userName = logged;
    }
  }

  if (userDisplay) userDisplay.innerText = userName;

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("loggedIn");
      window.location.href = "login.html";
    });
  }
});