"use server";

import { createClient } from "@/app/utils/supabase/server";
import { ReadingSession } from "@/app/types/reading-session";

/**
 * Fetches all reading sessions for a specific user.
 * @param userId - The ID of the user whose sessions to fetch.
 * @returns A promise that resolves to an array of reading sessions.
 */
export async function getUserReadingSessions( userId: string ): Promise<ReadingSession[]> {
  const supabase = await createClient();

  const { data: sessions, error } = await supabase
    .from( "reading_sessions" )
    .select( "*" )
    .eq( "uid", userId );

  if (error) {
    console.error( "Failed to fetch reading sessions:", error.message );
    // Return an empty array on error to prevent the UI from crashing.
    return [];
  }

  return sessions || [];
}