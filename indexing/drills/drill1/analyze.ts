import { getDb, closeDb } from '../../../db.js';
import type { Order } from './seed.js';

async function runStats() {
  const db = await getDb('indexing');
  const orders = db.collection<Order>('orders');

  console.log('\n--- No Index ---');
  const stats1 = await orders
    .find({ status: 'pending' })
    .explain('executionStats');
  console.log({
    time: stats1.executionStats.executionTimeMillis + 'ms',
    docsExamined: stats1.executionStats.totalDocsExamined,
    keysExamined: stats1.executionStats.totalKeysExamined,
  });

  console.log('\nCreating index on status...');
  await orders.createIndex({ status: 1 });

  console.log('\n--- With Index ---');
  const stats2 = await orders
    .find({ status: 'pending' })
    .explain('executionStats');
  console.log({
    time: stats2.executionStats.executionTimeMillis + 'ms',
    docsExamined: stats2.executionStats.totalDocsExamined,
    keysExamined: stats2.executionStats.totalKeysExamined,
  });

  await closeDb();
}

runStats();
