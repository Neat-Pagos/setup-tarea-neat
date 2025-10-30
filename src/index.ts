import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pokemonRoutes from './routes/pokemonV2.js';
import adoptionRoutes from './routes/adoptions.js';
import { setupPokemonListener } from './listeners/pokemonListener.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/pokemon', pokemonRoutes);
app.use('/api/adoptions', adoptionRoutes);

// Configurar listener de Firebase
setupPokemonListener();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});