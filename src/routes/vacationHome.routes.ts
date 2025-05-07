import { Router } from 'express';
import {
  getAllHomes,
  getHomeById,
  createHome,
  updateHome,
  deleteHome,
} from '../controllers/vacationHome.controller';
import { authenticate } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';
import { uploadImage } from '../controllers/upload.controller';
import { upload } from '../middlewares/uploadMiddleware';

const router = Router();

// Rutas públicas
router.get('/', getAllHomes);
router.get('/:id', getHomeById);

// Rutas protegidas (solo host y admin)
router.post('/', authenticate, requireRole('host', 'admin'), createHome);
router.put('/:id', authenticate, requireRole('host', 'admin'), updateHome);
router.delete('/:id', authenticate, requireRole('host', 'admin'), deleteHome);

// Subida de imagen a propiedad
router.post('/:id/upload-image', authenticate, requireRole('host', 'admin'), upload.single('image'), uploadImage);

export default router;


