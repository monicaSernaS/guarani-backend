import { Router } from 'express';
import {
  createTourPackage,
  getAllPackages,
  getHostPackages,
  updateTourPackage,
  deletePackage,
} from '../controllers/tourPackage.controller';
import { uploadImage } from '../controllers/upload.controller';
import { authenticate } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';
import { upload } from '../middlewares/uploadMiddleware';

const router = Router();

// Ruta pública
router.get('/', getAllPackages);

// Rutas protegidas para host y admin
router.get('/my-packages', authenticate, requireRole('host'), getHostPackages);
router.post('/', authenticate, requireRole('host', 'admin'), createTourPackage);
router.put('/:id', authenticate, requireRole('host', 'admin'), updateTourPackage);
router.delete('/:id', authenticate, requireRole('host', 'admin'), deletePackage);

// Subida de imagen a un paquete turístico
router.post('/:id/upload-image', authenticate, requireRole('host', 'admin'), upload.single('image'), uploadImage);

export default router;

