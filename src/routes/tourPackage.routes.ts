import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';
import {
  createTourPackage,
  getAllPackages,
  getHostPackages,
  updateTourPackage,
  deletePackage
} from '../controllers/tourPackage.controller';

const router = Router();

// Ruta pública
router.get('/', getAllPackages);

// Rutas para hosts y admin
router.get('/my-packages', authenticate, requireRole('host'), getHostPackages);
router.post('/', authenticate, requireRole('host', 'admin'), createTourPackage);
router.put('/:id', authenticate, requireRole('host', 'admin'), updateTourPackage);
router.delete('/:id', authenticate, requireRole('host', 'admin'), deletePackage);

export default router;

