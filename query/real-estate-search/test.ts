import { getDb, closeDb } from '../../db.js';
import { ListingRepository } from './service.js';
import { ObjectId } from 'mongodb';

async function runTests() {
  const db = await getDb('queries');
  const repo = new ListingRepository(db.collection('listings'));

  try {
    console.log('--- Testing Search ---');
    const searchResults = await repo.search({
      city: 'Kolkata',
      type: 'sale',
      bedrooms: 2,
      minPrice: 1000000,
    });
    console.log(`Found ${searchResults.length} matches.`);

    console.log('\n--- Testing countByCity ---');
    const cityCounts = await repo.countByCity();
    console.table(cityCounts);

    console.log('\n--- Testing getByFeatures ---');
    const rankedResults = await repo.getByFeatures(
      ['Parking'],
      ['Gym', 'Pool']
    );
    console.log(
      `Top match has features: ${rankedResults[0]?.features.join(', ')}`
    );

    console.log('\n--- Testing findSimilar ---');
    const randomDoc = await db.collection('listings').findOne({});
    if (randomDoc) {
      console.log(
        `Finding similar for: ${randomDoc.title} (${randomDoc.location.city})`
      );
      const similar = await repo.findSimilar(randomDoc._id as ObjectId);
      console.log(`Found ${similar.length} similar listings.`);
      const first = similar[0];
      if (first) {
        console.log(`Example similar: ${first.title} - Price: ${first.price}`);
      }
    }
  } catch (err) {
    console.error('Test failed:', err);
  } finally {
    await closeDb();
  }
}

runTests();
