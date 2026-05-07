import express from 'express';
import { body } from 'express-validator';
import { signup, login, getProfile } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', [
  body('email').isEmail().normalizeEmail(),
  body('username').isLength({ min: 3, max: 100 }).trim().escape(),
  body('password').isLength({ min: 6 }),
  body('firstName').trim().escape().optional(),
  body('lastName').trim().escape().optional()
], signup);

router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 })
], login);

router.get('/profile', authenticateToken, getProfile);

export default router;
