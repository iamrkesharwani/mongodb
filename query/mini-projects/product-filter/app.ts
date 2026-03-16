import type { Product, ProductFilters } from './type.js';
import { type Filter, Collection } from 'mongodb';

export async function filterProducts(
  collection: Collection<Product>,
  filters: ProductFilters
) {
  const query: Filter<Product> = {};

  if (filters.categories && filters.categories.length > 0) {
    query.category = { $in: filters.categories } as any;
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    query.price = {};
    if (filters.minPrice !== undefined) query.price.$gte = filters.minPrice;
    if (filters.maxPrice !== undefined) query.price.$lte = filters.maxPrice;
  }

  if (filters.minRating !== undefined) {
    query.rating = { $gte: filters.minRating };
  }

  if (filters.inStockDaily) {
    query.stock = { $gt: 0 };
  }

  if (filters.tags && filters.tags.length > 0) {
    query.tags = { $all: filters.tags } as any;
  }

  if (filters.search) {
    query.name = { $regex: filters.search, $options: 'i' } as any;
  }

  console.log('Generated Query:', JSON.stringify(query, null, 2));

  return await collection.find(query).toArray();
}