import { BookOpenCheck, CalendarDays, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ReadingProgressProps {
  currentPage: number;
  totalPages: number;
  totalHours: number;
  daysSinceLastSession: string | null;
  formattedLastSessionDate: string | null;
}

export function ReadingProgress( {
                                   currentPage,
                                   totalPages,
                                   totalHours,
                                   daysSinceLastSession,
                                   formattedLastSessionDate,
                                 }: ReadingProgressProps ) {
  // Avoid division by zero and ensure pages are valid.
  const progressPercentage = totalPages > 0 ? Math.round( ( currentPage / totalPages ) * 100 ) : 0;

  return (
    <div className="flex flex-col gap-3 my-2 text-xs">
      <>
        <div className="mb-1 flex justify-between items-baseline">
          <p className="font-medium text-primary">
            Page { currentPage } of { totalPages }
          </p>
          <p className="text-muted-foreground">{ progressPercentage }%</p>
        </div>
        <Progress value={ progressPercentage } aria-label={ `${ progressPercentage }% read` }/>
      </>

      {/* Session Details */ }
      <div className="flex flex-col justify-between text-muted-foreground mt-4 space-y-2">
        { formattedLastSessionDate && (
          <div className="flex items-center gap-1.5" title={ `Last read on ${ formattedLastSessionDate }` }>
            <CalendarDays className="h-3.5 w-3.5"/>
            <span>Last read on { formattedLastSessionDate }</span>
          </div>
        ) }
        { daysSinceLastSession && (
          <div className="flex items-center gap-1.5" title="Time since last session">
            <BookOpenCheck className="h-3.5 w-3.5"/>
            <span>Time since last session { daysSinceLastSession }</span>
          </div>
        ) }
        { totalHours > 0 && (
          <div className="flex items-center gap-1.5" title="Total time spent reading">
            <Clock className="h-3.5 w-3.5"/>
            <span>Total time spent reading { totalHours } hours</span>
          </div>
        ) }
      </div>
    </div>
  );
}