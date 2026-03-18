import { getDb, closeDb } from '../../../db.js';

async function run() {
  const db = await getDb('indexing');
  const collection = db.collection('orders');

  const indexes = [
    { status: 1 },
    { tenantId: 1 },
    { tenantId: 1, createdAt: -1 },
    { tenantId: 1, status: 1, createdAt: -1 },
  ];

  for (const index of indexes) {
    console.log(`--- Testing Index: ${JSON.stringify(index)} ---`);
    await collection.dropIndexes();
    await collection.createIndex(index as any);
    const stats = await collection
      .find({ tenantId: 'abc', status: 'active' })
      .sort({ createdAt: -1 })
      .hint(index)
      .explain('executionStats');

    const { executionTimeMillis, totalDocsExamined, totalKeysExamined } =
      stats.executionStats;
    console.table({
      executionTimeMillis,
      totalDocsExamined,
      totalKeysExamined,
    });
  }

  await closeDb();
}

run().catch(console.error);
