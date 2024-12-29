import { Book } from "@/app/types/book";

interface BookDetailProps {
  book: Book;
}

export async function BookDetail({
                                   book,
                                 }: BookDetailProps) {
  return (
    <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex flex-col items-center">
        { book.cover_url ? (
          <img
            src={ book.cover_url }
            alt={ book.title }
            className="w-full h-48 object-cover rounded-md mb-4"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-md mb-4">
            <p className="text-gray-500">No Cover Available</p>
          </div>
        ) }
        <h2 className="text-lg font-semibold text-center mb-2">{ book.title }</h2>
        <p className="text-sm text-gray-600 text-center mb-4">{ book.authors.join(", ") }</p>
        <p className="text-sm text-gray-500 text-center">{ book.publisher }</p>
      </div>
    </div>
  );
}