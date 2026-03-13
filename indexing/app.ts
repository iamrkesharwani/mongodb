import 'dotenv/config';
import { MongoClient, Collection } from 'mongodb';

interface Order {
  orderId: string;
  customerName: string;
  status: 'pending' | 'shipped' | 'delivered';
  amount: number;
  createdAt: Date;
}

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error('MONGODB_URI is not defined in .env');
const client = new MongoClient(uri);

async function main() {
  try {
    await client.connect();
    const db = client.db('performance');
    const orders: Collection<Order> = db.collection<Order>('orders');

    console.log('Seeding 100,000 orders...');
    const dummyOrders: Order[] = Array.from({ length: 100000 }).map((_, i) => ({
      orderId: `ORD-${i}`,
      customerName: `Customer ${i}`,
      status: i % 3 === 0 ? 'pending' : 'shipped',
      amount: Math.floor(Math.random() * 5000),
      createdAt: new Date(),
    }));

    await orders.deleteMany({});
    await orders.insertMany(dummyOrders);

    // Test Query WITHOUT Index
    console.log('Running query without index...');
    const slowExplain = await orders
      .find({
        status: 'pending',
        amount: { $gt: 4000 },
      })
      .explain('executionStats');
    console.log('COLLSCAN:', slowExplain.executionStats.totalDocsExamined);

    // Create Compound Index
    console.log('Creating Compound Index...');
    await orders.createIndex({ status: 1, amount: 1 });

    // Test Query WITH Index
    const fastExplain = await orders
      .find({ status: 'pending', amount: { $gt: 4000 } })
      .explain('executionStats');
    console.log('IXSCAN:', fastExplain.executionStats.totalDocsExamined);

    await orders.createIndex({ orderId: 1 }, { unique: true });
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

main();
