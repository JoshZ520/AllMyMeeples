import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './src/db/db.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const schemaPath = path.join(__dirname, 'schema.sql');
const seedPath = path.join(__dirname, 'seed.sql');

async function runSqlFile(filePath) {
  const sql = await fs.readFile(filePath, 'utf8');
  if (!sql.trim()) {
    return;
  }
  await db.raw(sql);
}

async function setup() {
  try {
    console.log('Setting up database...');

    await runSqlFile(schemaPath);

    const result = await db('games').count('* as count').first();
    const count = Number(result?.count || 0);

    if (count === 0) {
      await runSqlFile(seedPath);
      console.log('✓ Games seeded');
    } else {
      console.log(`✓ Database already has ${count} games`);
    }

    console.log('\n✅ Database setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

setup();
