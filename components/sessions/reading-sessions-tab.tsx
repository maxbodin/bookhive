"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ReadingSessionWithBook } from "@/app/types/reading-session";
import { AddNewSessionButton } from "@/components/sessions/add-new-session-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptySessions } from "./empty-sessions";
import { ReadingSessionsList } from "@/components/sessions/reading-sessions-list";

interface ReadingSessionsTabProps {
  userId: string;
  isOwner: boolean;
  initialYears: number[];
  initialSessions: ReadingSessionWithBook[];
  initialTotalCount: number;
  query: string;
}

export const ReadingSessionsTab = ( {
                                      userId,
                                      isOwner,
                                      initialYears,
                                      initialSessions,
                                      initialTotalCount,
                                      query,
                                    }: ReadingSessionsTabProps ) => {
  const t = useTranslations( "ReadingSessions" );
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentYear = searchParams.get( "year" ) || initialYears[0]?.toString() || new Date().getFullYear().toString();

  const handleYearChange = ( year: string ) => {
    const currentParams = new URLSearchParams( Array.from( searchParams.entries() ) );
    currentParams.set( "year", year );
    router.replace( `${ pathname }?${ currentParams.toString() }`, { scroll: false } );
  };

  if (initialYears.length === 0) {
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
            { t( "subtitle", { year: currentYear } ) }
          </p>
        </div>
        <Select value={ currentYear } onValueChange={ handleYearChange }>
          <SelectTrigger className="w-[120px] h-8 text-xs">
            <SelectValue placeholder={ t( "yearPlaceholder" ) }/>
          </SelectTrigger>
          <SelectContent>
            { initialYears.map( ( year ) => (
              <SelectItem key={ year } value={ year.toString() } className="text-xs">
                { year }
              </SelectItem>
            ) ) }
          </SelectContent>
        </Select>
      </div>

      { isOwner && <AddNewSessionButton/> }

      <ReadingSessionsList
        userId={ userId }
        isOwner={ isOwner }
        year={ parseInt( currentYear ) }
        query={ query }
        initialSessions={ initialSessions }
        initialTotalCount={ initialTotalCount }
      />
    </div>
  );
};