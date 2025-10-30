import { Request, Response, Router } from 'express';
import { PokemonStatus } from '../models/Pokemon.js';
import { db } from '../config/firebase.js';

const router = Router();

// GET /api/pokemon - Listar todos los pokémons
router.get('/', async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection("pokemons").get();
    const pokemons = snapshot.docs.map((doc) => doc.data());
    
    res.json(pokemons);
  } catch (error) {
    console.error('Error fetching pokemons:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/pokemon/adoptable-pokemons - Listar todos los pokémons adoptables
router.get('/adoptable-pokemons', async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection("pokemons").where("status", "==", PokemonStatus.AVAILABLE).get();
    const pokemons = snapshot.docs.map((doc) => doc.data());
    res.status(200).json(pokemons);
  } catch (error) {
    console.error('Error fetching adoptable pokemons:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
export default router;