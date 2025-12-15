"use client";

import { useTranslations } from "next-intl";
import { Bar, BarChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { StatCard } from "./stat-card";
import { YearSelection } from "@/components/profile/stats/year-selection";

interface MonthlyReadsCardProps {
  data: {
    month: string;
    read: number;
    reading: number;
    later: number;
    wishlist: number;
  }[];
  selectedYear: number;
  onYearChange: ( year: string ) => void;
}

export function MonthlyCountByStateCard( { data, selectedYear, onYearChange }: MonthlyReadsCardProps ) {
  const t = useTranslations( "Stats.MonthlyActivity" );

  const chartConfig = {
    read: { label: t( "read" ), color: "var(--chart-1)" },
    reading: { label: t( "startedReading" ), color: "var(--chart-2)" },
    later: { label: t( "addedToLater" ), color: "var(--chart-3)" },
    wishlist: { label: t( "addedToWishlist" ), color: "var(--chart-4)" },
  } satisfies ChartConfig;

  const hasData = data.some( d => d.read > 0 || d.reading > 0 || d.later > 0 || d.wishlist > 0 );

  return (
    <StatCard title={ t( "title" ) } headerChildren={
      <YearSelection year={ selectedYear } onValueChange={ onYearChange }/>
    }>
      { hasData ? (
        <ChartContainer config={ chartConfig } className="min-h-[250px] w-full">
          <BarChart
            accessibilityLayer
            data={ data }
            margin={ { top: 20, right: 0, left: 0 } }
            barCategoryGap="2%"
          >
            <CartesianGrid vertical={ false }/>

            {/* Axis 1 (Visible): Displays the month labels. This is the default axis. */ }
            <XAxis
              dataKey="month"
              tickLine={ false }
              tickMargin={ 10 }
              axisLine={ false }
              type="category"
            />

            {/* Axis 2 (Invisible): Creates a numerical coordinate system for ReferenceLines. */ }
            <XAxis
              xAxisId="numerical"
              type="number"
              hide={ true }
              domain={ [-0.5, data.length - 0.5] }
            />

            <YAxis
              tickLine={ false }
              axisLine={ false }
              tickMargin={ 10 }
              allowDecimals={ false }
            />

            <ChartTooltip content={ <ChartTooltipContent indicator="dot"/> }/>
            <ChartLegend content={ <ChartLegendContent/> }/>

            {/*
              Loop to create ReferenceLines.
              They target the invisible numerical X-axis using `xAxisId="numerical"`.
              The `x={index + 0.5}` works because it's mapping to a numerical scale.
            */ }
            { data.slice( 0, -1 ).map( ( _entry, index ) => (
              <ReferenceLine
                key={ `line-${ index }` }
                xAxisId="numerical"
                x={ index + 0.5 }
                stroke="hsl(var(--border))"
              />
            ) ) }

            <Bar dataKey="read" fill="var(--color-read)" radius={ [4, 4, 0, 0] }/>
            <Bar dataKey="reading" fill="var(--color-reading)" radius={ [4, 4, 0, 0] }/>
            <Bar dataKey="later" fill="var(--color-later)" radius={ [4, 4, 0, 0] }/>
            <Bar dataKey="wishlist" fill="var(--color-wishlist)" radius={ [4, 4, 0, 0] }/>
          </BarChart>
        </ChartContainer>
      ) : (
        <div className="flex h-[250px] w-full items-center justify-center">
          <p className="text-center text-muted-foreground">
            { t( "noActivity", { year: selectedYear } ) }
          </p>
        </div>
      ) }
    </StatCard>
  );
}