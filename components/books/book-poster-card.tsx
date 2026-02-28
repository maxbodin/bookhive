import { Book } from "@/app/types/book";
import { BookStateDropdown } from "@/components/books/book-state-dropdown";
import { Badge } from "@/components/ui/badge";
import { UserBook } from "@/app/types/user-book";
import { FavoriteToggleButton } from "@/components/books/favorite-toggle-button";
import { useTranslations } from "next-intl";
import { AddBookButton } from "@/components/open-library/add-book-button";
import { ROUTES } from "@/app/utils/routes";
import OptionalLink from "@/components/ui/optional-link";
import BookCover from "@/components/books/book-cover";

// Shared interface for props used by all card types
interface BookCardSharedProps {
  book: Book;
  profileUserBook?: UserBook;   // Data from the user whose profile is being viewed
  connectedUserBook?: UserBook; // Data from the logged-in user
  addFromOLButton: boolean;
}

// Props for the main exported component
export interface BookCardProps extends BookCardSharedProps {
  inFavoriteSection: boolean;
}


/**
 * Renders the minimalist favorite book cover.
 *
 * @param book
 * @param connectedUserBook
 * @constructor
 */
function FavoriteBookCover( { book, connectedUserBook }: BookCardSharedProps ) {
  const isConnectedUserFavorite = connectedUserBook?.is_favorite || false;
  // A user can only favorite a book if they are connected and have it marked as 'read'.
  const canToggleFavorite = connectedUserBook?.state === "read";

  return (
    <OptionalLink
      isLink={ true }
      href={ `/${ ROUTES.BOOK }/${ book.id }?ref=fav` }
      className="relative group rounded-lg shadow-md block"
    >
      <BookCover book={ book } className="rounded-lg" transitionSuffix="fav"/>
      {/* The toggle button is only shown if the connected user can interact with it. */ }
      { canToggleFavorite && (
        <FavoriteToggleButton bookId={ book.id } isFavorite={ isConnectedUserFavorite }/>
      ) }
    </OptionalLink>
  );
}

/**
 * Renders the full standard book card with details and actions.
 * The favorite button's state is tied to the CONNECTED user.
 *
 * @param book
 * @param connectedUserBook
 * @param addFromOLButton
 * @constructor
 */
function StandardBookCard( { book, connectedUserBook, addFromOLButton }: BookCardSharedProps ) {
  const tBookTypes = useTranslations( "BookTypes" );

  const isConnectedUserFavorite = connectedUserBook?.is_favorite || false;
  const canToggleFavorite = connectedUserBook?.state === "read";

  return (
    <div className="flex flex-col justify-between group border rounded-lg shadow-md h-full w-full overflow-hidden">
      <div>
        <div className="relative">
          <OptionalLink
            isLink={ !addFromOLButton }
            href={ `/${ ROUTES.BOOK }/${ book.id }?ref=std` }
            className="block rounded-t-lg"
          >
            <BookCover book={ book } className="rounded-t-lg" transitionSuffix="std"/>
          </OptionalLink>

          { book.type && (
            <Badge variant="secondary" className="absolute top-2 right-2">
              { tBookTypes( book.type ) }
            </Badge>
          ) }
          {/* Show the favorite toggle if the connected user has read the book. */ }
          { canToggleFavorite && (
            <FavoriteToggleButton bookId={ book.id } isFavorite={ isConnectedUserFavorite }/>
          ) }
        </div>
        <div className="p-3 w-full">
          <OptionalLink
            isLink={ !addFromOLButton }
            href={ `/${ ROUTES.BOOK }/${ book.id }?ref=std` }
            className="rounded-md inline-block w-full"
          >
            <h3
              className={ `text-md font-bold break-words whitespace-normal ${ !addFromOLButton ? "hover:underline" : "" }` }
              title={ book.title ?? "Untitled" }
            >
              { book.title ?? "Untitled" }
            </h3>
          </OptionalLink>

          { book.authors && (
            <p className="text-sm text-muted-foreground break-words whitespace-normal">
              { book.authors.join( ", " ) }
            </p>
          ) }
        </div>
      </div>
      <div className="p-3 pt-0 mt-auto w-full">
        { addFromOLButton && book.open_library_key ? (
          <AddBookButton openLibraryKey={ book.open_library_key }/>
        ) : (
          /* The state dropdown for actions is based on the connected user's data. */
          <BookStateDropdown bookId={ book.id } currentStateRecord={ connectedUserBook }/>
        ) }
      </div>
    </div>
  );
}

/**
 * Main component that decides whether to render a standard card or a favorite cover.
 */
export function BookPosterCard( props: BookCardProps ) {
  if (props.inFavoriteSection) {
    // In the "Favorites" section, always render the minimalist cover.
    return <FavoriteBookCover { ...props } />;
  }
  // In all other shelves, render the standard, detailed card.
  return <StandardBookCard { ...props } />;
}