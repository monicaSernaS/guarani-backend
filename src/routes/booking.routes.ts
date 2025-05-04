import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import {
  createBooking,
  getUserBookings,
  cancelBooking
} from '../controllers/booking.controller';

const router = Router();

// Protege todas las rutas
router.use(authenticate);

// Crear nueva reserva (usuario logueado)
router.post('/', createBooking);

// Obtener reservas del usuario autenticado
router.get('/', getUserBookings);

// Cancelar una reserva
router.put('/:id/cancel', cancelBooking);

export default router;
