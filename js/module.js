// js/module.js - Lógica para la página de módulo
let currentModule = null;
let currentCourse = null;
let userAnswers = [];

document.addEventListener("DOMContentLoaded", function() {
    loadModule();
    setupUserDisplay();
});

function loadModule() {
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('course');
    const moduleId = urlParams.get('module');
    
    if (!courseId || !moduleId) {
        document.getElementById('module-title').innerText = 'Módulo no encontrado';
        return;
    }
    
    // Buscar el curso y módulo
    currentCourse = window.courses.find(c => c.id === courseId);
    currentModule = currentCourse?.modules.find(m => m.id === moduleId);
    
    if (!currentModule) {
        document.getElementById('module-title').innerText = 'Módulo no encontrado';
        return;
    }
    
    // Actualizar la UI
    document.getElementById('module-title').innerText = currentModule.title;
    document.getElementById('module-course').innerText = `Curso: ${currentCourse.title}`;
    document.getElementById('module-tokens').innerText = `${currentModule.tokens} tokens`;
    document.getElementById('module-content-text').innerHTML = `<p>${currentModule.content}</p>`;
    
    // Mostrar editor de código si es módulo de programación
    if (courseId.includes('programacion')) {
        document.getElementById('code-editor-container').style.display = 'block';
    }
    
    // Cargar explicación AI
    document.getElementById('ai-expl-text').innerText = currentModule.explanation;
    
    // Cargar quiz
    loadQuiz();
    
    // Actualizar balance
    updateBalance();
}

function loadQuiz() {
    const quizContainer = document.getElementById('quiz-questions');
    quizContainer.innerHTML = '';
    
    if (!currentModule.quiz || currentModule.quiz.length === 0) {
        quizContainer.innerHTML = '<p>No hay quiz para este módulo.</p>';
        document.getElementById('submit-quiz').style.display = 'none';
        return;
    }
    
    currentModule.quiz.forEach((question, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'quiz-question';
        questionDiv.innerHTML = `
            <p><strong>${index + 1}. ${question.q}</strong></p>
            ${question.options.map((option, optIndex) => `
                <label style="display: block; margin: 5px 0;">
                    <input type="radio" name="question-${index}" value="${optIndex}">
                    ${option}
                </label>
            `).join('')}
        `;
        quizContainer.appendChild(questionDiv);
    });
}

function submitQuiz() {
    const questions = currentModule.quiz;
    let correctAnswers = 0;
    userAnswers = [];
    
    questions.forEach((question, index) => {
        const selectedOption = document.querySelector(`input[name="question-${index}"]:checked`);
        const userAnswer = selectedOption ? parseInt(selectedOption.value) : -1;
        userAnswers.push(userAnswer);
        
        if (userAnswer === question.answer) {
            correctAnswers++;
        }
    });
    
    const resultDiv = document.getElementById('quiz-result');
    const score = Math.round((correctAnswers / questions.length) * 100);
    
    resultDiv.innerHTML = `
        <div style="padding: 15px; border-radius: 8px; background: ${score >= 70 ? '#d1fae5' : '#fef2f2'}; border-left: 4px solid ${score >= 70 ? '#10B981' : '#EF4444'};">
            <strong>Resultado del quiz:</strong> ${correctAnswers} de ${questions.length} correctas (${score}%)
            ${score >= 70 ? '🎉 ¡Aprobado!' : '❌ Necesitas estudiar más'}
        </div>
    `;
}

function runCode() {
    const code = document.getElementById('code-editor').innerText;
    const outputDiv = document.getElementById('code-output');
    
    try {
        // Capturar console.log
        let output = '';
        const originalLog = console.log;
        console.log = function(...args) {
            output += args.join(' ') + '\n';
            originalLog.apply(console, args);
        };
        
        // Ejecutar código
        eval(code);
        
        // Restaurar console.log
        console.log = originalLog;
        
        outputDiv.innerHTML = `<pre style="margin: 0;">${output || 'No hay output'}</pre>`;
    } catch (error) {
        outputDiv.innerHTML = `<pre style="margin: 0; color: red;">Error: ${error.message}</pre>`;
    }
}

