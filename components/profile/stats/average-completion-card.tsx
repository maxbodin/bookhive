"use client";
import { StatCard } from "./stat-card";
import { YearSelection } from "@/components/profile/stats/year-selection";
import { useTranslations } from "next-intl";

interface AverageCompletionCardProps {
  avgDays: number;
}

export function AverageCompletionCard( { avgDays }: AverageCompletionCardProps ) {
  const t = useTranslations( "Stats.AverageCompletion" );

  return (
    <StatCard title={ t( "title" ) } headerChildren={
      <YearSelection
      />
    }>
      <div className="flex h-full items-center justify-center text-center">
        <div>
          <p className="text-4xl font-bold tracking-tighter">
            { avgDays > 0 ? avgDays.toFixed( 1 ) : "-" }
          </p>
          <p className="text-sm text-muted-foreground">{ t( "days" ) }</p>
        </div>
      </div>
    </StatCard>
  );
}