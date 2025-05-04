import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';
import {
  getHostDashboard,
  getHostHomes,
  getHostBookings,
  createHostBooking,
  updateHostBooking,
  deleteHostBooking
} from '../controllers/host.controller';

import {
  getHostPackages,
  createTourPackage,
  updateTourPackage,
  deletePackage
} from '../controllers/tourPackage.controller';

const router = Router();

// Proteger todas las rutas del host
router.use(authenticate);
router.use(requireRole('host'));

// Dashboard del host
router.get('/dashboard', getHostDashboard);

// Propiedades del host
router.get('/homes', getHostHomes);

// Paquetes turísticos del host
router.get('/packages', getHostPackages);
router.post('/packages', createTourPackage);
router.put('/packages/:id', updateTourPackage);
router.delete('/packages/:id', deletePackage);

// Reservas en propiedades del host
router.get('/bookings', getHostBookings);
router.post('/bookings', createHostBooking);
router.put('/bookings/:id', updateHostBooking);
router.delete('/bookings/:id', deleteHostBooking);

export default router;
