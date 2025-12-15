"use client";
import { StatCard } from "./stat-card";
import { YearSelection } from "@/components/profile/stats/year-selection";
import { useTranslations } from "next-intl";

interface ReadingSpeedCardProps {
  pagesPerDay: number;
  selectedYear: number;
  onYearChange: ( year: string ) => void;
}

export function ReadingSpeedCard( { pagesPerDay, selectedYear, onYearChange }: ReadingSpeedCardProps ) {
  const t = useTranslations( "Stats.ReadingSpeed" );

  return (
    <StatCard title={ t( "title" ) } headerChildren={
      <YearSelection year={ selectedYear } onValueChange={ onYearChange }/>
    }>
      <div className="grid grid-cols-1 gap-4 text-center sm:grid-cols-3">
        <div>
          <p className="text-2xl font-bold">{ pagesPerDay.toFixed( 1 ) }</p>
          <p className="text-sm text-muted-foreground">{ t( "pagesPerDay" ) }</p>
        </div>
        <div>
          <p className="text-2xl font-bold">{ ( pagesPerDay * 7 ).toFixed( 0 ) }</p>
          <p className="text-sm text-muted-foreground">{ t( "pagesPerWeek" ) }</p>
        </div>
        <div>
          <p className="text-2xl font-bold">{ ( pagesPerDay * 30.44 ).toFixed( 0 ) }</p>
          <p className="text-sm text-muted-foreground">{ t( "pagesPerMonth" ) }</p>
        </div>
      </div>
    </StatCard>
  );
}