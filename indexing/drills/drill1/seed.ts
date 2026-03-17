import { getDb, closeDb } from '../../../db.js';

export interface Order {
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  amount: number;
  createdAt: Date;
}

async function seed() {
  const db = await getDb('indexing');
  const orders = db.collection<Order>('orders');

  const statuses = ['pending', 'shipped', 'delivered', 'cancelled'] as const;
  const batchSize = 10000;

  await orders.deleteMany({});
  console.log('Seeding 100,000 orders...');

  for (let i = 0; i < 10; i++) {
    const batch = Array.from({ length: batchSize }).map(() => ({
      status: statuses[Math.floor(Math.random() * statuses.length)]!,
      amount: Math.floor(Math.random() * 5000) + 100,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)),
    }));
    await orders.insertMany(batch);
    console.log(`Inserted ${(i + 1) * batchSize} docs...`);
  }

  console.log('100,000 Orders seeded!');
  await closeDb();
}

seed();
