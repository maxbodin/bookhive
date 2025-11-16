import { Book } from "@/app/types/book";
import Link from "next/link";

interface BooksGridProps {
  books: Book[];
}

export function BooksGrid({ books }: BooksGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-4">
      {books.map((book) => (
        <div key={book.id} className="group">
          <div className="relative border rounded-lg shadow-xl">
            {book.cover_url ? (
              <img
                src={book.cover_url}
                alt={`Cover of ${book.title}`}
                className="w-full h-auto object-cover rounded-t-lg aspect-[2/3]"
              />
            ) : (
              <div className="w-full flex items-center justify-center rounded-t-lg aspect-[2/3]">
                <p className="text-gray-500 text-sm">Missing Cover :(</p>
              </div>
            )}
            <div className="p-3 rounded-b-lg">
              {book.title ? <h3 className="text-md font-bold" title={book.title}>
                {book.title}
              </h3> : null }
              {book.authors ? <p className="text-sm text-gray-400">
                {book.authors.join(", ")}
              </p> : null}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}