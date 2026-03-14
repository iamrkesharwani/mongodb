import { ObjectId } from 'mongodb';

for (let i = 0; i < 10; i++) {
  const id = new ObjectId();
  console.log(id.toString(), '| created at:', id.getTimestamp());
}
