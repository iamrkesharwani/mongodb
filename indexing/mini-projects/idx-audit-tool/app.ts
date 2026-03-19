import { getDb, closeDb } from '../../../db.js';

async function run() {
  const db = await getDb('indexing');
  const collections = await db.listCollections().toArray();
  console.log(`Index Audit Report [${new Date().toLocaleTimeString()}]`);

  for (const collInfo of collections) {
    const collectionName = collInfo.name;
    const collection = db.collection(collectionName);
    const indexes = await collection.listIndexes().toArray();

    console.log(`\nCollection: ${collectionName}`);
    console.log(`Total Indexes: ${indexes.length}`);

    if (indexes.length === 1) {
      console.warn(`[WARNING]: '${collectionName}' has NO custom indexes.`);
    }

    indexes.forEach((idx, i) => {
      console.log(` [${i + 1}] ${idx.name}: ${JSON.stringify(idx.key)}`);
    });
  }

  await closeDb();
}

run().catch(console.error);
