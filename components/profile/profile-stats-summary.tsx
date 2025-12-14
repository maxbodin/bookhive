import { BookOpen, Clock } from "lucide-react";

interface ProfileStatsSummaryProps {
  totalHoursRead: number;
  totalPagesRead: number;
}

/**
 * Component to display high-level user statistics like total reading time and pages read.
 * @param totalHoursRead
 * @param totalPagesRead
 * @constructor
 */
export function ProfileStatsSummary( { totalHoursRead, totalPagesRead }: ProfileStatsSummaryProps ) {
  return (
    <div className="mt-4 flex flex-row w-fit items-center justify-between gap-8 rounded-lg border p-4">
      {/* Total reading time stat */ }
      <div className="flex items-center gap-4 px-4">
        <Clock className="h-6 w-6 text-muted-foreground"/>
        <div>
          <p className="text-lg font-bold">{ totalHoursRead.toLocaleString() }</p>
          <p className="text-sm">Hours read</p>
        </div>
      </div>

      {/* Total pages read stat */ }
      <div className="flex items-center gap-4 px-4">
        <BookOpen className="h-6 w-6 text-muted-foreground"/>
        <div>
          <p className="text-lg font-bold">{ totalPagesRead.toLocaleString() }</p>
          <p className="text-sm">Pages read</p>
        </div>
      </div>
    </div>
  );
}