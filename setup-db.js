import knex from 'knex';
import config from './knexfile.js';

const db = knex(config.development);

async function setup() {
  try {
    console.log('Setting up database...');

    // Create games table
    const hasGames = await db.schema.hasTable('games');
    if (!hasGames) {
      console.log('Creating games table...');
      await db.schema.createTable('games', (table) => {
        table.increments('id').primary();
        table.string('title').notNullable();
        table.text('description');
        table.string('image_url');
        table.integer('min_players');
        table.integer('max_players');
        table.integer('playtime_minutes');
        table.decimal('rating', 3, 2);
        table.timestamp('created_at').defaultTo(db.fn.now());
        table.timestamp('updated_at').defaultTo(db.fn.now());
      });
      console.log('✓ Games table created');
    } else {
      console.log('✓ Games table already exists');
    }

    // Create shelves table
    const hasShelves = await db.schema.hasTable('shelves');
    if (!hasShelves) {
      console.log('Creating shelves table...');
      await db.schema.createTable('shelves', (table) => {
        table.increments('id').primary();
        table.string('user_id').notNullable();
        table.integer('game_id').unsigned().notNullable();
        table.foreign('game_id').references('games.id').onDelete('CASCADE');
        table.timestamp('added_at').defaultTo(db.fn.now());
        table.unique(['user_id', 'game_id']);
      });
      console.log('✓ Shelves table created');
    } else {
      console.log('✓ Shelves table already exists');
    }

    // Seed games if table is empty
    const gameCount = await db('games').count('* as count').first();
    if (gameCount.count === 0) {
      console.log('Seeding games...');
      const games = [
        {
          title: 'Catan',
          description: 'Build settlements and cities on the island of Catan. Trade resources and use strategy to become the dominant force.',
          image_url: '/images/game-1.jpg',
          min_players: 3,
          max_players: 4,
          playtime_minutes: 90,
          rating: 4.3
        },
        {
          title: 'Ticket to Ride',
          description: 'Claim railway routes and connect cities across the board. Strategic route-blocking and resource management.',
          image_url: '/images/game-2.jpg',
          min_players: 2,
          max_players: 5,
          playtime_minutes: 60,
          rating: 4.2
        },
        {
          title: 'Carcassonne',
          description: 'Build a medieval landscape tile by tile. Claim features and score points as the world takes shape.',
          image_url: '/images/game-1.jpg',
          min_players: 2,
          max_players: 5,
          playtime_minutes: 45,
          rating: 4.0
        },
        {
          title: 'Pandemic',
          description: 'Work together as disease-fighting specialists to contain outbreaks and discover cures. Cooperative gameplay.',
          image_url: '/images/game-2.jpg',
          min_players: 2,
          max_players: 4,
          playtime_minutes: 45,
          rating: 4.2
        },
        {
          title: '7 Wonders',
          description: 'Lead your civilization to glory through card drafting and building across three ages. Simultaneous action selection.',
          image_url: '/images/game-1.jpg',
          min_players: 3,
          max_players: 7,
          playtime_minutes: 45,
          rating: 4.3
        },
        {
          title: 'Splendor',
          description: 'Build a gem trading empire. Collect gems, purchase developments, and attract nobles for victory points.',
          image_url: '/images/game-2.jpg',
          min_players: 2,
          max_players: 4,
          playtime_minutes: 30,
          rating: 4.1
        },
        {
          title: 'Dominion',
          description: 'The original deck-building game. Draft cards and build powerful decks to dominate your opponents.',
          image_url: '/images/game-1.jpg',
          min_players: 2,
          max_players: 4,
          playtime_minutes: 30,
          rating: 4.0
        },
        {
          title: 'Azul',
          description: 'Beautiful tile-placement game about decorating the Royal Palace. Easy to learn, deep strategy.',
          image_url: '/images/game-2.jpg',
          min_players: 2,
          max_players: 4,
          playtime_minutes: 30,
          rating: 4.4
        },
        {
          title: 'Blood Rage',
          description: 'Viking clans battle for glory across three ages. Draft cards and send your warriors to gain fame and conquest.',
          image_url: '/images/game-1.jpg',
          min_players: 2,
          max_players: 4,
          playtime_minutes: 60,
          rating: 4.2
        },
        {
          title: 'Everdell',
          description: 'Build the prettiest woodland city. Gather resources, construct buildings, and attract cute critters.',
          image_url: '/images/game-2.jpg',
          min_players: 1,
          max_players: 4,
          playtime_minutes: 40,
          rating: 4.3
        }
      ];

      await db('games').insert(games);
      console.log('✓ Games seeded (10 games added)');
    } else {
      console.log(`✓ Database already has ${gameCount.count} games`);
    }

    console.log('\n✅ Database setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

setup();
