export interface Product {
  name: string;
  brand: string;
  category: string;
  variants: {
    size: 'S' | 'M' | 'L' | 'XL';
    color: string;
    price: number;
    stock: number;
  }[];
}
