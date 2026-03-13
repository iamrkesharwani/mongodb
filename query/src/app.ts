import 'dotenv/config';
import { MongoClient, ObjectId, Collection } from 'mongodb';

interface Product {
  title: string;
  category: 'Electronics' | 'Audio' | 'Home' | 'Fitness';
  price: number;
  stock: number;
  specs: { name: string; value: string }[];
  isRefurbished: boolean;
  tags: string[];
}

const uri = process.env.MONGODB_URI as string;
const client = new MongoClient(uri);

async function runQueryEngine() {
  try {
    await client.connect();
    const db = client.db('catalog');
    const products: Collection<Product> = db.collection<Product>('products');

    console.log('Seeding 1000 products...');
    const categories: Product['category'][] = [
      'Electronics',
      'Audio',
      'Home',
      'Fitness',
    ] as const;
    const dummyProducts: Product[] = Array.from({ length: 1000 }).map(
      (_, i) => ({
        title: `${categories[i % 4]} Gadget ${i}`,
        category: categories[i % categories.length]!,
        price: Math.floor(Math.random() * 900) + 100,
        stock: Math.floor(Math.random() * 50),
        specs: [
          { name: 'color', value: i % 2 === 0 ? 'Black' : 'White' },
          { name: 'warranty', value: i % 3 === 0 ? '1yr' : '2yr' },
        ],
        isRefurbished: i % 10 === 0,
        tags: i % 5 === 0 ? ['sale', 'trending'] : ['new-arrival'],
      })
    );
    await products.deleteMany({});
    await products.insertMany(dummyProducts);

    // Price 200-500 AND Category IN list
    const facetedSearch = await products
      .find({
        price: { $gte: 200, $lte: 500 },
        category: { $in: ['Electronics', 'Audio'] },
        stock: { $ne: 0 },
      })
      .limit(10)
      .toArray();

    // Items with a particular specs
    const specsFilter = await products
      .find({
        specs: {
          $elemMatch: { name: 'color', value: 'White' },
        },
      })
      .limit(5)
      .toArray();

    // Regex find
    const liveSearch = await products
      .find({
        title: { $regex: /^Audio/i },
      })
      .limit(5)
      .toArray();

    // Nested field query
    const nestedQuery = await products
      .find({
        'specs.0.value': 'Black',
      })
      .limit(5)
      .toArray();

    // Complex query
    const complexFilter = await products
      .find({
        $and: [
          { $or: [{ price: { $gt: 800 } }, { isRefurbished: true }] },
          { stock: { $gt: 0 } },
        ],
      })
      .limit(5)
      .toArray();

    console.log('All Query Milestones Executed!');
  } catch (error) {
    console.error(error);
  } finally {
    client.close();
  }
}

runQueryEngine();
