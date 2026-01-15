import { Book, Calendar } from "lucide-react";
import { format } from "date-fns";
import { getTranslations } from "next-intl/server";

import { ReadingSessionWithBook } from "@/app/types/reading-session";
import { Progress } from "@/components/ui/progress";

interface ReadingSessionItemProps {
  session: ReadingSessionWithBook;
}

const formatSessionDate = ( startTime: string ) => {
  const date = new Date( startTime );
  return format( date, "MMMM d, yyyy 'at' h:mm a" );
};

export const ReadingSessionItem = async ( { session }: ReadingSessionItemProps ) => {
  const t = await getTranslations( "ReadingSessions" );

  const startPage = session.start_page ?? 0;
  const endPage = session.end_page;
  const pagesRead = endPage - startPage;
  const totalPages = session.book?.pages ?? 0;

  // Calculate completion percentage after this session, preventing division by zero.
  const completionPercentage = totalPages > 0
    ? Math.round( ( endPage / totalPages ) * 100 )
    : 0;

  return (
    <div className="flex gap-4 rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
      <div className="w-16 flex-shrink-0">
        { session.book?.cover_url ? (
          <img src={ session.book?.cover_url } alt={ `Cover of ${ session.book?.title }` }
               className="w-full h-auto object-cover rounded-t-lg aspect-[2/3]"/>
        ) : (
          <div
            className="w-full flex items-center justify-center rounded-t-lg aspect-[2/3] bg-gray-100 dark:bg-secondary">
            <p className="text-primary text-sm">{ t( "noCover" ) }</p>
          </div>
        ) }
      </div>

      <div className="flex-grow flex flex-col justify-between min-w-0">
        <div>
          <div className="flex justify-between items-start gap-4">
            <div className="flex-grow">
              <h3 className="font-semibold leading-tight truncate" title={ session.book?.title }>
                { session.book?.title ?? t( "unknownBook" ) }
              </h3>
              <div className="flex items-center gap-2 mt-1 text-muted-foreground text-xs">
                <Calendar className="h-3.5 w-3.5"/>
                <span>{ formatSessionDate( session.start_time ) }</span>
              </div>
            </div>
            { totalPages > 0 && (
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-xl text-primary">{ completionPercentage }%</p>
              </div>
            ) }
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <Book className="h-3.5 w-3.5"/>
                <span>
                  { t( "pagesRead", { count: pagesRead } ) }
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                ({ t( "pageRange", { start: startPage, end: endPage } ) })
                <p className="text-right text-xs text-muted-foreground mt-1">
                  { t( "totalPages", { count: totalPages } ) }
                </p>
              </span>
            </div>
            { totalPages > 0 && (
              <Progress value={ completionPercentage } className="h-1.5 mt-1"/>
            ) }
          </div>
        </div>

        { session.notes && (
          <div className="mt-3 border-t pt-3">
            <p className="whitespace-pre-wrap text-sm text-foreground">{ session.notes }</p>
          </div>
        ) }
      </div>
    </div>
  );
};