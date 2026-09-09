# EduToken

Plataforma web de aprendizaje que recompensa el progreso del estudiante con tokens, logros y seguimiento visual de avance.

Proyecto desarrollado durante un hackathon.

## La idea

Estudiar en línea es fácil de abandonar porque el avance no se siente. EduToken convierte cada módulo terminado en una recompensa concreta: ganas tokens, desbloqueas logros y ves tu barra de progreso subir. La motivación deja de depender de la fuerza de voluntad.

## Funcionalidades

**Cuentas y sesión**
- Registro e inicio de sesión con validación
- Sesión persistente entre recargas
- Cierre de sesión y saludo personalizado con el nombre del usuario

**Cursos y módulos**
- Catálogo de cursos con sus módulos ("Introducción a la Programación" y "Matemáticas Básicas")
- Cada módulo trae contenido teórico, explicación ampliada y su propio quiz
- Editor de código integrado que aparece solo en los módulos de programación

**Evaluación**
- Quiz de opción múltiple generado dinámicamente desde los datos del curso
- Corrección automática con retroalimentación por respuesta
- Panel de tutor con la explicación desarrollada del tema

**Gamificación**
- Tokens otorgados al completar cada módulo, con el valor definido por módulo
- Balance visible en la página principal y en la vista del curso
- Sistema de logros desbloqueables
- Barra de progreso global y marcado de módulos completados

## Tecnologías

| Capa | Herramientas |
|---|---|
| Frontend | HTML5, CSS3, JavaScript (vanilla, sin frameworks) |
| Persistencia | localStorage |
| Backend | Python, Flask |

Todo el frontend está construido sin librerías externas: el renderizado de quizzes, la navegación entre módulos y el estado de la aplicación se manejan con JavaScript puro.

## Estructura

```
├── index.html          # Catálogo de cursos
├── login.html          # Inicio de sesión
├── register.html       # Registro
├── dashboard.html      # Progreso, logros y balance
├── course.html         # Detalle del curso y sus módulos
├── module.html         # Contenido, quiz y tutor
├── css/style.css
├── js/
│   ├── app.js          # Sesión, tokens, logros y progreso
│   ├── courses.js      # Datos de cursos, módulos y quizzes
│   ├── module.js       # Carga de módulo, quiz y corrección
│   └── main.js
└── backend/
    └── server.py       # API Flask: /register y /login
```

## Cómo ejecutarlo

**Frontend** — basta con un servidor estático:

```bash
python -m http.server 8000
```

Abre `http://localhost:8000`.

**Backend** (opcional, ver nota abajo):

```bash
cd backend
pip install flask
python server.py
```

## Estado actual y siguientes pasos

El proyecto salió de un hackathon y hay decisiones tomadas por tiempo que vale la pena señalar:

- **El backend Flask todavía no está conectado.** Los endpoints `/register` y `/login` funcionan, pero el frontend actualmente gestiona usuarios y sesión con `localStorage`. Conectar ambos es el siguiente paso natural.
- **Las contraseñas se guardan en texto plano.** Antes de cualquier uso real hay que aplicar hashing con `bcrypt` en el registro y en la comparación al iniciar sesión.
- **Las explicaciones del tutor son contenido pre-escrito**, definido en `courses.js`. No hay integración con un modelo de lenguaje; conectar una API sería la evolución del módulo.
- Los datos de cursos viven en un archivo JavaScript. Moverlos a base de datos permitiría administrarlos sin tocar código.

## Equipo

- Valeria Lagunas Carbajal
- Luis Ángel Castelar Hernández
