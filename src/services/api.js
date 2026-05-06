/**
 * @module api
 * @description Servicio centralizado de comunicación con los microservicios.
 * Aplica el principio DRY con una función genérica de peticiones HTTP.
 *
 * Microservicios que consume:
 *  - MS-Usuarios: http://localhost:8081
 *  - BFF:         http://localhost:8084
 */

const API_AUTH     = 'http://localhost:8081/api/auth';
const API_USUARIOS = 'http://localhost:8081/api/usuarios';
const API_BFF      = 'http://localhost:8084/api/bff';

/**
 * Función genérica para peticiones HTTP.
 * Aplica principio DRY: evita repetir fetch en cada función.
 *
 * @param {string} url - URL del endpoint
 * @param {string} method - Método HTTP (GET, POST, PUT, DELETE)
 * @param {Object} body - Cuerpo de la petición (opcional)
 * @returns {Promise<Object>} Respuesta del servidor
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
 * Llama al endpoint POST /api/auth/login de MS-Usuarios.
 *
 * @param {string} email - Correo del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise<{nombre, email, rol}>} Datos del usuario autenticado
 */
export const login = (email, password) =>
  request(`${API_AUTH}/login`, 'POST', { email, password });

/**
 * Registra un nuevo usuario en el sistema.
 * Llama al endpoint POST /api/usuarios de MS-Usuarios.
 *
 * @param {Object} datosUsuario - { nombre, email, password, rol }
 * @returns {Promise<Object>} Usuario creado
 */
export const registrar = (datosUsuario) =>
  request(API_USUARIOS, 'POST', datosUsuario);

/**
 * Obtiene el dashboard adaptado al rol del usuario.
 * Llama al BFF que aplica el Patrón Factory Method.
 *
 * @param {string} rol - Rol del usuario (EJECUTIVO, ANALISTA, SUPERVISOR)
 * @returns {Promise<Object>} DashboardDTO con KPIs según el rol
 */
export const getDashboard = (rol) =>
  request(`${API_BFF}/dashboard?rol=${rol}`, 'GET');