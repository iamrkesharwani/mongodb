import { getDb, closeDb } from '../../../db.js';
import type { Submission } from './type.js';

async function seed() {
  const db = await getDb('queries');
  const submissions = db.collection<Submission>('submissions');

  const messyData = [
    { student: 'Rahul', score: 85 },
    { student: 'Alice', score: '92' },
    { student: 'Bob' },
    { student: 'Charlie', score: null },
    { student: 'Dave', score: 78 },
    { student: 'Eve', score: 'invalid' },
  ];

  await submissions.deleteMany({});
  await submissions.insertMany(messyData);
  console.log('Messy Submissions seeded!');
  await closeDb();
}

seed();
