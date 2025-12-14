import { Book, BOOK_TYPE_MAP } from "@/app/types/book";
import { BookStateDropdown } from "@/components/books/book-state-dropdown";
import { Badge } from "@/components/ui/badge";
import { UserBook } from "@/app/types/user-book";
import { FavoriteToggleButton } from "@/components/books/favorite-toggle-button";

// Shared interface for props used by all card types
interface BookCardSharedProps {
  book: Book;
  profileUserBook?: UserBook;   // Data from the user whose profile is being viewed
  connectedUserBook?: UserBook; // Data from the logged-in user
  isOwner: boolean;
}

// Props for the main exported component
export interface BookCardProps extends BookCardSharedProps {
  inFavoriteSection: boolean;
}

/**
 * Renders a minimalist book cover.
 * The interactive favorite button reflects the CONNECTED user's status.
 */
function FavoriteBookCover( { book, connectedUserBook }: BookCardSharedProps ) {
  const isConnectedUserFavorite = connectedUserBook?.is_favorite || false;
  // A user can only favorite a book if they are connected and have it marked as 'read'.
  const canToggleFavorite = connectedUserBook?.state === "read";

  return (
    <div className="relative group rounded-lg shadow-md">
      { book.cover_url ? (
        <img src={ book.cover_url } alt={ `Cover of ${ book.title }` }
             className="w-full h-auto object-cover rounded-lg aspect-[2/3]"/>
      ) : (
        <div className="w-full flex items-center justify-center rounded-lg aspect-[2/3] bg-gray-100 dark:bg-secondary">
          <p className="text-primary text-sm">No Cover</p>
        </div>
      ) }
      {/* The toggle button is only shown if the connected user can interact with it. */ }
      { canToggleFavorite && (
        <FavoriteToggleButton bookId={ book.id } isFavorite={ isConnectedUserFavorite }/>
      ) }
    </div>
  );
}

/**
 * Renders the full book card with details and actions.
 * The favorite button's state is tied to the CONNECTED user.
 */
function StandardBookCard( { book, connectedUserBook }: BookCardSharedProps ) {
  const isConnectedUserFavorite = connectedUserBook?.is_favorite || false;
  const canToggleFavorite = connectedUserBook?.state === "read";

  return (
    <div className="flex flex-col justify-between group border rounded-lg shadow-md">
      <div>
        <div className="relative">
          { book.cover_url ? (
            <img src={ book.cover_url } alt={ `Cover of ${ book.title }` }
                 className="w-full h-auto object-cover rounded-t-lg aspect-[2/3]"/>
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
          {/* Show the favorite toggle if the connected user has read the book. */ }
          { canToggleFavorite && (
            <FavoriteToggleButton bookId={ book.id } isFavorite={ isConnectedUserFavorite }/>
          ) }
        </div>
        <div className="p-3">
          <h3 className="text-md font-bold" title={ book.title ?? "Untitled" }>
            { book.title ?? "Untitled" }
          </h3>
          { book.authors && (
            <p className="text-sm text-muted-foreground">{ book.authors.join( ", " ) }</p>
          ) }
        </div>
      </div>
      <div className="p-3 pt-0 mt-auto">
        {/* The state dropdown for actions is based on the connected user's data. */ }
        <BookStateDropdown bookId={ book.id } currentStateRecord={ connectedUserBook }/>
      </div>
    </div>
  );
}


/**
 * Main component that decides whether to render a standard card or a favorite cover.
 */
export function BookPosterCard( {
                                  book,
                                  profileUserBook,
                                  connectedUserBook,
                                  isOwner,
                                  inFavoriteSection
                                }: BookCardProps ) {
  if (inFavoriteSection) {
    // In the "Favorites" section, always render the minimalist cover.
    // It still receives `connectedUserBook` to allow the connected user to take action.
    return <FavoriteBookCover book={ book } profileUserBook={ profileUserBook } connectedUserBook={ connectedUserBook }
                              isOwner={ isOwner }/>;
  }

  // In all other shelves, render the standard, detailed card.
  return <StandardBookCard book={ book } profileUserBook={ profileUserBook } connectedUserBook={ connectedUserBook }
                           isOwner={ isOwner }/>;
}