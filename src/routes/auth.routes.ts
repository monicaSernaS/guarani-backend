import { Router } from 'express';
import { register, login, createAdmin } from '../controllers/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);

// Ruta protegida por header secreto
router.post('/create-admin', createAdmin);

export default router;

