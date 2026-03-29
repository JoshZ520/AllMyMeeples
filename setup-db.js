import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './src/db/db.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const schemaPath = path.join(__dirname, 'schema.sql');
const seedPath = path.join(__dirname, 'seed.sql');
const defaultUserSql = `
  INSERT INTO users (email, password, name, role)
  VALUES
    ('admin@allmymeeples.com', '$2b$10$sgiFRZ9sXt9hEonvg0kJYOEBspIU7JGZOiQYDVwalfyK7N1N48cuS', 'Admin User', 'admin'),
    ('moderator@allmymeeples.com', '$2b$10$sgiFRZ9sXt9hEonvg0kJYOEBspIU7JGZOiQYDVwalfyK7N1N48cuS', 'Moderator User', 'moderator'),
    ('user@allmymeeples.com', '$2b$10$sgiFRZ9sXt9hEonvg0kJYOEBspIU7JGZOiQYDVwalfyK7N1N48cuS', 'Standard User', 'user')
  ON CONFLICT (email) DO NOTHING;
`;

async function runSqlFile(filePath) {
  const sql = await fs.readFile(filePath, 'utf8');
  if (!sql.trim()) {
    return;
  }
  await db.query(sql);
}

async function setup() {
  try {
    console.log('Setting up database...');

    await runSqlFile(schemaPath);

    await db.query(defaultUserSql);

    const result = await db.query('SELECT COUNT(*) AS count FROM games');
    const count = Number(result.rows?.[0]?.count || 0);

    if (count === 0) {
      await runSqlFile(seedPath);
      console.log('✓ Games seeded');
    } else {
      console.log(`✓ Database already has ${count} games`);
      console.log('  To re-seed, delete games first with: pnpm run db:reset');
    }

    console.log('\n✅ Database setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

setup();
