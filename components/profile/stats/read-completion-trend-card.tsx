"use client";

import { useTranslations } from "next-intl";
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

interface ReadCompletionTrendCardProps {
  data: Array<{ month: string; completed: number; cumulative: number }>;
  className?: string;
}

export function ReadCompletionTrendCard( { data, className }: ReadCompletionTrendCardProps ) {
  const t = useTranslations( "Stats.ReadCompletionTrend" );
  const { selectedYear } = useYearSelection();

  const hasData = data.some( ( item ) => item.completed > 0 );

  const chartConfig = {
    completed: { label: t( "completed" ), color: "var(--chart-1)" },
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
            <Bar yAxisId="left" dataKey="completed" fill="var(--color-completed)" radius={ [5, 5, 0, 0] }/>
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