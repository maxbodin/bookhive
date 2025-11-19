import { Book } from "@/app/types/book";
import { createClient } from "@/app/utils/supabase/server";
import { BookStateMap } from "@/app/types/book-state";
import { BookStateDropdown } from "@/components/books/book-state-dropdown";

interface BooksGridProps {
  books: Book[];
}

/**
 * Fetches the current user's book states to populate the dropdowns correctly.
 */
async function getUserBookStates(): Promise<BookStateMap> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return {};

  const { data: userBooks } = await supabase
    .from( "users_books" )
    .select( "book_id, state" )
    .eq( "uid", user.id );

  if (!userBooks) return {};

  // Create a map for quick lookup: { bookId: state }
  return userBooks.reduce( ( acc, book ) => {
    acc[book.book_id] = book.state;
    return acc;
  }, {} as BookStateMap );
}

export async function BooksGrid( { books }: BooksGridProps ) {
  const userBookStates = await getUserBookStates();

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-7 gap-4 p-4">
      { books.map( ( book ) => (
        <div key={ book.id }
             className="flex flex-col justify-between group border rounded-lg shadow-md hover:shadow-xl transition-shadow">
          <div>
            { book.cover_url ? (
              <img
                src={ book.cover_url }
                alt={ `Cover of ${ book.title }` }
                className="w-full h-auto object-cover rounded-t-lg aspect-[2/3]"
              />
            ) : (
              <div className="w-full flex items-center justify-center rounded-t-lg aspect-[2/3] bg-gray-100">
                <p className="text-gray-500 text-sm">No Cover</p>
              </div>
            ) }
            <div className="p-3">
              { book.title ? <h3 className="text-md font-bold" title={ book.title }>
                { book.title }
              </h3> : null }
              { book.authors ? <p className="text-sm text-gray-400">
                { book.authors.join( ", " ) }
              </p> : null }
            </div>
          </div>
          <div className="p-3 pt-0">
            <BookStateDropdown
              bookId={ book.id }
              currentState={ userBookStates[book.id] }
            />
          </div>
        </div>
      ) ) }
    </div>
  );
}