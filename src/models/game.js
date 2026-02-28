import db from '../db/db.js';

export const Game = {
  async getAll() {
    return db('games').orderBy('title', 'asc');
  },

  async getById(id) {
    return db('games').where('id', id).first();
  },

  async create(gameData) {
    const [id] = await db('games').insert(gameData);
    return this.getById(id);
  },

  async update(id, gameData) {
    await db('games').where('id', id).update(gameData);
    return this.getById(id);
  },

  async delete(id) {
    return db('games').where('id', id).delete();
  }
};

export const Shelf = {
  async addGame(userId, gameId) {
    try {
      const [id] = await db('shelves').insert({
        user_id: userId,
        game_id: gameId
      });
      return { success: true, id };
    } catch (error) {
      if (error.message.includes('unique constraint')) {
        return { success: false, error: 'Game already on shelf' };
      }
      throw error;
    }
  },

  async removeGame(userId, gameId) {
    return db('shelves')
      .where({ user_id: userId, game_id: gameId })
      .delete();
  },

  async getUserGames(userId) {
    return db('shelves')
      .join('games', 'shelves.game_id', 'games.id')
      .where('shelves.user_id', userId)
      .select('games.*', 'shelves.added_at');
  },

  async isGameOnShelf(userId, gameId) {
    const result = await db('shelves')
      .where({ user_id: userId, game_id: gameId })
      .first();
    return !!result;
  }
};
