import 'dotenv/config';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function runDesignProject() {
  try {
    await client.connect();
    console.log('Database Connected!');

    const db = client.db('learning_mongo');
    const usersCollection = db.collection('users');
    const ordersCollection = db.collection('orders');

    const userData = {
      name: 'Rahul Kesharwani',
      email: 'rahul@email.com',
      address: {
        colony: 'Prem Nagar',
        city: 'ABC',
        country: 'India',
      },
      skills: ['React', 'Typescript', 'Node.js'],
    };

    const userResult = await usersCollection.insertOne(userData);
    const newUserId = userResult.insertedId;
    console.log(`New user inserted with ID: ${newUserId}`);

    const orderData = {
      orderNumber: 'ORD_0123_456',
      total: 1500,
      customerId: newUserId,
      items: [
        { product: 'Mechanical Keyboard', qty: 1, price: 1200 },
        { product: 'USB Cable', qty: 1, price: 300 },
      ],
    };

    const orderResult = await ordersCollection.insertOne(orderData);
    console.log(`Order created for User: ${newUserId}`);

    console.log('Timestamp of doc creation?:', newUserId.getTimestamp());
  } catch (error) {
    console.error(`Some error occurred:`, error);
  } finally {
    await client.close();
  }
}

runDesignProject();
