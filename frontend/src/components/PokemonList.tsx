import React, { useCallback, useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { pokemonService } from '../services/pokemonService';
import { Pokemon, PokemonStatus } from '../types/pokemon';
import type { MainLayoutContext } from './MainLayout';

export const PokemonList: React.FC = () => {
  const { openPokemonModal } = useOutletContext<MainLayoutContext>();
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPokemons = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const data = await pokemonService.getAll();
      setPokemons(data);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === 'object' &&
              err !== null &&
              'error' in err &&
              typeof (err as { error: unknown }).error === 'string'
            ? (err as { error: string }).error
            : 'Error al cargar los Pokémon';
      setError(message);
      console.error('Error loading pokemons:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadPokemons();
    const handleCreated = (): void => { void loadPokemons(); };
    window.addEventListener('pokemon-created', handleCreated);
    return () => window.removeEventListener('pokemon-created', handleCreated);
  }, [loadPokemons]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>): void => {
    const target = e.target as HTMLImageElement;
    target.hidden = true;
  };

  const getStatusText = (status: PokemonStatus): string => {
    const map: Record<PokemonStatus, string> = {
      [PokemonStatus.AVAILABLE]: 'Disponible',
      [PokemonStatus.PREPARED]: 'Preparado',
      [PokemonStatus.DELIVERED]: 'Entregado',
      [PokemonStatus.DELIVERED_ERROR]: 'Error de entrega',
    };
    return map[status] ?? status;
  };

  const getStatusBadgeClass = (status: PokemonStatus): string => {
    return `status-badge status-${status}`;
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Cargando Pokémon...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">
          {error}
          <br />
          <button type="button" onClick={() => void loadPokemons()} style={{ marginTop: '1rem' }}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-heading page-heading-with-action">
        <div>
          <h1>Archivo Pokémon</h1>
          <p>Catálogo operativo del centro de adopciones.</p>
        </div>
        <button className="header-action" type="button" onClick={openPokemonModal}>
          <span aria-hidden="true">+</span> Agregar Pokémon
        </button>
      </div>

      <div className="catalog-readout" aria-label={`${pokemons.length} registros en el catálogo`}>
        <span>Registros en archivo</span>
        <strong>{String(pokemons.length).padStart(2, '0')}</strong>
        <span className="readout-line" aria-hidden="true" />
        <small>Sincronizado con el centro</small>
      </div>

      {pokemons.length === 0 ? (
        <div className="no-adoptions">
          <h3>No hay Pokémon</h3>
          <p>No se encontraron registros en la base de datos.</p>
        </div>
      ) : (
        <div className="pokemon-grid">
          {pokemons.map((pokemon) => (
            <article key={pokemon.id} className="pokemon-card">
              <div className={`pokemon-stage type-${pokemon.type.toLowerCase()}`}>
                <span className="stage-orbit" aria-hidden="true" />
                {pokemon.imageUrl ? <img className="pokemon-card-image" src={pokemon.imageUrl} alt={pokemon.name} onError={handleImageError} /> : <div className="pokemon-placeholder" role="img" aria-label={`Imagen pendiente de ${pokemon.name}`}><span>?</span></div>}
                <span className="specimen-id">#{pokemon.id.slice(-3).padStart(3, '0')}</span>
              </div>
              <div className="pokemon-card-body">
                <div className="pokemon-card-header">
                <div className="pokemon-info">
                  <h3>{pokemon.name}</h3>
                  <p>{pokemon.region}</p>
                </div>
                <div className={getStatusBadgeClass(pokemon.status)}>{getStatusText(pokemon.status)}</div>
                </div>
                <dl className="pokemon-meta">
                  <div className="pokemon-meta-row"><dt>Tipo</dt><dd>{pokemon.type}</dd></div>
                  <div className="pokemon-meta-row"><dt>Dieta</dt><dd>{pokemon.diet}</dd></div>
                </dl>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
