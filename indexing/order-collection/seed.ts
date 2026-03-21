import { getDb, closeDb } from '../../db.js';

export interface Order {
  tenantId: string;
  customerId: string;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: string[];
  region: 'North' | 'South' | 'East' | 'West';
  createdAt: Date;
  fulfilledAt?: Date;
}

async function seed() {
  const db = await getDb('indexing');
  const collection = db.collection<Order>('orders');

  await collection.deleteMany({});
  console.log('Clearing old data...');

  const TOTAL = 500_000;
  const BATCH_SIZE = 25_000;
  const regions = ['North', 'South', 'East', 'West'] as const;
  const statuses = ['pending', 'shipped', 'delivered', 'cancelled'] as const;
  const itemsPool = [
    'Laptop',
    'Mouse',
    'Keyboard',
    'Monitor',
    'Desk',
    'Chair',
  ] as const;

  for (let i = 0; i < TOTAL / BATCH_SIZE; i++) {
    const batch: Order[] = Array.from({ length: BATCH_SIZE }).map(() => {
      const status = statuses[Math.floor(Math.random() * statuses.length)]!;
      return {
        tenantId: `T-${Math.floor(Math.random() * 100)}`,
        customerId: `CUST-${Math.floor(Math.random() * 10000)}`,
        status,
        total: Math.floor(Math.random() * 1000) + 50,
        items: [itemsPool[Math.floor(Math.random() * itemsPool.length)]!],
        region: regions[Math.floor(Math.random() * regions.length)]!,
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 10 ** 10)),
        ...(status === 'delivered' && { fulfilledAt: new Date() }),
      };
    });

    await collection.insertMany(batch);
    console.log(
      `Progress: ${((i + 1) * BATCH_SIZE).toLocaleString()} / ${TOTAL.toLocaleString()}`
    );
  }

  console.log('500k Orders Seeded Successfully!');
  await closeDb();
}

seed().catch(console.error);
