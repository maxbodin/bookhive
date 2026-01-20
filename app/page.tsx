import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { BooksGrid } from "@/components/books/books-grid";
import { UserBanner } from "@/components/profile/user-banner";
import { Separator } from "@/components/ui/separator";
import { UserBannerSkeleton } from "@/components/skeletons/user-banner-skeleton";
import { BooksGridSkeleton } from "@/components/skeletons/books-grid-skeleton";
import { searchBooks } from "@/app/actions/books/searchBooks";
import { UserBook } from "@/app/types/user-book";
import { User } from "@supabase/supabase-js";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { BOOKS_PER_PAGE, SearchParams } from "@/app/searchParams";
import { PaginationControls } from "@/components/pagination-controls";
import { redirect } from "next/navigation";
import {
  getConnectedUserBooksForDisplayedBooks
} from "@/app/actions/users-books/getConnectedUserBooksForDisplayedBooks";
import { Profile } from "@/app/types/profile";
import { getUserProfile } from "@/app/actions/profiles/getUserProfile";
import { searchOpenLibrary } from "@/app/actions/open-library/searchOpenLibrary";
import { Book } from "@/app/types/book";

interface HomePageProps {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    user?: string;
    displayShown?: string
  }>;
}

export default async function Home( { searchParams }: HomePageProps ) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const query: string | undefined = resolvedSearchParams?.query;
  const currentPage: number | undefined = Number( resolvedSearchParams?.page );

  const { data: books, count: totalBooks } = await searchBooks( query, currentPage );
  const totalPages = Math.ceil( totalBooks / BOOKS_PER_PAGE ) || 1;

  if (currentPage < 1 || isNaN( currentPage ) || ( currentPage > totalPages && totalPages <= 0 )) {
    const params = new URLSearchParams( resolvedSearchParams );
    params.set( SearchParams.PAGE, "1" );
    redirect( `/?${ params.toString() }` );
  }

  // Fetch connected user.
  let connectedUserDataWithBooks: UserBook[] = [];
  const currentUser: User | null = await getCurrentUser();

  // Fetch books from Open Library if admin.
  let OpenLibraryBooks: Book[] = [];
  let currentUserProfile: Profile | null = null;

  if (currentUser?.email) {
    currentUserProfile = await getUserProfile( currentUser?.email );
    if (query && query !== "" && currentUserProfile.is_admin) {
      OpenLibraryBooks = await searchOpenLibrary( query );

      // Filter out books that are already in our sovereign DB results.
      const sovereignKeys = new Set( books.map( b => b.open_library_key ).filter( Boolean ) );
      OpenLibraryBooks = OpenLibraryBooks.filter( b => !sovereignKeys.has( b.open_library_key ) );
    }
  }

  // If connected fetch user's data related to books (usersbooks).
  if (currentUser && books.length > 0) {
    const booksIds = [...new Set( books.map( book => book.id ) )];
    connectedUserDataWithBooks = await getConnectedUserBooksForDisplayedBooks( currentUser.id, booksIds );
  }

  const t = await getTranslations( "HomePage" );

  return (
    <div className="min-h-screen pb-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 items-center">

        <div className="w-full max-w-7xl mx-auto px-4 py-6">
          <h2 className="text-xl font-bold mb-4">{ t( "users" ) }</h2>
          <Suspense fallback={ <UserBannerSkeleton/> }>
            <UserBanner/>
          </Suspense>

          <Separator className="w-full mx-auto my-6"/>
          <h2 className="text-xl font-bold mb-4">{ t( "allBooks", { count: totalBooks } ) }</h2>
          <PaginationControls
            totalPages={ totalPages }
            currentPage={ currentPage }
          />

          <Suspense key={ `${ query }-${ currentPage }-sovereign` } fallback={ <BooksGridSkeleton/> }>
            <BooksGrid
              books={ books }
              view={ "poster" }
              isOwner={ true }
              profileUserBooks={ [] }
              connectedUserBooks={ connectedUserDataWithBooks }
              readingSessions={ [] }
            />
          </Suspense>

          <PaginationControls
            totalPages={ totalPages }
            currentPage={ currentPage }
          />


          { currentUserProfile?.is_admin && query && query !== "" && (
            <>
              <Separator className="w-full mx-auto my-8"/>
              <h2
                className="text-xl font-bold mb-4">{ t( "openlibraryResultsTitle", { count: OpenLibraryBooks.length } ) }</h2>
              <Suspense key={ `${ query }-${ currentPage }-openlibrary` } fallback={ <BooksGridSkeleton/> }>
                <BooksGrid
                  books={ OpenLibraryBooks }
                  view={ "poster" }
                  isOwner={ true }
                  profileUserBooks={ [] }
                  connectedUserBooks={ [] }
                  readingSessions={ [] }
                  addFromOLButton={ true }
                />
              </Suspense>
            </>
          ) }
        </div>
      </main>
    </div>
  );
}