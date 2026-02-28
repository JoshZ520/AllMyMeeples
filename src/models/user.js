import db from '../db/db.js';
import bcrypt from 'bcryptjs';

export const User = {
  
  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  },

  async comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  },
  async getById(id) {
    return db('users').where('id', id).first();
  },

  async getByEmail(email) {
    return db('users').where('email', email).first();
  },

  async create(userData) {
    const hashedPassword = await this.hashPassword(userData.password);

    const userToInsert = {
        email: userData.email,
        name: userData.name,
        password: hashedPassword
    };

    const [id] = await db('users').insert(userToInsert);
    return this.getById(id);
  },

  async update(id, userData) {
    await db('users').where('id', id).update(userData);
    return this.getById(id);
  }
};