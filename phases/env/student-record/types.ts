import type { ObjectId } from 'mongodb';

export interface Instructor {
  name: string;
  specialty: string;
}

export interface Course {
  _id?: ObjectId;
  title: string;
  instructor: Instructor;
  maxCapacity: number;
}

export interface Enrollment {
  courseId: ObjectId;
  enrolledAt: Date;
  grade?: string;
}

export interface Student {
  _id?: ObjectId;
  name: string;
  email: string;
  enrolledCourses: Enrollment[];
}
