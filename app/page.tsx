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
import { getAllUserUsersBooks } from "@/app/actions/users-books/getUserUsersBooks";
import { BOOKS_PER_PAGE, SearchParams } from "@/app/searchParams";
import { PaginationControls } from "@/components/pagination-controls";
import { redirect } from "next/navigation";

interface HomePageProps {
  searchParams?: Promise<{
    query?: string;
    page?: string; user?: string; displayShown?: string
  }>;
}

export default async function Home( { searchParams }: HomePageProps ) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const query: string | undefined = resolvedSearchParams?.query;
  const currentPage: number | undefined = Number( resolvedSearchParams?.page );

  const { data: books, count: totalBooks } = await searchBooks( query, currentPage );
  const totalPages = Math.ceil( totalBooks / BOOKS_PER_PAGE );

  if (currentPage < 1 || isNaN( currentPage ) || ( currentPage > totalPages && totalPages <= 0 )) {
    const params = new URLSearchParams( resolvedSearchParams );
    params.set( SearchParams.PAGE, "1" );
    redirect( `/?${ params.toString() }` );
  }

  // Fetch connected user.
  let connectedUserDataWithBooks: UserBook[] = [];
  const currentUser: User | null = await getCurrentUser();

  // If connected fetch user's data related to books (usersbooks).
  if (currentUser) {
    connectedUserDataWithBooks = await getAllUserUsersBooks( currentUser?.id );
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

          <PaginationControls
            totalPages={ totalPages }
            currentPage={ currentPage }
          />

          <h2 className="text-xl font-bold mb-4">{ t( "allBooks", { count: totalBooks } ) }</h2>
          <Suspense key={ `${ query }-${ currentPage }` } fallback={ <BooksGridSkeleton/> }>
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
        </div>
      </main>
    </div>
  );
}