import { Collection, ObjectId } from 'mongodb';
import type { Note } from './type.js';

export class NoteService {
  constructor(private collection: Collection<Note>) {}

  async createNew(title: string, body: string, tags: string[] = []) {
    const newNote: Note = {
      _id: new ObjectId(),
      title,
      body,
      tags,
      pinned: false,
      editCount: 0,
      wordCount: body.split(' ').length,
      updatedAt: new Date(),
    };
    const result = await this.collection.insertOne(newNote);
    return { ...newNote, _id: result.insertedId };
  }

  async updateNoteBody(id: ObjectId, newBody: string) {
    return await this.collection.updateOne(
      { _id: id },
      {
        $set: {
          body: newBody,
          updatedAt: new Date(),
          wordCount: newBody.split(' ').length,
        },
        $inc: { editCount: 1 },
      }
    );
  }

  async addTag(id: ObjectId, tag: string) {
    return await this.collection.updateOne(
      { _id: id },
      {
        $addToSet: { tags: tag },
        $set: { updatedAt: new Date() },
      }
    );
  }

  async removetag(id: ObjectId, tag: string) {
    return await this.collection.updateOne(
      { _id: id },
      {
        $pull: { tags: tag },
        $set: { updatedAt: new Date() },
      }
    );
  }

  async togglePin(id: ObjectId, isPinned: boolean) {
    return await this.collection.updateOne(
      { _id: id },
      { $set: { pinned: isPinned, updatedAt: new Date() } }
    );
  }

  async deleteNote(id: ObjectId) {
    return await this.collection.deleteOne({ _id: id });
  }

  async listNotes(page: number, limit: number) {
    const skip = (page - 1) * limit;
    return await this.collection
      .find({})
      .sort({ updatedAt: -1 })
      .project({ body: 0 })
      .skip(skip)
      .limit(limit)
      .toArray();
  }
}
