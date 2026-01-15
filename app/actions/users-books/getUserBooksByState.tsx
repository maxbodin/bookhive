"use server";
import { BookState } from "@/app/types/book-state";
import { UserBook } from "@/app/types/user-book";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/app/utils/supabase/server";
import { flattenUsersBooksData } from "@/app/utils/users-books/flattenUsersBooks";

/**
 * Fetches all of a user's books for a specific state without pagination.
 * @param userId - The ID of the user.
 * @param state - The book state to filter by.
 * @param query - Optional search query for the book title.
 * @returns A complete list of user's books for the given state.
 * @throws An error if fetching fails.
 */
export async function getUserBooksByState(
  userId: string,
  state: BookState,
  query: string = ""
): Promise<UserBook[]> {
  const t = await getTranslations( "GetUserUsersBooksAction" );
  const supabase = await createClient();

  let queryBuilder = supabase
    .from( "users_books" )
    .select( `*, books!inner (*)` )
    .eq( "uid", userId )
    .eq( "state", state );

  if (query) {
    queryBuilder = queryBuilder.ilike( "books.title", `%${ query }%` );
  }

  const { data: userBooksData, error } = await queryBuilder;

  if (error) {
    console.error( `Error fetching user books for state ${ state }:` );
    throw new Error( error.message || t( "fetchFailed" ) );
  }
  return ( flattenUsersBooksData( userBooksData ) || [] ) as UserBook[];
}