import { Response } from 'express';
import { AuthRequest } from '../types/express';
import Booking from '../models/Booking';

export const createBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { home, checkIn, checkOut, guests } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: '🚫 Usuario no autenticado' });
      return;
    }

    const booking = new Booking({
      user: userId,
      home,
      checkIn,
      checkOut,
      guests
    });

    const saved = await booking.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('❌ Error al crear reserva:', err);
    res.status(500).json({ message: '❌ Error al crear reserva' });
  }
};

export const getUserBookings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    const bookings = await Booking.find({ user: userId }).populate('home', 'title city address pricePerNight');
    res.json(bookings);
  } catch (err) {
    console.error('❌ Error al obtener reservas:', err);
    res.status(500).json({ message: '❌ Error al obtener reservas' });
  }
};

export const cancelBooking = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const booking = await Booking.findById(id);
    if (!booking) {
      res.status(404).json({ message: '❌ Reserva no encontrada' });
      return;
    }

    if (booking.user.toString() !== userId) {
      res.status(403).json({ message: '⛔ No autorizado para cancelar esta reserva' });
      return;
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: '✅ Reserva cancelada correctamente' });
  } catch (err) {
    console.error('❌ Error al cancelar reserva:', err);
    res.status(500).json({ message: '❌ Error al cancelar reserva' });
  }
};
