"use server";

import { createClient } from "@/app/utils/supabase/server";
import { getTranslations } from "next-intl/server";
import { UserBookStatsRecord } from "@/app/types/user-book";
import { USER_BOOK_STATS_COLUMNS } from "@/app/utils/supabase/selectColumns";

type UserBookStatsRow = Omit<UserBookStatsRecord, "pages" | "type"> & {
  books: { pages?: number | null; type?: UserBookStatsRecord["type"] }[]
    | { pages?: number | null; type?: UserBookStatsRecord["type"] }
    | null;
};

/**
 * Fetches all books for a user needed by the stats tab, with a minimal payload.
 */
export async function getUserBooksForStats( userId: string ): Promise<UserBookStatsRecord[]> {
  const supabase = await createClient();
  const t = await getTranslations( "GetUserUsersBooksAction" );

  const { data, error } = await supabase
    .from( "users_books" )
    .select( USER_BOOK_STATS_COLUMNS )
    .eq( "uid", userId );

  if ( error ) {
    console.error( "Error fetching user books for stats:", error.message );
    throw new Error( t( "fetchStatsFailed" ) );
  }

  const rows = ( data || [] ) as UserBookStatsRow[];

  return rows.map( ( row ) => {
    const bookData = Array.isArray( row.books ) ? row.books[ 0 ] : row.books;

    return {
      state: row.state,
      start_reading_date: row.start_reading_date,
      end_reading_date: row.end_reading_date,
      read_date: row.read_date,
      start_wishlist_date: row.start_wishlist_date,
      start_later_date: row.start_later_date,
      pages: bookData?.pages ?? null,
      type: bookData?.type ?? null,
    };
  } );
}