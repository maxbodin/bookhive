import { ReadingSession } from "@/app/types/reading-session";
import { differenceInMinutes, format, isValid } from "date-fns";

export interface Activity {
  count: number;                // Total minutes read.
  level: 0 | 1 | 2 | 3 | 4;     // Intensity level for cell color.
}

/**
 * Processes raw reading sessions into a Map for efficient lookups.
 *
 * @param sessions An array of the user's reading sessions.
 * @returns A Map where keys are date strings ('YYYY-MM-DD') and values are Activity objects.
 */
export function processSessionsForCalendar( sessions: ReadingSession[] ): Map<string, Activity> {
  const dailyMinutes: Record<string, number> = {};

  // Sum up minutes per day.
  sessions.forEach( session => {
    const start = new Date( session.start_time );
    const end = new Date( session.end_time );

    if (isValid( start ) && isValid( end )) {
      const day = format( start, "yyyy-MM-dd" );
      const duration = differenceInMinutes( end, start );

      if (duration > 0) {
        dailyMinutes[day] = ( dailyMinutes[day] || 0 ) + duration;
      }
    } else {
      console.error( "Invalid session date:", session );
    }
  } );

  const activityMap = new Map<string, Activity>();

  // Convert daily totals into Activity objects with levels.
  for (const [date, totalMinutes] of Object.entries( dailyMinutes )) {
    let level: Activity["level"];
    if (totalMinutes === 0) level = 0;
    else
      if (totalMinutes < 15) level = 1;
      else
        if (totalMinutes < 60) level = 2;
        else
          if (totalMinutes < 120) level = 3;
          else level = 4;

    activityMap.set( date, { count: totalMinutes, level } );
  }

  return activityMap;
}