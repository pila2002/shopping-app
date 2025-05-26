import * as SQLite from 'expo-sqlite';
import { addShoppingItem, initDatabase } from '../lib/db/database';
import { mockItems } from './seed';

const DATABASE_NAME = 'shopping_list.db';

export async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  try {
    // Open database
    const db = SQLite.openDatabaseSync(DATABASE_NAME);
    
    // Initialize database schema
    await initDatabase(db);
    console.log('📦 Database initialized');

    // Insert mock items
    console.log(`📝 Inserting ${mockItems.length} items...`);
    
    for (const item of mockItems) {
      await addShoppingItem(db, item);
    }

    console.log('✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Execute seeding if this script is run directly
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
} 