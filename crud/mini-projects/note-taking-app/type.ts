import type { ObjectId } from 'mongodb';

export interface Note {
  _id?: ObjectId;
  title: string;
  body: string;
  tags: string[];
  pinned: boolean;
  editCount: number;
  wordCount: number;
  updatedAt: Date;
}
