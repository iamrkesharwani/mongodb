import { getDb, closeDb } from '../../../db.js';
import type { Submission } from './type.js';

async function run() {
  const db = await getDb('queries');
  const submissions = db.collection<Submission>('submissions');

  try {
    const exists = await submissions
      .find({ score: { $exists: true } })
      .toArray();
    console.log(`\n[$exists] Field present: ${exists.length}`);

    const numeric = await submissions
      .find({ score: { $type: 'number' } })
      .toArray();
    console.log(`\n[$type: number] Valid numbers: ${numeric.length}`);

    const absent = await submissions
      .find({ score: { $exists: false } })
      .toArray();
    console.log(`\n[$exists: false] Field missing: ${absent.length}`);

    const strings = await submissions
      .find({ score: { $type: 'string' } })
      .toArray();

    for (const doc of strings) {
      const numericScore = parseInt(doc.score);
      if (!isNaN(numericScore)) {
        await submissions.updateOne(
          { _id: doc._id },
          { $set: { score: numericScore } }
        );
        console.log(
          `\nFixed score for ${doc.student}: ${doc.score} -> ${numericScore}`
        );
      }
    }
  } catch (error) {
    console.log(error);
  } finally {
    await closeDb();
  }
}

run();
