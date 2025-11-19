import { Book } from "@/app/types/book";
import { BookState } from "@/app/types/book-state";

export interface UserBook extends Book {
  state: BookState;
  uid: string;
}