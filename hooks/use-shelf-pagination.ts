import { useEffect, useState, useTransition } from "react";
import { UserBook, UserBookStateRecord } from "@/app/types/user-book";
import { BookState } from "@/app/types/book-state";
import { getPaginatedUserBooksByState } from "@/app/actions/users-books/getPaginatedUserBooksByState";
import {
  getConnectedUserBooksForDisplayedBooks
} from "@/app/actions/users-books/getConnectedUserBooksForDisplayedBooks";
import { getBookRelationId } from "@/app/utils/books/getBookIdentity";

interface UseShelfPaginationProps {
  userId: string;
  shelfState: BookState;
  initialData: UserBook[];
  initialConnectedUserBooks: UserBookStateRecord[];
  connectedUserId?: string;
  query: string;
  types?: string;
}

export function useShelfPagination( {
                                      userId,
                                      shelfState,
                                      initialData,
                                      initialConnectedUserBooks,
                                      connectedUserId,
                                      query,
                                      types,
                                    }: UseShelfPaginationProps ) {
  const [books, setBooks] = useState<UserBook[]>( initialData );
  const [connectedBooks, setConnectedBooks] = useState<UserBookStateRecord[]>( initialConnectedUserBooks );
  const [currentPage, setCurrentPage] = useState<number>( 1 );
  const [isPending, startTransition] = useTransition();

  useEffect( () => {
    setCurrentPage( 1 );
    setBooks( initialData );
    setConnectedBooks( initialConnectedUserBooks );
  }, [query, types, initialData, initialConnectedUserBooks] );

  const handlePageChange = ( newPage: number ) => {
    // Prevent fetching if already on the target page or if a fetch is in progress.
    if (newPage === currentPage || isPending) return;

    startTransition( async () => {
      try {
        // Fetch the profile's books for the new page using the current query and types filter.
        const { data: newProfileBooks } = await getPaginatedUserBooksByState(
          userId,
          shelfState,
          newPage,
          query,
          types
        );

        let nextConnectedBooks: UserBookStateRecord[] = [];

        // Keep connected-user state in sync with the currently visible page.
        if (connectedUserId && newProfileBooks.length > 0) {
          const newBookIds = Array.from(
            new Set(
              newProfileBooks
                .map( getBookRelationId )
                .filter( ( id ) => Number.isFinite( id ) )
            )
          );

          if (newBookIds.length > 0) {
            nextConnectedBooks = await getConnectedUserBooksForDisplayedBooks(
              connectedUserId,
              newBookIds
            );
          }
        }

        // Commit all state together to avoid rendering books with stale relation data.
        setBooks( newProfileBooks );
        setConnectedBooks( nextConnectedBooks );
        setCurrentPage( newPage );
      } catch (error) {
        console.error( "Error while paginating shelf:", error );
      }
    } );
  };

  return {
    books,
    connectedBooks,
    currentPage,
    isPending,
    handlePageChange,
  };
}
