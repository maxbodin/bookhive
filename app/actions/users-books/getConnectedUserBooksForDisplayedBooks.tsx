"use server";
import { UserBookStateRecord } from "@/app/types/user-book";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/app/utils/supabase/server";
import { USER_BOOK_STATE_COLUMNS } from "@/app/utils/supabase/selectColumns";

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
): Promise<UserBookStateRecord[]> {
  if ( !bookIds || bookIds.length === 0 ) {
    return [];
  }

  const uniqueBookIds = Array.from( new Set( bookIds ) );

  const t = await getTranslations( "GetUserUsersBooksAction" );
  const supabase = await createClient();

  const { data, error } = await supabase
    .from( "users_books" )
    .select( USER_BOOK_STATE_COLUMNS )
    .eq( "uid", connectedUserId )
    .in( "book_id", uniqueBookIds );

  if ( error ) {
    console.error( "Error fetching connected user's specific book data:", error );
    throw new Error( t( "fetchFailed" ) );
  }

  return ( data || [] ) as UserBookStateRecord[];
}