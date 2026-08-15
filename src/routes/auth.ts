import { Router } from 'express';
import { z } from 'zod';
import { admin } from '../config/firebase.js';
import { SESSION_COOKIE_NAME } from '../middleware/authGuard.js';

const router = Router();
const SESSION_DURATION_MS = 5 * 24 * 60 * 60 * 1000;
const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

router.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Ingresa un correo válido y tu contraseña' });
    return;
  }

  const apiKey = process.env.FIREBASE_WEB_API_KEY;
  if (!apiKey) {
    console.error('FIREBASE_WEB_API_KEY is not configured');
    res.status(500).json({ error: 'El inicio de sesión no está configurado' });
    return;
  }

  try {
    const firebaseResponse = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...parsed.data, returnSecureToken: true }),
      },
    );

    if (!firebaseResponse.ok) {
      res.status(401).json({ error: 'El correo o la contraseña no son correctos' });
      return;
    }

    const { idToken } = await firebaseResponse.json() as { idToken: string };
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn: SESSION_DURATION_MS });
    res.cookie(SESSION_COOKIE_NAME, sessionCookie, {
      maxAge: SESSION_DURATION_MS,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    res.status(204).send();
  } catch (error) {
    console.error('Unable to create Firebase session', error);
    res.status(503).json({ error: 'No pudimos iniciar sesión. Intenta nuevamente' });
  }
});

export default router;
