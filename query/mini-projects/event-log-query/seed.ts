import { getDb, closeDb } from '../../../db.js';

async function seedEvents() {
  const db = await getDb('queries');
  const events = db.collection('events');

  const logs = [
    {
      type: 'error',
      userId: 'user_1',
      metadata: { code: 500, message: 'Database Timeout', service: 'auth-api' },
      severity: 'error',
      createdAt: new Date(Date.now() - 10 * 60 * 1000),
    },
    {
      type: 'info',
      userId: 'user_2',
      metadata: { ip: '192.168.1.1', browser: 'Chrome' },
      severity: 'info',
      createdAt: new Date(Date.now() - 60 * 60 * 1000),
    },
    {
      type: 'warn',
      userId: 'user_1',
      metadata: { code: 404, page: '/dashboard' },
      severity: 'warn',
      createdAt: new Date(Date.now() - 5 * 60 * 1000),
    },
  ];

  await events.deleteMany({});
  await events.insertMany(logs);
  console.log('Event logs seeded!');
  await closeDb();
}

seedEvents();
