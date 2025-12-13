import { UserBook } from "@/app/types/user-book";
import { Book } from "@/app/types/book";

/**
 * Flattens the nested book data structure.
 * @param userBooksData - The data to flatten.
 * @returns A flattened array of book data.
 */
export function flattenUserBookData( userBooksData: UserBook[] ) {
  return userBooksData.map( item => {
    const { books, ...userBookData } = item;
    return {
      ...userBookData,
      ...( books as Partial<Book> ), // Type assertion to merge book properties
    };
  } );
}
