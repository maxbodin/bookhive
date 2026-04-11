"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Bar, BarChart, CartesianGrid, Line, XAxis, YAxis } from "recharts";
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
import { getMonthLabels, getStrictReadBooksByYear } from "@/app/utils/profiles/stats";

interface ReadCompletionTrendCardProps {
  userBooks: UserBookStatsRecord[];
  className?: string;
}

export function ReadCompletionTrendCard( { userBooks, className }: ReadCompletionTrendCardProps ) {
  const t = useTranslations( "Stats.ReadCompletionTrend" );
  const { selectedYear } = useYearSelection();
  const locale = useLocale();

  const data = useMemo( () => {
    const allMonths = getMonthLabels( locale );
    const monthlyReadCount = Array<number>( 12 ).fill( 0 );
    const readBooksByYear = getStrictReadBooksByYear( userBooks, selectedYear );

    readBooksByYear.forEach( ( book ) => {
      const monthIndex = book.completionDate.getUTCMonth();
      monthlyReadCount[monthIndex] += 1;
    } );

    let cumulative = 0;

    return allMonths.map( ( month, index ) => {
      cumulative += monthlyReadCount[index];

      return {
        month,
        read: monthlyReadCount[index],
        cumulative,
      };
    } );
  }, [userBooks, selectedYear, locale] );

  const hasData = data.some( ( item ) => item.read > 0 );

  const chartConfig = {
    read: { label: t( "read" ), color: "var(--chart-1)" },
    cumulative: { label: t( "cumulative" ), color: "var(--chart-5)" },
  } satisfies ChartConfig;

  return (
    <StatCard
      title={ t( "title" ) }
      className={ className }
      headerChildren={ <YearSelection/> }
    >
      { hasData ? (
        <ChartContainer config={ chartConfig } className="min-h-[280px] w-full">
          <BarChart data={ data } margin={ { left: 0, right: 8, top: 8 } }>
            <CartesianGrid vertical={ false }/>
            <XAxis dataKey="month" tickLine={ false } axisLine={ false } tickMargin={ 8 }/>
            <YAxis yAxisId="left" tickLine={ false } axisLine={ false } tickMargin={ 8 } allowDecimals={ false }/>
            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={ false }
              axisLine={ false }
              tickMargin={ 8 }
              allowDecimals={ false }
            />
            <ChartTooltip content={ <ChartTooltipContent indicator="line"/> }/>
            <ChartLegend content={ <ChartLegendContent/> }/>
            <Bar yAxisId="left" dataKey="read" fill="var(--color-read)" radius={ [5, 5, 0, 0] }/>
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="cumulative"
              stroke="var(--color-cumulative)"
              strokeWidth={ 2.5 }
              dot={ { r: 2 } }
              activeDot={ { r: 4 } }
            />
          </BarChart>
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