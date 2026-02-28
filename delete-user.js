import knex from 'knex';

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: 'allmymeeples.db'
  },
  useNullAsDefault: true
});

async function main() {
  // List all users
  console.log('\n=== ALL USERS ===');
  const users = await db.select('id', 'email', 'name').from('users').orderBy('id');
  if (users.length === 0) {
    console.log('No users found');
  } else {
    users.forEach(u => {
      console.log(`ID: ${u.id} | Email: ${u.email} | Name: ${u.name}`);
    });
  }

  // Delete a user if ID provided
  const userId = process.argv[2];
  if (userId) {
    console.log(`\nDeleting user ID ${userId}...`);
    
    // Delete shelved games first (foreign key constraint)
    const shelfDeleted = await db('shelves').where('user_id', userId).delete();
    console.log(`Deleted ${shelfDeleted} shelved games`);
    
    // Delete the user
    const userDeleted = await db('users').where('id', userId).delete();
    
    if (userDeleted > 0) {
      console.log(`✓ User ID ${userId} deleted successfully`);
    } else {
      console.log(`✗ User ID ${userId} not found`);
    }
  }

  process.exit(0);
}

main();
