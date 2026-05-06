import { createContext, useState, useContext } from 'react';

/**
 * @context AuthContext
 * @description Contexto global de autenticación.
 * Provee el estado del usuario y métodos para
 * iniciar y cerrar sesión en toda la aplicación.
 *
 * Uso:
 *  1. Envolver la app con <AuthProvider>
 *  2. Consumir con el hook useAuth()
 *
 * @example
 * const { usuario, iniciarSesion, cerrarSesion } = useAuth();
 */
const AuthContext = createContext();

/**
 * @component AuthProvider
 * @description Proveedor del contexto de autenticación.
 * Debe envolver el componente raíz de la aplicación.
 *
 * @param {React.ReactNode} children - Componentes hijos
 */
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  /**
   * Inicia sesión guardando los datos del usuario autenticado.
   * @param {Object} datos - Datos del usuario (nombre, email, rol)
   */
  const iniciarSesion = (datos) => setUsuario(datos);

  /**
   * Cierra sesión limpiando el estado del usuario.
   */
  const cerrarSesion = () => setUsuario(null);

  return (
    <AuthContext.Provider value={{ usuario, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * @hook useAuth
 * @description Hook personalizado para consumir el AuthContext.
 * @returns {{ usuario, iniciarSesion, cerrarSesion }}
 *
 * @example
 * const { usuario, cerrarSesion } = useAuth();
 */
export const useAuth = () => useContext(AuthContext);