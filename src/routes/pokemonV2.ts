import { Request, Response, Router } from 'express';
import { PokemonStatus } from '../models/Pokemon.js';
import { getPokemons } from '../helpers/getPokemons.js';

const router = Router();

// GET /api/pokemon - Listar todos los pokémons
router.get('/', async (req: Request, res: Response) => {
  try {
    const pokemons = await getPokemons();

    res.json(pokemons);
  } catch (error) {
    console.error('Error fetching pokemons:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/pokemon/adoptable-pokemons - Listar todos los pokémons adoptables
router.get('/adoptable-pokemons', async (req: Request, res: Response) => {
  try {
    const pokemons = await getPokemons(PokemonStatus.AVAILABLE);
    res.json(pokemons);
  } catch (error) {
    console.error('Error fetching adoptable pokemons:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
export default router;