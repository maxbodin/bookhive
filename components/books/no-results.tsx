import { FileSearch } from "lucide-react";
import { useTranslations } from "next-intl";

export function NoResults() {
  const t = useTranslations( "NoResults" );

  // Get the array of quote objects from translations.
  const bookQuotes = t.raw( "quotes" ) as { quote: string; author: string }[];
  const randomQuote = bookQuotes[Math.floor( Math.random() * bookQuotes.length )];

  return (
    <div
      className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary max-w-5xl m-4 p-4 md:p-8 mt-24">
      <FileSearch className="h-16 w-16 text-primary mb-4"/>
      <h2 className="text-2xl font-bold mb-2 tracking-tight">{ t( "title" ) }</h2>
      <blockquote className="text-lg italic border-l-4 border-input pl-4">
        <p>&quot;{ randomQuote.quote }&quot;</p>
        <cite className="block text-right not-italic text-sm text-muted-foreground mt-2">— { randomQuote.author }</cite>
      </blockquote>
    </div>
  );
}