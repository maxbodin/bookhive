"use server";

import { createClient } from "@/app/utils/supabase/server";
import { Book } from "@/app/types/book";
import { BOOKS_PER_PAGE } from "@/app/utils/searchParams";
import { applySharedBookFilters } from "@/app/utils/search/applySharedBookFilters";

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

  // Pass `null` for foreignTable because `books` is the top-level table here.
  request = applySharedBookFilters( request, null, query, types );

  // Apply pagination and ordering.
  request = request.order( "authors", { ascending: false } ).range( from, to );

  const { data: books, error, count } = await request;

  if (error) {
    console.error( "Error searching books:", error );
    return { data: [], count: 0 };
  }

  return { data: ( books as Book[] ) || [], count: count || 0 };
}