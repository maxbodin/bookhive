"use server";

import { UserBookStateRecord } from "@/app/types/user-book";
import { createClient } from "@/app/utils/supabase/server";
import { USER_BOOK_STATE_COLUMNS } from "@/app/utils/supabase/selectColumns";

/**
 *
 * @param userId
 * @param bookId
 */
export async function getConnectedUserBookForBook(
  userId: string,
  bookId: number
): Promise<UserBookStateRecord | undefined> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from( "users_books" )
    .select( USER_BOOK_STATE_COLUMNS )
    .eq( "uid", userId )
    .eq( "book_id", bookId )
    .single();

  if (error) {
    // A "single" query error is expected if the user has no record for this book.
    if (error.code !== "PGRST116") { // PGRST116: "exact one row expected"
      console.error( "Error fetching user book data:", error.message );
    }
    return undefined;
  }

  return data;
}