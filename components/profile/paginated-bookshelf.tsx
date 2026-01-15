"use client";
import { useState } from "react";
import { UserBook } from "@/app/types/user-book";
import { BookState } from "@/app/types/book-state";
import { BooksGrid } from "@/components/books/books-grid";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { BOOKS_PER_PAGE } from "@/app/searchParams";
import { cn } from "@/lib/utils";
import { PaginationBar } from "@/components/pagination/pagination-bar";
import { useShelfPagination } from "@/hooks/use-shelf-pagination";

interface PaginatedBookshelfProps {
  userId: string;
  initialData: UserBook[];
  totalCount: number;
  shelfState: BookState;
  shelfTitle: string;
  isOwner: boolean;
  initialConnectedUserBooks: UserBook[];
  connectedUserId?: string;
}

export function PaginatedBookshelf( {
                                      userId,
                                      initialData,
                                      totalCount,
                                      shelfState,
                                      shelfTitle,
                                      isOwner,
                                      initialConnectedUserBooks,
                                      connectedUserId,
                                    }: PaginatedBookshelfProps ) {
  const [isFolded, setIsFolded] = useState( false );

  // Use custom hook for data logic
  const { books, connectedBooks, currentPage, isPending, handlePageChange } = useShelfPagination( {
    userId,
    shelfState,
    initialData,
    initialConnectedUserBooks,
    connectedUserId,
  } );

  if (totalCount === 0) {
    return null;
  }

  const totalPages = Math.ceil( totalCount / BOOKS_PER_PAGE );

  return (
    <section>
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h2 className="text-2xl font-bold">
          { shelfTitle } ({ totalCount })
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={ () => setIsFolded( !isFolded ) }
          aria-expanded={ !isFolded }
        >
          { isFolded ? <ChevronDownIcon className="h-5 w-5"/> : <ChevronUpIcon className="h-5 w-5"/> }
          <span className="sr-only">{ isFolded ? "expand" : "collapse" }</span>
        </Button>
      </div>

      { !isFolded && (
        <div className={ cn( "transition-opacity duration-300", isPending ? "opacity-50" : "opacity-100" ) }>
          <PaginationBar
            currentPage={ currentPage }
            totalPages={ totalPages }
            isPending={ isPending }
            onPageChange={ handlePageChange }
          />

          <BooksGrid
            books={ books }
            profileUserBooks={ books }
            connectedUserBooks={ connectedBooks }
            view="poster"
            isOwner={ isOwner }
            readingSessions={ [] }
          />

          <PaginationBar
            currentPage={ currentPage }
            totalPages={ totalPages }
            isPending={ isPending }
            onPageChange={ handlePageChange }
          />
        </div>
      ) }
    </section>
  );
}