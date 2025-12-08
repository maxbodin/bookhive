import { searchBooks } from "@/app/services/books";
import { Suspense } from "react";
import { BooksGrid } from "@/components/books/books-grid";
import { UserBanner } from "@/components/profile/user-banner";
import { Separator } from "@/components/ui/separator";
import { UserBannerSkeleton } from "@/components/skeletons/user-banner-skeleton";
import { BooksGridSkeleton } from "@/components/skeletons/books-grid-skeleton";

interface HomePageProps {
  searchParams?: Promise<{ query?: string; user?: string; displayShown?: string }>;
}

export default async function Home( { searchParams }: HomePageProps ) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const query: string | undefined = resolvedSearchParams?.query;

  return (
    <div className="min-h-screen pb-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 items-center">

        <div className="w-full max-w-7xl mx-auto px-4 py-6">
          <h2 className="text-xl font-bold mb-4">Utilisateurs</h2>
          <Suspense fallback={ <UserBannerSkeleton/> }>
            <UserBanner/>
          </Suspense>

          <Separator className="w-full mx-auto my-6"/>

          <h2 className="text-xl font-bold mb-4">Tous les Livres</h2>
          <Suspense key={ query } fallback={ <BooksGridSkeleton/> }>
            <BooksGrid books={ await searchBooks( query ) }/>
          </Suspense>
        </div>
      </main>
    </div>
  );
}