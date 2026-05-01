import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { pokemonService } from '../services/pokemonService';
import type { CreatePokemonInput } from '../types/pokemon';

type PokemonFormState = {
  name: string;
  imageUrl: string;
  type: string;
  diet: string;
  region: string;
};

const INITIAL_FORM_STATE: PokemonFormState = {
  name: '',
  imageUrl: '',
  type: '',
  diet: '',
  region: '',
};

const buildCreatePokemonInput = (formState: PokemonFormState): CreatePokemonInput => {
  const input: CreatePokemonInput = {
    name: formState.name.trim(),
    type: formState.type.trim(),
    diet: formState.diet.trim(),
    region: formState.region.trim(),
  };

  if (formState.imageUrl.trim() !== '') {
    input.imageUrl = formState.imageUrl.trim();
  }

  return input;
};

const validateForm = (formState: PokemonFormState): string | null => {
  const requiredFields = [formState.name, formState.type, formState.diet, formState.region];
  const hasRequiredFields = requiredFields.every((field) => field.trim() !== '');

  if (!hasRequiredFields) {
    return 'Completa nombre, tipo, dieta y región.';
  }

  return null;
};

/**
 * Staff-facing form for adding Pokemon to the Firestore catalog.
 *
 * @returns A creation form wired to the backend Zod-validated endpoint.
 */
export const PokemonCreateForm: React.FC = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState<PokemonFormState>(INITIAL_FORM_STATE);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = event.target;

    setFormState((currentState) => ({
      ...currentState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    const validationError = validateForm(formState);

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await pokemonService.create(buildCreatePokemonInput(formState));
      navigate('/pokemons');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error al crear el Pokémon';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Agregar Pokémon</h1>
        <p>Crea un nuevo registro disponible en el catálogo de adopciones</p>
      </div>

      <form className="pokemon-form" onSubmit={handleSubmit}>
        {error && <div className="error">{error}</div>}

        <div className="form-grid">
          <label className="form-field">
            <span>Nombre *</span>
            <input
              type="text"
              name="name"
              value={formState.name}
              onChange={handleChange}
              placeholder="Ej: Pikachu"
            />
          </label>

          <label className="form-field">
            <span>Tipo *</span>
            <input
              type="text"
              name="type"
              value={formState.type}
              onChange={handleChange}
              placeholder="Ej: Eléctrico"
            />
          </label>

          <label className="form-field">
            <span>Región *</span>
            <input
              type="text"
              name="region"
              value={formState.region}
              onChange={handleChange}
              placeholder="Ej: Kanto"
            />
          </label>

          <label className="form-field">
            <span>URL de imagen</span>
            <input
              type="url"
              name="imageUrl"
              value={formState.imageUrl}
              onChange={handleChange}
              placeholder="https://..."
            />
          </label>
        </div>

        <label className="form-field">
          <span>Dieta *</span>
          <textarea
            name="diet"
            value={formState.diet}
            onChange={handleChange}
            rows={4}
            placeholder="Ej: Omnívoro - bayas y frutas"
          />
        </label>

        <div className="form-actions">
          <Link className="secondary-button" to="/pokemons">
            Cancelar
          </Link>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creando...' : 'Crear Pokémon'}
          </button>
        </div>
      </form>
    </div>
  );
};
