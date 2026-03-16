export type Category = 'electronics' | 'home' | 'beauty' | 'sports' | 'clothing';
export type tagsPool = 'premium' | 'sale' | 'new' | 'limited' | 'wireless';

export interface Product {
  name: string;
  price: number;
  stock: number;
  rating: number;
  category: Category;
  tags: tagsPool[];
  createdAt: Date;
}

export interface ProductFilters {
  categories?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStockDaily?: boolean;
  tags?: string[];
  search?: string;
}
