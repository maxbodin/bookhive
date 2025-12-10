import { Book } from "@/app/types/book";
import { BookState } from "@/app/types/book-state";

export interface UserBook extends Book {
  uid: string;
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