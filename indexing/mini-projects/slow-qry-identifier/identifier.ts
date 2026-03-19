import { getDb, closeDb } from '../../../db.js';

async function run() {
  const db = await getDb('indexing');
  const collection = db.collection('transactions');

  const queries = [
    { name: 'Find by UserID', filter: { userId: 'user_500', sort: {} } },
    { name: 'Find by Category', filter: { category: 'electronics' }, sort: {} },
    {
      name: 'Amount + Date Sort',
      filter: { amount: { $gt: 9000 } },
      sort: { transactionDate: -1 },
    },
  ];

  const report = [];

  for (const q of queries) {
    const start = Date.now();
    await collection
      .find(q.filter)
      .sort(q.sort as any)
      .toArray();
    const duration = Date.now() - start;

    report.push({
      Query: q.name,
      'Duration (ms)': duration,
      Status: duration > 100 ? 'SLOW' : 'FAST',
    });
  }

  console.table(report);
  await closeDb();
}

run();
