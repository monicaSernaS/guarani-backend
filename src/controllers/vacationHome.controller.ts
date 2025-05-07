import { Request, Response } from 'express';
import VacationHome from '../models/VacationHome';
import { AuthRequest } from '../types/express';

// Obtener todas las propiedades
export const getAllHomes = async (_req: Request, res: Response): Promise<void> => {
  try {
    const homes = await VacationHome.find().populate('tourPackages');
    res.json(homes);
  } catch (error) {
    res.status(500).json({ message: '❌ Error al obtener propiedades' });
  }
};

// Obtener propiedad por ID
export const getHomeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const home = await VacationHome.findById(req.params.id).populate('tourPackages');
    if (!home) {
      res.status(404).json({ message: '❌ Home not found' });
      return;
    }
    res.json(home);
  } catch (error) {
    res.status(500).json({ message: '❌ Error al obtener propiedad' });
  }
};

// Crear nueva propiedad
export const createHome = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const ownerId = req.user?.id;
    const newHome = new VacationHome({ ...req.body, owner: ownerId });
    const saved = await newHome.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: '❌ Error al crear propiedad' });
  }
};

// Actualizar propiedad
export const updateHome = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const isAdmin = req.user?.role === 'admin';

    const home = await VacationHome.findById(req.params.id);
    if (!home) {
      res.status(404).json({ message: '❌ Home not found' });
      return;
    }

    if (!isAdmin && home.owner.toString() !== userId) {
      res.status(403).json({ message: '⛔ No autorizado para modificar esta propiedad' });
      return;
    }

    const updated = await VacationHome.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: '❌ Error al actualizar propiedad' });
  }
};

// Eliminar propiedad
export const deleteHome = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const isAdmin = req.user?.role === 'admin';

    const home = await VacationHome.findById(req.params.id);
    if (!home) {
      res.status(404).json({ message: '❌ Home not found' });
      return;
    }

    if (!isAdmin && home.owner.toString() !== userId) {
      res.status(403).json({ message: '⛔ No autorizado para eliminar esta propiedad' });
      return;
    }

    await home.deleteOne();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: '❌ Error al eliminar propiedad' });
  }
};

// Subida de imagen a una propiedad
export const uploadVacationHomeImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!req.file) {
      res.status(400).json({ message: '❌ No se ha subido ninguna imagen' });
      return;
    }

    const imageUrl = (req.file as any).path;

    const home = await VacationHome.findById(id);
    if (!home) {
      res.status(404).json({ message: '❌ Propiedad no encontrada' });
      return;
    }

    // Asegurarse de que home.images sea un arreglo
    if (!Array.isArray(home.images)) {
      home.images = [];
    }

    // Agregar la nueva imagen al arreglo de imágenes
    home.images.push(imageUrl);
    await home.save();

    res.status(200).json({ message: '✅ Imagen subida correctamente', images: home.images });
  } catch (error) {
    res.status(500).json({ message: '❌ Error al subir imagen' });
  }
};
