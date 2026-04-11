import { Suspense, ViewTransition } from "react";
import { getTranslations } from "next-intl/server";
import { BooksGrid } from "@/components/books/books-grid";
import { UserBanner } from "@/components/profile/user-banner";
import { Separator } from "@/components/ui/separator";
import { UserBannerSkeleton } from "@/components/skeletons/user-banner-skeleton";
import { searchBooks } from "@/app/actions/books/searchBooks";
import { UserBookStateRecord } from "@/app/types/user-book";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { PaginationControls } from "@/components/pagination-controls";
import { redirect } from "next/navigation";
import {
  getConnectedUserBooksForDisplayedBooks
} from "@/app/actions/users-books/getConnectedUserBooksForDisplayedBooks";
import { Profile } from "@/app/types/profile";
import { getUserProfile } from "@/app/actions/profiles/getUserProfile";
import { searchOpenLibrary } from "@/app/actions/open-library/searchOpenLibrary";
import { Book } from "@/app/types/book";
import { BOOKS_PER_PAGE, SearchParams } from "@/app/utils/searchParams";
import { CreateBookDialog } from "@/components/books/create-book-dialog";
import { BooksGridSkeleton } from "@/components/skeletons/books-grid-skeleton";

interface HomePageProps {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    user?: string;  // TODO : usage ??
    displayShown?: string; // TODO : usage ??
    types?: string;
  }>;
}

export default async function Home( { searchParams }: HomePageProps ) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const query: string = resolvedSearchParams?.query?.trim() ?? "";
  const hasQuery = query.length > 0;
  const currentPage: number = Number( resolvedSearchParams?.page ?? "1" );
  const types: string | undefined = resolvedSearchParams?.types;

  const [
    { data: books, count: totalBooks },
    currentUser,
  ] = await Promise.all( [
    searchBooks( query, currentPage, types ),
    getCurrentUser(),
  ] );

  const totalPages = Math.ceil( totalBooks / BOOKS_PER_PAGE ) || 1;

  if (currentPage < 1 || Number.isNaN( currentPage ) || currentPage > totalPages) {
    const params = new URLSearchParams( resolvedSearchParams );
    params.set( SearchParams.PAGE, "1" );
    redirect( `/?${ params.toString() }` );
  }

  const connectedUserDataPromise: Promise<UserBookStateRecord[]> = currentUser && books.length > 0
    ? getConnectedUserBooksForDisplayedBooks( currentUser.id, books.map( ( book ) => book.id ) )
    : Promise.resolve( [] );

  const currentUserEmail = currentUser?.email;
  const currentUserProfilePromise: Promise<Profile | null> = currentUserEmail && hasQuery
    ? getUserProfile( currentUserEmail )
    : Promise.resolve( null );

  const [connectedUserDataWithBooks, currentUserProfile] = await Promise.all( [
    connectedUserDataPromise,
    currentUserProfilePromise,
  ] );

  const isConnected = !!currentUser;

  // Fetch books from Open Library if admin.
  let OpenLibraryBooks: Book[] = [];

  if (hasQuery && currentUserProfile?.is_admin) {
    OpenLibraryBooks = await searchOpenLibrary( query );

    // Filter out books that are already in our sovereign DB results.
    const sovereignKeys = new Set( books.map( b => b.open_library_key ).filter( Boolean ) );
    OpenLibraryBooks = OpenLibraryBooks.filter( b => !sovereignKeys.has( b.open_library_key ) );
  }

  const t = await getTranslations( "HomePage" );

  const showCreateButton =
    currentUserProfile?.is_admin &&
    hasQuery &&
    totalBooks === 0;

  const prioritizeFirstImage = currentPage === 1 && !hasQuery;

  return (
    <ViewTransition>
      <div className="min-h-screen pb-10 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 items-center">
          <div className="w-full max-w-7xl mx-auto px-4 py-6">
            <h2 className="text-xl font-bold mb-4">{ t( "users" ) }</h2>
            <div className="min-h-32">
              <Suspense fallback={ <UserBannerSkeleton/> }>
                <UserBanner/>
              </Suspense>
            </div>

            <Separator className="w-full mx-auto my-6"/>
            <h2 className="text-xl font-bold mb-4">{ t( "allBooks", { count: totalBooks } ) }</h2>

            <div className="flex flex-col items-center">
              <PaginationControls
                totalPages={ totalPages }
                currentPage={ currentPage }
              />

              <Suspense key={ `${ query }-${ currentPage }-sovereign` } fallback={ <BooksGridSkeleton/> }>
                <BooksGrid
                  books={ books }
                  view={ "poster" }
                  isOwner={ false }
                  profileUserBooks={ [] }
                  connectedUserBooks={ connectedUserDataWithBooks }
                  readingSessions={ [] }
                  isConnected={ isConnected }
                  addFromOLButton={ false }
                  prioritizeFirstImage={ prioritizeFirstImage }
                />
              </Suspense>

              <PaginationControls
                totalPages={ totalPages }
                currentPage={ currentPage }
              />

              { showCreateButton && (
                <CreateBookDialog initialTitle={ query }/>
              ) }
            </div>

            { currentUserProfile?.is_admin && hasQuery && (
              <>
                <Separator className="w-full mx-auto my-8"/>
                <h2
                  className="text-xl font-bold mb-4">{ t( "openlibraryResultsTitle", { count: OpenLibraryBooks.length } ) }</h2>

                <div className="flex flex-col items-center">
                  <Suspense key={ `${ query }-${ currentPage }-openlibrary` } fallback={ <BooksGridSkeleton/> }>
                    <BooksGrid
                      books={ OpenLibraryBooks }
                      view={ "poster" }
                      isOwner={ false }
                      profileUserBooks={ [] }
                      connectedUserBooks={ [] }
                      readingSessions={ [] }
                      addFromOLButton={ true }
                      isConnected={ isConnected }
                      prioritizeFirstImage={ false }
                    />
                  </Suspense>
                </div>
              </>
            ) }
          </div>
        </main>
      </div>
    </ViewTransition>
  );
}