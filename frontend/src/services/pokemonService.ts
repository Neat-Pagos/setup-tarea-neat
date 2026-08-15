import axios from 'axios';
import type { CreatePokemonInput, Pokemon } from '../types/pokemon';
import { api } from './api';

/**
 * Fetches all Pokémon from the adoption API (Firestore-backed catalog).
 */
export const pokemonService = {
  async getAll(): Promise<Pokemon[]> {
    try {
      const response = await api.get<Pokemon[]>('/pokemon');
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const data = error.response.data as { error?: string };
        throw new Error(data.error ?? 'Error al obtener los Pokémon');
      }
      throw new Error('Error al obtener los Pokémon');
    }
  },

  async getAdoptable(): Promise<Pokemon[]> {
    try {
      const response = await api.get<Pokemon[]>('/pokemon/adoptable-pokemons');
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const data = error.response.data as { error?: string };
        throw new Error(data.error ?? 'Error al obtener los Pokémon adoptables');
      }
      throw new Error('Error al obtener los Pokémon adoptables');
    }
  },

  async create(input: CreatePokemonInput): Promise<Pokemon> {
    try {
      const response = await api.post<Pokemon>('/pokemon', input);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const data = error.response.data as { error?: string };
        throw new Error(data.error ?? 'Error al crear el Pokémon');
      }
      throw new Error('Error al crear el Pokémon');
    }
  },
};
