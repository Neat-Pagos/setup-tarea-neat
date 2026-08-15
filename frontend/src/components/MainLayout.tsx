import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

/**
 * Shell with primary navigation tabs between adoptions review and Pokémon catalog.
 */
export const MainLayout: React.FC = () => {
  return (
    <>
      <header className="app-shell">
        <div className="signal-bar" aria-hidden="true">
          <span className="signal-light signal-light-primary" />
          <span className="signal-light signal-light-red" />
          <span className="signal-light signal-light-yellow" />
          <span className="signal-light signal-light-green" />
        </div>
        <div className="shell-inner">
          <NavLink to="/" className="brand" aria-label="Centro Pokémon, inicio">
            <span className="brand-mark" aria-hidden="true"><span /></span>
            <span className="brand-copy">
              <strong>Centro Pokémon</strong>
              <small>Unidad de adopciones</small>
            </span>
          </NavLink>
          <nav className="main-tabs" aria-label="Secciones principales">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `main-tab${isActive ? ' main-tab-active' : ''}`}
            >
              <span className="tab-index">01</span> Solicitudes
            </NavLink>
            <NavLink
              to="/pokemons"
              className={({ isActive }) => `main-tab${isActive ? ' main-tab-active' : ''}`}
            >
              <span className="tab-index">02</span> Pokémon
            </NavLink>
            <NavLink
              to="/pokemons/new"
              className={({ isActive }) => `main-tab${isActive ? ' main-tab-active' : ''}`}
            >
              <span className="tab-index">03</span> Nuevo registro
            </NavLink>
          </nav>
        </div>
      </header>
      <main><Outlet /></main>
    </>
  );
};
