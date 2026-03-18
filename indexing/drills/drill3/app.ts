import { getDb, closeDb } from '../../../db.js';

async function run() {
  const db = await getDb('indexing');
  const collection = db.collection('orders');

  console.log('Creating compound index...');
  await collection.createIndex({ tenantId: 1, status: 1, region: 1 });

  const stats = await collection
    .find(
      { tenantId: 'abd', status: 'active' },
      {
        projection: { tenantId: 1, status: 1, region: 1, _id: 0 },
      }
    )
    .explain('executionStats');

  const { totalDocsExamined, totalKeysExamined, nReturned } =
    stats.executionStats;

  console.log('--- Covered Query Results ---');
  console.table({ totalDocsExamined, totalKeysExamined, nReturned });

  if (totalDocsExamined === 0) {
    console.log('Success: This is a Covered Query!');
  } else {
    console.log('Failed: MongoDB still had to fetch documents.');
  }

  await closeDb();
}

run().catch(console.error);
