/**
 * @module api
 * @description Servicio centralizado de comunicación con los microservicios.
 * Aplica el principio DRY con una función genérica de peticiones HTTP.
 *
 * Microservicios que consume:
 *  - MS-Usuarios: http://localhost:8081
 *  - BFF:         http://localhost:8084
 */

const API_USUARIOS = 'http://localhost:8081/api/usuarios';
const API_BFF      = 'http://localhost:8084/api/bff';

/**
 * Función genérica para peticiones HTTP.
 * Aplica principio DRY: evita repetir fetch en cada función.
 */
const request = async (url, method = 'GET', body = null) => {
  try {
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error en la petición');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error.message);
    return { error: error.message };
  }
};

/**
 * Autentica un usuario con email y contraseña.
 * Llama al endpoint POST /api/usuarios/login de MS-Usuarios.
 */
export const login = (email, password) =>
  request(`${API_USUARIOS}/login`, 'POST', { email, password });

/**
 * Registra un nuevo usuario en el sistema.
 * Llama al endpoint POST /api/usuarios/registrar de MS-Usuarios.
 */
export const registrar = (datosUsuario) =>
  request(`${API_USUARIOS}/registrar`, 'POST', datosUsuario);

/**
 * Obtiene el dashboard adaptado al rol del usuario.
 * Llama al BFF que aplica el Patrón Factory Method.
 */
export const getDashboard = (rol) =>
  request(`${API_BFF}/dashboard?rol=${rol}`, 'GET');