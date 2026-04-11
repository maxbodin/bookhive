"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { StatCard } from "@/components/profile/stats/stat-card";
import { YearSelection } from "@/components/profile/stats/year-selection";
import { useYearSelection } from "@/app/contexts/year-selection-context";
import { UserBookStatsRecord } from "@/app/types/user-book";
import { getMonthLabels, getStrictReadBooksByYear } from "@/app/utils/profiles/stats";

interface MonthlyPagesReadCardProps {
  userBooks: UserBookStatsRecord[];
  className?: string;
}

export function MonthlyPagesReadCard( { userBooks, className }: MonthlyPagesReadCardProps ) {
  const t = useTranslations( "Stats.MonthlyPagesRead" );
  const { selectedYear } = useYearSelection();
  const locale = useLocale();

  const data = useMemo( () => {
    const allMonths = getMonthLabels( locale );
    const monthlyPagesRead = Array<number>( 12 ).fill( 0 );
    const readBooksByYear = getStrictReadBooksByYear( userBooks, selectedYear );

    readBooksByYear.forEach( ( book ) => {
      const monthIndex = book.completionDate.getUTCMonth();
      monthlyPagesRead[monthIndex] += book.pages || 0;
    } );

    return allMonths.map( ( month, index ) => ( {
      month,
      pages: monthlyPagesRead[index],
    } ) );
  }, [userBooks, selectedYear, locale] );

  const hasData = data.some( ( item ) => item.pages > 0 );

  const chartConfig = {
    pages: { label: t( "pages" ), color: "var(--chart-2)" },
  } satisfies ChartConfig;

  return (
    <StatCard
      title={ t( "title" ) }
      className={ className }
      headerChildren={ <YearSelection/> }
    >
      { hasData ? (
        <ChartContainer config={ chartConfig } className="min-h-[260px] w-full">
          <BarChart data={ data } margin={ { left: 0, right: 8, top: 8 } }>
            <CartesianGrid vertical={ false }/>
            <XAxis dataKey="month" tickLine={ false } axisLine={ false } tickMargin={ 8 }/>
            <YAxis tickLine={ false } axisLine={ false } tickMargin={ 8 } allowDecimals={ false }/>
            <ChartTooltip content={ <ChartTooltipContent/> }/>
            <Bar dataKey="pages" fill="var(--color-pages)" radius={ [5, 5, 0, 0] }/>
          </BarChart>
        </ChartContainer>
      ) : (
        <div className="flex h-[260px] w-full items-center justify-center">
          <p className="text-center text-muted-foreground">
            { t( "noPages", { year: selectedYear } ) }
          </p>
        </div>
      ) }
    </StatCard>
  );
}