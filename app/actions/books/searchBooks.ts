"use server";

import { createClient } from "@/app/utils/supabase/server";
import { Book } from "@/app/types/book";
import { BOOKS_PER_PAGE } from "@/app/searchParams";

/**
 * Fetches a paginated list of books based on a search query and returns the data along with the total count.
 * If no query is provided, it fetches all books.
 *
 * @param {string} [query] - The search query to filter books.
 * @param {number} [page=1] - The page number for pagination.
 * @returns {Promise<{data: Book[], count: number}>} An object containing the list of books for the page and the total count of matching books.
 */
export async function searchBooks( query?: string, page: number = 1 ): Promise<{ data: Book[], count: number }> {
  const from = ( page - 1 ) * BOOKS_PER_PAGE;
  const to = from + BOOKS_PER_PAGE - 1;

  const supabase = await createClient();

  let request = supabase
    .from( "books" )
    .select( "*", { count: "exact" } );

  if (query) {
    const sanitizedQuery = query.trim().toLowerCase();

    const textFilters = [
      `title.ilike.%${ sanitizedQuery }%`,
      `description.ilike.%${ sanitizedQuery }%`,
      `publisher.ilike.%${ sanitizedQuery }%`,
      `isbn_10.ilike.%${ sanitizedQuery }%`,
      `isbn_13.ilike.%${ sanitizedQuery }%`,
    ];

    const authorsFilter = `authors.cs.{${ sanitizedQuery }}`;

    request = request.or( [...textFilters, authorsFilter].join( "," ) );
  }

  request = request.order( "authors", { ascending: false } ).range( from, to );

  const { data: books, error, count } = await request;

  if (error) {
    console.error( "Error searching books:", error );
    return { data: [], count: 0 };
  }

  return { data: ( books as Book[] ) || [], count: count || 0 };
}