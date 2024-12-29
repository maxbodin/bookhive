import { searchBooks } from "@/app/services/books";
import { Suspense } from "react";
import { BooksGrid } from "@/components/books/booksGrid";


export default async function Home({
                                     searchParams,
                                   }: {
  searchParams?: { query?: string; user?: string; displayShown?: string }
}) {
  const query: string | undefined = searchParams?.query;

  return (
    <div
      className="items-center justify-items-center min-h-screen pb-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 items-center sm:items-start">
        <Suspense key={ query } fallback={ <div>Loading...</div> }>
          <BooksGrid books={ await searchBooks(query) }/>
        </Suspense>
      </main>
    </div>
  );
}