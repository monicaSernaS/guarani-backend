import { Request, Response } from 'express';
import User from '../models/User';

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: '🚫 Error al obtener usuarios' });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    res.json({ message: '✅ Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ message: '❌ Error al eliminar usuario' });
  }
};

export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const updated = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password');

    if (!updated) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: '❌ Error al actualizar rol' });
  }
};