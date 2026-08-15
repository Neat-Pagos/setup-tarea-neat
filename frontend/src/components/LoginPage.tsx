import axios from 'axios';
import React, { FormEvent, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export const LoginPage: React.FC = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  if (user) return <Navigate to="/" replace />;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await login(email, password);
      const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (loginError) {
      setError(axios.isAxiosError(loginError)
        ? loginError.response?.data?.error || 'No pudimos iniciar sesión. Intenta nuevamente'
        : 'No pudimos iniciar sesión. Intenta nuevamente');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-panel" aria-labelledby="login-title">
        <div className="login-brand" aria-hidden="true"><span className="brand-mark"><span /></span><span>Centro Pokémon</span></div>
        <div className="login-copy">
          <h1 id="login-title">Acceso del equipo</h1>
          <p>Ingresa con tu cuenta autorizada para gestionar adopciones y el catálogo.</p>
        </div>
        <form className="login-form" onSubmit={submit}>
          <label className="form-field"><span>Correo electrónico</span><input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoFocus /></label>
          <label className="form-field"><span>Contraseña</span><input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
          {error && <div className="login-error" role="alert">{error}</div>}
          <button type="submit" disabled={submitting}>{submitting ? 'Ingresando…' : 'Ingresar'}</button>
        </form>
      </section>
      <aside className="login-stage" aria-hidden="true">
        <div className="login-orbit"><span /></div>
        <strong>OPERACIONES<br />DE ADOPCIÓN</strong>
        <small>Acceso seguro · Personal autorizado</small>
      </aside>
    </main>
  );
};
