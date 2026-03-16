import { Collection, ObjectId } from 'mongodb';
import type { EventLog } from './type.js';

export class EventLogService {
  constructor(private collection: Collection<EventLog>) {}

  async getRecentErrors(minutes: number) {
    const cutoff = new Date(Date.now() - minutes * 60 * 1000);
    return await this.collection
      .find({
        severity: 'error',
        createdAt: { $gte: cutoff },
      })
      .toArray();
  }

  async getUserActivity(userId: string, from: Date, to: Date) {
    return await this.collection
      .find({
        userId,
        createdAt: { $gte: from, $lte: to },
      })
      .toArray();
  }

  async findByMetadata(key: string, value: any) {
    const query = { [`metadata.${key}`]: value };
    return await this.collection.find(query).toArray();
  }

  async getSeverityCounts(from: Date, to: Date) {
    const severities = ['info', 'warn', 'error'] as const;
    const report: Record<string, number> = {};
    for (const sev of severities) {
      report[sev] = await this.collection.countDocuments({
        severity: sev,
        createdAt: { $gte: from, $lte: to },
      });
    }
    return report;
  }
}
