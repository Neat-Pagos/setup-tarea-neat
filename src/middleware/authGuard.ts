import type { NextFunction, Request, Response } from 'express';
import { admin } from '../config/firebase.js';

export const SESSION_COOKIE_NAME = 'pokemon_session';

const readCookie = (header: string | undefined, name: string): string | undefined => {
  if (!header) return undefined;
  for (const cookie of header.split(';')) {
    const [key, ...value] = cookie.trim().split('=');
    if (key === name) return decodeURIComponent(value.join('='));
  }
  return undefined;
};

export const requireLogin = async (req: Request, res: Response, next: NextFunction) => {
  const sessionCookie = readCookie(req.headers.cookie, SESSION_COOKIE_NAME);
  if (!sessionCookie) {
    res.status(401).json({ error: 'Debes iniciar sesión para continuar' });
    return;
  }

  try {
    res.locals.user = await admin.auth().verifySessionCookie(sessionCookie, true);
    next();
  } catch {
    res.clearCookie(SESSION_COOKIE_NAME, { path: '/' });
    res.status(401).json({ error: 'Tu sesión venció. Inicia sesión nuevamente' });
  }
};
