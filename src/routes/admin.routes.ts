import { Router } from 'express';
import { authenticate } from '../middlewares/authMiddleware';
import { requireRole } from '../middlewares/roleMiddleware';
import {
  getAllUsers,
  createUser,
  updateUser,
  updateUserRole,
  deleteUser,
  getAllBookings,
  createBookingAsAdmin,
  updateBookingAsAdmin,
  deleteBookingAsAdmin
} from '../controllers/admin.controller';
import { getAllHomes, getHomeById, deleteHome } from '../controllers/vacationHome.controller';
import {
  getAllPackages,
  createTourPackage,
  updateTourPackage,
  deletePackage
} from '../controllers/tourPackage.controller';

const router = Router();

// Solo para admins
router.use(authenticate);
router.use(requireRole('admin'));

// Panel de bienvenida
router.get('/admin-panel', (_req, res) => {
  res.json({ message: '👑 Welcome, admin!' });
});

// Gestión de usuarios
router.get('/users', getAllUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Gestión de reservas
router.get('/bookings', getAllBookings);
router.post('/bookings', createBookingAsAdmin);
router.put('/bookings/:id', updateBookingAsAdmin);
router.delete('/bookings/:id', deleteBookingAsAdmin);

// Gestión de propiedades
router.get('/homes', getAllHomes);
router.get('/homes/:id', getHomeById);
router.delete('/homes/:id', deleteHome);

// Gestión de paquetes turísticos
router.get('/packages', getAllPackages);
router.post('/packages', createTourPackage);
router.put('/packages/:id', updateTourPackage);
router.delete('/packages/:id', deletePackage);

export default router;

