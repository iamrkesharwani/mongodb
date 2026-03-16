import { ObjectId } from 'mongodb';

export interface Submission {
  _id?: ObjectId;
  student: string;
  score?: any;
}
