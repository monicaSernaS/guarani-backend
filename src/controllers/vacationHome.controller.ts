import { Request, Response } from 'express';
import VacationHome from '../models/VacationHome';

export const getAllHomes = async (_req: Request, res: Response): Promise<void> => {
  const homes = await VacationHome.find();
  res.json(homes);
};

export const getHomeById = async (req: Request, res: Response): Promise<void> => {
  const home = await VacationHome.findById(req.params.id);
  if (!home) {
    res.status(404).json({ message: '❌ Home not found' });
    return;
  }
  res.json(home);
};

export const createHome = async (req: Request, res: Response): Promise<void> => {
  const newHome = new VacationHome(req.body);
  const saved = await newHome.save();
  res.status(201).json(saved);
};

export const updateHome = async (req: Request, res: Response): Promise<void> => {
  const updated = await VacationHome.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) {
    res.status(404).json({ message: '❌ Home not found' });
    return;
  }
  res.json(updated);
};

export const deleteHome = async (req: Request, res: Response): Promise<void> => {
  const deleted = await VacationHome.findByIdAndDelete(req.params.id);
  if (!deleted) {
    res.status(404).json({ message: ' ❌Home not found' });
    return;
  }
  res.status(204).send();
};
