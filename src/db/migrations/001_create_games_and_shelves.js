export async function up(knex) {
  // Create games table
  await knex.schema.createTable('games', (table) => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.text('description');
    table.string('image_url');
    table.integer('min_players');
    table.integer('max_players');
    table.integer('playtime_minutes');
    table.decimal('rating', 3, 2);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });

  // Create shelves table (for storing user game collections)
  await knex.schema.createTable('shelves', (table) => {
    table.increments('id').primary();
    table.string('user_id'); // Will be updated when auth is added
    table.integer('game_id').unsigned().notNullable();
    table.foreign('game_id').references('games.id').onDelete('CASCADE');
    table.timestamp('added_at').defaultTo(knex.fn.now());
    table.unique(['user_id', 'game_id']); // Prevent duplicates
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('shelves');
  await knex.schema.dropTableIfExists('games');
}
