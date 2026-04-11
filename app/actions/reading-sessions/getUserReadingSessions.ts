"use server";

import { createClient } from "@/app/utils/supabase/server";
import { ReadingSession } from "@/app/types/reading-session";

/**
 * Fetches all reading sessions for a specific user with a minimal payload.
 * Sessions are ordered from newest to oldest based on their start time.
 * @param userId - The ID of the user whose sessions to fetch.
 * @returns A promise that resolves to an array of reading sessions.
 */
export async function getUserReadingSessions( userId: string ): Promise<ReadingSession[]> {
  const supabase = await createClient();

  const { data: sessions, error } = await supabase
    .from( "reading_sessions" )
    .select( "id,uid,book_id,start_time,end_time,start_page,end_page,created_at,notes" )
    .eq( "uid", userId )
    .order( "start_time", { ascending: false } ); // Order by newest first.

  if (error) {
    console.error( "Failed to fetch reading sessions:", error.message );
    return [];
  }

  return ( sessions as ReadingSession[] ) || [];
}