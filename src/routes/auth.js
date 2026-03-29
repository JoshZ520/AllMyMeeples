import express from 'express';
import { asyncHandler } from '../middleware/auth.js';
import { 
  loginPage, 
  registerPage, 
  profilePage,
  login,
  register,
  logout
} from '../controllers/authController.js';

const router = express.Router();

// Auth page routes
router.get('/login', loginPage);
router.get('/register', registerPage);
router.get('/profile', asyncHandler(profilePage));

// Auth API endpoints
router.post('/login', asyncHandler(login));
router.post('/register', asyncHandler(register));
router.post('/logout', logout);

export default router;
