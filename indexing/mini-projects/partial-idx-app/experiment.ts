import { getDb, closeDb } from '../../../db.js';

async function run() {
  const db = await getDb('indexing');
  const collection = db.collection('support_tickets');

  const getIndexSize = async (indexName: string) => {
    const stats = await db.command({ collStats: 'support_tickets' });
    return stats.indexSizes[indexName] || 0;
  };

  console.log('--- STARTING PARTIAL INDEX EXPERIMENT ---');

  console.log('\nCreating FULL index...');
  await collection.createIndex({ assigneeId: 1 }, { name: 'idx_full' });
  const fullSize = await getIndexSize('idx_full');
  console.log(`Full Index Size: ${(fullSize / 1024).toFixed(2)} KB`);

  await collection.dropIndex('idx_full');

  console.log('\nCreating PARTIAL index...');
  await collection.createIndex(
    { assigneeId: 1 },
    { name: 'idx_partial', partialFilterExpression: { status: 'open' } }
  );
  const partialSize = await getIndexSize('idx_partial');
  console.log(`Partial Index Size: ${(partialSize / 1024).toFixed(2)} KB`);

  console.log('\nTesting Query with Explain...');
  const queryStats = await collection
    .find({ assigneeId: 'agent_1', status: 'open' })
    .explain('executionStats');
  const usedIndex = queryStats.queryPlanner.winningPlan.inputStage.indexName;
  console.log(`Index Used: ${usedIndex}`);

  if (usedIndex === 'idx_partial') {
    console.log('Success: Query is using the small Partial Index!');
  }

  await closeDb();
}

run();
