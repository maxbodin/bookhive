import { UserBook } from "@/app/types/user-book";
import { BooksGrid } from "@/components/books/books-grid";

interface UserBookshelfProps {
  userBooks: UserBook[];
}

const SHELVES_ORDER = ["reading", "read", "later", "wishlist"] as const;

const SHELF_TITLES: Record<typeof SHELVES_ORDER[number], string> = {
  reading: "Currently Reading",
  read: "Read",
  later: "Bought and waiting to be read",
  wishlist: "Wishlist",
};

export function UserBookshelf( { userBooks }: UserBookshelfProps ) {
  // Group books by their state.
  const booksByState = userBooks.reduce( ( acc, book ) => {
    const state = book.state;
    if (!acc[state]) {
      acc[state] = [];
    }
    acc[state].push( book );
    return acc;
  }, {} as Record<string, UserBook[]> );

  return (
    <div className="space-y-12">
      { SHELVES_ORDER.map( ( shelf ) => {
        const booksOnShelf = booksByState[shelf];
        if (!booksOnShelf || booksOnShelf.length === 0) {
          return null;
        }

        const gridView = shelf === "reading" ? "list" : "poster";

        return (
          <section key={ shelf }>
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">
              { SHELF_TITLES[shelf] } ({ booksOnShelf.length })
            </h2>
            <BooksGrid books={ booksOnShelf } view={ gridView }/>
          </section>
        );
      } ) }
    </div>
  );
}