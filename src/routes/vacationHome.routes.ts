import { Router } from 'express';
import {
  getAllHomes,
  getHomeById,
  createHome,
  updateHome,
  deleteHome
} from '../controllers/vacationHome.controller';

const router = Router();

router.get('/', getAllHomes);
router.get('/:id', getHomeById);
router.post('/', createHome);
router.put('/:id', updateHome);
router.delete('/:id', deleteHome);

export default router;
