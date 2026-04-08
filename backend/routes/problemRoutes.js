import express from 'express';
import jwt from 'jsonwebtoken';
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

const adminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No authorization header' });
  }
  
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
  if (!token) return res.status(401).json({ message: 'Unauthorized - no token' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.isAdmin) {
      req.isAdmin = true;
      req.id = decoded.userId;
      next();
    } else {
      res.status(403).json({ message: 'Admin access required' });
    }
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

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
