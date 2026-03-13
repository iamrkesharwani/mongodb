import 'dotenv/config';
import { MongoClient, ObjectId, Collection } from 'mongodb';

interface User {
  _id?: ObjectId;
  username: string;
  email: string;
  age: number;
  address: {
    city: string;
    country: string;
  };
  tags: string[];
  loginCount: number;
  isVerified: boolean;
  tempToken?: string;
}

const uri = process.env.MONGODB_URI as string;
const client = new MongoClient(uri);

async function main() {
  try {
    await client.connect();
    const db = client.db('production_db');
    const users: Collection<User> = db.collection<User>('users');

    // --- insertMany ---
    console.log('Sending 500 users...');
    const dummyUsers: User[] = Array.from({ length: 500 }).map((_, i) => {
      const city = i % 2 === 0 ? 'Kharagpur' : 'Berlin';
      return {
        username: `user_${i}`,
        email: `user_${i}@email.com`,
        age: Math.floor(Math.random() * 40) + 18,
        address: {
          city: city,
          country: city === 'Berlin' ? 'Germany' : 'India',
        },
        tags: ['newbee'],
        loginCount: 0,
        isVerified: false,
      };
    });

    await users.deleteMany({});
    await users.insertMany(dummyUsers);
    console.log('Seeding complete!');

    // --- Projection ---
    const limitedUsers = await users.findOne(
      { username: 'user_0' },
      { projection: { email: 1, _id: 0 } }
    );
    console.log('Result:', limitedUsers?.email);

    // --- Atomic Updates ---
    await users.updateOne(
      { username: 'user_0' },
      {
        $inc: { loginCount: 1 },
        $set: { isVerified: true },
      }
    );

    // --- Updating / Adding tags ---
    console.log('Managing tags...');
    await users.updateOne(
      { username: 'user_0' },
      { $addToSet: { tags: 'pro' } }
    );
    await users.updateOne(
      { username: 'user_0' },
      { $addToSet: { tags: 'active' } }
    );

    // --- $unset ---
    await users.updateOne(
      { username: 'user_0' },
      { $unset: { tempToken: '' } }
    );
    console.log('tempToken removed.');

    // --- Updating User ---
    const updatedUser: User = {
      username: 'user_updated_0',
      email: 'user_updated_0@email.com',
      age: 30,
      address: { city: 'Kharagpur', country: 'India' },
      tags: ['reborn'],
      loginCount: 0,
      isVerified: true,
    };
    await users.replaceOne({ username: 'user_1' }, updatedUser);

    const delResult = await users.deleteMany({
      isVerified: false,
      age: { $gt: 40 },
    });
    const count = await users.countDocuments({ isVerified: true });

    console.log(
      `Deleted: ${delResult.deletedCount} | Total Verified: ${count}`
    );
  } catch (error) {
    console.error(error);
  } finally {
    client.close();
  }
}

main();
