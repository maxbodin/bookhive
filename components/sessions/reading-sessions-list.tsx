"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { format } from "date-fns";

import { ReadingSessionWithBook, SESSIONS_PAGE_SIZE } from "@/app/types/reading-session";
import { getPaginatedUserReadingSessions, } from "@/app/actions/reading-sessions/getPaginatedUserReadingSessions";
import { ReadingSessionItem } from "./reading-session-item";
import { Spinner } from "@/components/ui/spinner";
import { EmptySessions } from "./empty-sessions";

interface ReadingSessionsListProps {
  userId: string;
  isOwner: boolean;
  year: number;
  query: string;
  initialSessions: ReadingSessionWithBook[];
  initialTotalCount: number;
}

export function ReadingSessionsList( {
                                       userId,
                                       isOwner,
                                       year,
                                       query,
                                       initialSessions,
                                       initialTotalCount
                                     }: ReadingSessionsListProps ) {
  const [sessions, setSessions] = useState<ReadingSessionWithBook[]>( initialSessions );
  const [page, setPage] = useState<number>( 1 );
  const [hasMore, setHasMore] = useState<boolean>( initialSessions.length < initialTotalCount );
  const [isLoading, setIsLoading] = useState<boolean>( false );
  const { ref, inView } = useInView( { threshold: 0.5 } );

  // Reset list when filters change.
  useEffect( () => {
    setSessions( initialSessions );
    setPage( 1 );
    setHasMore( initialSessions.length < initialTotalCount );
  }, [year, query, initialSessions, initialTotalCount] );

  const loadMoreSessions = useCallback( async () => {
    if (isLoading || !hasMore) return;

    setIsLoading( true );
    const nextPage = page + 1;
    const { sessions: newSessions } = await getPaginatedUserReadingSessions( {
      userId,
      page: nextPage,
      year,
      query,
    } );

    setSessions( ( prev ) => [...prev, ...newSessions] );
    setPage( nextPage );
    setHasMore( newSessions.length === SESSIONS_PAGE_SIZE );
    setIsLoading( false );
  }, [isLoading, hasMore, page, userId, year, query] );

  useEffect( () => {
    if (inView) {
      loadMoreSessions();
    }
  }, [inView, loadMoreSessions] );

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

  if (initialTotalCount === 0) {
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