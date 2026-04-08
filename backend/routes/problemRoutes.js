import express from 'express';
import {
  createProblem,
  getAllProblems,
  getProblemById,
  getProblemBySlug,
  updateProblem,
  deleteProblem,
  getProblemStats,
  getProblemStatsById,
  getRandomProblem
} from '../controllers/problemController.js';
import adminAuth from './adminRoutes.js';

const router = express.Router();

router.post('/', adminAuth, createProblem);
router.get('/', getAllProblems);
router.get('/stats', getProblemStats);
router.get('/stats/:id', getProblemStatsById);
router.get('/random', getRandomProblem);
router.get('/slug/:slug', getProblemBySlug);
router.get('/:id', getProblemById);
router.put('/:id', adminAuth, updateProblem);
router.delete('/:id', adminAuth, deleteProblem);

export default router;
