import { getDb, closeDb } from '../../../db.js';

async function seedTickets() {
  const db = await getDb('indexing');
  const collection = db.collection('support_tickets');

  await collection.deleteMany({});
  console.log('Cleaning collection...');

  const TOTAL = 100_000;
  const BATCH_SIZE = 10_000;

  for (let i = 0; i < TOTAL / BATCH_SIZE; i++) {
    const batch = Array.from({ length: BATCH_SIZE }).map((_, j) => {
      const isOpen = Math.random() < 0.1;

      return {
        ticketId: `TICK-${i}-${j}`,
        assigneeId: `agent_${Math.floor(Math.random() * 50)}`,
        status: isOpen ? 'open' : 'closed',
        subject: 'Problem with the system ' + j,
        createdAt: new Date(),
      };
    });

    await collection.insertMany(batch);
    console.log(`Seeded: ${(i + 1) * BATCH_SIZE} / ${TOTAL}`);
  }

  console.log('Seeding Complete!');
  await closeDb();
}

seedTickets().catch(console.error);
