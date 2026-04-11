"use client";
import { useEffect, useRef, useState } from "react";
import { UserBook, UserBookStateRecord } from "@/app/types/user-book";
import { BookState } from "@/app/types/book-state";
import { BooksGrid } from "@/components/books/books-grid";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { PaginationBar } from "@/components/pagination/pagination-bar";
import { useShelfPagination } from "@/hooks/use-shelf-pagination";
import { BOOKS_PER_PAGE } from "@/app/utils/searchParams";

interface PaginatedBookshelfProps {
  userId: string;
  initialData: UserBook[];
  totalCount: number;
  shelfState: BookState;
  shelfTitle: string;
  isOwner: boolean;
  initialConnectedUserBooks: UserBookStateRecord[];
  connectedUserId?: string;
  query: string;
  types?: string;
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
                                      query,
                                      types,
                                    }: PaginatedBookshelfProps ) {
  const [isFolded, setIsFolded] = useState( false );
  const sectionRef = useRef<HTMLDivElement>( null );

  // Track user intent: true ONLY when the user explicitly clicks pagination.
  const isPagingRef = useRef( false );

  const { books, connectedBooks, currentPage, isPending, handlePageChange } = useShelfPagination( {
    userId,
    shelfState,
    initialData,
    initialConnectedUserBooks,
    connectedUserId,
    query,
    types,
  } );

  const onPageChangeClick = ( page: number ) => {
    // Prevent setting the flag if the user clicks the currently active page.
    if (page !== currentPage) {
      isPagingRef.current = true;
      handlePageChange( page );
    }
  };

  useEffect( () => {
    // Only scroll if the effect was triggered by an explicit user action.
    if (isPagingRef.current) {
      sectionRef.current?.scrollIntoView( { behavior: "smooth" } );
      // Reset the intent flag immediately after scrolling.
      isPagingRef.current = false;
    }
  }, [currentPage] );

  if (totalCount === 0) {
    return null;
  }

  const totalPages = Math.ceil( totalCount / BOOKS_PER_PAGE );
  const handleToggleFold = () => setIsFolded( ( prev ) => !prev );

  return (
    <section>
      <div ref={ sectionRef } className="scroll-mt-[96px] flex justify-between items-center mb-4 border-b pb-2">
        <button
          type="button"
          onClick={ handleToggleFold }
          aria-expanded={ !isFolded }
          className="w-full flex items-center justify-between text-left rounded-md px-3 py-3 hover:bg-muted/40"
        >
          <h2 className="text-2xl font-bold">
            { shelfTitle } ({ totalCount })
          </h2>
          <span aria-hidden="true">
            { isFolded ? <ChevronDown className="h-5 w-5"/> : <ChevronUp className="h-5 w-5"/> }
          </span>
          <span className="sr-only">{ isFolded ? "expand" : "collapse" }</span>
        </button>
      </div>

      { !isFolded && (
        <div className={ cn( "transition-opacity duration-300", isPending ? "opacity-50" : "opacity-100" ) }>
          <PaginationBar
            currentPage={ currentPage }
            totalPages={ totalPages }
            isPending={ isPending }
            onPageChange={ onPageChangeClick }
          />

          <BooksGrid
            books={ books }
            profileUserBooks={ books }
            connectedUserBooks={ connectedBooks }
            view="poster"
            isOwner={ isOwner }
            readingSessions={ [] }
            isConnected={ !!connectedUserId }
            addFromOLButton={ false }
          />

          <PaginationBar
            currentPage={ currentPage }
            totalPages={ totalPages }
            isPending={ isPending }
            onPageChange={ onPageChangeClick }
          />
        </div>
      ) }
    </section>
  );
}