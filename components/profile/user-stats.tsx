"use client";

import { UserBookStatsRecord } from "@/app/types/user-book";
import { BooksByStatusCard } from "./stats/books-by-status-card";
import { AverageCompletionCard } from "@/components/profile/stats/average-completion-card";
import { BooksByTypesCard } from "@/components/profile/stats/books-by-types-card";
import { MonthlyCountByStateCard } from "@/components/profile/stats/monthly-count-by-state-card";
import { ReadingSpeedCard } from "@/components/profile/stats/reading-speed-card";
import { MonthlyPagesReadCard } from "@/components/profile/stats/monthly-pages-read-card";
import { ReadCompletionTrendCard } from "@/components/profile/stats/read-completion-trend-card";
import { ReadingDurationDistributionCard } from "@/components/profile/stats/reading-duration-distribution-card";
import { ReadingLifecycleCard } from "@/components/profile/stats/reading-lifecycle-card";
import { PagesByTypeOverTimeCard } from "@/components/profile/stats/pages-by-type-over-time-card";
import { ReadingWeekdayPatternCard } from "@/components/profile/stats/reading-weekday-pattern-card";
import { ReadLengthDistributionCard } from "@/components/profile/stats/read-length-distribution-card";

interface UserStatsProps {
  userBooks: UserBookStatsRecord[];
}

/**
 * Component to display various statistics about a user's book collection.
 * @param userBooks
 * @constructor
 */
export function UserStats( { userBooks }: UserStatsProps ) {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <BooksByStatusCard userBooks={ userBooks } className="xl:col-span-4"/>
      <BooksByTypesCard userBooks={ userBooks } className="xl:col-span-4"/>
      <AverageCompletionCard userBooks={ userBooks } className="xl:col-span-4"/>
      <ReadingSpeedCard userBooks={ userBooks } className="xl:col-span-4"/>
      <MonthlyPagesReadCard userBooks={ userBooks } className="xl:col-span-4"/>
      <ReadingDurationDistributionCard userBooks={ userBooks } className="xl:col-span-4"/>
      <MonthlyCountByStateCard userBooks={ userBooks } className="xl:col-span-6"/>
      <ReadCompletionTrendCard userBooks={ userBooks } className="xl:col-span-6"/>
      <ReadingLifecycleCard userBooks={ userBooks } className="xl:col-span-6"/>
      <PagesByTypeOverTimeCard userBooks={ userBooks } className="xl:col-span-6"/>
      <ReadingWeekdayPatternCard userBooks={ userBooks } className="xl:col-span-3"/>
      <ReadLengthDistributionCard userBooks={ userBooks } className="xl:col-span-6"/>
    </div>
  );
}