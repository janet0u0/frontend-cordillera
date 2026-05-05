// URLs de los microservicios
const API_USUARIOS = 'http://localhost:8081';
const API_BFF = 'http://localhost:8084';

// Login
export const login = async (email, password) => {
  const response = await fetch(`${API_USUARIOS}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return response.json();
};

// Obtener dashboard según rol
export const getDashboard = async (rol) => {
  const response = await fetch(`${API_BFF}/api/bff/dashboard?rol=${rol}`);
  return response.json();
};