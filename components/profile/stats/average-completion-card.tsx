import { StatCard } from "./stat-card";

interface AverageCompletionCardProps {
  avgDays: number;
}

export function AverageCompletionCard( { avgDays }: AverageCompletionCardProps ) {
  return (
    <StatCard title="Average time to finish a book">
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