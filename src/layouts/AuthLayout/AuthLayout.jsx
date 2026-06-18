import { Navigate, Outlet } from 'react-router-dom';
import { Gamepad2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './AuthLayout.css';

export default function AuthLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="auth-layout">
      <div className="auth-container">
        <div className="auth-brand">
          <Gamepad2 size={40} className="brand-icon" />
          <span className="brand-text">Lootly</span>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
