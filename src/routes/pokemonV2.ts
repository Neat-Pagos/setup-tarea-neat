import { Request, Response, Router } from 'express';
import { z } from 'zod';
import { db } from '../config/firebase.js';
import { getPokemons } from '../helpers/getPokemons.js';
import { Pokemon, PokemonStatus } from '../models/Pokemon.js';

const router = Router();
const POKEMONS_COLLECTION = 'pokemons';

const createPokemonSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  imageUrl: z.string().url('Image URL must be valid').optional(),
  type: z.string().trim().min(1, 'Type is required'),
  diet: z.string().trim().min(1, 'Diet is required'),
  region: z.string().trim().min(1, 'Region is required'),
});

type CreatePokemonInput = z.infer<typeof createPokemonSchema>;

/**
 * Persists a staff-created Pokemon with an available status.
 *
 * @param input - Pokemon data validated from the API request body.
 * @returns The Pokemon record stored in Firestore, including its generated id.
 */
async function createPokemon(input: CreatePokemonInput): Promise<Pokemon> {
  const docRef = db.collection(POKEMONS_COLLECTION).doc();
  const pokemon: Pokemon = {
    id: docRef.id,
    status: PokemonStatus.AVAILABLE,
    ...input,
  };

  await docRef.set({
    ...pokemon,
    createdAt: new Date(),
  });

  return pokemon;
}

// GET /api/pokemon - Listar todos los pokémons
router.get('/', async (_req: Request, res: Response) => {
  try {
    const pokemons = await getPokemons();

    res.json(pokemons);
  } catch (error) {
    console.error('Error fetching pokemons:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/pokemon - Crear un pokemon desde Postman o herramientas internas
router.post('/', async (req: Request<Record<string, never>, unknown, unknown>, res: Response) => {
  try {
    const validation = createPokemonSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        error: 'Invalid pokemon payload',
        details: validation.error.flatten().fieldErrors,
      });
      return;
    }

    const pokemon = await createPokemon(validation.data);

    res.status(201).json(pokemon);
  } catch (error) {
    console.error('Error creating pokemon:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/pokemon/adoptable-pokemons - Listar todos los pokémons adoptables
router.get('/adoptable-pokemons', async (_req: Request, res: Response) => {
  try {
    const pokemons = await getPokemons(PokemonStatus.AVAILABLE);
    res.json(pokemons);
  } catch (error) {
    console.error('Error fetching adoptable pokemons:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
export default router;