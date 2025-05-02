import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';

const router = Router();

// Ruta protegida solo para admins
router.get(
  '/admin-panel',
  authenticate,        // Verifica que el usuario esté autenticado (tiene token)
  requireRole('admin'), // Verifica que tenga rol "admin"
  (_req, res) => {
    res.json({ message: '👑 Welcome, admin!' });
  }
);

export default router;
