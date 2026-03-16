import { getDb, closeDb } from '../../../../db.js';
import type { Product } from '../drill1/type.js';

async function main() {
  const db = await getDb('queries');
  const products = db.collection<Product>('products');

  try {
    const budgetOrHighRated = await products
      .find({
        $or: [{ price: { $lt: 20 } }, { rating: { $gt: 4.5 } }],
      })
      .toArray();
    console.log(`\n[$or] Budget or High Rated: ${budgetOrHighRated.length}`);

    const electronicsInStock = await products
      .find({
        $and: [
          { category: 'electronics' },
          { stock: { $gt: 0 } },
          { price: { $gte: 50, $lte: 200 } },
        ],
      })
      .toArray();
    console.log(
      `\n[$and] Premium Electronics in stock: ${electronicsInStock.length}`
    );

    const activeNonClothing = await products
      .find({
        $nor: [{ stock: 0 }, { category: 'clothing' }],
      })
      .toArray();
    console.log(
      `\n[$nor] Available non-clothing items: ${activeNonClothing.length}`
    );

    const expensiveTechOrBeauty = await products
      .find({
        $and: [
          { price: { $gt: 20 } },
          { $or: [{ category: 'electronics' }, { category: 'beauty' }] },
        ],
      })
      .toArray();
    console.log(
      `\n[Combined] Expensive Tech/Beauty: ${expensiveTechOrBeauty.length}`
    );
  } catch (error) {
    console.error(error);
  } finally {
    await closeDb();
  }
}

main();
