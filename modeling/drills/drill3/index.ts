import { getDb, closeDb } from '../../../db.js';
import { BSON, ObjectId } from 'mongodb';

interface UserActivity {
  action: string;
  timestamp: Date;
  metadata: string;
}

interface UserDocument {
  _id: ObjectId | string;
  username: string;
  activityLog: UserActivity[];
}

async function run(): Promise<void> {
  const db = await getDb('modeling');
  const collection = db.collection<UserDocument>('users');

  const userId: string = 'user_2';
  await collection.insertOne({
    _id: userId,
    username: 'tester',
    activityLog: [],
  });

  console.log('--- SIMULATING 1 YEAR OF ACTIVITY LOGS ---');

  for (let i: number = 1; i <= 365; i++) {
    const newLogs: UserActivity[] = Array.from({ length: 10 }).map(() => ({
      action: 'CLICK_NAV_BAR',
      timestamp: new Date(),
      metadata: 'Some long string to occupy space '.repeat(100),
    }));

    await collection.updateOne(
      { _id: userId },
      { $push: { activityLog: { $each: newLogs } } }
    );

    if (i % 30 === 0) {
      const doc: UserDocument | null = await collection.findOne({
        _id: userId,
      });
      if (doc) {
        const sizeBytes: number = BSON.calculateObjectSize(doc);
        const sizeMB: string = (sizeBytes / (1024 * 1024)).toFixed(2);
        console.log(
          `Day ${i}: Size = ${sizeMB} MB | Log Count: ${doc.activityLog.length}`
        );
      }
    }
  }

  await closeDb();
}

run();
