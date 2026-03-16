import { getDb, closeDb } from '../../../db.js';
import { searchJobs } from './app.js';
import type { JobListing } from './type.js';

async function run() {
  const db = await getDb('queries');
  const JobListings = db.collection<JobListing>('JobListings');
  try {
    const searchParams = {
      skills: ['TypeScript', 'Node.js'],
      minSalary: 500000,
      maxSalary: 2000000,
      remote: true,
      location: 'Bangalore',
      daysOld: 20,
    };

    const result = await searchJobs(JobListings, searchParams);
    console.table(result);
  } catch (error) {
    console.error(error);
  } finally {
    await closeDb();
  }
}

run();
