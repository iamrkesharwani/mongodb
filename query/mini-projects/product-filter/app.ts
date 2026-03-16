import type { Product, ProductFilters } from './type.js';
import { type Filter, Collection } from 'mongodb';

export async function filterProducts(
  collection: Collection<Product>,
  filters: ProductFilters
) {
  const query: Filter<Product> = {};

  
}
