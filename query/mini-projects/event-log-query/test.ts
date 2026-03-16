import { getDb, closeDb } from '../../../db.js';
import { EventLogService } from './service.js';
import type { EventLog } from './type.js';

async function run() {
  const db = await getDb('queries');
  const events = db.collection<EventLog>('events');

  try {
    const service = new EventLogService(events);

    console.log('\n--- Recent Errors (last 30 min) ---');
    const errors = await service.getRecentErrors(30);
    console.log(errors);

    console.log('\n--- User Activity (user_1 last 2 hours) ---');
    const from = new Date(Date.now() - 2 * 60 * 60 * 1000);
    const to = new Date();
    const activity = await service.getUserActivity('user_1', from, to);
    console.log(activity);

    console.log('\n--- Find by Metadata (code = 404) ---');
    const metadataSearch = await service.findByMetadata('code', 404);
    console.log(metadataSearch);

    console.log('\n--- Severity Counts (last 2 hours) ---');
    const counts = await service.getSeverityCounts(from, to);
    console.log(counts);
  } catch (error) {
    console.error(error);
  } finally {
    await closeDb();
  }
}

run();
