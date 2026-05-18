import axios from "axios";
import type { CreatePokemonInput, Pokemon } from "../types/pokemon";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

/**
 * Fetches all Pokémon from the adoption API (Firestore-backed catalog).
 */
export const pokemonService = {
  async getAll(): Promise<Pokemon[]> {
    try {
      const response = await axios.get<Pokemon[]>(`${API_URL}/pokemon`);
      console.log(response);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const data = error.response.data as { error?: string };
        throw new Error(data.error ?? "Error al obtener los Pokémon");
      }
      throw new Error("Error al obtener los Pokémon");
    }
  },

  async create(input: CreatePokemonInput): Promise<Pokemon> {
    try {
      const response = await axios.post<Pokemon>(`${API_URL}/pokemon`, input);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data) {
        const data = error.response.data as { error?: string };
        throw new Error(data.error ?? "Error al crear el Pokémon");
      }
      throw new Error("Error al crear el Pokémon");
    }
  },
};
