import { Book } from "@/app/types/book";
import { createClient } from "@/app/utils/supabase/server";
import { BookStateDropdown } from "@/components/books/book-state-dropdown";
import { NoResults } from "@/components/books/no-results";
import { UserBookRecordMap } from "@/app/types/book-state";
import { UserBook } from "@/app/types/user-book";

interface BooksGridProps {
  books: Book[];
}

/**
 * Fetches the current user's full book records to populate the dropdowns correctly.
 */
async function getUserBookRecords(): Promise<UserBookRecordMap> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return {};

  const { data: userBooks } = await supabase
    .from( "users_books" )
    .select( "*" )
    .eq( "uid", user.id );

  if (!userBooks) return {};

  return userBooks.reduce( ( acc, bookRecord ) => {
    acc[bookRecord.book_id] = bookRecord as UserBook;
    return acc;
  }, {} as UserBookRecordMap );
}

export async function BooksGrid( { books }: BooksGridProps ) {
  if (!books || books.length === 0) {
    return <NoResults/>;
  }

  const userBookRecords = await getUserBookRecords();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-7 gap-4 p-4">
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
              currentStateRecord={ userBookRecords[book.id] }
            />
          </div>
        </div>
      ) ) }
    </div>
  );
}