"use server";

import { createClient } from "@/app/utils/supabase/server";

/**
 * Calculates the longest reading streak for a user.
 *
 * PERFORMANCE NOTES:
 * 1. Fetches only 'start_time' column (minimal payload).
 * 2. Uses DB-side sorting to allow O(N) linear scanning.
 * 3. Uses a Set for O(1) deduplication of multiple sessions per day.
 *
 * @param userId - The ID of the user.
 * @returns The number of consecutive days read.
 */
export async function getUserLongestStreak( userId: string ): Promise<number> {
  const supabase = await createClient();

  // Optimized query: Only fetch the date field, ordered.
  const { data, error } = await supabase
    .from( "reading_sessions" )
    .select( "start_time" )
    .eq( "uid", userId )
    .order( "start_time", { ascending: true } );

  if (error) {
    console.error( "Error fetching sessions for streak:", error );
    return 0;
  }

  if (!data || data.length === 0) {
    return 0;
  }

  // Normalize to unique dates (YYYY-MM-DD) to handle multiple sessions per day.
  // Set insertion is O(1) on average.
  const uniqueDates = new Set<string>();
  data.forEach( ( session ) => {
    // We split by "T" to get the date part quickly without heavy Date object parsing overhead.
    const dateStr = session.start_time.split( "T" )[0];
    uniqueDates.add( dateStr );
  } );

  const sortedUniqueDates = Array.from( uniqueDates );

  if (sortedUniqueDates.length === 0) return 0;

  // Linear scan for longest streak.
  let maxStreak = 1;
  let currentStreak = 1;

  // We start from the second element.
  for (let i = 1; i < sortedUniqueDates.length; i++) {
    const prevDate = new Date( sortedUniqueDates[i - 1] );
    const currDate = new Date( sortedUniqueDates[i] );

    // Calculate difference in milliseconds.
    const diffTime = currDate.getTime() - prevDate.getTime();
    // Convert to days (1000ms * 60s * 60m * 24h).
    const diffDays = Math.round( diffTime / ( 1000 * 3600 * 24 ) );

    if (diffDays === 1) {
      // Consecutive day.
      currentStreak++;
    } else {
      // Streak broken.
      maxStreak = Math.max( maxStreak, currentStreak );
      currentStreak = 1;
    }
  }

  // Final check in case the longest streak ended on the last date.
  return Math.max( maxStreak, currentStreak );
}