import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { pokemonService } from '../services/pokemonService';
import { Pokemon, PokemonStatus } from '../types/pokemon';
import CreateAdoption from './CreateAdoption';
import { useBroadcastRefresh } from '../hooks/useBroadcastRefresh';

const PLACEHOLDER_IMG =
  'https://via.placeholder.com/120x120/f0f0f0/999?text=%F0%9F%8C%9F';

export const PokemonList: React.FC = () => {
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

  useBroadcastRefresh('pokemons', loadPokemons);

  useEffect(() => {
    void loadPokemons();
  }, [loadPokemons]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>): void => {
    const target = e.target as HTMLImageElement;
    target.src = PLACEHOLDER_IMG;
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
      <div className="header">
        <h1>Todos los Pokémon</h1>
        <p>Catálogo registrado en el centro de adopciones</p>
        <Link className="header-action" to="/pokemons/new">
          Agregar Pokémon
        </Link>
      </div>

      {pokemons.length === 0 ? (
        <div className="no-adoptions">
          <h3>No hay Pokémon</h3>
          <p>No se encontraron registros en la base de datos.</p>
        </div>
      ) : (
        <div className="pokemon-grid">
          {pokemons.map((pokemon) => (
            <article key={pokemon.id} className="pokemon-card flex flex-col justify-between">
              <div className="pokemon-card-header">
                <img
                  className="pokemon-card-image"
                  src={pokemon.imageUrl || PLACEHOLDER_IMG}
                  alt={pokemon.name}
                  onError={handleImageError}
                />
                <div className="pokemon-info">
                  <h3 className="text-truncate">{pokemon.name}</h3>
                  <div className="pokemon-id">
                    <p>ID: {pokemon.id}</p>
                  </div>
                </div>
              </div>
              <div>
                <span className={getStatusBadgeClass(pokemon.status)}>{getStatusText(pokemon.status)}</span>
              </div>

              <dl className="pokemon-meta">
                <div className="pokemon-meta-row">
                  <dt>Tipo</dt>
                  <dd>{pokemon.type}</dd>
                </div>
                <div className="pokemon-meta-row">
                  <dt>Dieta</dt>
                  <dd>{pokemon.diet}</dd>
                </div>
                <div className="pokemon-meta-row">
                  <dt>Región</dt>
                  <dd>{pokemon.region}</dd>
                </div>
              </dl>
              <CreateAdoption pokemon={pokemon} />
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
