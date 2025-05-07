import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import { upload } from '../middlewares/uploadMiddleware';
import { uploadImage } from '../controllers/upload.controller';

const router = Router();

// Subida de imagen genérica (no asociada a un modelo directamente)
router.post('/', authenticate, upload.single('image'), uploadImage);

export default router;

