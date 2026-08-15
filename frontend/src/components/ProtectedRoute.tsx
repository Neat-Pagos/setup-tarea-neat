import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="auth-loading" role="status"><span className="loader-orbit" />Validando sesión…</div>;
  return user ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />;
};
