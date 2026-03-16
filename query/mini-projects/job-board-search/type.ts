import { ObjectId } from 'mongodb';

export interface JobListing {
  _id?: ObjectId;
  title: string;
  company: string;
  location: string;
  remote: boolean;
  salary: {
    min: number;
    max: number;
  };
  skills: string[];
  postedAt: Date;
}

export interface JobSearchParams {
  skills?: string[];
  minSalary?: number;
  maxSalary?: number;
  remote?: boolean;
  location?: string;
  daysOld?: number;
}
