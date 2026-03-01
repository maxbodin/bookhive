import { Book } from "@/app/types/book";
import { useTranslations } from "next-intl";
import React, { ViewTransition } from "react";

/**
 * Reusable component for displaying the Book Cover wrapped in a View Transition.
 * Uses a transitionSuffix to guarantee unique DOM names.
 *
 * @param book
 * @param className
 * @param transitionSuffix
 * @param fetchPriority
 * @param loading
 * @param decoding
 * @constructor
 */
export default function BookCover( {
                                     book,
                                     className,
                                     transitionSuffix,
                                     fetchPriority = "low",
                                     loading = "lazy",
                                     decoding = "async"
                                   }: {
  book: Book | Partial<Book>;
  className: string;
  transitionSuffix: string;
  fetchPriority?: "high" | "low" | "auto";
  loading?: "eager" | "lazy";
  decoding?: "async" | "auto" | "sync";
} ) {
  const t = useTranslations( "BookCard" );

  return (
    <ViewTransition name={ `book-cover-${ book.id }-${ transitionSuffix }` }>
      { book.cover_url ? (
        <img
          src={ book.cover_url }
          alt={ t( "coverAlt", { title: book.title ?? "Untitled" } ) }
          className={ `w-full h-auto object-cover aspect-[2/3] ${ className }` }
          loading={ loading }
          decoding={ decoding }
          fetchPriority={ fetchPriority }
        />
      ) : (
        <div
          className={ `w-full flex items-center justify-center aspect-[2/3] bg-gray-100 dark:bg-secondary ${ className }` }>
          <p className="text-primary text-sm">{ t( "noCover" ) }</p>
        </div>
      ) }
    </ViewTransition>
  );
}