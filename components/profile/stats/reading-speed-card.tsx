"use client";
import { StatCard } from "./stat-card";
import { YearSelection } from "@/components/profile/stats/year-selection";
import { useTranslations } from "next-intl";
import { UserBookStatsRecord } from "@/app/types/user-book";
import { useMemo } from "react";
import { getStrictReadBooksByYear } from "@/app/utils/profiles/stats";
import { useYearSelection } from "@/app/contexts/year-selection-context";

interface ReadingSpeedCardProps {
  userBooks: UserBookStatsRecord[];
  className?: string;
}

export function ReadingSpeedCard( { userBooks, className }: ReadingSpeedCardProps ) {
  const t = useTranslations( "Stats.ReadingSpeed" );
  const { selectedYear } = useYearSelection();

  const pagesPerDay = useMemo( () => {
    const readBooksByYear = getStrictReadBooksByYear( userBooks, selectedYear );

    if (readBooksByYear.length === 0) return 0;

    const totalPagesRead = readBooksByYear.reduce( ( acc, book ) => acc + (book.pages || 0), 0 );

    const firstReadDate = new Date( Math.min( ...readBooksByYear.map( ( book ) => book.completionDate.getTime() ) ) );
    const daysSinceFirstRead = Math.max( 1, (new Date().getTime() - firstReadDate.getTime()) / (1000 * 3600 * 24) );

    return totalPagesRead > 0 ? totalPagesRead / daysSinceFirstRead : 0;
  }, [userBooks, selectedYear] );

  return (
    <StatCard title={ t( "title" ) } className={ className } headerChildren={
      <YearSelection/>
    }>
      <div className="flex h-full items-center justify-center">
        <div className="grid w-full max-w-2xl grid-cols-1 gap-4 text-center sm:grid-cols-3">
          <div>
            <p className="text-2xl font-bold">{ pagesPerDay.toFixed( 1 ) }</p>
            <p className="text-sm text-muted-foreground">{ t( "pagesPerDay" ) }</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{ (pagesPerDay * 7).toFixed( 0 ) }</p>
            <p className="text-sm text-muted-foreground">{ t( "pagesPerWeek" ) }</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{ (pagesPerDay * 30.44).toFixed( 0 ) }</p>
            <p className="text-sm text-muted-foreground">{ t( "pagesPerMonth" ) }</p>
          </div>
        </div>
      </div>
    </StatCard>
  );
}