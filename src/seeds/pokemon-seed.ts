import { db } from '../config/firebase.js';
import { Pokemon, PokemonNames, PokemonStatus } from '../models/Pokemon.js';

// Function to fetch Pokemon data from PokeAPI
async function fetchPokemonData(pokemonId: number) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    if (!response.ok) throw new Error(`Failed to fetch Pokemon ${pokemonId}`);
    return await response.json();
  } catch (error) {
    console.error(`Error fetching Pokemon ${pokemonId}:`, error);
    return null;
  }
}

// Function to get Pokemon type in Spanish
function getSpanishType(types: any[]): string {
  const typeMap: { [key: string]: string } = {
    'normal': 'Normal',
    'fire': 'Fuego',
    'water': 'Agua',
    'electric': 'Eléctrico',
    'grass': 'Planta',
    'ice': 'Hielo',
    'fighting': 'Lucha',
    'poison': 'Veneno',
    'ground': 'Tierra',
    'flying': 'Volador',
    'psychic': 'Psíquico',
    'bug': 'Bicho',
    'rock': 'Roca',
    'ghost': 'Fantasma',
    'dragon': 'Dragón',
    'dark': 'Siniestro',
    'steel': 'Acero',
    'fairy': 'Hada'
  };
  
  return types.map((type: any) => typeMap[type.type.name] || type.type.name).join('/');
}

// Function to generate diet based on Pokemon type
function generateDiet(types: any[]): string {
  const typeNames = types.map((type: any) => type.type.name);
  
  if (typeNames.includes('grass')) {
    return 'Herbívoro - principalmente plantas y bayas';
  } else if (typeNames.includes('fire')) {
    return 'Omnívoro - bayas y pequeños animales';
  } else if (typeNames.includes('water')) {
    return 'Omnívoro - plantas acuáticas y peces pequeños';
  } else if (typeNames.includes('electric')) {
    return 'Omnívoro - bayas y frutas';
  } else if (typeNames.includes('psychic')) {
    return 'Omnívoro - puede alimentarse de cualquier cosa';
  } else if (typeNames.includes('dragon')) {
    return 'Carnívoro - principalmente peces y pequeños mamíferos';
  } else if (typeNames.includes('flying')) {
    return 'Omnívoro - bayas, frutas y pequeños insectos';
  } else if (typeNames.includes('bug')) {
    return 'Herbívoro - principalmente hojas y savia';
  } else if (typeNames.includes('poison')) {
    return 'Omnívoro - bayas y pequeños animales';
  } else if (typeNames.includes('ground')) {
    return 'Omnívoro - raíces y pequeños animales';
  } else if (typeNames.includes('rock')) {
    return 'Herbívoro - principalmente minerales y plantas';
  } else if (typeNames.includes('ghost')) {
    return 'Omnívoro - puede alimentarse de energía espiritual';
  } else if (typeNames.includes('ice')) {
    return 'Omnívoro - peces y plantas acuáticas';
  } else if (typeNames.includes('steel')) {
    return 'Omnívoro - minerales y bayas';
  } else if (typeNames.includes('fairy')) {
    return 'Herbívoro - principalmente bayas y flores';
  } else if (typeNames.includes('dark')) {
    return 'Omnívoro - bayas y pequeños animales';
  } else if (typeNames.includes('fighting')) {
    return 'Carnívoro - principalmente pequeños animales';
  } else {
    return 'Omnívoro - bayas y pequeños animales';
  }
}

// Function to get region based on Pokemon ID
function getRegion(pokemonId: number): string {
  if (pokemonId <= 151) return 'Kanto';
  if (pokemonId <= 251) return 'Johto';
  if (pokemonId <= 386) return 'Hoenn';
  if (pokemonId <= 493) return 'Sinnoh';
  if (pokemonId <= 649) return 'Unova';
  if (pokemonId <= 721) return 'Kalos';
  if (pokemonId <= 809) return 'Alola';
  if (pokemonId <= 898) return 'Galar';
  return 'Paldea';
}


// Function to create Pokemon from PokeAPI data
async function createPokemonFromAPI(pokemonId: number): Promise<Omit<Pokemon, 'id'> | null> {
  const pokemonData = await fetchPokemonData(pokemonId);
  if (!pokemonData) return null;

  return {
    status: PokemonStatus.AVAILABLE,
    name: pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1),
    imageUrl: pokemonData.sprites.other['official-artwork'].front_default || 
              pokemonData.sprites.front_default,
    type: getSpanishType(pokemonData.types),
    diet: generateDiet(pokemonData.types),
    region: getRegion(pokemonId)
  };
}

// Function to add random Pokemon from different regions
async function addRandomPokemonFromRegions() {
  const regionPokemonIds = {
    'Kanto': [1, 4, 7, 25, 39, 52, 63, 66, 72, 81], // Bulbasaur, Charmander, Squirtle, Pikachu, etc.
    'Johto': [152, 155, 158, 161, 164, 167, 170, 173, 176, 179], // Chikorita, Cyndaquil, etc.
    'Hoenn': [252, 255, 258, 261, 264, 267, 270, 273, 276, 279], // Treecko, Torchic, etc.
    'Sinnoh': [387, 390, 393, 396, 399, 402, 405, 408, 411, 414], // Turtwig, Chimchar, etc.
    'Unova': [495, 498, 501, 504, 507, 510, 513, 516, 519, 522], // Snivy, Tepig, etc.
    'Kalos': [650, 653, 656, 659, 662, 665, 668, 671, 674, 677], // Chespin, Fennekin, etc.
    'Alola': [722, 725, 728, 731, 734, 737, 740, 743, 746, 749], // Rowlet, Litten, etc.
    'Galar': [810, 813, 816, 819, 822, 825, 828, 831, 834, 837], // Grookey, Scorbunny, etc.
    'Paldea': [906, 909, 912, 915, 918, 921, 924, 927, 930, 933] // Sprigatito, Fuecoco, etc.
  };

  const additionalPokemon: Omit<Pokemon, 'id'>[] = [];
  
  // Add 2 random Pokemon from each region
  for (const [region, pokemonIds] of Object.entries(regionPokemonIds)) {
    const randomIds = pokemonIds.sort(() => 0.5 - Math.random()).slice(0, 2);
    
    for (const id of randomIds) {
      const pokemon = await createPokemonFromAPI(id);
      if (pokemon) {
        additionalPokemon.push(pokemon);
      }
    }
  }
  
  return additionalPokemon;
}

export async function seedPokemons() {
  try {
    const batch = db.batch();
    const pokemonsRef = db.collection('pokemons');

    // Add the predefined Pokemon
    console.log('🌍 Seeding predefined Pokemon...');
    let id = 1;

    // Add random Pokemon from different regions
    console.log('🌍 Fetching additional Pokemon from different regions...');
    const additionalPokemon = await addRandomPokemonFromRegions();
    
    additionalPokemon.forEach((pokemon) => {
      const docRef = pokemonsRef.doc(id.toString());
      batch.set(docRef, {
        ...pokemon,
        id: id.toString(),
        createdAt: new Date()
      });
      id++
    });

    await batch.commit();
    console.log(`✅ Pokemon data seeded successfully! Added ${additionalPokemon.length} Pokemon from all regions.`);
  } catch (error) {
    console.error('❌ Error seeding pokemon data:', error);
  }
}

// Ejecutar el seed si este archivo es ejecutado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  seedPokemons().then(() => process.exit(0));
}