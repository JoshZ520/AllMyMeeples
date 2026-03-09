import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './db.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const rootDir = path.join(__dirname, '..', '..');
const schemaPath = path.join(rootDir, 'schema.sql');
const seedPath = path.join(rootDir, 'seed.sql');

async function runSqlFile(filePath) {
  const sql = await fs.readFile(filePath, 'utf8');
  if (!sql.trim()) {
    return;
  }
  await db.raw(sql);
}

export async function initDb() {
  await runSqlFile(schemaPath);

  const result = await db('games').count('* as count').first();
  const count = Number(result?.count || 0);

  if (count === 0) {
    await runSqlFile(seedPath);
  }
}
