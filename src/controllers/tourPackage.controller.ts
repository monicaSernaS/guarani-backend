import { Response } from 'express';
import { AuthRequest } from '../types/express';
import TourPackage from '../models/TourPackage';
import VacationHome from '../models/VacationHome';

// Crear paquete turístico
export const createTourPackage = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, price, property } = req.body;
    const createdBy = req.user?.id;

    if (!createdBy) {
      res.status(401).json({ message: '🚫 Usuario no autenticado' });
      return;
    }

    const pkg = new TourPackage({
      title,
      description,
      price,
      property: property || null,
      createdBy,
    });

    const saved = await pkg.save();

    if (property) {
      await VacationHome.findByIdAndUpdate(property, {
        $push: { tourPackages: saved._id },
      });
    }

    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: '❌ Error al crear paquete turístico' });
  }
};

// Obtener todos los paquetes (público)
export const getAllPackages = async (_req: AuthRequest, res: Response) => {
  try {
    const packages = await TourPackage.find().populate('property', 'title');
    res.json(packages);
  } catch {
    res.status(500).json({ message: '❌ Error al obtener paquetes' });
  }
};

// Obtener paquetes creados por el host autenticado
export const getHostPackages = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const packages = await TourPackage.find({ createdBy: userId }).populate('property', 'title');
    res.json(packages);
  } catch {
    res.status(500).json({ message: '❌ Error al obtener paquetes del host' });
  }
};

// Editar paquete (solo admin o creador)
export const updateTourPackage = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const pkg = await TourPackage.findById(id);
    if (!pkg) {
      res.status(404).json({ message: 'Paquete no encontrado' });
      return;
    }

    if (userRole !== 'admin' && pkg.createdBy.toString() !== userId) {
      res.status(403).json({ message: '⛔ No autorizado para modificar este paquete' });
      return;
    }

    const updated = await TourPackage.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch {
    res.status(500).json({ message: '❌ Error al actualizar paquete turístico' });
  }
};

// Eliminar paquete (solo admin o creador)
export const deletePackage = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    const pkg = await TourPackage.findById(id);
    if (!pkg) {
      res.status(404).json({ message: 'Paquete no encontrado' });
      return;
    }

    if (userRole !== 'admin' && pkg.createdBy.toString() !== userId) {
      res.status(403).json({ message: '⛔ No autorizado para eliminar este paquete' });
      return;
    }

    await pkg.deleteOne();

    if (pkg.property) {
      await VacationHome.findByIdAndUpdate(pkg.property, {
        $pull: { tourPackages: pkg._id },
      });
    }

    res.json({ message: '✅ Paquete eliminado' });
  } catch {
    res.status(500).json({ message: '❌ Error al eliminar paquete' });
  }
};
