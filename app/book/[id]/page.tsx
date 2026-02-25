import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getBookById } from "@/app/actions/books/getBookById";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { getUserProfile } from "@/app/actions/profiles/getUserProfile";
import { getConnectedUserBookForBook } from "@/app/actions/users-books/getConnectedUserBookForBook";
import { BookStateDropdown } from "@/components/books/book-state-dropdown";
import { FavoriteToggleButton } from "@/components/books/favorite-toggle-button";
import { Separator } from "@/components/ui/separator";
import { BookReadingSessions } from "@/components/book/book-reading-sessions";
import { BackButton } from "@/components/ui/back-button";
import { EditableBookDetails } from "@/components/book/editable-book-details";
import { Metadata, ResolvingMetadata } from "next";
import { ROUTES } from "@/app/utils/routes";

const BASE_URL = "https://bookhive.maximebodin.com";

interface BookDetailsPageProps {
  params?: Promise<{ id: string }>;
}

export async function generateMetadata(
  { params }: BookDetailsPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = params ? await params : undefined;
  const decodedBookId: number = Number( decodeURIComponent( resolvedParams?.id ?? "" ) );
  const book = await getBookById( decodedBookId );

  if (!book) {
    return { title: "Book Not Found | BookHive" };
  }

  const previousImages = ( await parent ).openGraph?.images || [];
  const ogImage = book.cover_url ? [book.cover_url, ...previousImages] : previousImages;

  return {
    title: `${ book.title } by ${ book.authors?.join( ", " ) || "Unknown" } | BookHive`,
    description: book.description?.slice( 0, 160 ) || `Track your reading progress for ${ book.title } on BookHive.`,
    openGraph: {
      title: book.title || "Untitled",
      description: book.description?.slice( 0, 160 ),
      images: ogImage,
      type: "book",
      authors: book.authors || [],
      isbn: book.isbn_13 || book.isbn_10 || undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: book.title || "Untitled",
      description: book.description?.slice( 0, 160 ),
      images: book.cover_url ? [book.cover_url] : [],
    },
    alternates: {
      canonical: `${ BASE_URL }/${ ROUTES.BOOK }/${ book.id }`,
    },
  };
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

  // Structured Data for Google Rich Snippets.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Book",
    "name": book.title,
    "author": book.authors?.map( author => ( {
      "@type": "Person",
      "name": author
    } ) ),
    "datePublished": book.publication_date,
    "image": book.cover_url,
    "isbn": book.isbn_13 || book.isbn_10,
    "numberOfPages": book.pages,
    "publisher": {
      "@type": "Organization",
      "name": book.publisher
    },
    "description": book.description,
    "inLanguage": "en",
    "bookFormat": "https://schema.org/Hardcover",
  };

  const currentUser = await getCurrentUser();
  const connectedUserBook = currentUser
    ? await getConnectedUserBookForBook( currentUser.id, book.id )
    : undefined;

  let isAdmin = false;
  if (currentUser?.email) {
    const profile = await getUserProfile( currentUser.email );
    isAdmin = profile?.is_admin ?? false;
  }

  const t = await getTranslations( "BookDetails" );

  const isConnectedUserFavorite = connectedUserBook?.is_favorite || false;
  const canToggleFavorite = connectedUserBook?.state === "read";

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={ { __html: JSON.stringify( jsonLd ) } }
      />
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
            <EditableBookDetails book={ book } isAdmin={ isAdmin }/>
          </main>
        </div>

        { currentUser && (
          <div className="mt-8">
            <Separator className="my-6"/>
            <BookReadingSessions userId={ currentUser.id } bookId={ book.id }/>
          </div>
        ) }
      </div>
    </article>
  );
}