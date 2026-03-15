import type { Collection } from 'mongodb';
import type { InventoryItem } from './type.js';

export class ItemService {
  constructor(private collection: Collection<InventoryItem>) {}

  async restock(sku: string, qty: number) {
    return await this.collection.updateOne(
      { sku: sku },
      {
        $inc: { stock: qty },
        $set: { lastRestockedAt: new Date() },
      }
    );
  }

  async reserve(sku: string, qty: number) {
    const item = await this.collection.findOne({ sku });
    if (!item) throw new Error('No item found');

    const availableStock = item.stock - item.reservedStock;
    if (availableStock > qty) {
      return await this.collection.updateOne(
        { sku },
        { $inc: { reservedStock: qty } }
      );
    } else {
      throw new Error('Out of stock');
    }
  }

  async release(sku: string, qty: number) {
    return await this.collection.updateOne(
      { sku },
      { $inc: { reservedStock: -qty } }
    );
  }

  async getLowStock() {
    const allItems = await this.collection.find({}).toArray();
    return allItems.filter((item) => item.stock < item.reorderThreshold);
  }

  async upsertProduct(sku: string, data: Partial<InventoryItem>) {
    return await this.collection.updateOne(
      { sku },
      { $set: { ...data, lastRestockedAt: new Date() } },
      { upsert: true }
    );
  }
}
