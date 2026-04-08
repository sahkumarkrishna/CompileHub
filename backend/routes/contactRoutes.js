import express from 'express';
import { submitContact, replyToContact, getAllContacts, markAsRead, deleteContact } from '../controllers/contactController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', submitContact);
router.post('/reply', authMiddleware, replyToContact);

router.use(authMiddleware);

router.get('/', getAllContacts);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteContact);

export default router;
