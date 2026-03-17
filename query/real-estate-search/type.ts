import type { ObjectId } from 'mongodb';

export interface Listing {
  _id?: ObjectId;
  title: string;
  type: 'rent' | 'sale';
  price: number;
  location: {
    city: string;
    neighborhood: string;
    coordinates: [number, number];
  };
  features: string[];
  bedrooms: number;
  bathrooms: number;
  area: number;
  available: boolean;
  listedAt: Date;
}
