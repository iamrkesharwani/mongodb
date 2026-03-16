import { getDb, closeDb } from '../../../db.js';
import type { Book } from './types.js';

async function main() {
  const db = await getDb('library');
  const booksCollection = db.collection<Book>('books');

  const myBooks: Book[] = [
    {
      title: 'The Great Gatsby',
      publishedYear: 1925,
      genres: ['Classic', 'Fiction'],
      author: { name: 'F. Scott Fitzgerald', nationality: 'American' },
      isAvailable: true,
    },
    {
      title: '1984',
      publishedYear: 1949,
      genres: ['Dystopian', 'Sci-Fi'],
      author: { name: 'George Orwell', nationality: 'British' },
      isAvailable: true,
    },
    {
      title: 'The Hobbit',
      publishedYear: 1937,
      genres: ['Fantasy'],
      author: { name: 'J.R.R. Tolkien', nationality: 'British' },
      isAvailable: false,
    },
    {
      title: 'To Kill a Mockingbird',
      publishedYear: 1960,
      genres: ['Classic', 'Drama'],
      author: { name: 'Harper Lee', nationality: 'American' },
      isAvailable: true,
    },
    {
      title: 'Brave New World',
      publishedYear: 1932,
      genres: ['Dystopian', 'Fiction'],
      author: { name: 'Aldous Huxley', nationality: 'British' },
      isAvailable: true,
    },
    {
      title: 'The Catcher in the Rye',
      publishedYear: 1951,
      genres: ['Fiction'],
      author: { name: 'J.D. Salinger', nationality: 'American' },
      isAvailable: false,
    },
    {
      title: 'Moby Dick',
      publishedYear: 1851,
      genres: ['Adventure'],
      author: { name: 'Herman Melville', nationality: 'American' },
      isAvailable: true,
    },
    {
      title: 'War and Peace',
      publishedYear: 1869,
      genres: ['Historical', 'Classic'],
      author: { name: 'Leo Tolstoy', nationality: 'Russian' },
      isAvailable: true,
    },
    {
      title: 'Ulysses',
      publishedYear: 1922,
      genres: ['Modernist'],
      author: { name: 'James Joyce', nationality: 'Irish' },
      isAvailable: false,
    },
    {
      title: 'The Odyssey',
      publishedYear: -800,
      genres: ['Epic', 'Mythology'],
      author: { name: 'Homer', nationality: 'Greek' },
      isAvailable: true,
    },
  ];

  try {
    await booksCollection.deleteMany({});
    const result = await booksCollection.insertMany(myBooks);
    console.log(`${result.insertedCount} books successfully added!`);

    const allBooks = await booksCollection.find({}).toArray();
    console.log('\n--- My Personal Library ---');
    allBooks.forEach((book) => {
      console.log(
        `${book.title} by ${book.author.name} [${book.publishedYear}]`
      );
    });
  } catch (error) {
    console.error(error);
  } finally {
    await closeDb();
  }
}

main();
