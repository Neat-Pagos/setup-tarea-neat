import { PokemonStatus } from '../models/Pokemon.js';

export const pokemonAvailableTransitions: Record<PokemonStatus, PokemonStatus[]> = {
    [PokemonStatus.AVAILABLE]: [PokemonStatus.PREPARED],
    [PokemonStatus.PREPARED]: [PokemonStatus.DELIVERED, PokemonStatus.DELIVERED_ERROR],
    [PokemonStatus.DELIVERED]: [],
    [PokemonStatus.DELIVERED_ERROR]: [PokemonStatus.PREPARED, PokemonStatus.AVAILABLE]
};

export const canTransitionPokemon = (
  currentStatus: PokemonStatus,
  nextStatus: PokemonStatus
): boolean => pokemonAvailableTransitions[currentStatus]?.includes(nextStatus) ?? false;
