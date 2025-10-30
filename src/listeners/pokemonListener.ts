import { db } from '../config/firebase.js';
import { Pokemon, PokemonStatus } from '../models/Pokemon.js';

export function setupPokemonListener() {
  const pokemonsRef = db.collection('pokemons');

  // Listener para todos los cambios en la colección
  pokemonsRef.onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const pokemon: Pokemon = {
        id: change.doc.id,
        ...change.doc.data()
      } as Pokemon;
      
      if (change.type === 'modified') {
        console.log('Pokemon in preparation:', pokemon.name);
        pokemonsRef.doc(pokemon.id).update({
          status: PokemonStatus.PREPARED,
        });
      }
    });
  });
}