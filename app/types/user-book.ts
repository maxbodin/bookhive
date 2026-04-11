import { Book } from "@/app/types/book";
import { BookState } from "@/app/types/book-state";

export interface UserBook extends Book {
  uid: string;
  books: Book[];
  book_id: number;
  state: BookState;
  start_reading_date?: string | null;
  end_reading_date?: string | null;
  read_date?: string | null;
  start_wishlist_date?: string | null;
  end_wishlist_date?: string | null;
  start_later_date?: string | null;
  end_later_date?: string | null;
  is_favorite: boolean;
  current_page: number;
  id: number;
}

export type UserBookStateRecord = Pick<
  UserBook,
  | "id"
  | "uid"
  | "book_id"
  | "state"
  | "current_page"
  | "is_favorite"
  | "start_reading_date"
  | "end_reading_date"
  | "read_date"
  | "start_wishlist_date"
  | "end_wishlist_date"
  | "start_later_date"
  | "end_later_date"
>;

export type UserBookWithNestedBook = UserBookStateRecord & {
  books: Partial<Book>[] | Partial<Book> | null;
};