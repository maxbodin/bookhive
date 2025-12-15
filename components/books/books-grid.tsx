import { Book } from "@/app/types/book";
import { NoResults } from "@/components/books/no-results";
import { BookPosterCard } from "./book-poster-card";
import { BookHorizontalCard } from "./book-horizontal-card";
import { UserBook } from "@/app/types/user-book";
import { ReadingSession } from "@/app/types/reading-session";
import { cookies } from "next/headers";
import { LayoutGrid, Rows } from "lucide-react";
import { toggleDisplayMode } from "@/components/books/toggleDisplayMode";

interface BooksGridProps {
  books: Book[];
  profileUserBooks: UserBook[];         // The profile owner's books
  connectedUserBooks?: UserBook[];      // The logged-in user's data with books
  view: "poster" | "list";
  isOwner: boolean;
  readingSessions: ReadingSession[];    // The profile owner's reading sessions
}

/**
 * Flexible component that renders a collection of books, handling multiple user contexts
 * and allowing display mode switching between grid and carousel for poster view.
 */
export async function BooksGrid( {
                                   books,
                                   profileUserBooks,
                                   connectedUserBooks,
                                   view = "poster",
                                   isOwner = false,
                                   readingSessions
                                 }: BooksGridProps ) {
  if (!books || books.length === 0) {
    return <NoResults/>;
  }

  const displayMode = ( await cookies() ).get( "display_mode" )?.value ?? "grid";

  // Determine if the carousel view should be active.
  const isCarousel = displayMode === "carousel" && view === "poster";

  const containerClasses = isCarousel
    ? "flex gap-4 overflow-x-auto p-4"                                              // Horizontal scrollable container for carousel
    : view === "poster"
      ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-7 gap-4 p-4"   // Grid for posters
      : "flex flex-col gap-4 p-2 md:p-4";                                           // Vertical list

  return (
    <section className="w-full">
      <div className="relative w-full">
        { view === "poster" && (
          <form
            action={ toggleDisplayMode }
            className="absolute right-2 z-10"
          >
            <button
              type="submit"
              className="inline-flex items-center justify-center p-2 rounded-md border text-sm font-medium bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
              title={ `Switch to ${ isCarousel ? "Grid" : "Carousel" } View` }
            >
              { isCarousel ? (
                <LayoutGrid className="h-5 w-5"/>
              ) : (
                <Rows className="h-5 w-5"/>
              ) }
              <span className="sr-only">
                { isCarousel ? "Grid View" : "Carousel View" }
              </span>
            </button>
          </form>
        ) }

        <div className={ containerClasses }>
          { books.map( ( book ) => {
            // Find the specific user-book record for the profile owner and the connected user.
            const profileUserBook = profileUserBooks.find( ub => ub.book_id === book.id );
            const connectedUserBook = connectedUserBooks?.find( ub => ub.book_id === book.id );

            return view === "poster" || isCarousel ? (
              <BookPosterCard
                key={ book.id }
                book={ book }
                profileUserBook={ profileUserBook }
                connectedUserBook={ connectedUserBook }
                isOwner={ isOwner }
                inFavoriteSection={ false }
              />
            ) : (
              <BookHorizontalCard
                key={ book.id }
                book={ book }
                profileUserBook={ profileUserBook }
                connectedUserBook={ connectedUserBook }
                isOwner={ isOwner }
                inFavoriteSection={ false }
                readingSessions={ readingSessions }
              />
            );
          } ) }
        </div>
      </div>
    </section>
  );
}