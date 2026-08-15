import React, { ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { adoptionsService } from '../services/adoptionsService';
import { pokemonService } from '../services/pokemonService';
import type { UserData } from '../types/adoption';
import type { Pokemon } from '../types/pokemon';

type AdoptionCreateModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

const INITIAL_USER: UserData = { name: '', email: '', phone: '', region: '', idNumber: '' };

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error !== null) {
    if ('message' in error && typeof error.message === 'string') return error.message;
    if ('error' in error && typeof error.error === 'string') return error.error;
  }
  return 'No pudimos registrar la solicitud.';
};

export const AdoptionCreateModal: React.FC<AdoptionCreateModalProps> = ({ open, onClose, onCreated }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [selectedPokemonId, setSelectedPokemonId] = useState('');
  const [user, setUser] = useState<UserData>(INITIAL_USER);
  const [loadingPokemons, setLoadingPokemons] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadAdoptablePokemons = useCallback(async (): Promise<void> => {
    try {
      setLoadingPokemons(true);
      setError(null);
      setPokemons(await pokemonService.getAdoptable());
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoadingPokemons(false);
    }
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      void loadAdoptablePokemons();
    }
    if (!open && dialog.open) dialog.close();
  }, [open, loadAdoptablePokemons]);

  const close = (): void => {
    if (submitting) return;
    setError(null);
    onClose();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setUser((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (!selectedPokemonId) {
      setError('Selecciona un Pokémon disponible.');
      return;
    }
    if (!Object.values(user).every((value) => value.trim())) {
      setError('Completa todos los datos de la persona adoptante.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await adoptionsService.createAdoption(selectedPokemonId, user);
      setSelectedPokemonId('');
      setUser(INITIAL_USER);
      onCreated();
      onClose();
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <dialog ref={dialogRef} className="creation-modal creation-modal-wide" aria-labelledby="adoption-modal-title" onCancel={(event) => { event.preventDefault(); close(); }} onClick={(event) => { if (event.target === dialogRef.current) close(); }}>
      <form className="modal-panel" onSubmit={handleSubmit}>
        <header className="modal-header">
          <div><h2 id="adoption-modal-title">Nueva adopción</h2><p>Selecciona un Pokémon disponible y registra a la persona adoptante.</p></div>
          <button className="modal-close" type="button" aria-label="Cerrar" onClick={close}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg></button>
        </header>
        <div className="modal-body adoption-modal-body">
          {error && <div className="modal-error" role="alert">{error}</div>}
          <section className="modal-section" aria-labelledby="adoptable-title">
            <div className="modal-section-heading"><div><h3 id="adoptable-title">Pokémon adoptable</h3><p>Solo se muestran registros con estado disponible.</p></div>{!loadingPokemons && pokemons.length > 0 && <span>{pokemons.length} disponibles</span>}</div>
            {loadingPokemons ? <div className="modal-loading"><span className="loader-orbit" />Consultando disponibilidad…</div> : pokemons.length === 0 ? <div className="modal-empty"><strong>No hay Pokémon disponibles</strong><span>Actualiza el catálogo o vuelve a intentarlo.</span><button type="button" onClick={() => void loadAdoptablePokemons()}>Reintentar</button></div> : <div className="pokemon-picker">{pokemons.map((pokemon) => <label key={pokemon.id} className={`pokemon-option${selectedPokemonId === pokemon.id ? ' is-selected' : ''}`}><input type="radio" name="pokemonId" value={pokemon.id} checked={selectedPokemonId === pokemon.id} onChange={() => setSelectedPokemonId(pokemon.id)} /><span className="pokemon-option-image">{pokemon.imageUrl ? <img src={pokemon.imageUrl} alt="" /> : <span aria-hidden="true">?</span>}</span><span className="pokemon-option-copy"><strong>{pokemon.name}</strong><small>{pokemon.type} · {pokemon.region}</small></span><span className="pokemon-option-check" aria-hidden="true" /></label>)}</div>}
          </section>
          <section className="modal-section" aria-labelledby="adopter-title">
            <div className="modal-section-heading"><div><h3 id="adopter-title">Datos del adoptante</h3><p>Información necesaria para revisar y contactar.</p></div></div>
            <div className="form-grid">
              <label className="form-field"><span>Nombre completo *</span><input name="name" value={user.name} onChange={handleChange} autoComplete="name" /></label>
              <label className="form-field"><span>Correo *</span><input type="email" name="email" value={user.email} onChange={handleChange} autoComplete="email" /></label>
              <label className="form-field"><span>Teléfono *</span><input type="tel" name="phone" value={user.phone} onChange={handleChange} autoComplete="tel" /></label>
              <label className="form-field"><span>Región *</span><input name="region" value={user.region} onChange={handleChange} autoComplete="address-level1" /></label>
              <label className="form-field form-field-wide"><span>Identificación *</span><input name="idNumber" value={user.idNumber} onChange={handleChange} /></label>
            </div>
          </section>
        </div>
        <footer className="modal-actions"><button type="button" className="modal-secondary" onClick={close} disabled={submitting}>Cancelar</button><button type="submit" className="modal-primary" disabled={submitting || loadingPokemons || pokemons.length === 0}>{submitting ? 'Registrando…' : 'Registrar adopción'}</button></footer>
      </form>
    </dialog>
  );
};
