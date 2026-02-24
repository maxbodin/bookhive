"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { format } from "date-fns";
import { ReadingSessionWithBook, SESSIONS_PAGE_SIZE } from "@/app/types/reading-session";
import { getPaginatedUserReadingSessions } from "@/app/actions/reading-sessions/getPaginatedUserReadingSessions";
import { ReadingSessionItem } from "./reading-session-item";
import { Spinner } from "@/components/ui/spinner";
import { EmptySessions } from "./empty-sessions";
import { useYearSelection } from "@/app/contexts/year-selection-context";

interface ReadingSessionsListProps {
  userId: string;
  isOwner: boolean;
  query: string;
  types?: string;
  initialSessions: ReadingSessionWithBook[];
  initialTotalCount: number;
}

export function ReadingSessionsList( {
                                       userId,
                                       isOwner,
                                       query,
                                       types,
                                       initialSessions,
                                       initialTotalCount
                                     }: ReadingSessionsListProps ) {
  const [sessions, setSessions] = useState<ReadingSessionWithBook[]>( initialSessions );
  const [page, setPage] = useState<number>( 1 );
  const [hasMore, setHasMore] = useState<boolean>( initialSessions.length < initialTotalCount );
  const [isLoading, setIsLoading] = useState<boolean>( false );
  const { ref, inView } = useInView( { threshold: 0.5 } );

  const { selectedYear } = useYearSelection();

  // Ref to track if this is the first render.
  const isInitialMount = useRef( true );

  // Reset list when filters change and we are not on first mount.
  useEffect( () => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Using an alert we can see clearly that the list is only reloaded on filters update and not on first mount.
    // alert(`Effect is running for year: ${selectedYear}`);
    const fetchOnFilterChange = async () => {
      setIsLoading( true );
      const { sessions: newSessions, totalCount } = await getPaginatedUserReadingSessions( {
        userId,
        page: 1,
        year: selectedYear,
        query,
        types,
      } );

      setSessions( newSessions );
      setPage( 1 );
      setHasMore( newSessions.length < totalCount );
      setIsLoading( false );
    };

    fetchOnFilterChange();
  }, [selectedYear, query, types, userId] );

  const loadMoreSessions = useCallback( async () => {
    if (isLoading || !hasMore) return;

    setIsLoading( true );
    const nextPage = page + 1;
    const { sessions: newSessions } = await getPaginatedUserReadingSessions( {
      userId,
      page: nextPage,
      year: selectedYear,
      query,
      types,
    } );

    setSessions( ( prev ) => [...prev, ...newSessions] );
    setPage( nextPage );
    setHasMore( newSessions.length === SESSIONS_PAGE_SIZE );
    setIsLoading( false );
  }, [isLoading, hasMore, page, userId, selectedYear, query, types] );

  useEffect( () => {
    if (inView && !isLoading) {
      loadMoreSessions();
    }
  }, [inView, isLoading, loadMoreSessions] );

  // Group sessions by month for rendering.
  const groupedSessions = useMemo( () => {
    const groups = new Map<string, ReadingSessionWithBook[]>();
    sessions.forEach( ( session ) => {
      const monthKey = format( new Date( session.start_time ), "MMMM yyyy" );
      if (!groups.has( monthKey )) {
        groups.set( monthKey, [] );
      }
      groups.get( monthKey )!.push( session );
    } );
    return groups;
  }, [sessions] );

  if (sessions.length === 0) {
    return <EmptySessions isOwner={ isOwner } className="mt-4"/>;
  }

  return (
    <div className="flex flex-col gap-4">
      { Array.from( groupedSessions.entries() ).map( ( [month, monthSessions] ) => (
        <React.Fragment key={ month }>
          <h2 className="text-lg font-bold tracking-tight text-muted-foreground pt-4">
            { month }
          </h2>
          { monthSessions.map( ( session ) => (
            <ReadingSessionItem
              key={ session.id }
              session={ session }
              isOwner={ isOwner }
            />
          ) ) }
        </React.Fragment>
      ) ) }

      { hasMore && (
        <div ref={ ref } className="flex justify-center items-center p-4">
          <Spinner/>
        </div>
      ) }
    </div>
  );
}