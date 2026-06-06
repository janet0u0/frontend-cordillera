import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    // ✅ Al cargar, recupera la sesión guardada
    try {
      const guardado = sessionStorage.getItem('usuario_cordillera');
      return guardado ? JSON.parse(guardado) : null;
    } catch {
      return null;
    }
  });

  const iniciarSesion = (datos) => {
    setUsuario(datos);
    // ✅ Guarda en sessionStorage para sobrevivir el reload
    sessionStorage.setItem('usuario_cordillera', JSON.stringify(datos));
  };

  const cerrarSesion = () => {
    setUsuario(null);
    // ✅ Limpia sessionStorage al salir
    sessionStorage.removeItem('usuario_cordillera');
  };

  return (
    <AuthContext.Provider value={{ usuario, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);