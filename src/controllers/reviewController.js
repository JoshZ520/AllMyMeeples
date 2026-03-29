import { Review } from '../models/review.js';
import { Game } from '../models/game.js';

const VALID_STATUSES = ['submitted', 'approved', 'rejected'];

export const submitReview = async (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/auth/login');
  }

  const { id } = req.params;
  const { rating, content } = req.body;

  // Validation - expected errors handled here
  const numericRating = Number(rating);
  if (!numericRating || numericRating < 1 || numericRating > 5 || !content?.trim()) {
    const game = await Game.getById(id);
    const reviews = await Review.listApprovedByGame(id);
    const userReviews = await Review.listByGameForUser(id, req.session.userId);
    
    return res.status(400).render('game', {
      title: game?.title || 'Game Details',
      game,
      reviews,
      userReviews,
      error: 'Please provide a rating (1-5) and a review.'
    });
  }

  try {
    await Review.create({
      userId: req.session.userId,
      gameId: id,
      rating: numericRating,
      content: content.trim()
    });
    res.redirect(`/games/${id}`);
  } catch (error) {
    // Handle duplicate review (expected error)
    if (error.code === '23505') {
      const game = await Game.getById(id);
      const reviews = await Review.listApprovedByGame(id);
      const userReviews = await Review.listByGameForUser(id, req.session.userId);
      
      return res.status(400).render('game', {
        title: game?.title || 'Game Details',
        game,
        reviews,
        userReviews,
        error: 'You already submitted a review for this game.'
      });
    }
    // Unexpected errors propagate to global handler
    throw error;
  }
};

export const updateReview = async (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/auth/login');
  }

  const { reviewId } = req.params;
  const { rating, content, gameId } = req.body;
  const numericRating = Number(rating);

  // Validation
  if (!numericRating || numericRating < 1 || numericRating > 5 || !content?.trim()) {
    return res.redirect(`/games/${gameId}`);
  }

  await Review.updateReview({
    id: reviewId,
    userId: req.session.userId,
    rating: numericRating,
    content: content.trim()
  });

  res.redirect(`/games/${gameId}`);
};

export const deleteReview = async (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/auth/login');
  }

  const { reviewId } = req.params;
  const { gameId } = req.body;

  await Review.deleteReview({ id: reviewId, userId: req.session.userId });
  res.redirect(`/games/${gameId}`);
};

export const updateReviewStatus = async (req, res) => {
  const { reviewId } = req.params;
  const { status } = req.body;

  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).redirect('/admin');
  }

  await Review.updateStatus(reviewId, status);
  res.redirect('/admin');
};
