"use server";

import { createClient } from "@/app/utils/supabase/server";
import { Book } from "@/app/types/book";
import { sortNatural } from "@/lib/sortNatural";

/**
 * Fetches all book.
 *
 * @returns {Promise<Book[]>} A list of all book.
 */
export async function getBooks(): Promise<Book[]> {
  const supabase = await createClient();

  const { data: books, error: booksError } = await supabase
    .from( "books" )
    .select()
    .order( "authors", { ascending: false } );

  if (booksError) {
    console.error( "Error fetching books:", booksError );
    return [];
  }

  return books as Book[];
}

/**
 * Fetches books based on a search query.
 * If no query is provided, fetches all books.
 *
 * @param {string} [query] - The search query to filter books.
 * @returns {Promise<Book[]>} A list of matching books.
 */
export async function searchBooks( query?: string ): Promise<Book[]> {
  const supabase = await createClient();

  let request = supabase
    .from( "books" )
    .select()
    .order( "authors", { ascending: false } );

  if (query) {
    const sanitizedQuery = query.trim().toLowerCase();

    // Handle text fields.
    const textFilters = [
      `title.ilike.%${ sanitizedQuery }%`,
      `description.ilike.%${ sanitizedQuery }%`,
      `publisher.ilike.%${ sanitizedQuery }%`,
      `isbn_10.ilike.%${ sanitizedQuery }%`,
      `isbn_13.ilike.%${ sanitizedQuery }%`,
    ];

    // Handle authors (array field).
    // TODO : Fix, seems not to work.
    const authorsFilter = `authors.cs.{${ sanitizedQuery }}`;

    request = request.or( [...textFilters, authorsFilter].join( "," ) );
  }

  const { data: books, error: booksError } = await request;

  if (booksError) {
    console.error( "Error fetching books:", booksError );
    return [];
  }

  return !books ? [] : sortNatural( books ) as Book[];
}