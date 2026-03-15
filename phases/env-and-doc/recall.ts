import { closeDb, getDb } from '../../db.js';
import { ObjectId } from 'mongodb';

interface Product {
  _id?: ObjectId;
  name: string;
  specs: {
    color: string;
    dimensions: string;
  };
  tags: string[];
}

async function run() {
  const db = await getDb('recall_phase1');
  const products = db.collection<Product>('students');
  try {
    await products.deleteMany({});
    const product: Product = {
      name: 'iPhone 12',
      specs: { color: 'Titanium', dimensions: '6.1-inch' },
      tags: ['apple', 'mobile'],
    };
    await products.insertOne(product);
    console.log('Item Inserted.');

    const fetchedProduct = await products.findOne({ name: 'iPhone 12' });
    if (fetchedProduct) {
      console.log(
        'Fetched:',
        fetchedProduct.name,
        'with ID:',
        fetchedProduct._id
      );
    }
  } catch (error) {
    console.error(error);
  } finally {
    await closeDb();
  }
}

run();
