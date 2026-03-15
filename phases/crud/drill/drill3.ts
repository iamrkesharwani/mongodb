import { getDb, closeDb } from '../../../db.js';

interface UserProfile {
  name: string;
  email: string;
  age: number;
  createdAt: Date;
}

async function main() {
  const db = await getDb('drill_3');
  const users = db.collection<UserProfile>('users');

  try {
    const count = await users.countDocuments();
    if (count < 200) {
      console.log('Seeding 200 users...');
      const dummyUsers = Array.from({ length: 200 }).map((_, i) => ({
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        age: Math.floor(Math.random() * 40) + 20,
        createdAt: new Date(Date.now() - i * 1000 * 60 * 60),
      }));
      await users.insertMany(dummyUsers);
    }

    const getPage = async (page: number, limit: number, sortDir: 1 | -1) => {
      const skip = (page - 1) * limit;
      return await users
        .find({})
        .project({ name: 1, email: 1, _id: 0 })
        .sort({ createdAt: sortDir })
        .skip(skip)
        .limit(limit)
        .toArray();
    };

    console.log('\n--- Page 1 (Newest 5) ---');
    console.table(await getPage(1, 5, -1));

    console.log('\n--- Page 2 (Newest 5) ---');
    console.table(await getPage(2, 5, -1));

    console.log('\n--- Page 1 (Oldest 3) ---');
    console.table(await getPage(1, 3, 1));
  } catch (error) {
    console.error(error);
  } finally {
    await closeDb();
  }
}

main();
