export interface Product {
  name: string;
  price: number;
  stock: number;
  rating: number;
  category: 'electronics' | 'clothing' | 'home' | 'beauty';
}
