import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './db.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = path.join(__dirname, '..', '..');
const schemaPath = path.join(rootDir, 'schema.sql');
const seedPath = path.join(rootDir, 'seed.sql');
const defaultUserSql = `
  INSERT INTO users (email, password, name, role)
  VALUES
    ('admin@allmymeeples.com', '$2b$10$X04RA79j3M3dqxYTgjCAgeBq.EIrddBImViC0S2XpNr2SCPqiF8nK', 'Admin User', 'admin'),
    ('moderator@allmymeeples.com', '$2b$10$X04RA79j3M3dqxYTgjCAgeBq.EIrddBImViC0S2XpNr2SCPqiF8nK', 'Moderator User', 'moderator'),
    ('user@allmymeeples.com', '$2b$10$X04RA79j3M3dqxYTgjCAgeBq.EIrddBImViC0S2XpNr2SCPqiF8nK', 'Standard User', 'user')
  ON CONFLICT (email) DO NOTHING;
`;

async function runSqlFile(filePath) {
  const sql = await fs.readFile(filePath, 'utf8');
  if (!sql.trim()) {
    return;
  }
  await db.query(sql);
}

export async function initDb() {
  await runSqlFile(schemaPath);

  await db.query(defaultUserSql);

  const result = await db.query('SELECT COUNT(*) AS count FROM games');
  const count = Number(result.rows?.[0]?.count || 0);

  if (count === 0) {
    await runSqlFile(seedPath);
  }
}
