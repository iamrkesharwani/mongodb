import { type Filter, Collection } from 'mongodb';
import type { JobListing, JobSearchParams } from './type.js';

export async function searchJobs(
  collection: Collection<JobListing>,
  params: JobSearchParams
) {
  const query: Filter<JobListing> = {};

  if (params.skills && params.skills.length > 0) {
    query.skills = { $in: params.skills } as any;
  }

  if (params.remote !== undefined) {
    query.remote = params.remote;
  }

  if (params.location) {
    query.location = { $regex: params.location, $options: 'i' } as any;
  }

  if (params.minSalary || params.maxSalary) {
    if (params.minSalary) {
      query['salary.max'] = { $gte: params.minSalary };
    }
    if (params.maxSalary) {
      query['salary.min'] = { $lte: params.maxSalary };
    }
  }

  if (params.daysOld) {
    const cutOffDate = new Date(
      Date.now() - params.daysOld * 24 * 60 * 60 * 1000
    );
    query.postedAt = { $gte: cutOffDate };
  }

  return await collection.find(query).sort({ postedAt: -1 }).toArray();
}
