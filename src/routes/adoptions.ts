import { Request, Response, Router } from 'express';
import { db } from '../config/firebase.js';
import { AdoptionStatus, UserData } from '../models/Adoption.js';
import { getPokemons } from '../helpers/getPokemons.js';

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

// POST /api/adoptions/v2 - Crear una nueva solicitud de adopción
router.post('/v2', async (req: Request, res: Response) => {
  try {
    const { pokemonId, userData } = req.body;

    if(!pokemonId || !userData) {
      return res.status(400).json({ error: 'Pokemon ID and user data are required' });
    }

    // Validar información mínima requerida
    const requiredFields: (keyof UserData)[] = ['name', 'email', 'phone', 'region', 'idNumber'];
    const hasMinimumData = requiredFields.every(field => 
      userData && userData[field] && userData[field].trim() !== ''
    );

    if (!hasMinimumData) {
      // Crear adopción rechazada sin notificar al usuario
      const adoptionsRef = db.collection('adoptions');
      const docRef = adoptionsRef.doc();
      await docRef.set({
        id: docRef.id,
        pokemonId,
        userData,
        status: AdoptionStatus.REJECTED,
        createdAt: new Date(),
        updatedAt: new Date(),
        rejectionReason: 'Información mínima requerida incompleta'
      });

      return res.status(200).json({ message: 'Solicitud recibida' });
    }

    // Crear adopción en estado de revisión
    const adoptionsRef = db.collection('adoptions');
    const docRef = adoptionsRef.doc();
    const adoption = await docRef.set({
      id: docRef.id,
      pokemonId,
      userData,
      status: AdoptionStatus.UNDER_REVIEW,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    res.status(201).json({ 
      message: 'Solicitud de adopción creada exitosamente',
      adoptionId: docRef.id 
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
      .where('status', 'in', [AdoptionStatus.UNDER_REVIEW, AdoptionStatus.PENDING])
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
    const { rejectionReason, reviewedBy } = req.body;

    const adoptionRef = db.collection('adoptions').doc(id);
    await adoptionRef.update({
      status: AdoptionStatus.REJECTED,
      rejectionReason,
      reviewedBy,
      reviewedAt: new Date(),
      updatedAt: new Date()
    });

    res.json({ message: 'Adopción rechazada exitosamente' });
  } catch (error) {
    console.error('Error rejecting adoption:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/adoptions/manage/:id/approve - Aprobar una adopción
router.put('/manage/:id/approve', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { approvalDate, reviewedBy } = req.body;

    const adoptionRef = db.collection('adoptions').doc(id);
    await adoptionRef.update({
      status: AdoptionStatus.APPROVED,
      approvalDate: approvalDate || new Date(),
      reviewedBy,
      reviewedAt: new Date(),
      updatedAt: new Date()
    });

    res.json({ message: 'Adopción aprobada exitosamente' });
  } catch (error) {
    console.error('Error approving adoption:', error);
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