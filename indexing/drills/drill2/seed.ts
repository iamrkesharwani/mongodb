import { getDb, closeDb } from '../../../db.js';
import { ObjectId } from 'mongodb';

interface Order {
  _id?: ObjectId;
  tenantId: string;
  status: 'active' | 'inactive' | 'pending' | 'cancelled';
  createdAt: Date;
  total: number;
  region: 'north' | 'south' | 'east' | 'west';
}

async function seed() {
  const db = await getDb('indexing');
  const collection = db.collection<Order>('orders');

  console.log('Cleaning existing orders...');
  await collection.deleteMany({});

  const tenants = ['abc', 'def', 'ghi', 'jkl'];
  const statuses: Order['status'][] = [
    'active',
    'pending',
    'inactive',
    'cancelled',
  ];
  const regions: Order['region'][] = ['east', 'west', 'north', 'south'];

  const TOTAL_DOCS = 100_000;
  const BATCH_SIZE = 10_000;

  console.log(`Starting seed of ${TOTAL_DOCS} documents...`);

  for (let i = 0; i < 10; i++) {
    const batch: Order[] = Array.from({ length: BATCH_SIZE }).map(() => ({
      tenantId: tenants[Math.floor(Math.random() * tenants.length)] as string,
      status: statuses[
        Math.floor(Math.random() * statuses.length)
      ] as Order['status'],
      region: regions[
        Math.floor(Math.random() * regions.length)
      ] as Order['region'],
      total: Math.floor(Math.random() * 5000) + 100,
      createdAt: new Date(
        Date.now() - Math.floor(Math.random() * 60 * 24 * 60 * 60 * 1000)
      ),
    }));

    await collection.insertMany(batch);
    console.log(`Inserted batch ${i + 1} (${i + 1 * BATCH_SIZE} total)`);
  }

  console.log('Seeding finished successfully.');
  await closeDb();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
