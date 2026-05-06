markdown# Frontend Cordillera - Grupo Cordillera

## 📌 Descripción
Dashboard interactivo de la Plataforma de Monitoreo Inteligente.
Permite a los usuarios autenticarse y visualizar KPIs adaptados
según su rol organizacional (Ejecutivo, Analista, Supervisor).

## 🎯 Patrones aplicados
- **Componentes Reutilizables NPM**: KPIBox, VentasChart
- **Contexto de Autenticación**: AuthContext maneja el estado global
- **Servicios Centralizados**: api.js aplica principio DRY

## ⚙️ Tecnologías
- React.js 19
- NPM (Node Package Manager)
- JavaScript ES6+
- CSS por componente

## 📁 Estructura del proyecto
frontend-cordillera/
├── public/
├── src/
│   ├── components/
│   │   ├── charts/
│   │   │   ├── VentasChart.jsx  → Gráfico de proyección
│   │   │   └── VentasChart.css
│   │   └── kpi/
│   │       ├── KPIBox.jsx       → Tarjeta KPI reutilizable
│   │       └── KPIBox.css
│   ├── context/
│   │   └── AuthContext.jsx      → Estado global de autenticación
│   ├── pages/
│   │   ├── Dashboard.jsx        → Página principal con KPIs
│   │   ├── Dashboard.css
│   │   ├── Login.jsx            → Página de login y registro
│   │   └── Login.css
│   ├── services/
│   │   └── api.js               → Comunicación con microservicios
│   ├── App.js
│   └── App.css
└── package.json

## 🔐 Roles disponibles
| Rol | Descripción | Ve |
|-----|-------------|-----|
| EJECUTIVO | Alta Gerencia | Ventas + Rentabilidad |
| ANALISTA | Analista de Negocio | Ventas + Stock + Transacciones |
| SUPERVISOR | Admin. de Datos | KPIs de su sucursal |
| ADMIN_SISTEMA | Admin. del Sistema | Gestión de accesos |

## 🌐 Conexión con microservicios
- MS-Usuarios: http://localhost:8081 (login y registro)
- BFF: http://localhost:8084 (dashboard por rol)

## 🚀 Cómo ejecutar
1. Instalar dependencias:
npm install

2. Ejecutar en modo desarrollo:
npm start

3. Abrir en el navegador:
http://localhost:3000

## 👥 Usuarios de prueba
| Email | Contraseña | Rol |
|-------|------------|-----|
| ejecutivo@cordillera.cl | 123456 | EJECUTIVO |
| analista@cordillera.cl | 123456 | ANALISTA |
| supervisor@cordillera.cl | 123456 | SUPERVISOR |

## ✅ Requisitos
- Node.js 18+
- NPM
- MS-Usuarios corriendo en puerto 8081
- BFF corriendo en puerto 8084

## 👥 Autores
- Janet Huaylla Huayllas
- Bairo Pasten Codoceo