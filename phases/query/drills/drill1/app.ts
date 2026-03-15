import { getDb, closeDb } from '../../../../db.js';
import type { Product } from './type.js';

async function main() {
  const db = await getDb('queries');
  const products = db.collection<Product>('products');

  try {
    const expensive = await products
      .find({
        price: { $gt: 50 },
      })
      .toArray();
    console.log(`\nPrice > 50: Found ${expensive.length} products.`);

    const highRatedAffordable = await products
      .find({
        rating: { $gte: 4 },
        price: { $lte: 100 },
      })
      .toArray();
    console.log(
      `\nHigh Rating & Affordable: Found ${highRatedAffordable.length} products.`
    );

    const notClothing = await products
      .find({
        category: { $ne: 'clothing' },
      })
      .toArray();
    console.log(`\nNot Clothing: Found ${notClothing.length} products.`);

    const lowStock = await products.find({ stock: { $lt: 5 } }).toArray();
    console.log(`\nLow Stock (< 5): Found ${lowStock.length} products.`);
  } catch (error) {
    console.error(error);
  } finally {
    await closeDb();
  }
}

main()