"use server";

import { createClient } from "@/app/utils/supabase/server";
import { UserBook } from "@/app/types/user-book";
import { flattenUserBookData } from "@/app/utils/flattenUserBook";

/**
 * Fetches a user's book collection, with optional filtering.
 * @param userId - The ID of the user whose books to fetch.
 * @param query - An optional search term to filter books by title.
 * @returns A list of the user's books.
 * @throws An error if fetching the books fails.
 */
export async function getUserUsersBooks( userId: string, query?: string ): Promise<UserBook[]> {
  const supabase = await createClient();

  let queryBuilder = supabase
    .from( "users_books" )
    .select( `
      *,
      books ( * )
    ` )
    .eq( "uid", userId );

  // If a search query is provided, filter the results on the joined 'books' table's title.
  if (query) {
    queryBuilder = queryBuilder.ilike( "books.title", `%${ query }%` );
  }

  const { data: userBooksData, error } = await queryBuilder;

  if (error) {
    throw new Error( error.message || "Failed to fetch user's usersbooks." );
  }

  return ( flattenUserBookData( userBooksData ) || [] ) as UserBook[];
}