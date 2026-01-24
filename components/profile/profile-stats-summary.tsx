import { BookOpen, Clock } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { getUserTotalPagesRead } from "@/app/actions/users-books/getUserTotalPagesRead";
import { getUserTotalHoursRead } from "@/app/actions/users-books/getUserTotalHoursRead";

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

  const [totalHoursRead, totalPagesRead] = await Promise.all( [
    getUserTotalHoursRead( userId ),
    getUserTotalPagesRead( userId ),
  ] );

  return (
    <div className="mt-4 flex flex-row w-fit items-center justify-between gap-8 rounded-lg border p-4">
      {/* Total reading time stat */ }
      <div className="flex items-center gap-4 px-4">
        <Clock className="h-6 w-6 text-muted-foreground"/>
        <div>
          <p className="text-lg font-bold">{ totalHoursRead.toLocaleString() }</p>
          <p className="text-sm">{ t( "hoursRead" ) }</p>
        </div>
      </div>

      {/* Total pages read stat */ }
      <div className="flex items-center gap-4 px-4">
        <BookOpen className="h-6 w-6 text-muted-foreground"/>
        <div>
          <p className="text-lg font-bold">{ totalPagesRead.toLocaleString() }</p>
          <p className="text-sm">{ t( "pagesRead" ) }</p>
        </div>
      </div>
    </div>
  );
}