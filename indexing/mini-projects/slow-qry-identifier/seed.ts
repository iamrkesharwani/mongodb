import { getDb, closeDb } from '../../../db.js';
import { ObjectId } from 'mongodb';

export interface Transaction {
  _id?: ObjectId;
  userId: string;
  amount: number;
  category: 'groceries' | 'electronics' | 'utilities' | 'entertainment';
  transactionDate: Date;
  status: 'completed' | 'pending' | 'failed';
  note: string;
}

async function seed() {
  const db = await getDb('indexing');
  const collection = db.collection<Transaction>('transactions');
  await collection.deleteMany({});
  console.log('Cleaned old transactions.');
  const categories = [
    'groceries',
    'electronics',
    'utilities',
    'entertainment',
  ] as const;
  const statuses = ['completed', 'pending', 'failed'] as const;

  const TOTAL = 200_000;
  const BATCH_SIZE = 20_000;

  for (let i = 0; i < TOTAL / BATCH_SIZE; i++) {
    const batch = Array.from({ length: BATCH_SIZE }).map((_, idx) => ({
      userId: `user_${Math.floor(Math.random() * 5000)}`,
      amount: Math.floor(Math.random() * 10000) + 1,
      category: categories[
        Math.floor(Math.random() * categories.length)
      ] as any,
      status: statuses[Math.floor(Math.random() * statuses.length)] as any,
      transactionDate: new Date(
        Date.now() - Math.floor(Math.random() * 10000000000)
      ),
      note: 'Transaction record for audit purposes ' + idx,
    }));

    await collection.insertMany(batch);
    console.log(`Progress: ${(i + 1) * BATCH_SIZE} / ${TOTAL}`);
  }

  console.log('Seeding Done!');
  await closeDb();
}

seed();
