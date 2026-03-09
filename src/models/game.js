import db from '../db/db.js';

const GAME_FIELDS = [
  'title',
  'description',
  'image_url',
  'min_players',
  'max_players',
  'playtime_minutes',
  'rating'
];

function buildUpdateClause(data, fields) {
  const updates = [];
  const values = [];
  let index = 1;

  fields.forEach((field) => {
    if (data[field] !== undefined) {
      updates.push(`${field} = $${index}`);
      values.push(data[field]);
      index += 1;
    }
  });

  return { updates, values };
}

export const Game = {
  async getAll() {
    const result = await db.query('SELECT * FROM games ORDER BY title ASC');
    return result.rows;
  },

  async getById(id) {
    const result = await db.query('SELECT * FROM games WHERE id = $1 LIMIT 1', [id]);
    return result.rows[0] || null;
  },

  async create(gameData) {
    const values = GAME_FIELDS.map((field) => gameData[field] ?? null);
    const placeholders = GAME_FIELDS.map((_, index) => `$${index + 1}`).join(', ');
    const result = await db.query(
      `INSERT INTO games (${GAME_FIELDS.join(', ')}) VALUES (${placeholders}) RETURNING id`,
      values
    );
    const id = result.rows[0]?.id;
    return this.getById(id);
  },

  async update(id, gameData) {
    const { updates, values } = buildUpdateClause(gameData, GAME_FIELDS);
    if (updates.length === 0) {
      return this.getById(id);
    }

    values.push(id);
    const query = `UPDATE games SET ${updates.join(', ')} WHERE id = $${values.length}`;
    await db.query(query, values);
    return this.getById(id);
  },

  async delete(id) {
    const result = await db.query('DELETE FROM games WHERE id = $1', [id]);
    return result.rowCount;
  }
};

export const Shelf = {
  async addGame(userId, gameId) {
    try {
      const result = await db.query(
        'INSERT INTO shelves (user_id, game_id) VALUES ($1, $2) RETURNING id',
        [userId, gameId]
      );
      return { success: true, id: result.rows[0]?.id };
    } catch (error) {
      if (error.code === '23505') {
        return { success: false, error: 'Game already on shelf' };
      }
      throw error;
    }
  },

  async removeGame(userId, gameId) {
    const result = await db.query(
      'DELETE FROM shelves WHERE user_id = $1 AND game_id = $2',
      [userId, gameId]
    );
    return result.rowCount;
  },

  async getUserGames(userId) {
    const result = await db.query(
      `SELECT games.*, shelves.added_at
       FROM shelves
       JOIN games ON shelves.game_id = games.id
       WHERE shelves.user_id = $1`,
      [userId]
    );
    return result.rows;
  },

  async isGameOnShelf(userId, gameId) {
    const result = await db.query(
      'SELECT 1 FROM shelves WHERE user_id = $1 AND game_id = $2 LIMIT 1',
      [userId, gameId]
    );
    return result.rowCount > 0;
  }
};
