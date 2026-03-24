import { Review } from '../models/review.js';
import { Game } from '../models/game.js';

const VALID_STATUSES = ['submitted', 'approved', 'rejected'];

export const submitReview = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.redirect('/auth/login');
    }

    const { id } = req.params;
    const { rating, content } = req.body;

    const numericRating = Number(rating);
    if (!numericRating || numericRating < 1 || numericRating > 5 || !content?.trim()) {
      return res.status(400).render('game', {
        title: 'Game Details',
        game: await Game.getById(id),
        reviews: await Review.listApprovedByGame(id),
        userReviews: await Review.listByGameForUser(id, req.session.userId),
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
    } catch (error) {
      if (error.code === '23505') {
        return res.status(400).render('game', {
          title: 'Game Details',
          game: await Game.getById(id),
          reviews: await Review.listApprovedByGame(id),
          userReviews: await Review.listByGameForUser(id, req.session.userId),
          error: 'You already submitted a review for this game.'
        });
      }
      throw error;
    }

    res.redirect(`/games/${id}`);
  } catch (error) {
    console.error('Review submit error:', error);
    res.status(500).render('game', {
      title: 'Game Details',
      game: await Game.getById(req.params.id),
      reviews: await Review.listApprovedByGame(req.params.id),
      userReviews: await Review.listByGameForUser(req.params.id, req.session.userId),
      error: 'Failed to submit review.'
    });
  }
};

export const updateReview = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.redirect('/auth/login');
    }

    const { reviewId } = req.params;
    const { rating, content, gameId } = req.body;
    const numericRating = Number(rating);

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
  } catch (error) {
    console.error('Review update error:', error);
    res.redirect(`/games/${req.body.gameId}`);
  }
};

export const deleteReview = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.redirect('/auth/login');
    }

    const { reviewId } = req.params;
    const { gameId } = req.body;

    await Review.deleteReview({ id: reviewId, userId: req.session.userId });
    res.redirect(`/games/${gameId}`);
  } catch (error) {
    console.error('Review delete error:', error);
    res.redirect(`/games/${req.body.gameId}`);
  }
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
