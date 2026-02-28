import { Game, Shelf } from '../models/game.js';

// For now, use a demo user ID (will be replaced with actual user auth in Week 7)
const DEMO_USER_ID = 'demo-user';

export const getGames = async (req, res) => {
  try {
    const games = await Game.getAll();
    res.json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
};

export const getGameById = async (req, res) => {
  try {
    const game = await Game.getById(req.params.id);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }
    res.json(game);
  } catch (error) {
    console.error('Error fetching game:', error);
    res.status(500).json({ error: 'Failed to fetch game' });
  }
};

export const addToShelf = async (req, res) => {
  try {
    const { gameId } = req.params;
    const userId = req.user?.id || DEMO_USER_ID;

    // Check if game exists
    const game = await Game.getById(gameId);
    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    // Try to add to shelf
    const result = await Shelf.addGame(userId, gameId);
    
    if (!result.success) {
      return res.status(400).json({ 
        error: result.error,
        message: 'This game is already on your shelf'
      });
    }

    res.json({ 
      success: true, 
      message: 'Game added to shelf',
      game 
    });
  } catch (error) {
    console.error('Error adding to shelf:', error);
    res.status(500).json({ error: 'Failed to add game to shelf' });
  }
};

export const removeFromShelf = async (req, res) => {
  try {
    const { gameId } = req.params;
    const userId = req.user?.id || DEMO_USER_ID;

    const removed = await Shelf.removeGame(userId, gameId);
    
    if (removed === 0) {
      return res.status(404).json({ error: 'Game not found on shelf' });
    }

    res.json({ success: true, message: 'Game removed from shelf' });
  } catch (error) {
    console.error('Error removing from shelf:', error);
    res.status(500).json({ error: 'Failed to remove game from shelf' });
  }
};

export const getUserShelf = async (req, res) => {
  try {
    const userId = req.user?.id || DEMO_USER_ID;
    const games = await Shelf.getUserGames(userId);
    res.json(games);
  } catch (error) {
    console.error('Error fetching shelf:', error);
    res.status(500).json({ error: 'Failed to fetch shelf' });
  }
};

export const checkIfOnShelf = async (req, res) => {
  try {
    const { gameId } = req.params;
    const userId = req.user?.id || DEMO_USER_ID;
    const onShelf = await Shelf.isGameOnShelf(userId, gameId);
    res.json({ onShelf });
  } catch (error) {
    console.error('Error checking shelf:', error);
    res.status(500).json({ error: 'Failed to check shelf' });
  }
};
