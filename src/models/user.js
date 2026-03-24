import db from '../db/db.js';
import bcrypt from 'bcryptjs';

const USER_FIELDS = ['email', 'name', 'password', 'role'];

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

export const User = {
  
  async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  },

  async comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  },
  async getById(id) {
    const result = await db.query('SELECT * FROM users WHERE id = $1 LIMIT 1', [id]);
    return result.rows[0] || null;
  },

  async getByEmail(email) {
    const result = await db.query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);
    return result.rows[0] || null;
  },

  async create(userData) {
    const hashedPassword = await this.hashPassword(userData.password);
    const role = userData.role || 'user';

    const result = await db.query(
      'INSERT INTO users (email, name, password, role) VALUES ($1, $2, $3, $4) RETURNING id',
      [userData.email, userData.name, hashedPassword, role]
    );
    const id = result.rows[0]?.id;
    return this.getById(id);
  },

  async listAll() {
    const result = await db.query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
    return result.rows;
  },

  async updateRole(id, role) {
    await db.query('UPDATE users SET role = $1 WHERE id = $2', [role, id]);
    return this.getById(id);
  },

  async update(id, userData) {
    const updates = { ...userData };
    if (updates.password) {
      updates.password = await this.hashPassword(updates.password);
    }

    const { updates: clauses, values } = buildUpdateClause(updates, USER_FIELDS);
    if (clauses.length === 0) {
      return this.getById(id);
    }

    values.push(id);
    const query = `UPDATE users SET ${clauses.join(', ')} WHERE id = $${values.length}`;
    await db.query(query, values);
    return this.getById(id);
  }
};