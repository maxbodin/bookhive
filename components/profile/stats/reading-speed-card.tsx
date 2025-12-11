import { StatCard } from "./stat-card";

interface ReadingSpeedCardProps {
  pagesPerDay: number;
}

export function ReadingSpeedCard( { pagesPerDay }: ReadingSpeedCardProps ) {
  return (
    <StatCard title="Average Reading Speed">
      <div className="grid grid-cols-1 gap-4 text-center sm:grid-cols-3">
        <div>
          <p className="text-2xl font-bold">{ pagesPerDay.toFixed( 1 ) }</p>
          <p className="text-sm text-muted-foreground">Pages/Day</p>
        </div>
        <div>
          <p className="text-2xl font-bold">{ ( pagesPerDay * 7 ).toFixed( 0 ) }</p>
          <p className="text-sm text-muted-foreground">Pages/Week</p>
        </div>
        <div>
          <p className="text-2xl font-bold">{ ( pagesPerDay * 30.44 ).toFixed( 0 ) }</p>
          <p className="text-sm text-muted-foreground">Pages/Month</p>
        </div>
      </div>
    </StatCard>
  );
}
