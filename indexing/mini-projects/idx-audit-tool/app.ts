import { getDb, closeDb } from '../../../db.js';
import { Collection } from 'mongodb';

async function audit(collection: Collection, index: any) {
  const firstKey = Object.keys(index.key)[0] as any;
  if (firstKey === '_id') return null;

  const stats = await collection
    .find({ [firstKey]: { $exists: true } })
    .hint(index.name)
    .limit(100)
    .explain('executionStats');

  return {
    time: stats.executionStats.executionTimeMillis,
    keys: stats.executionStats.totalKeysExamined,
    docs: stats.executionStats.totalDocsExamined,
  };
}

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

    for (const [i, idx] of indexes.entries()) {
      console.log(`   [${i + 1}] ${idx.name}: ${JSON.stringify(idx.key)}`);
      const perf = await audit(collection, idx);
      if (perf) {
        console.log(
          `Latency: ${perf.time}ms | Keys Scanned: ${perf.keys} | Docs Scanned: ${perf.docs}`
        );
      }
      console.log('  ', '-'.repeat(40));
    }
  }

  await closeDb();
}

run().catch(console.error);
