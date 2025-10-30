// js/courses.js
window.courses = [
  {
    id: "intro-programacion",
    title: "Introducción a la Programación",
    intro: "Aprende los fundamentos: variables, estructuras de control y funciones. Ideal para empezar en programación.",
    modules: [
      {
        id: "m1",
        title: "Variables y tipos",
        content: "En este módulo veremos qué es una variable y tipos de datos básicos (números, cadenas).",
        explanation: "Una variable es un nombre que almacena un valor. Ejemplo: let x = 5; Los tipos comunes son: entero, flotante, cadena (string), booleano.",
        tokens: 5,
        quiz: [
          {
            q: "¿Qué es una variable?",
            options: [
              "Un espacio de memoria con nombre para guardar datos",
              "Una función que imprime texto",
              "Una etiqueta HTML"
            ],
            answer: 0
          },
          {
            q: "¿Cuál es un tipo de dato?",
            options: ["cadena (string)", "botón", "estilo CSS"],
            answer: 0
          }
        ]
      },
      {
        id: "m2",
        title: "Estructuras de control",
        content: "Condicionales (if) y bucles (for/while) para controlar el flujo del programa.",
        explanation: "Las estructuras de control permiten tomar decisiones y repetir tareas. Ej: if(condicion){ ... } o for(let i=0;i<10;i++){ ... }. ",
        tokens: 5,
        quiz: [
          {
            q: "¿Para qué sirve un if?",
            options: ["Tomar una decisión según una condición", "Crear variables", "Guardar archivos"],
            answer: 0
          }
        ]
      },
      {
        id: "m3",
        title: "Funciones básicas",
        content: "Introducción a funciones: cómo definir y llamar funciones sencillas.",
        explanation: "Una función es un bloque de código reutilizable. Ejemplo: function saludar(){ console.log('Hola'); }",
        tokens: 5,
        quiz: [
          {
            q: "¿Qué hace una función?",
            options: ["Reutilizar código", "Guardar archivos", "Diseñar estilos CSS"],
            answer: 0
          }
        ]
      }
    ]
  },
  {
    id: "matematicas-basicas",
    title: "Matemáticas Básicas",
    intro: "Conceptos esenciales de álgebra y aritmética para la programación y la lógica matemática.",
    modules: [
      {
        id: "m1",
        title: "Operaciones básicas",
        content: "Suma, resta, multiplicación y división: conceptos y ejemplos.",
        explanation: "La suma suma dos números: 2+3=5. La resta resta: 5-2=3. La multiplicación y división son repetición y partición respectivamente.",
        tokens: 4,
        quiz: [
          {
            q: "¿Cuánto es 2 + 3?",
            options: ["4", "5", "6"],
            answer: 1
          }
        ]
      }
    ]
  }
];
