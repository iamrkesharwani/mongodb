export interface AuthorSnapshot {
  name: string;
  nationality: string;
}

export interface Book {
  title: string;
  publishedYear: number;
  genres: string[];
  author: AuthorSnapshot;
  isAvailable: boolean;
}
