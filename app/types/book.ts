export interface Book {
  id: number;
  createdAt: string;
  title: string;
  description: string;
  authors: string[];
  publisher: string;
  cover_url: string;
  side_url: string;
  back_url: string;
  height: number;
  length: number;
  width: number;
  weight: number;
  pages: number;
  categories: string[];
  publication_date: string;
  isbn_10: number;
  isbn_13: number;
}
