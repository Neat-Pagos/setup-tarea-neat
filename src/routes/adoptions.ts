import { Request, Response, Router } from 'express';
import { db } from '../config/firebase.js';

const router = Router();

// POST /api/adoptions - Crear una nueva adopción
router.post('/', async (req: Request, res: Response) => {
  try {
    const adoptionsRef = db.collection('adoptions');
    const docRef = adoptionsRef.doc();
    const adoption = await docRef.set({
      ...req.body,
      id: docRef.id,
      createdAt: new Date()
    });

    res.json(adoption);
  } catch (error) {
    console.error('Error creating adoption:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;