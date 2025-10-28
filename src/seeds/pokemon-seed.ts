import { db } from '../config/firebase.js';
import { Pokemon, PokemonStatus } from '../models/Pokemon.js';

const samplePokemons: Omit<Pokemon, 'id'>[] = [
  {
    status: PokemonStatus.AVAILABLE,
    name: 'Pikachu',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png'
  },
  {
    status: PokemonStatus.AVAILABLE,
    name: 'Charizard',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png'
  },
  { 
    status: PokemonStatus.AVAILABLE,
    name: 'Blastoise',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/9.png'
  },
  { 
    status: PokemonStatus.AVAILABLE,
    name: 'Venusaur',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png'
  },
  {  
    status: PokemonStatus.AVAILABLE,
    name: 'Mewtwo',
    imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png'
  }
];

export async function seedPokemons() {
  try {
    const batch = db.batch();
    const pokemonsRef = db.collection('pokemons');

    samplePokemons.forEach((pokemon) => {
      const docRef = pokemonsRef.doc();
      batch.set(docRef, {
        ...pokemon,
        id: docRef.id,
        createdAt: new Date()
      });
    });

    await batch.commit();
    console.log('✅ Pokemon data seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding pokemon data:', error);
  }
}

// Ejecutar el seed si este archivo es ejecutado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  seedPokemons().then(() => process.exit(0));
}