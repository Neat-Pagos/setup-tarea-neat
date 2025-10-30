import { db } from "../config/firebase.js";
import { PokemonStatus } from "../models/Pokemon.js";

export const getPokemons = async (status?: PokemonStatus) => {
  try {
    const snapshot = await db.collection("pokemons").get();
    const pokemons = snapshot.docs.map((doc) => doc.data());
    
    if (status) {
      return pokemons.filter((pokemon) => pokemon.status === status);
    }
    
    return pokemons;
  } catch (error) {
    console.error("Error fetching pokemons:", error);
    return [];
  }
};
