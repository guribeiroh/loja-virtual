export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  category: string;
  coverImage?: string;
  isbn?: string;
  publishYear?: number;
  language?: string;
  pageCount?: number;
} 