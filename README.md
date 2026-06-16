markdown# Frontend Cordillera - Grupo Cordillera

Plataforma de Monitoreo Inteligente del Grupo Cordillera. Aplicación React que consume el BFF para mostrar dashboards personalizados según el rol del usuario.

## Tecnologías
- React 19
- React Router DOM
- CSS Modules
- NPM

## Patrones Aplicados
- **Context API**: Gestión global del estado de autenticación
- **Factory Method**: Renderizado condicional según rol del BFF
- **Componentes Reutilizables NPM**: KPIBox, VentasChart

## Requisitos
- Node.js 18+
- NPM
- MS-Usuarios corriendo en puerto 8081
- BFF corriendo en puerto 8084

## Instalación y Ejecución

### 1. Clonar el repositorio
```bash
git clone 
cd frontend-cordillera
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Ejecutar la aplicación
```bash
npm start
```

La aplicación quedará disponible en `http://localhost:3000`

## Estructura del proyecto

```text
frontend-cordillera/
├── public/                            
├── src/
│   ├── components/                     
│   │   ├── __tests__/                 
│   │   │   ├── KPIBox.test.jsx       
│   │   │   └── VentasChart.test.jsx    
│   │   ├── KPIBox.css
│   │   ├── KPIBox.jsx
│   │   ├── VentasChart.css
│   │   └── VentasChart.jsx
│   │
│   ├── context/                        
│   │   ├── __tests__/                  
│   │   │   └── AuthContext.test.jsx    
│   │   └── AuthContext.jsx
│   │
│   ├── pages/                          
│   │   ├── __tests__/                  
│   │   │   ├── Dashboard.test.jsx      
│   │   │   └── Login.test.jsx          
│   │   ├── Dashboard.css
│   │   ├── Dashboard.jsx
│   │   ├── Login.css
│   │   └── Login.jsx
│   │
│   ├── services/                      
│   │   ├── __tests__/                  
│   │   │   └── api.test.js            
│   │   └── api.js
│   │
│   ├── __tests__/                   
│   │   └── App.test.jsx                
│   ├── App.css
│   ├── App.jsx
│   ├── index.js
│   └── setupTests.js                   
│
├── Dockerfile
├── nginx.conf
├── package.json                        
└── README.md
```

## Usuarios de prueba

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| ejecutivo@cordillera.cl | 123456 | EJECUTIVO |
| analista@cordillera.cl | 123456 | ANALISTA |
| supervisor@cordillera.cl | 123456 | SUPERVISOR |

## Dashboards por Rol

| Rol | Tipo Reporte | KPIs Disponibles |
|-----|-------------|-----------------|
| EJECUTIVO | ESTRATÉGICO | Ventas, Meta, Rentabilidad |
| ANALISTA | ANALÍTICO | Ventas, Stock Crítico, Transacciones |
| SUPERVISOR | OPERATIVO | Ventas, Stock Crítico, Transacciones |
| ADMIN_SISTEMA | CONTROL TÉCNICO | Estado del sistema |

## Microservicios requeridos
| Servicio | Puerto |
|----------|--------|
| MS-Usuarios | 8081 |
| MS-KPI | 8082 |
| MS-Datos | 8083 |
| BFF | 8084 |
