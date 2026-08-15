import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { AdoptionCreateModal } from './AdoptionCreateModal';
import { PokemonCreateModal } from './PokemonCreateModal';
import './CreationModals.css';

export type MainLayoutContext = {
  openAdoptionModal: () => void;
  openPokemonModal: () => void;
};

/**
 * Shell with primary navigation tabs between adoptions review and Pokémon catalog.
 */
export const MainLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const [adoptionModalOpen, setAdoptionModalOpen] = useState(false);
  const [pokemonModalOpen, setPokemonModalOpen] = useState(false);

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
          </nav>
          <button className="logout-button" type="button" onClick={() => void logout()} title={user?.email ?? undefined}>Salir</button>
        </div>
      </header>
      <main><Outlet context={{ openAdoptionModal: () => setAdoptionModalOpen(true), openPokemonModal: () => setPokemonModalOpen(true) } satisfies MainLayoutContext} /></main>
      <PokemonCreateModal open={pokemonModalOpen} onClose={() => setPokemonModalOpen(false)} onCreated={() => window.dispatchEvent(new Event('pokemon-created'))} />
      <AdoptionCreateModal open={adoptionModalOpen} onClose={() => setAdoptionModalOpen(false)} onCreated={() => window.dispatchEvent(new Event('adoption-created'))} />
    </>
  );
};
