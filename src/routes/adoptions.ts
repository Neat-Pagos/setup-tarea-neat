import { Request, Response, Router } from 'express';
import { db } from '../config/firebase.js';
import { AdoptionStatus, UserData } from '../models/Adoption.js';
import { getPokemons } from '../helpers/getPokemons.js';
import { createAdoptionRequest } from '../helpers/createAdoptionRequest.js';
import { approveAdoption, rejectAdoption } from '../services/adoptionService.js';
import { InvalidStatusTransitionError, ResourceNotFoundError } from '../services/serviceErrors.js';

const router = Router();

// POST /api/adoptions/v2 - Crear una nueva solicitud de adopción
router.post('/v2', async (req: Request, res: Response) => {
  try {
    const { pokemonId, userData } = req.body;

    if(!pokemonId || !userData) {
      return res.status(400).json({ error: 'Pokemon ID and user data are required' });
    }

    const result = await createAdoptionRequest(pokemonId, userData as UserData);

    if (!result.success && result.reason === 'incomplete_user_data') {
      return res.status(422).json({ message: 'Información mínima requerida incompleta' });
    }

    if (!result.success && result.reason === 'pokemon_not_found') {
      return res.status(404).json({ message: 'Pokémon no encontrado' });
    }

    if (!result.success) {
      return res.status(409).json({ message: 'El Pokémon no está disponible' });
    }

    res.status(201).json({ 
      message: 'Solicitud de adopción creada exitosamente',
      adoptionId: result.adoptionId
    });
  } catch (error) {
    console.error('Error creating adoption request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/adoptions/adoptable-pokemons - Listar pokémons adoptables (sin filtros)
router.get('/adoptable-pokemons', async (_req: Request, res: Response) => {
  try {
    const pokemons = await getPokemons(); // Sin parámetros para no filtrar
    res.json(pokemons);
  } catch (error) {
    console.error('Error fetching adoptable pokemons:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/adoptions/review - Obtener adopciones para revisión del staff
router.get('/review', async (_req: Request, res: Response) => {
  try {
    const adoptionsRef = db.collection('adoptions');
    const snapshot = await adoptionsRef
      .orderBy('createdAt', 'desc')
      .get();

    const adoptions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(adoptions);
  } catch (error) {
    console.error('Error fetching adoptions for review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/adoptions/manage/:id/reject - Rechazar una adopción
router.put('/manage/:id/reject', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rejectionReason } = req.body;

    await rejectAdoption(id, rejectionReason);

    res.json({ message: 'Adopción rechazada exitosamente' });
  } catch (error) {
    console.error('Error rejecting adoption:', error);
    if (error instanceof ResourceNotFoundError) {
      return res.status(404).json({ error: error.message });
    }
    if (error instanceof InvalidStatusTransitionError) {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/adoptions/manage/:id/approve - Aprobar una adopción
router.put('/manage/:id/approve', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { approvalDate } = req.body;

    await approveAdoption(id, approvalDate ? new Date(approvalDate) : undefined);

    res.json({ message: 'Adopción aprobada exitosamente' });
  } catch (error) {
    console.error('Error approving adoption:', error);
    if (error instanceof ResourceNotFoundError) {
      return res.status(404).json({ error: error.message });
    }
    if (error instanceof InvalidStatusTransitionError) {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/adoptions/delivery/:id/comment - Agregar comentario de entrega
router.put('/delivery/:id/comment', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { deliveryComment } = req.body;

    const adoptionRef = db.collection('adoptions').doc(id);
    await adoptionRef.update({
      deliveryComment,
      status: AdoptionStatus.DELIVERY_FAILED,
      updatedAt: new Date()
    });

    res.json({ message: 'Comentario de entrega agregado exitosamente' });
  } catch (error) {
    console.error('Error adding delivery comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/adoptions/delivery/:id/security-concern - Marcar preocupación de seguridad
router.put('/delivery/:id/security-concern', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { securityComment } = req.body;

    const adoptionRef = db.collection('adoptions').doc(id);
    await adoptionRef.update({
      securityConcern: true,
      securityComment,
      status: AdoptionStatus.SECURITY_CONCERN,
      updatedAt: new Date()
    });

    res.json({ message: 'Preocupación de seguridad marcada exitosamente' });
  } catch (error) {
    console.error('Error marking security concern:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/adoptions/delivery/:id/delivered - Marcar como entregado
router.put('/delivery/:id/delivered', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const adoptionRef = db.collection('adoptions').doc(id);
    await adoptionRef.update({
      status: AdoptionStatus.DELIVERED,
      updatedAt: new Date()
    });

    res.json({ message: 'Adopción marcada como entregada exitosamente' });
  } catch (error) {
    console.error('Error marking as delivered:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
