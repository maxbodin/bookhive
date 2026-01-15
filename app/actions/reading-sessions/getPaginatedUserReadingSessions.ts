"use server";

import { createClient } from "@/app/utils/supabase/server";
import { ReadingSessionWithBook, SESSIONS_PAGE_SIZE } from "@/app/types/reading-session";

interface PaginatedSessionsResult {
  sessions: ReadingSessionWithBook[];
  totalCount: number;
}

/**
 * Fetches a paginated, filterable, and searchable list of a user's reading sessions.
 * @param userId The ID of the user.
 * @param page The page number to fetch.
 * @param year The year to filter sessions by.
 * @param query Optional search query for the book title.
 * @returns A promise resolving to the sessions for the page and the total count matching the criteria.
 */
export async function getPaginatedUserReadingSessions( {
                                                         userId,
                                                         page,
                                                         year,
                                                         query,
                                                       }: {
  userId: string;
  page: number;
  year: number;
  query?: string;
} ): Promise<PaginatedSessionsResult> {
  const supabase = await createClient();
  const offset = ( page - 1 ) * SESSIONS_PAGE_SIZE;

  let queryBuilder = supabase
    .from( "reading_sessions" )
    .select( `
      *,
      book:books!inner (
        title,
        cover_url,
        pages
      )
    `,
      { count: "exact" }
    )
    .eq( "uid", userId )
    .gte( "start_time", `${ year }-01-01T00:00:00Z` )
    .lt( "start_time", `${ year + 1 }-01-01T00:00:00Z` )
    .order( "start_time", { ascending: false } )
    .range( offset, offset + SESSIONS_PAGE_SIZE - 1 );

  // Apply search query if it exists.
  if (query) {
    queryBuilder = queryBuilder.ilike( "book.title", `%${ query }%` );
  }

  const { data: sessions, error, count } = await queryBuilder;

  if (error) {
    console.error( "Failed to fetch paginated reading sessions:", error.message );
    return { sessions: [], totalCount: 0 };
  }

  return {
    sessions: ( sessions as ReadingSessionWithBook[] ) || [],
    totalCount: count ?? 0,
  };
}