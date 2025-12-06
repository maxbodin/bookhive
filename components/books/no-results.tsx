import { FileSearch } from "lucide-react";

const bookQuotes = [
  {
    quote: "A reader lives a thousand lives before he dies . . . The man who never reads lives only one.",
    author: "George R.R. Martin"
  },
  {
    quote: "Until I feared I would lose it, I never loved to read. One does not love breathing.",
    author: "Harper Lee"
  },
  {
    quote: "There is no friend as loyal as a book.",
    author: "Ernest Hemingway"
  },
  {
    quote: "The person, be it gentleman or lady, who has not pleasure in a good novel, must be intolerably stupid.",
    author: "Jane Austen"
  },
  {
    quote: "A room without books is like a body without a soul.",
    author: "Marcus Tullius Cicero"
  },
];

export function NoResults() {
  const randomQuote = bookQuotes[Math.floor( Math.random() * bookQuotes.length )];

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary max-w-5xl m-4 p-4 md:p-8 mt-24">
      <FileSearch className="h-16 w-16 text-primary mb-4"/>
      <h2 className="text-2xl font-bold mb-2 tracking-tight">No Books Found</h2>
      <blockquote className="text-lg italic border-l-4 border-input pl-4">
        <p>&quot;{ randomQuote.quote }&quot;</p>
        <cite className="block text-right not-italic text-sm text-muted-foreground mt-2">— { randomQuote.author }</cite>
      </blockquote>
    </div>
  );
}