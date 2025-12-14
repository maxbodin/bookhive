import { BookOpenCheck, CalendarDays, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { getTranslations } from "next-intl/server";

interface ReadingProgressProps {
  currentPage: number;
  totalPages: number;
  totalHours: number;
  daysSinceLastSession: string | null;
  formattedLastSessionDate: string | null;
}

export default async function ReadingProgress( {
                                                 currentPage,
                                                 totalPages,
                                                 totalHours,
                                                 daysSinceLastSession,
                                                 formattedLastSessionDate,
                                               }: ReadingProgressProps ) {
  const t = await getTranslations( "ReadingProgress" );

  // Avoid division by zero and ensure pages are valid.
  const progressPercentage = totalPages > 0 ? Math.round( ( currentPage / totalPages ) * 100 ) : 0;

  return (
    <div className="flex flex-col gap-3 my-2 text-xs">
      <>
        <div className="mb-1 flex justify-between items-baseline">
          <p className="font-medium text-primary">
            { t( "page_progress", { currentPage, totalPages } ) }
          </p>
          <p className="text-muted-foreground">{ progressPercentage }%</p>
        </div>
        <Progress value={ progressPercentage } aria-label={ t( "progress_aria", { progress: progressPercentage } ) }/>
      </>

      {/* Session Details */ }
      <div className="flex flex-col justify-between text-muted-foreground mt-4 space-y-2">
        { formattedLastSessionDate && (
          <div className="flex items-center gap-1.5"
               title={ t( "last_read_title", { date: formattedLastSessionDate } ) }>
            <CalendarDays className="h-3.5 w-3.5"/>
            <span>{ t( "last_read", { date: formattedLastSessionDate } ) }</span>
          </div>
        ) }
        { daysSinceLastSession && (
          <div className="flex items-center gap-1.5" title={ t( "time_since_title" ) }>
            <BookOpenCheck className="h-3.5 w-3.5"/>
            <span>{ t( "time_since", { days: daysSinceLastSession } ) }</span>
          </div>
        ) }
        { totalHours > 0 && (
          <div className="flex items-center gap-1.5" title={ t( "total_time_title" ) }>
            <Clock className="h-3.5 w-3.5"/>
            <span>{ t( "total_time", { count: totalHours } ) }</span>
          </div>
        ) }
      </div>
    </div>
  );
}