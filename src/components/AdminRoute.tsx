import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

const ADMIN_PASSWORD = 'admin123'; // En producción, esto debería estar en variables de entorno

const AdminRoute: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  const location = useLocation();

  useEffect(() => {
    // Verificar si ya está autenticado en sessionStorage
    const isAuth = sessionStorage.getItem('adminAuth') === 'true';
    setIsAuthenticated(isAuth);
  }, []);

  const handleLogin = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'true');
      setLoginError('');
    } else {
      setLoginError('Contraseña incorrecta');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('adminAuth');
  };

  // Solo mostrar el componente si estamos en la ruta /admin
  if (location.pathname !== '/admin') {
    return null;
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} error={loginError} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
};

export default AdminRoute;