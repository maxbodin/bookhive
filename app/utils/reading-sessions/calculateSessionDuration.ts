import { differenceInMilliseconds } from "date-fns";

/**
 * Calculates the duration of a single reading session.
 * @param startTime ISO string for the start time.
 * @param endTime ISO string for the end time.
 * @returns An object with hours and minutes.
 */
export const calculateSessionDuration = ( startTime: string, endTime: string ) => {
  const start = new Date( startTime );
  const end = new Date( endTime );

  if (isNaN( start.getTime() ) || isNaN( end.getTime() )) {
    return { hours: 0, minutes: 0 };
  }

  const diffMs = differenceInMilliseconds( end, start );
  const totalMinutes = Math.floor( diffMs / 60000 );

  const hours = Math.floor( totalMinutes / 60 );
  const minutes = totalMinutes % 60;

  return { hours, minutes };
};
