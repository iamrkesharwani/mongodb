import { Collection, ObjectId, type Filter } from 'mongodb';
import type { Listing } from './type.js';

export class ListingRepository {
  constructor(private collection: Collection<Listing>) {}

  async search(filters: any) {
    const query: Filter<Listing> & Record<string, any> = {};

    if (filters.city) query['location.city'] = filters.city;
    if (filters.type) query.type = filters.type;

    if (filters.minPrice || filters.maxPrice) {
      query.price = {};
      if (filters.minPrice) query.price.$gte = filters.minPrice;
      if (filters.maxPrice) query.price.$lte = filters.maxPrice;
    }

    if (filters.features && filters.features.length > 0) {
      query.features = { $all: filters.features };
    }

    if (filters.bedrooms) {
      query.bedrooms = { $gte: filters.bedrooms };
    }

    query.available = true;

    return await this.collection.find(query).sort({ listedAt: -1 }).toArray();
  }

  async findSimilar(listingId: ObjectId) {
    const original = await this.collection.findOne({ _id: listingId });
    if (!original) throw new Error('Listing not found');

    const city = original.location?.city;
    if (!city) throw new Error('Listing has incomplete location data');

    const minPrice = original.price * 0.8;
    const maxPrice = original.price * 1.2;

    const similar = await this.collection
      .find({
        _id: { $ne: listingId },
        'location.city': city,
        type: original.type,
        price: { $lte: maxPrice, $gte: minPrice },
        features: { $in: original.features ?? [] },
      })
      .toArray();

    return similar.filter((item) => {
      const itemFeatures = item.features ?? [];
      const originalFeatures = original.features ?? [];
      const shared = itemFeatures.filter((f) => originalFeatures.includes(f));
      return shared.length >= 2;
    });
  }

  async getByFeatures(required: string[], optional: string[]) {
    const results = await this.collection
      .find({ features: { $all: required } })
      .toArray();

    return results.sort((a, b) => {
      const countA = (a.features ?? []).filter((f) =>
        optional.includes(f)
      ).length;
      const countB = (b.features ?? []).filter((f) =>
        optional.includes(f)
      ).length;
      return countB - countA;
    });
  }

  async countByCity() {
    const cities = await this.collection.distinct('location.city');
    const report: Record<string, number> = {};

    for (const city of cities) {
      report[city] = await this.collection.countDocuments({
        'location.city': city,
      });
    }

    return report;
  }
}
