import { getDb, closeDb } from '../../../db.js';

interface Session {
  userId: string;
  createdAt: Date;
  expiresAt: Date;
}

async function run() {
  const db = await getDb('indexing');
  const collection = db.collection<Session>('sessions');

  await collection.deleteMany({});

  console.log('Creating TTL Index...');
  await collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

  const expiryDate = new Date(Date.now() + 60 * 1000);
  await collection.insertOne({
    userId: 'user_123',
    createdAt: new Date(),
    expiresAt: expiryDate,
  });

  console.log(`Expiry set: ${expiryDate.toLocaleTimeString()}`);
  console.log('Monitoring deletion (checking every 10s)...');

  const interval = setInterval(async () => {
    const count = await collection.countDocuments();
    console.log(`[${new Date().toLocaleTimeString()}] Document: ${count}`);

    if (count === 0) {
      console.log('Document successfully deleted by TTL thread!');
      clearInterval(interval);
      await closeDb();
    }
  }, 10000);
}

run().catch(console.error);
