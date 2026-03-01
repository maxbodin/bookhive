"use client";

import { Book } from "@/app/types/book";
import { useTranslations } from "next-intl";
import React, { useState, ViewTransition } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ImageOff } from "lucide-react";

interface BookCoverProps {
  book: Book | Partial<Book>;
  className?: string;
  transitionSuffix: string;
  fetchPriority?: "high" | "low" | "auto";
  loading?: "eager" | "lazy";
  sizes?: string;
}

/**
 * Reusable component for displaying the Book Cover wrapped in a View Transition.
 * Uses a transitionSuffix to guarantee unique DOM names.
 *
 * @param book
 * @param className
 * @param transitionSuffix
 * @param fetchPriority
 * @param loading
 * @param sizes
 * @constructor
 */
export default function BookCover( {
                                     book,
                                     className,
                                     transitionSuffix,
                                     fetchPriority = "low",
                                     loading = "lazy",
                                     sizes = "(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 15vw",
                                   }: BookCoverProps ) {
  const t = useTranslations( "BookCard" );
  const [imgError, setImgError] = useState<boolean>( false );

  // Defining limits matching aspect ratio (2:3).
  const BASE_WIDTH = 400;
  const BASE_HEIGHT = 600;

  const hasValidCover = book.cover_url && !imgError;

  return (
    <ViewTransition name={ `book-cover-${ book.id }-${ transitionSuffix }` }>
      { hasValidCover ? (
        <Image
          src={ book.cover_url! }
          alt={ t( "coverAlt", { title: book.title ?? "Untitled" } ) }
          width={ BASE_WIDTH }
          height={ BASE_HEIGHT }
          className={ cn( "w-full h-auto object-cover aspect-[2/3]", className ) }
          loading={ loading }
          priority={ fetchPriority === "high" }
          sizes={ sizes }
          onError={ () => setImgError( true ) }
          quality={ 60 }
        />
      ) : (
        <div
          className={ cn(
            "w-full flex flex-col gap-2 items-center justify-center aspect-[2/3] bg-muted dark:bg-secondary text-muted-foreground p-2 text-center",
            className
          ) }
        >
          <ImageOff className="w-8 h-8 opacity-50" aria-hidden="true"/>
          <p className="text-xs font-medium leading-tight line-clamp-2">
            { book.title || t( "noCover" ) }
          </p>
        </div>
      ) }
    </ViewTransition>
  );
}