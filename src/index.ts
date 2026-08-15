import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pokemonRoutes from './routes/pokemonV2.js';
import adoptionRoutes from './routes/adoptions.js';
import authRoutes from './routes/auth.js';
import { requireLogin, SESSION_COOKIE_NAME } from './middleware/authGuard.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api', requireLogin);
app.get('/api/auth/session', (_req, res) => {
  const user = res.locals.user as { uid: string; email?: string };
  res.json({ uid: user.uid, email: user.email ?? null });
});
app.post('/api/auth/logout', (_req, res) => {
  res.clearCookie(SESSION_COOKIE_NAME, { path: '/' });
  res.status(204).send();
});

app.use('/api/pokemon', pokemonRoutes);
app.use('/api/adoptions', adoptionRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
