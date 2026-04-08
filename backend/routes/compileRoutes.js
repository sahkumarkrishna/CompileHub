import express from 'express';
import { compileCode, getUserStats, getUserSnippets, saveSnippet, getSavedSnippets, getUserSubmissions } from '../controllers/compileController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/compile', compileCode);
router.get('/stats', authMiddleware, getUserStats);
router.get('/snippets', authMiddleware, getUserSnippets);
router.post('/compile/save', authMiddleware, saveSnippet);
router.get('/compile/saved', authMiddleware, getSavedSnippets);
router.get('/submissions', authMiddleware, getUserSubmissions);

export default router;
