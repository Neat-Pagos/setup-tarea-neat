import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { pokemonService } from '../services/pokemonService';
import type { CreatePokemonInput } from '../types/pokemon';

type PokemonCreateModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

const INITIAL_FORM: CreatePokemonInput = { name: '', imageUrl: '', type: '', diet: '', region: '' };

export const PokemonCreateModal: React.FC<PokemonCreateModalProps> = ({ open, onClose, onCreated }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [form, setForm] = useState<CreatePokemonInput>(INITIAL_FORM);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const close = (): void => {
    if (submitting) return;
    setError(null);
    onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const required = [form.name, form.type, form.region, form.diet].every((value) => value.trim());
    if (!required) {
      setError('Completa nombre, tipo, región y dieta.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const input = { ...form, imageUrl: form.imageUrl?.trim() || undefined };
      await pokemonService.create(input);
      setForm(INITIAL_FORM);
      onCreated();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'No pudimos registrar el Pokémon.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <dialog ref={dialogRef} className="creation-modal" aria-labelledby="pokemon-modal-title" onCancel={(event) => { event.preventDefault(); close(); }} onClick={(event) => { if (event.target === dialogRef.current) close(); }}>
      <form className="modal-panel" onSubmit={handleSubmit}>
        <header className="modal-header">
          <div><h2 id="pokemon-modal-title">Registrar Pokémon</h2><p>Incorpora una nueva ficha al catálogo operativo.</p></div>
          <button className="modal-close" type="button" aria-label="Cerrar" onClick={close}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg></button>
        </header>
        <div className="modal-body">
          {error && <div className="modal-error" role="alert">{error}</div>}
          <div className="form-grid">
            <label className="form-field"><span>Nombre *</span><input autoFocus name="name" value={form.name} onChange={handleChange} placeholder="Ej: Pikachu" /></label>
            <label className="form-field"><span>Tipo *</span><input name="type" value={form.type} onChange={handleChange} placeholder="Ej: Eléctrico" /></label>
            <label className="form-field"><span>Región *</span><input name="region" value={form.region} onChange={handleChange} placeholder="Ej: Kanto" /></label>
            <label className="form-field"><span>URL de imagen <small>Opcional</small></span><input type="url" name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://…" /></label>
          </div>
          <label className="form-field"><span>Dieta *</span><textarea name="diet" value={form.diet} onChange={handleChange} rows={3} placeholder="Ej: Bayas y frutas" /></label>
        </div>
        <footer className="modal-actions"><button type="button" className="modal-secondary" onClick={close} disabled={submitting}>Cancelar</button><button type="submit" className="modal-primary" disabled={submitting}>{submitting ? 'Registrando…' : 'Registrar Pokémon'}</button></footer>
      </form>
    </dialog>
  );
};
