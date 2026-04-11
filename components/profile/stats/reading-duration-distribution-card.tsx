"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
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
import {
  getDurationBucket,
  getStrictReadBooksByYear,
  ReadDurationBucket,
} from "@/app/utils/profiles/stats";
import { UserBookStatsRecord } from "@/app/types/user-book";

interface ReadingDurationDistributionCardProps {
  userBooks: UserBookStatsRecord[];
  className?: string;
}

export function ReadingDurationDistributionCard( { userBooks, className }: ReadingDurationDistributionCardProps ) {
  const t = useTranslations( "Stats.ReadingDurationDistribution" );
  const { selectedYear } = useYearSelection();

  const data = useMemo( () => {
    const readBooksByYear = getStrictReadBooksByYear( userBooks, selectedYear );

    const durationBuckets: Record<ReadDurationBucket, number> = {
      upToWeek: 0,
      upToMonth: 0,
      upToThreeMonths: 0,
      overThreeMonths: 0,
    };

    readBooksByYear
      .map( ( book ) => {
        const start = book.startDate.getTime();
        const end = book.endDate.getTime();
        return ( end - start ) / ( 1000 * 3600 * 24 );
      } )
      .filter( ( duration ): duration is number => duration >= 0 )
      .forEach( ( durationInDays ) => {
        durationBuckets[getDurationBucket( durationInDays)] += 1;
      } );

    return [
      { bucket: "upToWeek" as const, count: durationBuckets.upToWeek },
      { bucket: "upToMonth" as const, count: durationBuckets.upToMonth },
      { bucket: "upToThreeMonths" as const, count: durationBuckets.upToThreeMonths },
      { bucket: "overThreeMonths" as const, count: durationBuckets.overThreeMonths },
    ];
  }, [userBooks, selectedYear] );

  const chartConfig = {
    count: { label: t( "readBooks" ), color: "var(--chart-4)" },
  } satisfies ChartConfig;

  const chartData = data.map( ( item ) => ( {
    ...item,
    label: t( `buckets.${ item.bucket }` ),
  } ) );

  const hasData = chartData.some( ( item ) => item.count > 0 );

  return (
    <StatCard
      title={ t( "title" ) }
      className={ className }
      headerChildren={ <YearSelection/> }
    >
      { hasData ? (
        <ChartContainer config={ chartConfig } className="min-h-[260px] w-full">
          <BarChart data={ chartData } margin={ { left: 0, right: 8, top: 8 } }>
            <CartesianGrid vertical={ false }/>
            <XAxis
              dataKey="label"
              tickLine={ false }
              axisLine={ false }
              tickMargin={ 8 }
              interval={ 0 }
            />
            <YAxis tickLine={ false } axisLine={ false } tickMargin={ 8 } allowDecimals={ false }/>
            <ChartTooltip content={ <ChartTooltipContent/> }/>
            <Bar dataKey="count" fill="var(--color-count)" radius={ [5, 5, 0, 0] }/>
          </BarChart>
        </ChartContainer>
      ) : (
        <div className="flex h-[260px] w-full items-center justify-center">
          <p className="text-center text-muted-foreground">
            { t( "noData", { year: selectedYear } ) }
          </p>
        </div>
      ) }
    </StatCard>
  );
}