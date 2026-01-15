import { useState, useTransition } from "react";
import { UserBook } from "@/app/types/user-book";
import { BookState } from "@/app/types/book-state";
import { getPaginatedUserBooksByState } from "@/app/actions/users-books/getPaginatedUserBooksByState";
import {
  getConnectedUserBooksForDisplayedBooks
} from "@/app/actions/users-books/getConnectedUserBooksForDisplayedBooks";

interface UseShelfPaginationProps {
  userId: string;
  shelfState: BookState;
  initialData: UserBook[];
  initialConnectedUserBooks: UserBook[];
  connectedUserId?: string;
}

export function useShelfPagination( {
                                      userId,
                                      shelfState,
                                      initialData,
                                      initialConnectedUserBooks,
                                      connectedUserId,
                                    }: UseShelfPaginationProps ) {
  const [books, setBooks] = useState<UserBook[]>( initialData );
  const [connectedBooks, setConnectedBooks] = useState<UserBook[]>( initialConnectedUserBooks );
  const [currentPage, setCurrentPage] = useState<number>( 1 );
  const [isPending, startTransition] = useTransition();

  const handlePageChange = ( newPage: number ) => {
    // Prevent fetching if already on the target page or if a fetch is in progress.
    if (newPage === currentPage || isPending) return;

    startTransition( async () => {
      // Fetch the profile's books for the new page.
      const { data: newProfileBooks } = await getPaginatedUserBooksByState( userId, shelfState, newPage );

      setBooks( newProfileBooks );
      setCurrentPage( newPage );

      // If a user is connected, fetch their specific data for these new books.
      if (connectedUserId && newProfileBooks.length > 0) {
        const newBookIds = newProfileBooks.map( ( b ) => b.book_id );
        const newConnectedData = await getConnectedUserBooksForDisplayedBooks( connectedUserId, newBookIds );

        setConnectedBooks( ( prev ) => {
          const bookMap = new Map( prev.map( ( b ) => [b.book_id, b] ) );
          newConnectedData.forEach( ( b ) => bookMap.set( b.book_id, b ) );
          return Array.from( bookMap.values() );
        } );
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
