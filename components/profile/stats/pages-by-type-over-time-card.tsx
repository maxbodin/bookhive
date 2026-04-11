"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
import {
  BookTypeBucket,
  getMonthLabels,
  getStrictReadBooksByYear,
  toBookTypeBucket,
} from "@/app/utils/profiles/stats";

interface PagesByTypeOverTimeCardProps {
  userBooks: UserBookStatsRecord[];
  className?: string;
}

export function PagesByTypeOverTimeCard( { userBooks, className }: PagesByTypeOverTimeCardProps ) {
  const t = useTranslations( "Stats.PagesByTypeOverTime" );
  const { selectedYear } = useYearSelection();
  const locale = useLocale();

  const data = useMemo( () => {
    const allMonths = getMonthLabels( locale );
    const monthlyPagesByType: Record<BookTypeBucket, number[]> = {
      bd: Array<number>( 12 ).fill( 0 ),
      manga: Array<number>( 12 ).fill( 0 ),
      roman: Array<number>( 12 ).fill( 0 ),
      unknown: Array<number>( 12 ).fill( 0 ),
    };

    const readBooksByYear = getStrictReadBooksByYear( userBooks, selectedYear );

    readBooksByYear.forEach( ( book ) => {
      const monthIndex = book.completionDate.getUTCMonth();
      const bookType = toBookTypeBucket( book.type );
      monthlyPagesByType[bookType][monthIndex] += book.pages || 0;
    } );

    return allMonths.map( ( month, index ) => ( {
      month,
      bd: monthlyPagesByType.bd[index],
      manga: monthlyPagesByType.manga[index],
      roman: monthlyPagesByType.roman[index],
      unknown: monthlyPagesByType.unknown[index],
    } ) );
  }, [userBooks, selectedYear, locale] );

  const chartConfig = {
    bd: { label: t( "bd" ), color: "var(--chart-1)" },
    manga: { label: t( "manga" ), color: "var(--chart-2)" },
    roman: { label: t( "roman" ), color: "var(--chart-3)" },
    unknown: { label: t( "unknown" ), color: "var(--chart-4)" },
  } satisfies ChartConfig;

  const hasData = data.some( ( item ) =>
    item.bd > 0 || item.manga > 0 || item.roman > 0 || item.unknown > 0
  );

  return (
    <StatCard title={ t( "title" ) } className={ className } headerChildren={ <YearSelection/> }>
      { hasData ? (
        <ChartContainer config={ chartConfig } className="min-h-[280px] w-full">
          <BarChart data={ data } margin={ { left: 0, right: 8, top: 8 } }>
            <CartesianGrid vertical={ false }/>
            <XAxis dataKey="month" tickLine={ false } axisLine={ false } tickMargin={ 8 }/>
            <YAxis tickLine={ false } axisLine={ false } tickMargin={ 8 } allowDecimals={ false }/>
            <ChartTooltip content={ <ChartTooltipContent indicator="dot"/> }/>
            <ChartLegend content={ <ChartLegendContent/> }/>
            <Bar dataKey="bd" stackId="pages" fill="var(--color-bd)" radius={ [5, 5, 0, 0] }/>
            <Bar dataKey="manga" stackId="pages" fill="var(--color-manga)" radius={ [5, 5, 0, 0] }/>
            <Bar dataKey="roman" stackId="pages" fill="var(--color-roman)" radius={ [5, 5, 0, 0] }/>
            <Bar dataKey="unknown" stackId="pages" fill="var(--color-unknown)" radius={ [5, 5, 0, 0] }/>
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