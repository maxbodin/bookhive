import { Book } from "@/app/types/book";
import { BookDetail } from "@/components/books/bookDetail";

interface BooksGridProps {
  books: Book[];
}

export async function BooksGrid({
                                  books,
                                }: BooksGridProps) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
    { books.map((book) => (
      <BookDetail key={ book.id } book={ book }/>
    )) }
  </div>;
}