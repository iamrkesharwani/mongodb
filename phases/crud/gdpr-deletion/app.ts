import { Collection, ObjectId } from 'mongodb';
import type { UserData } from './types.js';

export class GdprService {
  constructor(private collection: Collection<UserData>) {}

  async anonymizeUser(id: ObjectId) {
    return await this.collection.updateOne(
      { _id: id },
      {
        $set: {
          name: 'Deleted User',
          email: 'hidden_' + Math.random().toString(36).substring(7),
          deletionRequested: false,
        },
        $unset: {
          phone: '',
          address: '',
        },
      }
    );
  }

  async purgeRequested() {
    const result = await this.collection.deleteMany({
      deletionRequested: true,
    });
    console.log(`[GDPR] Total users purged: ${result.deletedCount}`);
    return result;
  }

  async exportUser(id: ObjectId) {
    return await this.collection.findOne(
      { _id: id },
      {
        projection: {
          _id: 0,
          name: 1,
          email: 1,
          createdAt: 1,
        },
      }
    );
  }
}
