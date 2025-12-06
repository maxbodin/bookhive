import { UserBook } from "@/app/types/user-book";

/**
 * Sorts books in a natural order:
 * first by the length of the authors' names (shorter first), then by title alphabetically.
 * @param formattedBooks
 */
export function sortNatural( formattedBooks: UserBook[] ) : UserBook[] {
  return formattedBooks.sort( ( a: UserBook, b: UserBook ) => {
    const aAuthorsLength = a.authors?.join( "," ).length ?? 0;
    const bAuthorsLength = b.authors?.join( "," ).length ?? 0;

    if (aAuthorsLength !== bAuthorsLength) {
      return aAuthorsLength - bAuthorsLength;
    }

    const aTitle = a.title ?? "";
    const bTitle = b.title ?? "";
    return aTitle.localeCompare( bTitle );
  } );
}