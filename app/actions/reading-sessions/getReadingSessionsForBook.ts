"use server";

import { createClient } from "@/app/utils/supabase/server";
import { ReadingSessionWithBook } from "@/app/types/reading-session";

/**
 * Fetches all reading sessions for a specific user and a specific book.
 * @param userId
 * @param bookId
 */
export async function getReadingSessionsForBook(
  userId: string,
  bookId: number
): Promise<ReadingSessionWithBook[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from( "reading_sessions" )
    .select( `
      *,
      book:books (
        title,
        cover_url,
        pages
      )
    ` )
    .eq( "uid", userId )
    .eq( "book_id", bookId )
    .order( "start_time", { ascending: false } ); // Order by newest first.

  if (error) {
    console.error( "Error fetching reading sessions for book:", error.message );
    return [];
  }

  return data as ReadingSessionWithBook[];
}