import { BookCardProps } from "@/components/books/book-poster-card";
import { Badge } from "@/components/ui/badge";
import { BookStateDropdown } from "@/components/books/book-state-dropdown";
import { SessionInfo } from "@/components/sessions/session-info";
import { ReadingSession } from "@/app/types/reading-session";
import { getTranslations } from "next-intl/server";

export interface BookHorizontalCardProps extends BookCardProps {
  readingSessions?: ReadingSession[];
}

export async function BookHorizontalCard( {
                                            book,
                                            profileUserBook,
                                            connectedUserBook,
                                            readingSessions = [],
                                          }: BookHorizontalCardProps ) {
  const t = await getTranslations( "BookCard" );
  const tBookTypes = await getTranslations( "BookTypes" );

  // Find the sessions that belong to the current book
  const bookSessions = readingSessions.filter( ( session ) => session.book_id === book.id );

  const isReadingInProgress = profileUserBook?.state === "reading" && !!profileUserBook.pages;
  const bookTitle = book.title ?? t( "untitled" );

  return (
    <div className="flex gap-4 group border rounded-lg shadow-sm hover:shadow-lg transition-shadow p-3 w-full">
      <div className="flex-shrink-0 w-24 md:w-28">
        { book.cover_url ? (
          <img
            src={ book.cover_url }
            alt={ t( "coverAlt", { title: bookTitle } ) }
            className="w-full h-auto object-cover rounded aspect-[2/3] shadow-md"
          />
        ) : (
          <div className="w-full flex items-center justify-center rounded aspect-[2/3] bg-gray-100 dark:bg-secondary">
            <p className="text-primary text-xs">{ t( "noCover" ) }</p>
          </div>
        ) }
      </div>

      <div className="flex flex-col flex-grow justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-grow min-w-0">
              <h3 className="text-lg font-bold" title={ bookTitle }>
                { bookTitle }
              </h3>
              { book.authors && (
                <p className="text-sm text-muted-foreground">
                  { t( "by", { authors: book.authors.join( ", " ) } ) }
                </p>
              ) }
            </div>
            { book.type && (
              <Badge variant="outline" className="flex-shrink-0">
                { tBookTypes( book.type, { defaultValue: book.type } ) }
              </Badge>
            ) }
          </div>

          {/* Pass the filtered sessions for this specific book to SessionInfo */ }
          <SessionInfo userBook={ profileUserBook } sessions={ bookSessions }/>
        </div>

        <div className="flex items-end justify-between mt-4">
          <div className="text-xs text-muted-foreground">
            { !isReadingInProgress && book.pages && (
              <p>{ t( "pages", { count: book.pages } ) }</p>
            ) }
          </div>
          <div className="w-40 flex-shrink-0">
            <BookStateDropdown bookId={ book.id } currentStateRecord={ connectedUserBook }/>
          </div>
        </div>
      </div>
    </div>
  );
}