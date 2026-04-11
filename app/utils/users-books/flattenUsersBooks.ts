import { UserBookStateRecord, UserBookWithNestedBook } from "@/app/types/user-book";
import { Book } from "@/app/types/book";

/**
 * Flattens the nested book data structure.
 * @param userBooksData - The data to flatten.
 * @returns A flattened array of book data.
 */
export function flattenUsersBooksData( userBooksData: UserBookWithNestedBook[] ):
  Array<UserBookStateRecord & Partial<Book>> {
  return userBooksData.map( item => {
    const { books, ...userBookData } = item;

    const normalizedBookData = Array.isArray( books ) ? books[0] : books;

    return {
      ...userBookData,
      ...( normalizedBookData || {} ),
    };
  } );
}
