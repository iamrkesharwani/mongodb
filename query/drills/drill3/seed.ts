import type { User } from './type.js';
import { getDb, closeDb } from '../../../../db.js';

async function seed() {
  const db = await getDb('queries');
  const users = db.collection<User>('users');

  const dummyUsers: User[] = [
    {
      name: 'Rahul',
      skills: ['TypeScript', 'MongoDB', 'Node.js'],
      addresses: [
        { city: 'Kharagpur', isPrimary: true },
        { city: 'Berlin', isPrimary: false },
      ],
    },
    {
      name: 'Alice',
      skills: ['Python', 'TypeScript'],
      addresses: [{ city: 'Berlin', isPrimary: true }],
    },
    {
      name: 'Bob',
      skills: ['Java', 'Spring'],
      addresses: [{ city: 'New York', isPrimary: true }],
    },
    {
      name: 'Charlie',
      skills: ['MongoDB', 'React', 'CSS'],
      addresses: [
        { city: 'London', isPrimary: true },
        { city: 'Berlin', isPrimary: true },
      ],
    },
    {
      name: 'Dave',
      skills: ['TypeScript', 'Python', 'MongoDB', 'Docker'],
      addresses: [],
    },
  ];

  await users.deleteMany({});
  await users.insertMany(dummyUsers);
  console.log('Users seeded successfully!');
  await closeDb();
}

seed();
