import { calculateReadingStats } from "@/app/utils/reading-sessions/calculateReadingStats";
import { UserBook } from "@/app/types/user-book";
import { ReadingSession } from "@/app/types/reading-session";
import ReadingProgress from "@/components/sessions/reading-progress";

interface SessionInfoProps {
  userBook?: UserBook;
  sessions: ReadingSession[];
}

export function SessionInfo( { userBook, sessions }: SessionInfoProps ) {
  // Only show progress if the book is being read and has total pages defined.
  if (!userBook || userBook.state !== "reading" || !userBook.pages) {
    return null;
  }

  // Calculate the statistics from the provided sessions.
  const { totalHours, daysSinceLastSession, formattedLastSessionDate } = calculateReadingStats( sessions );

  return (
    <ReadingProgress
      currentPage={ userBook.current_page }
      totalPages={ userBook.pages }
      totalHours={ totalHours }
      daysSinceLastSession={ daysSinceLastSession }
      formattedLastSessionDate={ formattedLastSessionDate }
    />
  );
}