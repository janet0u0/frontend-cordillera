import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import './App.css';

/**
 * App principal - Grupo Cordillera
 * Maneja el flujo: Login → Dashboard
 */
function AppContent() {
  const { usuario } = useAuth();

  if (!usuario) {
    return <Login />;
  }

  return <Dashboard />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;