import express from 'express';
import { getUserStats, recordProblemAttempt } from '../controllers/userController.js';
import authMiddleware from '../Middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', authMiddleware, getUserStats);
router.post('/problem-attempt', authMiddleware, recordProblemAttempt);

export default router;
