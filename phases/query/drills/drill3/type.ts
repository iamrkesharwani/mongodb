import type { ObjectId } from 'mongodb';

export interface Address {
  city: string;
  isPrimary: boolean;
}

export interface User {
  _id?: ObjectId;
  name: string;
  skills: string[];
  addresses: Address[];
}
