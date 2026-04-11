"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, } from "@/components/ui/chart";
import { StatCard } from "@/components/profile/stats/stat-card";
import { YearSelection } from "@/components/profile/stats/year-selection";
import { useYearSelection } from "@/app/contexts/year-selection-context";
import { UserBookStatsRecord } from "@/app/types/user-book";
import { getStrictReadBooksByYear, getWeekdayLabels, } from "@/app/utils/profiles/stats";

interface ReadingWeekdayPatternCardProps {
  userBooks: UserBookStatsRecord[];
  className?: string;
}

export function ReadingWeekdayPatternCard( { userBooks, className }: ReadingWeekdayPatternCardProps ) {
  const t = useTranslations( "Stats.ReadingWeekdayPattern" );
  const { selectedYear } = useYearSelection();
  const locale = useLocale();

  const data = useMemo( () => {
    const allWeekdays = getWeekdayLabels( locale );
    const weekdayReadCount = Array<number>( 7 ).fill( 0 );
    const readBooksByYear = getStrictReadBooksByYear( userBooks, selectedYear );

    readBooksByYear.forEach( ( book ) => {
      const weekdayIndex = (book.completionDate.getUTCDay() + 6) % 7;
      weekdayReadCount[ weekdayIndex ] += 1;
    } );

    return allWeekdays.map( ( weekday, index ) => ({
      weekday,
      read: weekdayReadCount[ index ],
    }) );
  }, [userBooks, selectedYear, locale] );

  const chartConfig = {
    read: { label: t( "read" ), color: "var(--chart-2)" },
  } satisfies ChartConfig;

  const hasData = data.some( ( item ) => item.read > 0 );

  return (
    <StatCard title={ t( "title" ) } className={ className } headerChildren={ <YearSelection/> }>
      { hasData ? (
        <ChartContainer config={ chartConfig } className="min-h-[280px] w-full">
          <RadarChart data={ data } margin={ { top: 8, right: 16, left: 16, bottom: 8 } }>
            <PolarGrid/>
            <PolarAngleAxis dataKey="weekday"/>
            <PolarRadiusAxis allowDecimals={ false }/>
            <ChartTooltip content={ <ChartTooltipContent/> }/>
            <Radar
              dataKey="read"
              fill="var(--color-read)"
              fillOpacity={ 0.35 }
              stroke="var(--color-read)"
              strokeWidth={ 2 }
            />
          </RadarChart>
        </ChartContainer>
      ) : (
        <div className="flex h-[280px] w-full items-center justify-center">
          <p className="text-center text-muted-foreground">
            { t( "noData", { year: selectedYear } ) }
          </p>
        </div>
      ) }
    </StatCard>
  );
}