function askAI() {
    const question = document.getElementById('ai-question').value.trim();
    const answerDiv = document.getElementById('ai-answer');
    
    if (!question) return;
    
    // Simular respuesta AI (en un caso real, conectarías con una API)
    const responses = [
        `Basado en el módulo "${currentModule.title}", ${question.toLowerCase().includes('variable') ? 'las variables son espacios de memoria con nombre para almacenar datos.' : 'puedo explicarte más sobre este concepto.'}`,
        `Excelente pregunta sobre ${currentModule.title}. Recuerda que ${currentModule.explanation}`,
        `En el contexto de lo que estás aprendiendo: ${currentModule.content}. ¿Te ayuda esto?`,
        `Según el contenido del módulo, la respuesta está relacionada con: ${currentModule.explanation}`
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    
    answerDiv.innerHTML = `
        <div class="ai-response">
            <strong>AI Tutor dice:</strong>
            <p>${randomResponse}</p>
            <p><em>¿Tienes otra pregunta?</em></p>
        </div>
    `;
    
    document.getElementById('ai-question').value = '';
}

// REEMPLAZAR la función completeModule actual por esta:

function completeModule() {
    if (!currentModule || !currentCourse) return;
    
    const user = getLoggedUserId();
    if (!user) {
        alert('Debes iniciar sesión para completar módulos');
        return;
    }
    
    // Verificar si ya completó este módulo
    const progressObj = getCourseProgress();
    const userProgress = progressObj[user] || {};
    const courseProgress = userProgress[currentCourse.id] || [];
    
    if (courseProgress.includes(currentModule.id)) {
        alert('Ya completaste este módulo anteriormente.');
        return;
    }
    
    // Verificar quiz (opcional)
    const questions = currentModule.quiz || [];
    if (questions.length > 0) {
        const selectedOptions = userAnswers.filter(answer => answer !== -1);
        if (selectedOptions.length < questions.length) {
            if (!confirm('No has completado el quiz. ¿Estás seguro de que quieres completar el módulo?')) {
                return;
            }
        }
    }
    
    // ACTUALIZAR BALANCE CORRECTAMENTE
    let currentBalance = parseInt(localStorage.getItem('balance') || '0');
    let newBalance = currentBalance + currentModule.tokens;
    
    // Guardar en localStorage
    localStorage.setItem('balance', newBalance.toString());
    
    // Actualizar progreso del curso
    if (!userProgress[currentCourse.id]) {
        userProgress[currentCourse.id] = [];
    }
    userProgress[currentCourse.id].push(currentModule.id);
    progressObj[user] = userProgress;
    localStorage.setItem('courseProgress', JSON.stringify(progressObj));
    
    // Actualizar progreso general
    let currentProgress = parseInt(localStorage.getItem('progress') || '0');
    let newProgress = Math.min(100, currentProgress + 10);
    localStorage.setItem('progress', newProgress.toString());
    
    // Actualizar logros
    let achievements = JSON.parse(localStorage.getItem('achievements') || '[]');
    const newAchievement = `✅ Completado: ${currentModule.title}`;
    if (!achievements.includes(newAchievement)) {
        achievements.push(newAchievement);
        localStorage.setItem('achievements', JSON.stringify(achievements));
    }
    
    // Actualizar UI inmediatamente
    updateBalance();
    
    // Deshabilitar botón
    document.getElementById('complete-btn').innerHTML = '✅ Módulo completado';
    document.getElementById('complete-btn').disabled = true;
    document.getElementById('complete-btn').style.background = '#6B7280';
    
    // Mensaje de éxito
    alert(`🎉 ¡Felicidades! Has completado "${currentModule.title}" y ganado ${currentModule.tokens} tokens!`);
    
    // FORZAR ACTUALIZACIÓN en páginas abiertas
    if (window.opener && !window.opener.closed) {
        window.opener.location.reload();
    }
}

function updateBalance() {
    const balance = localStorage.getItem('balance') || '0';
    document.getElementById('user-balance').textContent = balance;
}

function setupUserDisplay() {
    const userDisplay = document.getElementById('user-display');
    const loggedUser = localStorage.getItem('loggedIn');
    
    if (loggedUser) {
        try {
            const userObj = JSON.parse(loggedUser);
            userDisplay.textContent = userObj.displayName || userObj.id || 'Usuario';
        } catch (e) {
            userDisplay.textContent = loggedUser;
        }
    }
}