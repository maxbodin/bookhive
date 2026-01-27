"use client";
import { useTranslations } from "next-intl";
import { AddNewSessionButton } from "@/components/sessions/add-new-session-button";
import { EmptySessions } from "./empty-sessions";
import { ReadingSessionsList } from "@/components/sessions/reading-sessions-list";
import { useYearSelection } from "@/app/contexts/year-selection-context";
import { YearSelection } from "@/components/profile/stats/year-selection";
import { ReadingSessionWithBook } from "@/app/types/reading-session";

interface ReadingSessionsTabProps {
  userId: string;
  isOwner: boolean;
  initialSessions: ReadingSessionWithBook[];
  initialTotalCount: number;
  query: string;
}

export const ReadingSessionsTab = ( {
                                      userId,
                                      isOwner,
                                      initialSessions,
                                      initialTotalCount,
                                      query,
                                    }: ReadingSessionsTabProps ) => {
  const t = useTranslations( "ReadingSessions" );
  const { selectedYear, availableYears } = useYearSelection();


  if (availableYears.length === 0) {
    return (
      <div className="max-w-2xl mx-auto flex flex-col gap-4">
        { isOwner && <AddNewSessionButton/> }
        <EmptySessions isOwner={ isOwner }/>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center gap-4 pt-2">
        <div>
          <h2 className="text-xl font-bold tracking-tight">
            { t( "title", { count: initialTotalCount } ) }
          </h2>
          <p className="text-sm text-muted-foreground">
            { t( "subtitle", { year: selectedYear } ) }
          </p>
        </div>
        <YearSelection/>
      </div>

      { isOwner && <AddNewSessionButton/> }

      <ReadingSessionsList
        userId={ userId }
        isOwner={ isOwner }
        query={ query }
        initialSessions={ initialSessions }
        initialTotalCount={ initialTotalCount }
      />
    </div>
  );
};