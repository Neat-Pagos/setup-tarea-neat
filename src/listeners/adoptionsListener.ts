import { db } from '../config/firebase.js';
import { AdoptionStatus } from '../models/Adoption.js';
import { PokemonStatus } from '../models/Pokemon.js';

export function setupAdoptionsListener() {
  const adoptionsRef = db.collection('adoptions');

  // Listener para todos los cambios en la colección de adopciones
  adoptionsRef.onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'modified') {
        const adoptionData = change.doc.data();
        
        // Verificar si el estado cambió a APPROVED
        if (adoptionData.status === AdoptionStatus.APPROVED) {
          const pokemonId = adoptionData.pokemonId;
          
          if (pokemonId) {
            // Actualizar el estado del Pokémon a PREPARED
            const pokemonRef = db.collection('pokemons').doc(pokemonId);
            pokemonRef.update({
              status: PokemonStatus.PREPARED,
            })
            .then(() => {
              console.log(`Pokemon ${pokemonId} actualizado a estado PREPARED después de aprobar adopción ${change.doc.id}`);
            })
            .catch((error) => {
              console.error(`Error al actualizar el estado del Pokémon ${pokemonId}:`, error);
            });
          }
        }
      }
    });
  });
  
  console.log('Listener de adopciones configurado correctamente');
}