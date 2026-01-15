"use server";

import { createClient } from "@/app/utils/supabase/server";

/**
 * Fetches the unique years in which a user has logged reading sessions.
 * @param userId The ID of the user.
 * @returns A promise that resolves to an array of years, sorted in descending order.
 */
export async function getReadingSessionYears( userId: string ): Promise<number[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc( "get_distinct_session_years", {
    p_uid: userId
  } );

  if (error) {
    console.error( "Failed to fetch reading session years:", error.message );
    return [];
  }

  if (!data) {
    return [];
  }

  // The 'data' is typed as an array of objects with a 'session_year' property.
  return data.map( ( row: { session_year: number } ) => row.session_year );
}