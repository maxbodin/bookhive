"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { StatCard } from "@/components/profile/stats/stat-card";
import { YearSelection } from "@/components/profile/stats/year-selection";
import { useYearSelection } from "@/app/contexts/year-selection-context";
import { UserBookStatsRecord } from "@/app/types/user-book";
import { getMonthLabels, getStrictReadBooksByYear, toValidDate } from "@/app/utils/profiles/stats";

interface ReadingLifecycleCardProps {
  userBooks: UserBookStatsRecord[];
  className?: string;
}

export function ReadingLifecycleCard( { userBooks, className }: ReadingLifecycleCardProps ) {
  const t = useTranslations( "Stats.ReadingLifecycle" );
  const { selectedYear } = useYearSelection();
  const locale = useLocale();

  const data = useMemo( () => {
    const allMonths = getMonthLabels( locale );
    const monthlyStartedCount = Array<number>( 12 ).fill( 0 );
    const monthlyReadCount = Array<number>( 12 ).fill( 0 );

    userBooks.forEach( ( book ) => {
      const startDate = toValidDate( book.start_reading_date );
      if (!startDate) return;

      if (startDate.getUTCFullYear() === selectedYear) {
        monthlyStartedCount[startDate.getUTCMonth()] += 1;
      }
    } );

    const readBooksByYear = getStrictReadBooksByYear( userBooks, selectedYear );

    readBooksByYear.forEach( ( book ) => {
      monthlyReadCount[book.completionDate.getUTCMonth()] += 1;
    } );

    return allMonths.map( ( month, index ) => ( {
      month,
      started: monthlyStartedCount[index],
      read: monthlyReadCount[index],
    } ) );
  }, [userBooks, selectedYear, locale] );

  const chartConfig = {
    started: { label: t( "started" ), color: "var(--chart-2)" },
    read: { label: t( "read" ), color: "var(--chart-1)" },
  } satisfies ChartConfig;

  const hasData = data.some( ( item ) => item.started > 0 || item.read > 0 );

  return (
    <StatCard
      title={ t( "title" ) }
      className={ className }
      headerChildren={ <YearSelection/> }
    >
      { hasData ? (
        <ChartContainer config={ chartConfig } className="min-h-[280px] w-full">
          <LineChart data={ data } margin={ { left: 0, right: 8, top: 8 } }>
            <CartesianGrid vertical={ false }/>
            <XAxis dataKey="month" tickLine={ false } axisLine={ false } tickMargin={ 8 }/>
            <YAxis tickLine={ false } axisLine={ false } tickMargin={ 8 } allowDecimals={ false }/>
            <ChartTooltip content={ <ChartTooltipContent indicator="line"/> }/>
            <ChartLegend content={ <ChartLegendContent/> }/>
            <Line
              type="monotone"
              dataKey="started"
              stroke="var(--color-started)"
              strokeWidth={ 2.5 }
              dot={ { r: 2 } }
              activeDot={ { r: 4 } }
            />
            <Line
              type="monotone"
              dataKey="read"
              stroke="var(--color-read)"
              strokeWidth={ 2.5 }
              dot={ { r: 2 } }
              activeDot={ { r: 4 } }
            />
          </LineChart>
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