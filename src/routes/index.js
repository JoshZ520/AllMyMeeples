import express from 'express';
import { home } from '../controllers/homeController.js';
import { 
  getGames, 
  getGameById, 
  addToShelf, 
  removeFromShelf, 
  getUserShelf, 
  checkIfOnShelf 
} from '../controllers/gameController.js';

const router = express.Router();

// Home page
router.get('/', home);

// Game API endpoints
router.get('/api/games', getGames);
router.get('/api/games/:id', getGameById);
router.post('/api/games/:gameId/shelf', addToShelf);
router.delete('/api/games/:gameId/shelf', removeFromShelf);
router.get('/api/shelf', getUserShelf);
router.get('/api/games/:gameId/check', checkIfOnShelf);

// Collection page view
router.get('/collection', (req, res) => {
  res.render('collection', { title: 'My Collection' });
});

export default router;
