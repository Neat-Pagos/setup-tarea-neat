import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

/**
 * Shell with primary navigation tabs between adoptions review and Pokémon catalog.
 */
export const MainLayout: React.FC = () => {
  return (
    <>
      <div className="main-tabs-wrap">
        <div className="container main-tabs-inner">
          <nav className="main-tabs" role="tablist" aria-label="Secciones principales">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `main-tab${isActive ? ' main-tab-active' : ''}`}
            >
              Adopciones
            </NavLink>
            <NavLink
              to="/pokemons"
              className={({ isActive }) => `main-tab${isActive ? ' main-tab-active' : ''}`}
            >
              Pokémon
            </NavLink>
          </nav>
        </div>
      </div>
      <Outlet />
    </>
  );
};
