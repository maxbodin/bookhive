"use server";
import { createClient } from "@/app/utils/supabase/server";
import { UserBook } from "@/app/types/user-book";
import { flattenUsersBooksData } from "@/app/utils/users-books/flattenUsersBooks";
import { getTranslations } from "next-intl/server";

/**
 * Fetches a user's favorite books.
 * @param userId - The ID of the user whose favorite books to fetch.
 * @param query - Optional search query for the book title.
 * @returns A list of the user's favorite books.
 * @throws An error if fetching fails.
 */
export async function getUserFavoriteUsersBooks( userId: string,
                                                 query: string = "" ): Promise<UserBook[]> {
  const t = await getTranslations( "GetUserUsersBooksAction" );
  const supabase = await createClient();

  let queryBuilder = supabase
    .from( "users_books" )
    .select( `*, books!inner(*)` )
    .eq( "uid", userId )
    .eq( "is_favorite", true );

  if (query) {
    queryBuilder = queryBuilder.ilike( "books.title", `%${ query }%` );
  }

  const { data: userBooksData, error } = await queryBuilder;

  if (error) {
    console.error( "Error fetching favorite user books:", error );
    throw new Error( error.message || t( "fetchFailed" ) );
  }

  return ( flattenUsersBooksData( userBooksData ) || [] ) as UserBook[];
}