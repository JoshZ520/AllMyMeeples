import db from '../db/db.js';

export const User = {
  async getById(id) {
    return db('users').where('id', id).first();
  },

  async getByEmail(email) {
    return db('users').where('email', email).first();
  },

  async create(userData) {
    const [id] = await db('users').insert(userData);
    return this.getById(id);
  },

  async update(id, userData) {
    await db('users').where('id', id).update(userData);
    return this.getById(id);
  }
};
