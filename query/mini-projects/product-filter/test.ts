import { filterProducts } from './app.js';
import { getDb, closeDb } from '../../../db.js';
import type { Product, ProductFilters } from './type.js';

async function run() {
  const db = await getDb('queries');
  const products = db.collection<Product>('products');

  try {
    const filters: ProductFilters = {
      categories: ['electronics'],
      minPrice: 500,
      maxPrice: 1500,
      minRating: 4,
      tags: ['premium'],
      inStockDaily: true,
    };
    const result = await filterProducts(products, filters);
    console.table(result);
  } catch (error) {
    console.error(error);
  } finally {
    await closeDb();
  }
}

run();
