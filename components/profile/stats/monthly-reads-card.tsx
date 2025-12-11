import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { StatCard } from "./stat-card";

interface MonthlyReadsCardProps {
  data: { month: string; books: number }[];
  years: number[];
  selectedYear: number;
  onYearChange: ( year: string ) => void;
}

const chartConfig = {
  books: {
    label: "Books Read",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function MonthlyReadsCard( { data, years, selectedYear, onYearChange }: MonthlyReadsCardProps ) {
  // Check if there is any data to display for the selected year.
  const hasData = data.some( d => d.books > 0 );

  return (
    <StatCard
      title="Monthly Reading"
      headerChildren={
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
      }
    >
      { hasData ? (
        <ChartContainer config={ chartConfig } className="min-h-[250px] w-full">
          <BarChart accessibilityLayer data={ data } margin={ { top: 20 } }>
            <CartesianGrid vertical={ false }/>
            <XAxis dataKey="month" tickLine={ false } tickMargin={ 10 } axisLine={ false }/>
            <YAxis tickLine={ false } axisLine={ false } tickMargin={ 10 } allowDecimals={ false }/>
            <ChartTooltip cursor={ false } content={ <ChartTooltipContent indicator="dot"/> }/>
            <Bar dataKey="books" fill="var(--color-books)" radius={ [4, 4, 0, 0] }/>
          </BarChart>
        </ChartContainer>
      ) : (
        <div className="flex h-[250px] w-full items-center justify-center">
          <p className="text-center text-muted-foreground">No books read in { selectedYear }.</p>
        </div>
      ) }
    </StatCard>
  );
}