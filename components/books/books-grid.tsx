import { Book } from "@/app/types/book";
import { createClient } from "@/app/utils/supabase/server";
import { NoResults } from "@/components/books/no-results";
import { UserBookRecordMap } from "@/app/types/book-state";
import { BookPosterCard } from "./book-poster-card";
import { BookHorizontalCard } from "./book-horizontal-card";
import { UserBook } from "@/app/types/user-book";

interface BooksGridProps {
  books: Book[];
  view?: "poster" | "list";
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

/**
 * Flexible component that fetches user book data and renders a collection of books.
 */
export async function BooksGrid( { books, view = "poster" }: BooksGridProps ) {
  if (!books || books.length === 0) {
    return <NoResults/>;
  }

  const userBookRecords = await getUserBookRecords();

  // Dynamically set the container's class based on the view prop.
  const containerClasses = view === "poster"
    ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-7 gap-4 p-4"
    : "flex flex-col gap-4 p-2 md:p-4";

  return (
    <div className={ containerClasses }>
      { books.map( ( book ) => {
        const userBookRecord = userBookRecords[book.id];

        return view === "poster" ? (
          <BookPosterCard key={ book.id } book={ book } userBook={ userBookRecord }/>
        ) : (
          <BookHorizontalCard key={ book.id } book={ book } userBook={ userBookRecord }/>
        );
      } ) }
    </div>
  );
}