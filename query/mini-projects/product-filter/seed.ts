import { getDb, closeDb } from '../../../../db.js';
import type { Product, tagsPool } from './type.js';

async function seed() {
  const db = await getDb('queries');
  const products = db.collection<Product>('products');

  const categories = [
    'electronics',
    'home',
    'beauty',
    'sports',
    'clothing',
  ] as const;
  const tagPool = ['premium', 'sale', 'new', 'limited', 'wireless'] as const;

  const dummyData: Product[] = Array.from({ length: 500 }).map((_, i) => {
    const randomTags: tagsPool[] = [...tagPool]
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 3) + 1);

    return {
      name: `${categories[i % 5]} Item ${i + 1}`,
      price: Math.floor(Math.random() * 1900) + 10,
      stock: Math.floor(Math.random() * 100),
      rating: Number((Math.random() * 4 + 1).toFixed(1)),
      category: categories[Math.floor(Math.random() * categories.length)]!,
      tags: randomTags,
      createdAt: new Date(),
    };
  });

  await products.deleteMany({});
  await products.insertMany(dummyData);
  console.log('500 Products seeded!');
  await closeDb();
}

seed();
