import { Book, BOOK_TYPE_MAP } from "@/app/types/book";
import { BookStateDropdown } from "@/components/books/book-state-dropdown";
import { Badge } from "@/components/ui/badge";
import { UserBook } from "@/app/types/user-book";


export interface BookCardProps {
  book: Book;
  userBook?: UserBook;
}

export function BookPosterCard( { book, userBook }: BookCardProps ) {
  return (
    <div
      key={ book.id }
      className="flex flex-col justify-between group border rounded-lg shadow-md hover:shadow-xl transition-shadow">
      <div>
        <div className="relative">
          { book.cover_url ? (
            <img
              src={ book.cover_url }
              alt={ `Cover of ${ book.title }` }
              className="w-full h-auto object-cover rounded-t-lg aspect-[2/3]"
            />
          ) : (
            <div
              className="w-full flex items-center justify-center rounded-t-lg aspect-[2/3] bg-gray-100 dark:bg-secondary">
              <p className="text-primary text-sm">No Cover</p>
            </div>
          ) }
          { book.type && (
            <Badge variant="secondary" className="absolute top-2 right-2">
              { BOOK_TYPE_MAP[book.type] || book.type }
            </Badge>
          ) }
        </div>

        <div className="p-3">
          <h3 className="text-md font-bold" title={ book.title ?? "Untitled" }>
            { book.title ?? "Untitled" }
          </h3>
          { book.authors && (
            <p className="text-sm text-muted-foreground">
              { book.authors.join( ", " ) }
            </p>
          ) }
        </div>
      </div>

      {/* Bottom section with the interactive dropdown */ }
      <div className="p-3 pt-0 mt-auto">
        <BookStateDropdown
          bookId={ book.id }
          currentStateRecord={ userBook }
        />
      </div>
    </div>
  );
}