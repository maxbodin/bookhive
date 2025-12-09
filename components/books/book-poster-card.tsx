import { Book, BOOK_TYPE_MAP } from "@/app/types/book";
import { BookStateDropdown } from "@/components/books/book-state-dropdown";
import { Badge } from "@/components/ui/badge";
import { UserBook } from "@/app/types/user-book";
import { FavoriteToggleButton } from "@/components/books/favorite-toggle-button";

export interface BookCardProps {
  book: Book;
  userBook?: UserBook;
  isOwner?: boolean;
}

/**
 *
 * @param book
 * @param userBook
 * @param isOwner
 * @constructor
 */
function FavoriteBookCover( { book, userBook, isOwner }: BookCardProps ) {
  const isRead = userBook?.state === "read";

  return (
    <div className="relative group rounded-lg shadow-md">
      { book.cover_url ? (
        <img
          src={ book.cover_url }
          alt={ `Cover of ${ book.title }` }
          className="w-full h-auto object-cover rounded-lg aspect-[2/3]"
        />
      ) : (
        <div
          className="w-full flex items-center justify-center rounded-lg aspect-[2/3] bg-gray-100 dark:bg-secondary">
          <p className="text-primary text-sm">No Cover</p>
        </div>
      ) }
      { isOwner && isRead && (
      <FavoriteToggleButton
        bookId={ book.id }
        isFavorite={ true }
      />)}
    </div>
  );
}

/**
 * Composant pour afficher la carte de livre standard avec toutes les informations.
 * @param book
 * @param userBook
 * @param isOwner
 * @constructor
 */
function StandardBookCard( { book, userBook, isOwner }: BookCardProps ) {
  const isRead = userBook?.state === "read";
  const isFavorite = userBook?.is_favorite || false;

  return (
    <div
      className="flex flex-col justify-between group border rounded-lg shadow-md">
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
          { isOwner && isRead && (
            <FavoriteToggleButton
              bookId={ book.id }
              isFavorite={ isFavorite }
            />
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

      <div className="p-3 pt-0 mt-auto">
        <BookStateDropdown
          bookId={ book.id }
          currentStateRecord={ userBook }
        />
      </div>
    </div>
  );
}

export function BookPosterCard( { book, userBook, isOwner }: BookCardProps ) {
  const isFavorite = userBook?.is_favorite || false;

  if (isFavorite) {
    return <FavoriteBookCover book={ book } userBook={ userBook } isOwner={ isOwner }/>;
  }

  return <StandardBookCard book={ book } userBook={ userBook } isOwner={ isOwner }/>;
}