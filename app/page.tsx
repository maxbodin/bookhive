import { Suspense } from "react";
import { BooksGrid } from "@/components/books/books-grid";
import { UserBanner } from "@/components/profile/user-banner";
import { Separator } from "@/components/ui/separator";
import { UserBannerSkeleton } from "@/components/skeletons/user-banner-skeleton";
import { BooksGridSkeleton } from "@/components/skeletons/books-grid-skeleton";
import { searchBooks } from "@/app/actions/books/searchBooks";
import { Book } from "@/app/types/book";
import { UserBook } from "@/app/types/user-book";
import { User } from "@supabase/supabase-js";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { getUserUsersBooks } from "@/app/actions/users-books/getUserUsersBooks";

interface HomePageProps {
  searchParams?: Promise<{ query?: string; user?: string; displayShown?: string }>;
}

export default async function Home( { searchParams }: HomePageProps ) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const query: string | undefined = resolvedSearchParams?.query;

  const books: Book[] = await searchBooks( query || "" );


  // Fetch connected user.
  let connectedUserDataWithBooks: UserBook[] = [];
  const currentUser: User | null = await getCurrentUser();

  // If connected fetch user's data related to books (usersbooks).
  if (currentUser) {
    connectedUserDataWithBooks = await getUserUsersBooks( currentUser?.id );
  }

  return (
    <div className="min-h-screen pb-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 items-center">

        <div className="w-full max-w-7xl mx-auto px-4 py-6">
          <h2 className="text-xl font-bold mb-4">Utilisateurs</h2>
          <Suspense fallback={ <UserBannerSkeleton/> }>
            <UserBanner/>
          </Suspense>

          <Separator className="w-full mx-auto my-6"/>

          <h2 className="text-xl font-bold mb-4">Tous les Livres ({ books.length })</h2>
          <Suspense key={ query } fallback={ <BooksGridSkeleton/> }>
            <BooksGrid books={ books } view={ "poster" } isOwner={ true } profileUserBooks={ [] }
                       connectedUserBooks={ connectedUserDataWithBooks } readingSessions={ [] }/>
          </Suspense>
        </div>
      </main>
    </div>
  );
}