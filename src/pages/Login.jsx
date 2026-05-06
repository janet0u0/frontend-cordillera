import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { login, registrar } from '../services/api';
import './Login.css';

function Login() {
  // Estados para controlar el formulario
  const [esRegistro, setEsRegistro] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [rol, setRol] = useState('EJECUTIVO');
  
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const { iniciarSesion } = useAuth();

  const handleAccion = async () => {
    if (!email || !password || (esRegistro && !nombre)) {
      setError('Por favor completa todos los campos');
      return;
    }
    setCargando(true);
    setError(null);
    try {
      if (esRegistro) {
        const data = await registrar({ nombre, email, password, rol });
        if (data.error) throw new Error(data.error);
        alert('✅ Registro exitoso. Ahora puedes iniciar sesión.');
        setEsRegistro(false);
      } else {
        const data = await login(email, password);
        if (data.error) throw new Error(data.error);
        iniciarSesion(data);
      }
    } catch (err) {
      setError(err.message || 'Error de conexión');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-pagina">
      <div className="login-card">
        <h1 className="login-titulo">📊 Grupo Cordillera</h1>
        <p className="login-subtitulo">Plataforma de Monitoreo Inteligente</p>

        <div className="login-form">
          <h2 className="login-form-titulo">
            {esRegistro ? '📝 Crear Cuenta' : '🔐 Iniciar Sesión'}
          </h2>

          {esRegistro && (
            <div className="login-campo">
              <label className="login-label">Nombre Completo</label>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre" className="login-input" />
            </div>
          )}

          <div className="login-campo">
            <label className="login-label">Correo electrónico</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="usuario@cordillera.cl" className="login-input" />
          </div>

          <div className="login-campo">
            <label className="login-label">Contraseña</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" className="login-input" />
          </div>

          {esRegistro && (
            <div className="login-campo">
              <label className="login-label">Rol solicitado</label>
              <select className="login-input" value={rol} onChange={(e) => setRol(e.target.value)}>
                <option value="EJECUTIVO">👔 Ejecutivo</option>
                <option value="ANALISTA">📊 Analista</option>
                <option value="SUPERVISOR">🔍 Supervisor</option>
                <option value="ADMIN_SISTEMA">🛠️ Administrador</option>
              </select>
            </div>
          )}

          {error && <div className="login-error">⚠️ {error}</div>}

          <button onClick={handleAccion} disabled={cargando} className="login-boton">
            {cargando ? '⏳ Procesando...' : (esRegistro ? 'Registrar Usuario' : '🚀 Ingresar')}
          </button>

          <p className="login-toggle" onClick={() => { setEsRegistro(!esRegistro); setError(null); }}>
            {esRegistro ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate aquí'}
          </p>
        </div>

        {!esRegistro && (
          <div className="login-usuarios">
            <p className="login-usuarios-titulo">Usuarios de prueba:</p>
            <p>👔 ejecutivo@cordillera.cl | 📊 analista@cordillera.cl</p>
            <p className="login-password">Contraseña: 123456</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;