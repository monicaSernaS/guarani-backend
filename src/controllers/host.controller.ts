import { Response } from 'express';
import { AuthRequest } from '../types/express';
import VacationHome from '../models/VacationHome';
import Booking from '../models/Booking';
import TourPackage from 'src/models/TourPackage';

// Dashboard del host
export const getHostDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    const homes = await VacationHome.find({ owner: userId });
    const packages = await TourPackage.find({ createdBy: userId }).populate('property', 'title');
    const homeIds = homes.map(h => h._id);

    const bookings = await Booking.find({ home: { $in: homeIds } })
      .populate('user', 'firstName lastName email')
      .populate('home', 'title');

    res.json({ homes, packages, bookings });
  } catch (error) {
    console.error('❌ Error al cargar dashboard del host:', error);
    res.status(500).json({ message: '❌ Error al cargar dashboard del anfitrión' });
  }
};

// Obtener las propiedades del anfitrión autenticado
export const getHostHomes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: '🚫 Usuario no autenticado' });
      return;
    }

    const homes = await VacationHome.find({ owner: userId });
    res.json(homes);
  } catch (error) {
    console.error('❌ Error al obtener propiedades del host:', error);
    res.status(500).json({ message: '❌ Error al obtener propiedades del anfitrión' });
  }
};

//Obtener reservas asociadas a propiedades del anfitrión
 
export const getHostBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    const homes = await VacationHome.find({ owner: userId });
    const homeIds = homes.map(home => home._id);

    const bookings = await Booking.find({ home: { $in: homeIds } })
      .populate('user', 'firstName lastName email')
      .populate('home', 'title');

    res.json(bookings);
  } catch (error) {
    console.error('❌ Error al obtener reservas del host:', error);
    res.status(500).json({ message: '❌ Error al obtener reservas del anfitrión' });
  }
};

//Crear una reserva en una propiedad del host
export const createHostBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { user, home, checkIn, checkOut, guests } = req.body;

    const homeDoc = await VacationHome.findById(home);
    if (!homeDoc || homeDoc.owner.toString() !== userId) {
      res.status(403).json({ message: '⛔ No autorizado para esa propiedad' });
      return;
    }

    const booking = new Booking({ user, home, checkIn, checkOut, guests });
    const saved = await booking.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error('❌ Error al crear reserva del host:', error);
    res.status(500).json({ message: '❌ Error al crear reserva' });
  }
};

//Actualizar una reserva del host
export const updateHostBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const booking = await Booking.findById(id).populate('home');
    if (!booking || (booking.home as any).owner.toString() !== userId) {
      res.status(403).json({ message: '⛔ No autorizado para editar esa reserva' });
      return;
    }

    Object.assign(booking, req.body);
    const updated = await booking.save();
    res.json(updated);
  } catch (error) {
    console.error('❌ Error al actualizar reserva del host:', error);
    res.status(500).json({ message: '❌ Error al actualizar reserva' });
  }
};

//Eliminar una reserva del host
 
export const deleteHostBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const booking = await Booking.findById(id).populate('home');
    if (!booking || (booking.home as any).owner.toString() !== userId) {
      res.status(403).json({ message: '⛔ No autorizado para eliminar esa reserva' });
      return;
    }

    await booking.deleteOne();
    res.json({ message: '✅ Reserva eliminada' });
  } catch (error) {
    console.error('❌ Error al eliminar reserva del host:', error);
    res.status(500).json({ message: '❌ Error al eliminar reserva' });
  }
};
