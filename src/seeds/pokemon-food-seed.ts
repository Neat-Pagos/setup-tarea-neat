import { db } from "../config/firebase.js";
import { Food } from "../models/Food.js";
import { PokemonNames } from "../models/Pokemon.js";

const sampleFood: Omit<Food, 'id'>[] = [
  {
    pokemonName: PokemonNames.PIKACHU,
    foodName: "Ramas",
  },
  {
    pokemonName: PokemonNames.BLASTOISE,
    foodName: "Bla",
  },
];

export async function seedPokemons() {
  try {
    const batch = db.batch();
    const foodRef = db.collection("food");

    sampleFood.forEach((food) => {
      const docRef = foodRef.doc();
      batch.set(docRef, {
        ...food,
        id: docRef.id,
        createdAt: new Date(),
      });
    });

    await batch.commit();
    console.log("✅ Pokemon data seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding pokemon data:", error);
  }
}

// Ejecutar el seed si este archivo es ejecutado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  seedPokemons().then(() => process.exit(0));
}
