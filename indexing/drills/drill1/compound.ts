import { getDb, closeDb } from '../../../db.js';
import type { Order } from './seed.js';

async function run() {
  const db = await getDb('indexing');
  const orders = db.collection<Order>('orders');

  const date = new Date(Date.now() - 1000);

  console.log('\n--- No Index ---');
  const stats1 = await orders
    .find({ status: 'pending', createdAt: { $gt: date } })
    .explain('executionStats');
  console.log({
    time: stats1.executionStats.executionTimeMillis + 'ms',
    docsExamined: stats1.executionStats.totalDocsExamined,
    keysExamined: stats1.executionStats.totalKeysExamined,
  });

  console.log('\nCreating compound index...');
  await orders.createIndex({ status: 1, createdAt: 1 });

  console.log('\n--- No Index ---');
  const stats2 = await orders
    .find({ status: 'pending', createdAt: { $gt: date } })
    .explain('executionStats');
  console.log({
    time: stats2.executionStats.executionTimeMillis + 'ms',
    docsExamined: stats2.executionStats.totalDocsExamined,
    keysExamined: stats2.executionStats.totalKeysExamined,
  });

  await closeDb();
}

run();
