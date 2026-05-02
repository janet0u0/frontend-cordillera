# Frontend Cordillera - Grupo Cordillera

## 📌 Descripción
Componente frontend de la Plataforma de Monitoreo Inteligente.
Dashboard interactivo que consume el BFF y adapta la visualización
según el rol del usuario (Ejecutivo, Analista, Supervisor).

## ⚙️ Tecnologías
- React.js 19
- NPM (Node Package Manager)
- JavaScript ES6+
- CSS inline con estilos en componentes

## 📁 Estructura del proyecto
frontend-cordillera/
├── public/          → Archivos públicos
├── src/
│   ├── components/  → Dashboard.js (componente principal)
│   ├── App.js       → Componente raíz
│   ├── App.css      → Estilos globales
│   └── index.js     → Punto de entrada
├── package.json     → Dependencias NPM
└── README.md

## 📊 Funcionalidades
- Selector de rol interactivo (Ejecutivo, Analista, Supervisor)
- Dashboard adaptado según el rol seleccionado
- KPIs en tiempo real desde el BFF
- Indicador de datos en tiempo real vs caché
- Manejo de errores de conexión

## 🌐 Conexión con el BFF
El frontend consume el BFF en:
http://localhost:8084/api/bff/dashboard?rol={ROL}

## 🚀 Cómo ejecutar
1. Instalar dependencias:
npm install

2. Ejecutar en modo desarrollo:
npm start

3. Abrir en el navegador:
http://localhost:3000

## ✅ Requisitos
- Node.js 18+
- NPM
- BFF corriendo en http://localhost:8084

## 👥 Autores
- Janet Huaylla Huayllas
- Bairo Pasten Codoceo