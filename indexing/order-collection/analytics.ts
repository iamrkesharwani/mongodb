import { getDb, closeDb } from '../../db.js';
import type { Order } from './seed.js';

async function run() {
  const db = await getDb('indexing');
  const collection = db.collection<Order>('orders');

  console.log('--- STARTING ANALYTICS INDEXING ---');

  const indexes = [
    { key: { tenantId: 1, status: 1 }, name: 'idx_tenant_status' },
    { key: { region: 1, total: 1 }, name: 'idx_region_total' },
    { key: { tenantId: 1, createdAt: -1 }, name: 'idx_recent_orders' },
    { key: { region: 1, status: 1, createdAt: 1 }, name: 'idx_fulfillment' },
    { key: { items: 1 }, name: 'idx_multikey_items' },
  ];

  console.log('Building indexes...');
  await collection.createIndexes(indexes as any);

  const verifyQuery = async (
    label: string,
    query: any,
    sort: any = {},
    proj: any = {}
  ) => {
    const stats = await collection
      .find(query, { projection: proj })
      .sort(sort)
      .limit(100)
      .explain('executionStats');

    const exec = stats.executionStats;
    console.log(`\n--- Pattern: ${label} ---`);
    console.table({
      'Time (ms)': exec.executionTimeMillis,
      'Docs Examined': exec.totalDocsExamined,
      'Keys Examined': exec.totalKeysExamined,
      'Index Used':
        stats.queryPlanner.winningPlan.inputStage?.indexName || 'COLLSCAN',
    });
  };

  await verifyQuery('Dashboard Filter', {
    tenantId: 'T-10',
    status: 'pending',
  });
  await verifyQuery(
    'High-Value Region (Covered)',
    { region: 'North', total: { $gt: 500 } },
    {},
    { region: 1, total: 1, _id: 0 }
  );
  await verifyQuery(
    'Recent Orders Sort',
    { tenantId: 'T-10' },
    { createdAt: -1 }
  );
  await verifyQuery('Multikey Search', { items: 'Laptop' });

  await closeDb();
}

run().catch(console.error);
