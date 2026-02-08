import express from 'express';
import {
  signup,
  login,
  logout,
  updateProfile,
  verifyEmail,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import authMiddleware from '../Middleware/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.put('/update-profile', authMiddleware, updateProfile);

export default router;
