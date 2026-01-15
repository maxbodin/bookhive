"use server";

import { createClient } from "@/app/utils/supabase/server";
import { ReadingSessionWithBook } from "@/app/types/reading-session";

/**
 * Fetches all reading sessions for a specific user, including associated book details.
 * Sessions are ordered from newest to oldest based on their start time.
 * @param userId - The ID of the user whose sessions to fetch.
 * @returns A promise that resolves to an array of reading sessions with book info.
 */
export async function getUserReadingSessions( userId: string ): Promise<ReadingSessionWithBook[]> {
  const supabase = await createClient();

  const { data: sessions, error } = await supabase
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
    .order( "start_time", { ascending: false } ); // Order by newest first.

  if (error) {
    console.error( "Failed to fetch reading sessions:", error.message );
    return [];
  }

  return ( sessions as ReadingSessionWithBook[] ) || [];
}