import { UserBook } from "@/app/types/user-book";
import { BooksGrid } from "@/components/books/books-grid";
import { BookState } from "@/app/types/book-state";
import { ReadingSession } from "@/app/types/reading-session";
import { getTranslations } from "next-intl/server";
import { BooksGridSkeleton } from "@/components/skeletons/books-grid-skeleton";
import { Suspense } from "react";

interface UserBookshelfProps {
  userBooks: UserBook[];                // The profile owner's books.
  isOwner: boolean;
  connectedUserBooks: UserBook[];       // The logged-in user's data with books.
  readingSessions: ReadingSession[];    // The profile owner's reading sessions.
}

const SHELVES_ORDER = ["reading", "read", "later", "wishlist"] as const;

export async function UserBookshelf( { userBooks, isOwner, connectedUserBooks, readingSessions }: UserBookshelfProps ) {
  const t = await getTranslations( "UserBookshelf" );

  const SHELF_TITLES: Record<typeof SHELVES_ORDER[number], string> = {
    reading: t( "reading" ),
    read: t( "read" ),
    later: t( "later" ),
    wishlist: t( "wishlist" ),
  };

  // Group books by their state.
  const userBooksByState = userBooks.reduce( ( acc, userbook ) => {
    const state: BookState = userbook.state;
    if (!acc[state]) {
      acc[state] = [];
    }
    acc[state].push( userbook );
    return acc;
  }, {} as Record<string, UserBook[]> );

  return (
    <div className="space-y-12">
      { SHELVES_ORDER.map( ( shelf ) => {
        const userBooksOnShelf = userBooksByState[shelf];
        if (!userBooksOnShelf || userBooksOnShelf.length === 0) {
          return null;
        }

        const gridView = shelf === "reading" ? "list" : "poster";

        return (
          <section key={ shelf }>
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">
              { SHELF_TITLES[shelf] } ({ userBooksOnShelf.length })
            </h2>
            <Suspense key={ `${ shelf }` } fallback={ <BooksGridSkeleton/> }>
              <BooksGrid
                books={ userBooksOnShelf }
                profileUserBooks={ userBooksOnShelf }
                connectedUserBooks={ connectedUserBooks }
                view={ gridView }
                isOwner={ isOwner }
                readingSessions={ readingSessions }
              />
            </Suspense>
          </section>
        );
      } ) }
    </div>
  );
}