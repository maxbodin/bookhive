import { BookOpen, Clock, Flame } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { getUserTotalPagesRead } from "@/app/actions/users-books/getUserTotalPagesRead";
import { getUserTotalHoursRead } from "@/app/actions/users-books/getUserTotalHoursRead";
import { getUserLongestStreak } from "@/app/actions/reading-sessions/getUserLongestStreak";

interface ProfileStatsSummaryProps {
  userId: string;
}

/**
 * Async component that fetches and displays high-level user statistics.
 * @param userId
 * @constructor
 */
export async function ProfileStatsSummary( { userId }: ProfileStatsSummaryProps ) {
  const t = await getTranslations( "ProfileStatsSummary" );

  const [totalHoursRead, totalPagesRead, longestStreak] = await Promise.all( [
    getUserTotalHoursRead( userId ),
    getUserTotalPagesRead( userId ),
    getUserLongestStreak( userId ),
  ] );

  return (
    <div
      className="mt-4 flex flex-row flex-wrap items-center justify-between gap-8 rounded-lg border bg-card p-4 shadow-sm text-card-foreground w-full max-w-md sm:w-fit sm:max-w-none"
    >
      {/* Total reading time stat  */ }
      <div className="flex items-center gap-4 px-4">
        <Clock className="h-6 w-6"/>
        <div>
          <p className="text-lg font-bold">
            { t( "hoursUnit", { count: totalHoursRead } ) }
          </p>
          <p className="text-sm text-muted-foreground">{ t( "totalHoursLabel" ) }</p>
        </div>
      </div>

      {/* Total pages read stat */ }
      <div className="flex items-center gap-4 px-4">
        <BookOpen className="h-6 w-6"/>
        <div>
          <p className="text-lg font-bold">
            { totalPagesRead.toLocaleString() }
          </p>
          <p className="text-sm text-muted-foreground">{ t( "totalPagesLabel" ) }</p>
        </div>
      </div>

      {/* Longest Streak stat */ }
      <div className="flex items-center gap-4 px-4">
        <Flame className="h-6 w-6"/>
        <div>
          <p className="text-lg font-bold">
            { t( "daysUnit", { count: longestStreak } ) }
          </p>
          <p className="text-sm text-muted-foreground">{ t( "longestStreakLabel" ) }</p>
        </div>
      </div>
    </div>
  );
}