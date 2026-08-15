import { db } from '../config/firebase.js';

const clearDatabase = async (): Promise<void> => {
  const collections = await db.listCollections();

  if (collections.length === 0) {
    console.log('Firebase database is already empty.');
    return;
  }

  for (const collection of collections) {
    await db.recursiveDelete(collection);
    console.log(`Deleted collection: ${collection.id}`);
  }

  console.log('Firebase database cleared successfully.');
};

clearDatabase()
  .then(() => process.exit(0))
  .catch((error: unknown) => {
    console.error('Error clearing Firebase database:', error);
    process.exit(1);
  });
