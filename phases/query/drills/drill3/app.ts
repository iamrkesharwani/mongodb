import type { User } from './type.js';
import { getDb, closeDb } from '../../../../db.js';

async function run() {
  const db = await getDb('queries');
  const users = db.collection<User>('users');

  try {
    const eitherSkill = await users
      .find({
        skills: { $in: ['TypeScript', 'Python'] },
      })
      .toArray();
    console.log(`\n[$in] TS or Python experts: ${eitherSkill.length}`);

    const bothSkills = await users
      .find({
        skills: { $all: ['TypeScript', 'MongoDB'] },
      })
      .toArray();
    console.log(`\n[$all] TS + Mongo pros: ${bothSkills.length}`);

    const exactThree = await users
      .find({
        skills: { $size: 3 },
      })
      .toArray();
    console.log(`\n[$size] Users with exactly 3 skills: ${exactThree.length}`);

    const berlinPrimary = await users
      .find({
        addresses: { $elemMatch: { city: 'Berlin', isPrimary: true } },
      })
      .toArray();
    console.log(
      `\n[$elemMatch] Primary Berlin residents: ${berlinPrimary.length}`
    );
  } catch (error) {
    console.error(error);
  } finally {
    await closeDb();
  }
}

run();
