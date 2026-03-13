import 'dotenv/config';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function main() {
  try {
    await client.connect();
    const db = client.db('production_crud');
    const users = db.collection('users');

    // --- TASK 1: insertMany ---
    console.log('Sending 500 users...');
    const dummyUsers = Array.from({ length: 500 }).map((_, i) => {
      const city = i % 2 === 0 ? 'Kharagpur' : 'Berlin';
      return {
        username: `user_${i}`,
        email: `user${i}@email.com`,
        age: Math.floor(Math.random() * 40) + 18,
        address: {
          city: city,
          country: city === 'Kharagpur' ? 'India' : 'Germany',
        },
        tags: ['newbee'],
        loginCount: 0,
        isVerified: false,
      };
    });

    await users.deleteMany({});
    await users.insertMany(dummyUsers);
    console.log('Seeding complete!');

    // --- TASK 2: Projection ---
    const projectionResult = await users
      .find({ 'address.city': 'Berlin' })
      .project({ email: 1, username: 1, _id: 0 })
      .limit(5)
      .toArray();
    console.table(projectionResult);

    // --- TASK 3: Pagination ---
    const page = 3;
    const limit = 10;
    const skipAmount = (page - 1) * limit;

    const pageData = await users
      .find({})
      .sort({ age: 1 })
      .skip(skipAmount)
      .limit(limit)
      .toArray();
    console.log(`Page ${page} Data fetched! Total docs: ${pageData.length}`);

    // --- Task 4: Atomic Updates ---
    await users.updateOne(
      { username: 'user_20' },
      {
        $set: { isVerified: true },
        $inc: { loginCount: 5 },
        $unset: { someOldField: '' },
      }
    );
    console.log('Atomic fields updated for user_20');

    await users.replaceOne(
      { username: 'user_10' },
      { username: 'user_10_reborn', note: 'Entire document was replaced' }
    );

    const deleteResult = await users.deleteMany({
      isVerified: false,
      age: { $gt: 55 },
    });
    console.log(`Deleted ${deleteResult.deletedCount} unverified old users.`);

    // --- Task 5. Array Management ---
    await users.updateOne(
      { username: 'user_10' },
      { $addToSet: { tags: 'pro' } }
    );

    await users.updateOne(
      { username: 'user_10' },
      { $push: { tags: 'active' } }
    );

    const totalKharagpur = await users.countDocuments({
      'address.city': 'Kharagpur',
    });
    console.log(`Dashboard Metric - Kharagpur Users: ${totalKharagpur}`);
  } catch (error) {
    console.error(error);
  } finally {
    client.close();
  }
}

main();
