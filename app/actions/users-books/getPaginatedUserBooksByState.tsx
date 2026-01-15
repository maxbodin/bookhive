"use server";
import { BookState } from "@/app/types/book-state";
import { UserBook } from "@/app/types/user-book";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/app/utils/supabase/server";
import { flattenUsersBooksData } from "@/app/utils/users-books/flattenUsersBooks";
import { BOOKS_PER_PAGE } from "@/app/searchParams";

/**
 * Fetches a paginated list of a user's books filtered by a specific state (e.g., 'read', 'later').
 * Designed for client-side pagination on the profile page.
 *
 * @param userId - The ID of the user.
 * @param state - The book state to filter by.
 * @param page - The page number to fetch.
 * @param query - Optional search query for the book title.
 * @returns An object with the paginated data and the total count for that state.
 */
export async function getPaginatedUserBooksByState(
  userId: string,
  state: BookState,
  page: number = 1,
  query: string = ""
): Promise<{ data: UserBook[], count: number }> {
  const supabase = await createClient();
  const t = await getTranslations( "GetUserUsersBooksAction" );

  const from = ( page - 1 ) * BOOKS_PER_PAGE;
  const to = from + BOOKS_PER_PAGE - 1;

  let queryBuilder = supabase
    .from( "users_books" )
    .select( "*, books(*)", { count: "exact" } )
    .eq( "uid", userId )
    .eq( "state", state );

  if (query) {
    queryBuilder = queryBuilder.ilike( "books.title", `%${ query }%` );
  }

  queryBuilder = queryBuilder.range( from, to );

  const { data, error, count } = await queryBuilder;

  if (error) {
    console.error( `Error fetching user books for state ${ state }:`, error );
    throw new Error( t( "fetchFailed" ) );
  }

  const flattenedData = flattenUsersBooksData( data || [] ) as UserBook[];
  return { data: flattenedData, count: count || 0 };
}
