"use client";
import { StatCard } from "./stat-card";
import { YearSelection } from "@/components/profile/stats/year-selection";
import { useTranslations } from "next-intl";
import { UserBookStatsRecord } from "@/app/types/user-book";
import { useMemo } from "react";
import { getStrictReadBooksByYear } from "@/app/utils/profiles/stats";
import { useYearSelection } from "@/app/contexts/year-selection-context";

interface AverageCompletionCardProps {
  userBooks: UserBookStatsRecord[];
  className?: string;
}

export function AverageCompletionCard( { userBooks, className }: AverageCompletionCardProps ) {
  const t = useTranslations( "Stats.AverageCompletion" );
  const { selectedYear } = useYearSelection();

  const avgDays = useMemo( () => {
    const readBooksByYear = getStrictReadBooksByYear( userBooks, selectedYear );

    const readingDurations = readBooksByYear
      .map( ( book ) => {
        const start = book.startDate.getTime();
        const end = book.endDate.getTime();
        return ( end - start ) / ( 1000 * 3600 * 24 );
      } )
      .filter( ( duration ): duration is number => duration >= 0 );

    if (readingDurations.length === 0) return 0;

    return readingDurations.reduce( ( a, b ) => a + b, 0 ) / readingDurations.length;
  }, [userBooks, selectedYear] );

  return (
    <StatCard title={ t( "title" ) } className={ className } headerChildren={
      <YearSelection
      />
    }>
      <div className="flex h-full items-center justify-center text-center">
        <div>
          <p className="text-4xl font-bold tracking-tighter">
            { avgDays > 0 ? avgDays.toFixed( 1 ) : "-" }
          </p>
          <p className="text-sm text-muted-foreground">{ t( "days" ) }</p>
        </div>
      </div>
    </StatCard>
  );
}