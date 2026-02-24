"use server";

import { createClient } from "@/app/utils/supabase/server";
import { Book } from "@/app/types/book";
import { BOOKS_PER_PAGE } from "@/app/utils/searchParams";

/**
 * Fetches a paginated list of books based on a search query and optional type filters.
 * Returns the data along with the total count.
 *
 * @param {string} [query] - The search query to filter books by text/author.
 * @param {number} [page=1] - The page number for pagination.
 * @param {string} [types] - Comma-separated list of book types (e.g., "bd,manga,null").
 * @returns {Promise<{data: Book[], count: number}>} An object containing the list of books for the page and the total count of matching books.
 */
export async function searchBooks(
  query?: string,
  page: number = 1,
  types?: string
): Promise<{ data: Book[]; count: number }> {
  const from = ( page - 1 ) * BOOKS_PER_PAGE;
  const to = from + BOOKS_PER_PAGE - 1;

  const supabase = await createClient();

  let request = supabase.from( "books" ).select( "*", { count: "exact" } );

  // Apply text search filter.
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

  // Apply type filter.
  if (types) {
    const typeArray = types.split( "," );

    // Separate the string "null" from actual enum values like "bd" or "manga".
    const validTypes = typeArray.filter( ( t ) => t !== "null" );
    const includesNull = typeArray.includes( "null" );

    if (validTypes.length > 0 && includesNull) {
      // User selected both specific types AND "null" (No type).
      request = request.or( `type.in.(${ validTypes.join( "," ) }),type.is.null` );
    } else
      if (validTypes.length > 0) {
        // User selected ONLY specific types.
        request = request.in( "type", validTypes );
      } else
        if (includesNull) {
          // User selected ONLY "null" (No type).
          request = request.is( "type", null );
        }
  }

  // Apply pagination and ordering.
  request = request.order( "authors", { ascending: false } ).range( from, to );

  const { data: books, error, count } = await request;

  if (error) {
    console.error( "Error searching books:", error );
    return { data: [], count: 0 };
  }

  return { data: ( books as Book[] ) || [], count: count || 0 };
}