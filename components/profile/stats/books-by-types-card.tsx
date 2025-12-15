"use client";

import { useTranslations } from "next-intl";
import { Cell, Label, Pie, PieChart } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { StatCard } from "./stat-card";
import React from "react";

interface BookTypesCardProps {
  data: Record<string, number>;
}

export function BooksByTypesCard( { data }: BookTypesCardProps ) {
  const t = useTranslations( "Stats.BooksByTypes" );

  const chartConfig = {
    bd: { label: t( "bd" ), color: "var(--chart-1)" },
    manga: { label: t( "manga" ), color: "var(--chart-2)" },
    roman: { label: t( "roman" ), color: "var(--chart-3)" },
    unknown: { label: t( "unknown" ), color: "var(--chart-4)" },
  } satisfies ChartConfig;

  const chartData = Object.entries( data ).map( ( [type, count] ) => ( {
    typeKey: type,
    type: chartConfig[type as keyof typeof chartConfig]?.label || "Unknown",
    count,
    fill: `var(--color-${ type })`,
  } ) ).filter( item => item.count > 0 );

  const totalBooks = React.useMemo( () => {
    return chartData.reduce( ( acc, curr ) => acc + curr.count, 0 );
  }, [] );

  return (
    <StatCard title={ t( "title" ) }>
      { totalBooks > 0 ? (
        <ChartContainer config={ chartConfig } className="min-h-[250px] w-full">
          <PieChart>
            <ChartTooltip
              cursor={ false }
              content={ <ChartTooltipContent hideLabel/> }
            />
            <Pie
              data={ chartData }
              dataKey="count"
              nameKey="type"
              innerRadius={ 45 }
              outerRadius={ 90 }
              strokeWidth={ 2 }
              label
            >
              <Label
                content={ ( { viewBox } ) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={ viewBox.cx }
                        y={ viewBox.cy }
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={ viewBox.cx }
                          y={ viewBox.cy }
                          className="text-xl font-bold text-foreground"
                          fill="currentColor"
                        >
                          { totalBooks.toLocaleString() }
                        </tspan>
                        <tspan
                          x={ viewBox.cx }
                          y={ ( viewBox.cy || 0 ) + 20 }
                          className="text-muted-foreground"
                          fill="currentColor"
                        >
                          { t( "books" ) }
                        </tspan>
                      </text>
                    );
                  }
                } }
              />
              { chartData.map( ( entry ) => (
                <Cell key={ `cell-${ entry.type }` } fill={ entry.fill }/>
              ) ) }
            </Pie>
            <ChartLegend
              content={ <ChartLegendContent nameKey="typeKey"/> }
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      ) : (
        <p className="py-8 text-center text-muted-foreground">{ t( "noBooks" ) }</p>
      ) }
    </StatCard>
  );
}