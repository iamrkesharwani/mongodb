import { Collection, ObjectId, type Filter } from 'mongodb';
import type { Task, TaskHistory, TaskStatus } from './type.js';

export class TaskRepository {
  constructor(private collection: Collection<Task>) {}

  async create(taskData: Omit<Task, 'history'>) {
    const task: Task = {
      ...taskData,
      history: [],
    };
    const result = await this.collection.insertOne(task);
    return { ...task, _id: result.insertedId };
  }

  async getById(id: ObjectId) {
    return await this.collection.findOne({ _id: id });
  }

  async list(
    workspaceId: ObjectId,
    filters: Partial<{ status: TaskStatus; assigneeId: ObjectId }>
  ) {
    const query: Filter<Task> = { workspaceId, ...filters };
    return await this.collection.find(query).toArray();
  }

  async assign(id: ObjectId, userId: ObjectId) {
    return await this.collection.updateOne(
      { _id: id },
      { $set: { assigneeId: userId } }
    );
  }

  async updateStatus(id: ObjectId, newStatus: TaskStatus) {
    const task = await this.collection.findOne({ _id: id });
    if (!task) throw new Error('Task not found');
    if (task.status === newStatus) return;

    const historyEntry: TaskHistory = {
      changedAt: new Date(),
      oldStatus: task.status,
      newStatus: newStatus,
    };

    return await this.collection.updateOne(
      { _id: id },
      {
        $set: { status: newStatus },
        $push: { history: historyEntry },
      }
    );
  }

  async bulkClose(workspaceId: ObjectId) {
    return await this.collection.updateOne(
      {
        workspaceId,
        status: { $nin: ['done', 'cancelled'] },
      },
      { $set: { status: 'done' } }
    );
  }

  async delete(id: ObjectId) {
    const result = await this.collection.deleteOne({ _id: id });
    return result.deletedCount;
  }

  async countByStatus(workspaceId: ObjectId) {
    const statuses: TaskStatus[] = ['todo', 'in_progress', 'done', 'cancelled'];
    const report: Record<string, number> = {
      todo: 0,
      in_progress: 0,
      done: 0,
      cancelled: 0,
    };
    for (const status of statuses) {
      report[status] = await this.collection.countDocuments({
        workspaceId,
        status,
      });
    }
    return report;
  }
}
