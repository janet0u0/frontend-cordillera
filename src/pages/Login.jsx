import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/api';
import './Login.css';

/**
 * Página de Login - Grupo Cordillera
 * Autentica al usuario contra MS-Usuarios
 */
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const { iniciarSesion } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Por favor ingresa email y contraseña');
      return;
    }
    setCargando(true);
    setError(null);
    try {
      const data = await login(email, password);
      if (data.error) {
        setError(data.error);
        return;
      }
      iniciarSesion(data);
    } catch (err) {
      setError('No se pudo conectar con el servidor');
    } finally {
      setCargando(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div className="login-pagina">
      <div className="login-card">
        <h1 className="login-titulo">📊 Grupo Cordillera</h1>
        <p className="login-subtitulo">Plataforma de Monitoreo Inteligente</p>

        <div className="login-form">
          <h2 className="login-form-titulo">🔐 Iniciar Sesión</h2>

          <div className="login-campo">
            <label className="login-label">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="usuario@cordillera.cl"
              className="login-input"
            />
          </div>

          <div className="login-campo">
            <label className="login-label">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="••••••"
              className="login-input"
            />
          </div>

          {error && (
            <div className="login-error">⚠️ {error}</div>
          )}

          <button
            onClick={handleLogin}
            disabled={cargando}
            className="login-boton"
          >
            {cargando ? '⏳ Verificando...' : '🚀 Ingresar'}
          </button>
        </div>

        <div className="login-usuarios">
          <p className="login-usuarios-titulo">Usuarios de prueba:</p>
          <p>👔 ejecutivo@cordillera.cl</p>
          <p>📊 analista@cordillera.cl</p>
          <p>🔍 supervisor@cordillera.cl</p>
          <p className="login-password">Contraseña: 123456</p>
        </div>
      </div>
    </div>
  );
}

export default Login;