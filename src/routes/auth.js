import express from 'express';
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
router.get('/profile', profilePage);

// Auth API endpoints (will be implemented in Week 7)
router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);

export default router;
