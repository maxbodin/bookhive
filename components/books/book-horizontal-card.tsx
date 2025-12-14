import { BOOK_TYPE_MAP } from "@/app/types/book";
import { BookCardProps } from "@/components/books/book-poster-card";
import { Badge } from "@/components/ui/badge";
import { BookStateDropdown } from "@/components/books/book-state-dropdown";

export function BookHorizontalCard( { book, connectedUserBook }: BookCardProps ) {
  return (
    <div
      className="flex gap-4 group border rounded-lg shadow-sm hover:shadow-lg transition-shadow p-3 w-full">
      <div className="flex-shrink-0 w-24 md:w-28">
        { book.cover_url ? (
          <img
            src={ book.cover_url }
            alt={ `Cover of ${ book.title }` }
            className="w-full h-auto object-cover rounded aspect-[2/3] shadow-md"
          />
        ) : (
          <div
            className="w-full flex items-center justify-center rounded aspect-[2/3] bg-gray-100 dark:bg-secondary">
            <p className="text-primary text-xs">No Cover</p>
          </div>
        ) }
      </div>

      <div className="flex flex-col flex-grow justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-grow min-w-0">
              <h3 className="text-lg font-bold" title={ book.title ?? "Untitled" }>
                { book.title ?? "Untitled" }
              </h3>
              { book.authors && (
                <p className="text-sm text-muted-foreground">
                  by { book.authors.join( ", " ) }
                </p>
              ) }
            </div>
            { book.type && (
              <Badge variant="outline"
                     className="flex-shrink-0">{ BOOK_TYPE_MAP[book.type] || book.type }</Badge>
            ) }
          </div>

          {/*<SessionInfo userBook={ profileUserBook }/>*/ }
        </div>

        <div className="flex items-end justify-between mt-4">
          <div className="text-xs text-muted-foreground">
            { book.pages && <p>{ book.pages } pages</p> }
          </div>
          <div className="w-40 flex-shrink-0">
            <BookStateDropdown
              bookId={ book.id }
              currentStateRecord={ connectedUserBook }
            />
          </div>
        </div>
      </div>
    </div>
  );
}