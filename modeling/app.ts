import 'dotenv/config';
import { MongoClient, ObjectId, Collection, type Auth } from 'mongodb';

interface Author {
  _id?: ObjectId;
  name: string;
  bio: string;
}

interface Post {
  title: string;
  content: string;
  authorSnapshot: {
    authorId: ObjectId;
    name: string;
  };
  tags: string[];
}

interface Order {
  orderNumber: string;
  customerId: ObjectId;
  items: {
    productId: ObjectId;
    name: string;
    priceAtPurchase: number;
    qty: number;
  }[];
  total: number;
}

const uri = process.env.MONGODB_URI as string;
const client = new MongoClient(uri);

async function main() {
  try {
    await client.connect();
    const db = client.db('modeling');

    const authors = db.collection<Author>('authors');
    const posts = db.collection<Post>('posts');
    const orders = db.collection<Order>('orders');

    const authorRes = await authors.insertOne({
      name: 'Rahul',
      bio: 'MERN Developer',
    } as Author);
    const authorId = authorRes.insertedId;

    await posts.insertOne({
      title: 'MongoDB Modeling',
      content: 'Learn embed vs reference...',
      authorSnapshot: { authorId, name: 'Rahul' },
      tags: ['tech', 'database'],
    } as Post);
    console.log('Blog Post created with Embedded Author Snapshot');

    await orders.insertOne({
      orderNumber: 'ORD-555',
      customerId: authorId,
      items: [
        {
          productId: new ObjectId(),
          name: 'Mechanical Keyboard',
          priceAtPurchase: 4500,
          qty: 1,
        },
      ],
      total: 4500,
    } as Order);
    console.log('Order created with Referenced Customer and Price Snapshot');
  } catch (error) {
    console.error(error);
  } finally {
    client.close();
  }
}

main()