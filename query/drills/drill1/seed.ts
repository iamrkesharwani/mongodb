import { getDb, closeDb } from '../../../db.js';
import type { Product } from './type.js';

async function run() {
  const db = await getDb('queries');
  const products = db.collection<Product>('products');

  const categories: Product['category'][] = [
    'electronics',
    'clothing',
    'home',
    'beauty',
  ];

  const dummyData: Product[] = Array.from({ length: 100 }).map((_, i) => ({
    name: `Product ${i + 1}`,
    price: Math.floor(Math.random() * 200) + 10,
    stock: Math.floor(Math.random() * 50),
    rating: Number((Math.random() * 5).toFixed(1)),
    category: categories[Math.floor(Math.random() * categories.length)]!,
  }));

  await products.deleteMany({});
  await products.insertMany(dummyData);
  console.log('✔ 100 Products seeded!');
  await closeDb();
}

run();
