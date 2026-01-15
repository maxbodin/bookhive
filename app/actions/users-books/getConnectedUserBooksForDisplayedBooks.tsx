"use server";
import { UserBook } from "@/app/types/user-book";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/app/utils/supabase/server";
import { flattenUsersBooksData } from "@/app/utils/users-books/flattenUsersBooks";

/**
 * Fetches the connected user's book data for a specific list of book IDs.
 *
 * @param connectedUserId - The ID of the logged-in user.
 * @param bookIds - An array of book IDs to check against.
 * @returns A list of the connected user's books that match the provided book IDs.
 */
export async function getConnectedUserBooksForDisplayedBooks(
  connectedUserId: string,
  bookIds: number[]
): Promise<UserBook[]> {
  if (!bookIds || bookIds.length === 0) {
    return [];
  }

  const t = await getTranslations( "GetUserUsersBooksAction" );
  const supabase = await createClient();

  const { data, error } = await supabase
    .from( "users_books" )
    .select( "*, books(*)" )
    .eq( "uid", connectedUserId )
    .in( "book_id", bookIds );

  if (error) {
    console.error( "Error fetching connected user's specific book data:", error );
    throw new Error( t( "fetchFailed" ) );
  }

  return ( flattenUsersBooksData( data ) || [] ) as UserBook[];
}
