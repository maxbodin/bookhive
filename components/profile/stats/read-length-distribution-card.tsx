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
  getReadLengthBucket,
  getStrictReadBooksByYear,
  ReadLengthBucket,
} from "@/app/utils/profiles/stats";
import { UserBookStatsRecord } from "@/app/types/user-book";

interface ReadLengthDistributionCardProps {
  userBooks: UserBookStatsRecord[];
  className?: string;
}

export function ReadLengthDistributionCard( { userBooks, className }: ReadLengthDistributionCardProps ) {
  const t = useTranslations( "Stats.ReadLengthDistribution" );
  const { selectedYear } = useYearSelection();

  const data = useMemo( () => {
    const readLengthBuckets: Record<ReadLengthBucket, number> = {
      upTo150: 0,
      from151To300: 0,
      from301To500: 0,
      over500: 0,
    };

    const readBooksByYear = getStrictReadBooksByYear( userBooks, selectedYear );

    readBooksByYear.forEach( ( book ) => {
      const pages = book.pages || 0;

      if (pages > 0) {
        readLengthBuckets[getReadLengthBucket( pages )] += 1;
      }
    } );

    return [
      { bucket: "upTo150" as const, count: readLengthBuckets.upTo150 },
      { bucket: "from151To300" as const, count: readLengthBuckets.from151To300 },
      { bucket: "from301To500" as const, count: readLengthBuckets.from301To500 },
      { bucket: "over500" as const, count: readLengthBuckets.over500 },
    ];
  }, [userBooks, selectedYear] );

  const chartConfig = {
    count: { label: t( "books" ), color: "var(--chart-5)" },
  } satisfies ChartConfig;

  const chartData = data.map( ( item ) => ( {
    ...item,
    label: t( `buckets.${ item.bucket }` ),
  } ) );

  const hasData = chartData.some( ( item ) => item.count > 0 );

  return (
    <StatCard title={ t( "title" ) } className={ className } headerChildren={ <YearSelection/> }>
      { hasData ? (
        <ChartContainer config={ chartConfig } className="min-h-[280px] w-full">
          <BarChart
            data={ chartData }
            margin={ { left: 8, right: 8, top: 8 } }
            layout="vertical"
          >
            <CartesianGrid horizontal={ false }/>
            <XAxis type="number" tickLine={ false } axisLine={ false } tickMargin={ 8 } allowDecimals={ false }/>
            <YAxis
              type="category"
              dataKey="label"
              tickLine={ false }
              axisLine={ false }
              width={ 80 }
            />
            <ChartTooltip content={ <ChartTooltipContent/> }/>
            <Bar dataKey="count" fill="var(--color-count)" radius={ [0, 5, 5, 0] }/>
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