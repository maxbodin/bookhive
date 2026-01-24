"use server";
import { createClient } from "@/app/utils/supabase/server";

/**
 * Calculates the total reading time for a user in hours.
 * @param userId - The ID of the user.
 * @returns The total number of hours read, rounded.
 */
export async function getUserTotalHoursRead( userId: string ): Promise<number> {
  const supabase = await createClient();

  const { data: sessions, error } = await supabase
    .from( "reading_sessions" )
    .select( "start_time, end_time" )
    .eq( "uid", userId );

  if (error) {
    console.error( "Error fetching reading sessions for time calculation:", error );
    return 0;
  }

  if (!sessions) {
    return 0;
  }

  const totalMilliseconds = sessions.reduce( ( acc, session ) => {
    const start = new Date( session.start_time );
    const end = new Date( session.end_time );
    if (!isNaN( start.getTime() ) && !isNaN( end.getTime() )) {
      return acc + ( end.getTime() - start.getTime() );
    }
    return acc;
  }, 0 );

  // Convert to hours and round to the nearest whole number.
  return Math.round( totalMilliseconds / ( 1000 * 60 * 60 ) );
}