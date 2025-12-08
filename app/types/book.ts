export interface Book {
  id: number;
  created_at: string;
  isbn_10?: string | null;
  title?: string | null;
  description?: string | null;
  authors?: string[] | null;
  publisher?: string | null;
  cover_url?: string | null;
  side_url?: string | null;
  back_url?: string | null;
  height: number;
  length: number;
  width: number;
  weight?: number | null;
  pages?: number | null;
  categories?: string[] | null;
  publication_date?: string | null;
  isbn_13?: string | null;
  type?: BookType | null;
}

export type BookType = "bd" | "manga" | "roman";

export const BOOK_TYPE_MAP: Record<BookType, string> = {
  bd: "Comic",
  manga: "Manga",
  roman: "Novel",
};