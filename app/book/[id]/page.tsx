import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getBookById } from "@/app/actions/books/getBookById";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { getConnectedUserBookForBook } from "@/app/actions/users-books/getConnectedUserBookForBook";
import { Badge } from "@/components/ui/badge";
import { BookStateDropdown } from "@/components/books/book-state-dropdown";
import { FavoriteToggleButton } from "@/components/books/favorite-toggle-button";
import { Separator } from "@/components/ui/separator";
import BookDetailItem from "@/components/book/book-detail-item";
import { BookReadingSessions } from "@/components/book/book-reading-sessions";
import { BackButton } from "@/components/ui/back-button";

interface BookDetailsPageProps {
  params?: Promise<{ id: string }>;
}

export default async function BookDetailsPage( { params }: BookDetailsPageProps ) {
  const resolvedParams = params ? await params : undefined;
  const decodedBookId: number = Number( decodeURIComponent( resolvedParams?.id ?? "" ) );

  if (isNaN( decodedBookId )) {
    notFound();
  }

  const book = await getBookById( decodedBookId );
  if (!book) {
    notFound();
  }

  const currentUser = await getCurrentUser();
  const connectedUserBook = currentUser
    ? await getConnectedUserBookForBook( currentUser.id, book.id )
    : undefined;


  const t = await getTranslations( "BookDetails" );
  const tBookTypes = await getTranslations( "BookTypes" );

  const isConnectedUserFavorite = connectedUserBook?.is_favorite || false;
  const canToggleFavorite = connectedUserBook?.state === "read";

  return (
    <div className="container mx-auto flex flex-col p-4 md:p-8 gap-6">
      <div>
        <BackButton/>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        <aside className="md:col-span-1 flex flex-col items-center gap-6">
          <div className="relative w-full max-w-xs md:max-w-full">
            { book.cover_url ? (
              <img
                src={ book.cover_url }
                alt={ `Cover of ${ book.title }` }
                className="w-full rounded-lg shadow-xl aspect-[2/3] object-cover"
              />
            ) : (
              <div
                className="w-full flex items-center justify-center rounded-lg aspect-[2/3] bg-gray-100 dark:bg-secondary shadow-lg">
                <p className="text-primary">{ t( "noCover" ) }</p>
              </div>
            ) }
            { canToggleFavorite && (
              <FavoriteToggleButton bookId={ book.id } isFavorite={ isConnectedUserFavorite }/>
            ) }
          </div>
          <div className="flex flex-col gap-3">
            { currentUser && (
              <BookStateDropdown bookId={ book.id } currentStateRecord={ connectedUserBook }/>
            ) }
          </div>
        </aside>

        <main className="md:col-span-2">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl" title={ book.title ?? t( "undefined" ) }>
            { book.title ?? t( "undefined" ) }
          </h1>

          <p className="mt-2 text-xl text-muted-foreground">
            { book.authors && book.authors.length > 0
              ? `${ t( "by" ) } ${ book.authors.join( ", " ) }`
              : t( "undefined" ) }
          </p>

          { book.type && (
            <Badge variant="secondary" className="mt-4">
              { tBookTypes( book.type ) }
            </Badge>
          ) }

          <Separator className="my-6"/>

          <div className="max-w-none">
            <h2 className="text-xl text-muted-foreground font-semibold mb-4">{ t( "descriptionTitle" ) }</h2>
            <p>{ book.description ?? t( "undefined" ) }</p>
          </div>

          <div className="mt-8">
            <h2 className="text-xl text-muted-foreground font-semibold mb-4">{ t( "detailsTitle" ) }</h2>
            <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-6">
              <BookDetailItem label={ t( "publisher" ) } value={ book.publisher }/>
              <BookDetailItem label={ t( "publicationDate" ) } value={ book.publication_date }/>
              <BookDetailItem label={ t( "pages" ) } value={ book.pages }/>
              <BookDetailItem label={ t( "isbn10" ) } value={ book.isbn_10 }/>
              <BookDetailItem label={ t( "isbn13" ) } value={ book.isbn_13 }/>
              <BookDetailItem label={ t( "dimensions" ) }
                              value={ book.height && book.length && book.width &&
                                `${ book.height ?? t( "undefined" ) } x ${ book.length ?? t( "undefined" ) } x ${ book.width ?? t( "undefined" ) } cm` }/>
              <BookDetailItem label={ t( "weight" ) } value={ book.weight && `${ book.weight } g` }/>
              <BookDetailItem label={ t( "categories" ) }
                              value={ book.categories && `${ book.categories.join( ", " ) }` }/>
            </dl>
          </div>
        </main>
      </div>

      { currentUser && (
        <div className="mt-8">
          <Separator className="my-6"/>
          <BookReadingSessions userId={ currentUser.id } bookId={ book.id }/>
        </div>
      ) }
    </div>
  );
}