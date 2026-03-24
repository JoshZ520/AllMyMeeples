import db from '../db/db.js';

export const Review = {
  async create({ userId, gameId, rating, content }) {
    const result = await db.query(
      `INSERT INTO reviews (user_id, game_id, rating, content, status)
       VALUES ($1, $2, $3, $4, 'submitted')
       RETURNING id`,
      [userId, gameId, rating, content]
    );
    return result.rows[0]?.id;
  },

  async listApprovedByGame(gameId) {
    const result = await db.query(
      `SELECT reviews.*, users.name
       FROM reviews
       JOIN users ON reviews.user_id = users.id
       WHERE reviews.game_id = $1 AND reviews.status = 'approved'
       ORDER BY reviews.created_at DESC`,
      [gameId]
    );
    return result.rows;
  },

  async listByGameForUser(gameId, userId) {
    const result = await db.query(
      `SELECT reviews.*
       FROM reviews
       WHERE game_id = $1 AND user_id = $2
       ORDER BY created_at DESC`,
      [gameId, userId]
    );
    return result.rows;
  },

  async listPending() {
    const result = await db.query(
      `SELECT reviews.*, users.name, users.email, games.title AS game_title
       FROM reviews
       JOIN users ON reviews.user_id = users.id
       JOIN games ON reviews.game_id = games.id
       WHERE reviews.status = 'submitted'
       ORDER BY reviews.created_at DESC`
    );
    return result.rows;
  },

  async updateStatus(id, status) {
    await db.query(
      `UPDATE reviews SET status = $1, updated_at = NOW() WHERE id = $2`,
      [status, id]
    );
  },

  async updateReview({ id, userId, rating, content }) {
    const result = await db.query(
      `UPDATE reviews
       SET rating = $1, content = $2, status = 'submitted', updated_at = NOW()
       WHERE id = $3 AND user_id = $4
       RETURNING id`,
      [rating, content, id, userId]
    );
    return result.rows[0]?.id;
  },

  async deleteReview({ id, userId }) {
    const result = await db.query(
      'DELETE FROM reviews WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    return result.rowCount;
  }
};
