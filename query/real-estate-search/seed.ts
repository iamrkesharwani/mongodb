import { getDb, closeDb } from '../../db.js';
import type { Listing } from './type.js';

async function seedListings() {
  const db = await getDb('queries');
  const listings = db.collection<Listing>('listings');

  const cities = ['Kharagpur', 'Kolkata', 'Mumbai', 'Bangalore', 'Delhi'];
  const neighborhoods: Record<string, string[]> = {
    Kharagpur: ['IIT Area', 'Prem Bazar', 'Gole Bazar'],
    Kolkata: ['Salt Lake', 'New Town', 'Park Street', 'Ballygunge'],
    Mumbai: ['Bandra', 'Andheri', 'Juhu', 'Powai'],
    Bangalore: ['Indiranagar', 'Koramangala', 'Whitefield'],
    Delhi: ['Hauz Khas', 'Saket', 'Rohini'],
  };
  const featuresPool = [
    'Gym',
    'Pool',
    'Parking',
    'Garden',
    'Security',
    'Wifi',
    'Balcony',
    'Elevator',
  ];

  const dummyData: Listing[] = Array.from({ length: 300 }).map((_, i) => {
    const city = cities[Math.floor(Math.random() * cities.length)]!;
    const neighborhood =
      neighborhoods[city]![
        Math.floor(Math.random() * neighborhoods[city]!.length)
      ]!;
    const type = Math.random() > 0.3 ? 'sale' : 'rent';
    const area = Math.floor(Math.random() * 4000) + 500;
    const priceBase = type === 'sale' ? 5000 : 20;
    const price = area * priceBase + Math.floor(Math.random() * 1000);

    return {
      title: `${Math.floor(Math.random() * 5) + 1} BHK in ${neighborhood}`,
      type,
      price,
      location: {
        city,
        neighborhood,
        coordinates: [
          Number((87.0 + Math.random()).toFixed(4)),
          Number((22.0 + Math.random()).toFixed(4)),
        ],
      },
      features: featuresPool
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 5) + 2),
      bedrooms: Math.floor(Math.random() * 5) + 1,
      bathrooms: Math.floor(Math.random() * 3) + 1,
      area,
      available: Math.random() > 0.1,
      listedAt: new Date(
        Date.now() - Math.floor(Math.random() * 180) * 24 * 60 * 60 * 1000
      ),
    };
  });

  await listings.deleteMany({});
  await listings.insertMany(dummyData);
  console.log('300 Real Estate listings seeded successfully!');
  await closeDb();
}

seedListings();
