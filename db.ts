import 'dotenv/config';
import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI as string;
if (!uri) throw new Error('MONGODB_URI not present in environment variable');

let client: MongoClient;

export async function getDb(dbName: string): Promise<Db> {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    console.log('MongoDB Connected!');
  }
  return client.db(dbName);
}

export async function closeDb(): Promise<void> {
  if (client) {
    await client.close();
    console.log('Connection closed.');
  }
}
