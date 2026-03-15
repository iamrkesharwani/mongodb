import { ObjectId } from 'mongodb';

export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'cancelled';

export interface TaskHistory {
  changedAt: Date;
  oldStatus: TaskStatus;
  newStatus: TaskStatus;
}

export interface Task {
  _id?: ObjectId;
  title: string;
  description: string;
  status: TaskStatus;
  assigneeId: ObjectId | null;
  workspaceId: ObjectId;
  dueDate: Date;
  history: TaskHistory[];
}
