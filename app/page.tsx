import { searchBooks } from "@/app/services/books";
import { Suspense } from "react";
import { BooksGrid } from "@/components/books/books-grid";


interface HomePageProps {
  searchParams?: Promise<{ query?: string; user?: string; displayShown?: string }>;
}

export default async function Home({ searchParams }: HomePageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const query: string | undefined = resolvedSearchParams?.query;

  return (
    <div
      className="items-center justify-items-center min-h-screen pb-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 items-center">
        <Suspense key={ query } fallback={ <div>Loading...</div> }>
          <BooksGrid books={ await searchBooks( query ) }/>
        </Suspense>
      </main>
    </div>
  );
}