"use client";

import { Bar, BarChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatCard } from "./stat-card";

interface MonthlyReadsCardProps {
  data: {
    month: string;
    read: number;
    reading: number;
    later: number;
    wishlist: number;
  }[];
  years: number[];
  selectedYear: number;
  onYearChange: ( year: string ) => void;
}

const chartConfig = {
  read: {
    label: "Read",
    color: "var(--chart-1)",
  },
  reading: {
    label: "Started Reading",
    color: "var(--chart-2)",
  },
  later: {
    label: "Added to Later",
    color: "var(--chart-3)",
  },
  wishlist: {
    label: "Added to Wishlist",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

const getEmptyStateMessage = ( year: number ) => {
  return `No book activity recorded in ${ year }.`;
};

export function MonthlyCountByStateCard( {
                                    data,
                                    years,
                                    selectedYear,
                                    onYearChange
                                  }: MonthlyReadsCardProps ) {
  const hasData = data.some( d => d.read > 0 || d.reading > 0 || d.later > 0 || d.wishlist > 0 );

  return (
    <StatCard
      title="Monthly Activity"
      headerChildren={
        <div className="flex items-center gap-2">
          <Select value={ String( selectedYear ) } onValueChange={ onYearChange }>
            <SelectTrigger
              className="ml-auto h-7 w-[120px] rounded-lg pl-2.5"
              aria-label="Select a year"
            >
              <SelectValue placeholder="Select year"/>
            </SelectTrigger>
            <SelectContent align="end" className="rounded-xl">
              { years.map( ( year ) => (
                <SelectItem key={ year } value={ String( year ) } className="rounded-lg">
                  <div className="flex items-center gap-2 text-xs">{ year }</div>
                </SelectItem>
              ) ) }
            </SelectContent>
          </Select>
        </div>
      }
    >
      { hasData ? (
        <ChartContainer config={ chartConfig } className="min-h-[250px] w-full">
          <BarChart
            accessibilityLayer
            data={ data }
            margin={ { top: 20, right: 0, left: 0 } }
            barCategoryGap="2%"
          >
            <CartesianGrid vertical={false} />

            {/* Axis 1 (Visible): Displays the month labels. This is the default axis. */}
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              type="category"
            />

            {/* Axis 2 (Invisible): Creates a numerical coordinate system for ReferenceLines. */}
            <XAxis
              xAxisId="numerical"
              type="number"
              hide={true}
              domain={[ -0.5, data.length - 0.5 ]}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              allowDecimals={false}
            />

            <ChartTooltip content={<ChartTooltipContent indicator="dot"/>}/>
            <ChartLegend content={<ChartLegendContent />}/>

            {/*
              Loop to create ReferenceLines.
              They target the invisible numerical X-axis using `xAxisId="numerical"`.
              The `x={index + 0.5}` works because it's mapping to a numerical scale.
            */}
            {data.slice(0, -1).map((_entry, index) => (
              <ReferenceLine
                key={`line-${index}`}
                xAxisId="numerical"
                x={index + 0.5}
                stroke="hsl(var(--border))"
              />
            ))}

            <Bar dataKey="read" fill="var(--color-read)" radius={ [4, 4, 0, 0] } />
            <Bar dataKey="reading" fill="var(--color-reading)" radius={ [4, 4, 0, 0] }/>
            <Bar dataKey="later" fill="var(--color-later)" radius={ [4, 4, 0, 0] }/>
            <Bar dataKey="wishlist" fill="var(--color-wishlist)" radius={ [4, 4, 0, 0] } />
          </BarChart>
        </ChartContainer>
      ) : (
        <div className="flex h-[250px] w-full items-center justify-center">
          <p className="text-center text-muted-foreground">
            { getEmptyStateMessage( selectedYear ) }
          </p>
        </div>
      ) }
    </StatCard>
  );
}