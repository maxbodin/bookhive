import { formatDistanceToNow, parseISO } from "date-fns";
import { ReadingSession } from "@/app/types/reading-session";

export interface ReadingStats {
  totalHours: number;
  lastSessionDate: string | null;
  daysSinceLastSession: string | null;
  formattedLastSessionDate: string | null;
}

/**
 * Calculates total reading hours and finds the last session date from a list of sessions.
 *
 * @param sessions - An array of reading sessions for a single book.
 * @returns An object containing the calculated reading statistics.
 */
export function calculateReadingStats( sessions: ReadingSession[] ): ReadingStats {
  if (!sessions || sessions.length === 0) {
    return {
      totalHours: 0,
      lastSessionDate: null,
      daysSinceLastSession: null,
      formattedLastSessionDate: null,
    };
  }

  let totalMilliseconds = 0;
  let latestEndDate: Date | null = null;

  sessions.forEach( session => {
    const startTime = parseISO( session.start_time );
    const endTime = parseISO( session.end_time );

    // Ensure dates are valid before performing calculations.
    if (!isNaN( startTime.getTime() ) && !isNaN( endTime.getTime() )) {
      totalMilliseconds += endTime.getTime() - startTime.getTime();

      // Find the most recent session end time.
      if (!latestEndDate || endTime > latestEndDate) {
        latestEndDate = endTime;
      }
    }
  } );

  const totalHours = totalMilliseconds / ( 1000 * 60 * 60 );

  if (latestEndDate) {
    const finalDate = latestEndDate as Date;

    const formattedLastSessionDate = finalDate.toLocaleDateString( undefined, {
      year: "numeric", month: "long", day: "numeric",
    } );

    const daysSinceLastSession = `${ formatDistanceToNow( finalDate ) } ago`;

    const lastSessionDate = finalDate.toISOString();

    return {
      totalHours: parseFloat( totalHours.toFixed( 1 ) ),
      lastSessionDate,
      daysSinceLastSession,
      formattedLastSessionDate,
    };
  }

  return {
    totalHours: parseFloat( totalHours.toFixed( 1 ) ),
    lastSessionDate: null,
    daysSinceLastSession: null,
    formattedLastSessionDate: null,
  };
}