import { getDb, closeDb } from '../../../db.js';

import type { Document } from 'mongodb';

interface User {
  type: 'user';
  email: string;
}

interface Log {
  type: 'log';
  message: string;
  level: 'info' | 'error';
}

export function isUser(doc: Document): doc is User {
  return doc.type === 'user' && typeof doc.email === 'string';
}

export function isLog(doc: Document): doc is Log {
  return doc.type === 'log' && typeof doc.message === 'string';
}

async function run() {
  const db = await getDb('chaos_db');
  const collection = db.collection('chaos');

  const chaoticDocs = [
    { type: 'user', email: 'dev@example.com' },
    { type: 'log', message: 'System reboot', level: 'info' },
    { name: 'Unknown Object', mysteryFactor: 9000 },
    { type: 'user', email: 'admin@test.io' },
    { type: 'log', message: 'Database failure', level: 'error' },
  ];

  try {
    await collection.deleteMany({});
    await collection.insertMany(chaoticDocs);

    const docs = await collection.find().toArray();

    docs.forEach((doc, index) => {
      console.log(`\nDocument [${index}]`);
      if (isUser(doc)) {
        console.log(`User detected: ${doc.email.toUpperCase()}`);
      } else if (isLog(doc)) {
        console.log(`Log [${doc.level}]: ${doc.message}`);
      } else {
        console.log(
          `Unknown Shape: Keys found => ${Object.keys(doc).join(', ')}`
        );
      }
    });
  } catch (error) {
    console.error(error);
  } finally {
    await closeDb();
  }
}

run();
