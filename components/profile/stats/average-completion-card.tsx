import { StatCard } from "./stat-card";
import { YearSelection } from "@/components/profile/stats/year-selection";

interface AverageCompletionCardProps {
  avgDays: number;
  selectedYear: number;
  onYearChange: ( year: string ) => void;
}

export function AverageCompletionCard( {
                                         avgDays, selectedYear,
                                         onYearChange
                                       }: AverageCompletionCardProps ) {
  return (
    <StatCard title="Average time to finish a book" headerChildren={
      <YearSelection
        year={ selectedYear }
        onValueChange={ onYearChange }
      />
    }>
      <div className="flex h-full items-center justify-center text-center">
        <div>
          <p className="text-4xl font-bold tracking-tighter">
            { avgDays > 0 ? avgDays.toFixed( 1 ) : "-" }
          </p>
          <p className="text-sm text-muted-foreground">Days</p>
        </div>
      </div>
    </StatCard>
  );
}