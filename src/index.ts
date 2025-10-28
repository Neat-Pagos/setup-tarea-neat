import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pokemonRoutes from './routes/pokemon.js';
import { setupPokemonListener } from './listeners/pokemonListener.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/pokemon', pokemonRoutes);

// Configurar listener de Firebase
setupPokemonListener();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});