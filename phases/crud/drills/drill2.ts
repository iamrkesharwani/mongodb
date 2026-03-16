import { getDb, closeDb } from '../../../db.js';

interface TestDoc {
  _id: string;
  name?: string;
  role?: string;
  status?: string;
  secretInfo?: string;
}

async function main() {
  const db = await getDb('drill_2');
  const col = db.collection<TestDoc>('test_replace');

  try {
    const docId = 'user_101';
    console.log('\n--- Inserting Full Document ---');
    await col.replaceOne(
      { _id: docId },
      { name: 'Rahul', role: 'Dev', status: 'Idle', secretInfo: 'Top Secret' },
      { upsert: true }
    );

    console.log('\n--- Using updateOne with $set ---');
    await col.updateOne({ _id: docId }, { $set: { status: 'Coding' } });
    let surgeonResult = await col.findOne({ _id: docId });
    console.log(surgeonResult);

    console.log('\n--- Using replaceOne ---');
    await col.replaceOne({ _id: docId }, { name: 'Rahul', status: 'Gone' });
    let bulldozerResult = await col.findOne({ _id: docId });
    console.log(bulldozerResult);
  } catch (error) {
    console.error(error);
  } finally {
    await closeDb();
  }
}

main();
