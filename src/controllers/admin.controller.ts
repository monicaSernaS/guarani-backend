import { Request, Response } from 'express';
import Booking from '../models/Booking';
import User from '../models/User';

// Obtener todos los usuarios (sin contraseñas)
export const getAllUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error);
    res.status(500).json({ message: '❌ Error al obtener usuarios' });
  }
};

// Crear un nuevo usuario (admin, host o user)
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, password, role, phone, address } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      res.status(400).json({ message: '⚠️ Ya existe un usuario con ese email' });
      return;
    }

    const newUser = new User({ firstName, lastName, email, password, role, phone, address });
    const saved = await newUser.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error('❌ Error al crear usuario:', error);
    res.status(500).json({ message: '❌ Error al crear usuario' });
  }
};

// Actualizar un usuario
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updated = await User.findByIdAndUpdate(id, req.body, { new: true }).select('-password');

    if (!updated) {
      res.status(404).json({ message: '❌ Usuario no encontrado' });
      return;
    }

    res.json(updated);
  } catch (error) {
    console.error('❌ Error al actualizar usuario:', error);
    res.status(500).json({ message: '❌ Error al actualizar usuario' });
  }
};

// Cambiar el rol de un usuario
export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const updated = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
    if (!updated) {
      res.status(404).json({ message: '❌ Usuario no encontrado' });
      return;
    }

    res.json(updated);
  } catch (error) {
    console.error('❌ Error al cambiar rol del usuario:', error);
    res.status(500).json({ message: '❌ Error al cambiar rol' });
  }
};

// Eliminar un usuario
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({ message: '❌ Usuario no encontrado' });
      return;
    }

    res.json({ message: '✅ Usuario eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar usuario:', error);
    res.status(500).json({ message: '❌ Error al eliminar usuario' });
  }
};

// Obtener todas las reservas 
export const getAllBookings = async (_req: Request, res: Response): Promise<void> => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'firstName lastName email')
      .populate('home', 'title');
    res.json(bookings);
  } catch (error) {
    console.error('❌ Error al obtener reservas:', error);
    res.status(500).json({ message: '❌ Error al obtener reservas' });
  }
};

// Crear una reserva como admin
export const createBookingAsAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user, home, checkIn, checkOut, guests } = req.body;
    const booking = new Booking({ user, home, checkIn, checkOut, guests });
    const saved = await booking.save();

    res.status(201).json(saved);
  } catch (error) {
    console.error('❌ Error al crear reserva:', error);
    res.status(500).json({ message: '❌ Error al crear reserva' });
  }
};

// Actualizar una reserva por ID
export const updateBookingAsAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updated = await Booking.findByIdAndUpdate(id, req.body, { new: true });

    if (!updated) {
      res.status(404).json({ message: '❌ Reserva no encontrada' });
      return;
    }

    res.json(updated);
  } catch (error) {
    console.error('❌ Error al actualizar reserva:', error);
    res.status(500).json({ message: '❌ Error al actualizar reserva' });
  }
};

// Eliminar una reserva por ID
export const deleteBookingAsAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await Booking.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({ message: '❌ Reserva no encontrada' });
      return;
    }

    res.json({ message: '✅ Reserva eliminada por el administrador' });
  } catch (error) {
    console.error('❌ Error al eliminar reserva:', error);
    res.status(500).json({ message: '❌ Error al eliminar reserva' });
  }
};
