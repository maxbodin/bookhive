"use client";

import { useMemo } from "react";
import { Book } from "@/app/types/book";
import { NoResults } from "@/components/books/no-results";
import { BookPosterCard } from "./book-poster-card";
import { BookHorizontalCard } from "./book-horizontal-card";
import { UserBook } from "@/app/types/user-book";
import { ReadingSession } from "@/app/types/reading-session";
import { MultiSelect } from "@/components/ui/multi-select";
import { useBookFilter } from "@/hooks/use-book-filter";
import { BookState } from "@/app/types/book-state";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface BooksGridProps {
  books: Book[];
  profileUserBooks: UserBook[];         // The profile owner's books
  connectedUserBooks?: UserBook[];      // The logged-in user's data with books
  view: "poster" | "list";
  isOwner: boolean;
  readingSessions: ReadingSession[];    // The profile owner's reading sessions
  addFromOLButton: boolean;
  isConnected?: boolean;
}

type BookStateFilterValue = BookState | "none";

/**
 * Flexible component that renders a collection of books, handling multiple user contexts
 * and allowing display mode switching between grid and carousel for poster view.
 *
 * @param books
 * @param profileUserBooks
 * @param connectedUserBooks
 * @param view
 * @param isOwner
 * @param readingSessions
 * @param addFromOLButton
 * @param isConnected
 * @constructor
 */
export function BooksGrid( {
                             books,
                             profileUserBooks,
                             connectedUserBooks = [],
                             view = "poster",
                             isOwner = false,
                             readingSessions,
                             addFromOLButton,
                             isConnected = false,
                           }: BooksGridProps ) {
  const tBookStateDropdown = useTranslations( "BookStateDropdown.states" );
  const t = useTranslations( "BooksGrid" );

  const FILTER_OPTIONS: { label: string; value: BookStateFilterValue }[] = [
    { label: tBookStateDropdown( "read" ), value: "read" },
    { label: tBookStateDropdown( "reading" ), value: "reading" },
    { label: tBookStateDropdown( "later" ), value: "later" },
    { label: tBookStateDropdown( "wishlist" ), value: "wishlist" },
    { label: tBookStateDropdown( "none" ), value: "none" },
  ];

  const [selectedStates, setSelectedStates] = useBookFilter();

  // If viewing own profile, "reset" the applied filters for this render pass.
  const appliedFilters = isOwner ? [] : selectedStates;

  // Find the specific user-book record for the profile owner and the connected user.
  const { profileBooksMap, connectedBooksMap } = useMemo( () => {
    const pMap = new Map<number, UserBook>();
    profileUserBooks.forEach( ( ub ) => pMap.set( ub.book_id, ub ) );

    const cMap = new Map<number, UserBook>();
    connectedUserBooks.forEach( ( ub ) => cMap.set( ub.book_id, ub ) );

    return { profileBooksMap: pMap, connectedBooksMap: cMap };
  }, [profileUserBooks, connectedUserBooks] );

  if (!books || books.length === 0) {
    return <NoResults/>;
  }

  const containerClasses =
    view === "poster"
      ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-7 gap-4 p-4 mt-4"    // Grid for posters.
      : "flex flex-col gap-4 p-2 md:p-4 mt-4";                                            // Vertical list.

  return (
    <section className="w-full">
      <div className="relative w-full">

        {/* Displayed only if connected and not on the user's own profile. */ }
        { isConnected && !isOwner && (
          <div className="flex justify-end px-4">
            <MultiSelect
              options={ FILTER_OPTIONS }
              selectedValues={ appliedFilters }
              onSelectionChange={ setSelectedStates }
              placeholder={ t( "filter" ) }
              className="w-[200px]"
            />
          </div>
        ) }

        <div className={ containerClasses }>
          { books.map( ( book ) => {
            const profileUserBook = profileBooksMap.get( book.id );
            const connectedUserBook = connectedBooksMap.get( book.id );

            // Treat missing state natively as "none".
            const bookStateForFilter = connectedUserBook?.state || "none";

            // Fade the book if filters are active and its state isn't included.
            const isFaded =
              appliedFilters.length > 0 &&
              !appliedFilters.includes( bookStateForFilter );

            return (
              <div
                key={ book.id }
                className={ cn(
                  "h-full transition-all duration-300",
                  isFaded ? "opacity-40 grayscale" : "opacity-100"
                ) }
              >
                { view === "poster" ? (
                  <BookPosterCard
                    book={ book }
                    profileUserBook={ profileUserBook }
                    connectedUserBook={ connectedUserBook }
                    inFavoriteSection={ false }
                    addFromOLButton={ addFromOLButton }
                  />
                ) : (
                  <BookHorizontalCard
                    book={ book }
                    profileUserBook={ profileUserBook }
                    connectedUserBook={ connectedUserBook }
                    inFavoriteSection={ false }
                    readingSessions={ readingSessions }
                    addFromOLButton={ false }/>
                ) }
              </div>
            );
          } ) }
        </div>
      </div>
    </section>
  );
}