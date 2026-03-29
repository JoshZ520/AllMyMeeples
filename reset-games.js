import db from './src/db/db.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const seedPath = path.join(__dirname, 'seed.sql');

async function reset() {
  try {
    console.log('Deleting existing games...');
    await db.query('DELETE FROM games');
    
    console.log('Seeding games from seed.sql...');
    const sql = await fs.readFile(seedPath, 'utf8');
    await db.query(sql);
    
    const result = await db.query('SELECT COUNT(*) FROM games');
    const count = result.rows[0].count;
    
    console.log(`✅ Success! Database now has ${count} games.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Reset failed:', error.message);
    process.exit(1);
  }
}

reset();
