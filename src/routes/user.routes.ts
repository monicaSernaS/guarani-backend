import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';
import {
  getAllUsers,
  deleteUser,
  updateUserRole
} from '../controllers/user.controller';

const router = Router();

// Protege cada ruta individualmente (sin router.use)
router.get('/', authenticate, requireRole('admin'), getAllUsers);
router.delete('/:id', authenticate, requireRole('admin'), deleteUser);
router.put('/:id/role', authenticate, requireRole('admin'), updateUserRole);

export default router;


