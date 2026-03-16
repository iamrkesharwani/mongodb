import { getDb, closeDb } from '../../db.js';

interface CounterDoc {
  _id: string;
  views: number;
  tags: string[];
  lastUpdated: Date;
}

async function main() {
  const db = await getDb('drill_1');
  const counter = db.collection<CounterDoc>('counter');

  try {
    console.log('Starting Drills...');

    await counter.updateOne(
      { _id: 'page_v1' },
      { $set: { views: 0, tags: [], lastUpdated: new Date() } },
      { upsert: true }
    );

    await counter.updateOne({ _id: 'page_v1' }, { $inc: { views: 5 } });

    // Duplicates allowed with $push
    await counter.updateOne(
      { _id: 'page_v1' },
      { $push: { tags: 'trending' } }
    );
    await counter.updateOne(
      { _id: 'page_v1' },
      { $push: { tags: 'trending' } }
    );

    // Duplicates not allowed with $addToSet
    await counter.updateOne(
      { _id: 'page_v1' },
      { $addToSet: { tags: 'viral' } }
    );
    await counter.updateOne(
      { _id: 'page_v1' },
      { $addToSet: { tags: 'viral' } }
    );

    const result = await counter.findOne({ _id: 'page_v1' });
    console.log('\n--- Final Data in MongoDB ---');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error(error);
  } finally {
    await closeDb();
  }
}

main();
