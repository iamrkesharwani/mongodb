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

  const indexes = [
    { key: { userId: 1 }, name: 'idx_userId' },
    { key: { category: 1 }, name: 'idx_category' },
    { key: { transactionDate: -1, amount: 1 }, name: 'idx_sort_range' },
  ];
  await collection.createIndexes(indexes as any);

  const report = [];

  for (const q of queries) {
    const explainStats = await collection
      .find(q.filter)
      .sort(q.sort as any)
      .limit(100)
      .explain('executionStats');
    const duration = explainStats.executionStats.executionTimeMillis;
    report.push({
      Query: q.name,
      'DB Internal Time (ms)': duration,
      'Docs Examined': explainStats.executionStats.totalDocsExamined,
      Status: duration > 100 ? 'SLOW' : 'FAST',
    });
  }

  console.table(report);
  await closeDb();
}

run();
