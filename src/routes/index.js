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
import { adminDashboard, updateUserRole } from '../controllers/adminController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { submitReview, updateReview, deleteReview, updateReviewStatus } from '../controllers/reviewController.js';
import { Review } from '../models/review.js';
import { Game } from '../models/game.js';

const router = express.Router();

// Home page
router.get('/', home);

// Browse page
router.get('/browse', (req, res) => {
  res.render('browse', { title: 'Browse Games' });
});

// Game detail page
router.get('/games/:id', async (req, res) => {
  const game = await Game.getById(req.params.id);
  if (!game) {
    return res.status(404).render('index', { title: 'Not Found', message: 'Game not found.' });
  }

  const reviews = await Review.listApprovedByGame(req.params.id);
  const userReviews = req.session.userId
    ? await Review.listByGameForUser(req.params.id, req.session.userId)
    : [];

  res.render('game', {
    title: game.title,
    game,
    reviews,
    userReviews,
    user: req.session.user
  });
});

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

// Admin dashboard
router.get('/admin', requireAuth, requireRole('admin'), adminDashboard);
router.post('/admin/users/:id/role', requireAuth, requireRole('admin'), updateUserRole);
router.post('/admin/reviews/:reviewId/status', requireAuth, requireRole('admin'), updateReviewStatus);

// Review routes
router.post('/games/:id/reviews', requireAuth, submitReview);
router.post('/reviews/:reviewId/edit', requireAuth, updateReview);
router.post('/reviews/:reviewId/delete', requireAuth, deleteReview);

export default router;
