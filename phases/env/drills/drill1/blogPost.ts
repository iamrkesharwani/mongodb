export interface BlogPost {
  title: string;
  content: string;
  author: {
    name: string;
    bio?: string;
  };
  comments?: {
    username: string;
    text: string;
    createdAt: Date;
  }[];
}
