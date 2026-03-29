import { User } from '../models/user.js';
import { Review } from '../models/review.js';
import { Game } from '../models/game.js';

const VALID_ROLES = ['admin', 'moderator', 'user'];

export const adminDashboard = async (req, res) => {
  const users = await User.listAll();
  const pendingReviews = await Review.listPending();
  res.render('admin/index', {
    title: 'Admin Dashboard',
    users,
    pendingReviews
  });
};

export const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!VALID_ROLES.includes(role)) {
    return res.status(400).render('admin/index', {
      title: 'Admin Dashboard',
      users: await User.listAll(),
      error: 'Invalid role selected.'
    });
  }

  await User.updateRole(id, role);
  res.redirect('/admin');
};

// ===== GAME CRUD =====
export const showGames = async (req, res) => {
  const games = await Game.getAll();
  res.render('admin/games', {
    title: 'Manage Games',
    games
  });
};

export const showAddGameForm = (req, res) => {
  res.render('admin/game-form', {
    title: 'Add New Game',
    game: null,
    action: '/admin/games'
  });
};

export const createGame = async (req, res) => {
  const { title, description, image_url, min_players, max_players, playtime_minutes, rating, categories, mechanics } = req.body;

  // Validation
  if (!title || !description || !min_players || !max_players || !playtime_minutes) {
    return res.status(400).render('admin/game-form', {
      title: 'Add New Game',
      game: req.body,
      action: '/admin/games',
      error: 'Title, description, min players, max players, and playtime are required.'
    });
  }

  // Parse arrays from form input (comma-separated strings)
  const categoriesArray = categories ? categories.split(',').map(c => c.trim()).filter(c => c) : [];
  const mechanicsArray = mechanics ? mechanics.split(',').map(m => m.trim()).filter(m => m) : [];

  const gameData = {
    title,
    description,
    image_url: image_url || '',
    min_players: Number(min_players),
    max_players: Number(max_players),
    playtime_minutes: Number(playtime_minutes),
    rating: rating ? Number(rating) : null,
    categories: categoriesArray,
    mechanics: mechanicsArray
  };

  await Game.create(gameData);
  res.redirect('/admin/games');
};

export const showEditGameForm = async (req, res) => {
  const { id } = req.params;
  const game = await Game.getById(id);

  if (!game) {
    return res.status(404).send('Game not found');
  }

  // Convert arrays to comma-separated strings for form display
  game.categoriesString = game.categories ? game.categories.join(', ') : '';
  game.mechanicsString = game.mechanics ? game.mechanics.join(', ') : '';

  res.render('admin/game-form', {
    title: 'Edit Game',
    game,
    action: `/admin/games/${id}`
  });
};

export const updateGame = async (req, res) => {
  const { id } = req.params;
  const { title, description, image_url, min_players, max_players, playtime_minutes, rating, categories, mechanics } = req.body;

  // Validation
  if (!title || !description || !min_players || !max_players || !playtime_minutes) {
    const game = await Game.getById(id);
    return res.status(400).render('admin/game-form', {
      title: 'Edit Game',
      game: { ...game, ...req.body },
      action: `/admin/games/${id}`,
      error: 'Title, description, min players, max players, and playtime are required.'
    });
  }

  // Parse arrays from form input
  const categoriesArray = categories ? categories.split(',').map(c => c.trim()).filter(c => c) : [];
  const mechanicsArray = mechanics ? mechanics.split(',').map(m => m.trim()).filter(m => m) : [];

  const gameData = {
    title,
    description,
    image_url: image_url || '',
    min_players: Number(min_players),
    max_players: Number(max_players),
    playtime_minutes: Number(playtime_minutes),
    rating: rating ? Number(rating) : null,
    categories: categoriesArray,
    mechanics: mechanicsArray
  };

  await Game.update(id, gameData);
  res.redirect('/admin/games');
};

export const deleteGame = async (req, res) => {
  const { id } = req.params;
  await Game.delete(id);
  res.redirect('/admin/games');
};
