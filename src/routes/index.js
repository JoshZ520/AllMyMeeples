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
import { 
  adminDashboard, 
  updateUserRole,
  showGames,
  showAddGameForm,
  createGame,
  showEditGameForm,
  updateGame,
  deleteGame
} from '../controllers/adminController.js';
import { requireAuth, requireRole, asyncHandler } from '../middleware/auth.js';
import { submitReview, updateReview, deleteReview, updateReviewStatus } from '../controllers/reviewController.js';
import { Review } from '../models/review.js';
import { Game } from '../models/game.js';

const router = express.Router();

// Home page
router.get('/', home);

// Test error handling (remove in production)
router.get('/test-error', asyncHandler(async (req, res) => {
  throw new Error('This is a test error to verify global error handler is working');
}));

// Browse page
router.get('/browse', (req, res) => {
  res.render('browse', { title: 'Browse Games' });
});

// Game detail page
router.get('/games/:id', asyncHandler(async (req, res) => {
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
}));

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

// Admin dashboard (accessible to admin and moderator)
router.get('/admin', requireAuth, requireRole(['admin', 'moderator']), asyncHandler(adminDashboard));
router.post('/admin/users/:id/role', requireAuth, requireRole('admin'), asyncHandler(updateUserRole));
router.post('/admin/reviews/:reviewId/status', requireAuth, requireRole(['admin', 'moderator']), asyncHandler(updateReviewStatus));

// Admin game management
router.get('/admin/games', requireAuth, requireRole('admin'), asyncHandler(showGames));
router.get('/admin/games/new', requireAuth, requireRole('admin'), showAddGameForm);
router.post('/admin/games', requireAuth, requireRole('admin'), asyncHandler(createGame));
router.get('/admin/games/:id/edit', requireAuth, requireRole('admin'), asyncHandler(showEditGameForm));
router.post('/admin/games/:id', requireAuth, requireRole('admin'), asyncHandler(updateGame));
router.post('/admin/games/:id/delete', requireAuth, requireRole('admin'), asyncHandler(deleteGame));

// Review routes
router.post('/games/:id/reviews', requireAuth, asyncHandler(submitReview));
router.post('/reviews/:reviewId/edit', requireAuth, asyncHandler(updateReview));
router.post('/reviews/:reviewId/delete', requireAuth, asyncHandler(deleteReview));

export default router;
