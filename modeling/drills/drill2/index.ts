import { getDb, closeDb } from '../../../db.js';

interface Post {
  title: string;
  author: {
    id: string;
    name: string;
  };
}

async function run() {
  const db = await getDb('modeling');
  const posts = db.collection<Post>('posts');

  await posts.deleteMany({});
  const dummyPosts: Post[] = Array.from({ length: 1000 }).map((_, i) => ({
    title: `Post #${i + 1}`,
    author: { id: 'auth_1', name: 'Rahul' },
  }));
  await posts.insertMany(dummyPosts);

  console.log('Renaming Author in ALL posts...');
  const start = Date.now();
  const result = await posts.updateMany(
    { 'author.id': 'auth_1' },
    { $set: { 'author.name': 'Ankit' } }
  );
  const duration = Date.now() - start;

  console.log('\n--- Write Amplification Report ---');
  console.table({
    'Total Posts': 1000,
    'Documents Modified': result.modifiedCount,
    'Execution Time': `${duration}ms`,
  });

  await closeDb();
}

run()