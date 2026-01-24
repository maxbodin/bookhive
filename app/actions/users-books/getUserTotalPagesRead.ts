"use server";
import { createClient } from "@/app/utils/supabase/server";
import { getTranslations } from "next-intl/server";

/**
 * Calculates the total number of pages read by a user using a database RPC for performance.
 * @param userId - The ID of the user.
 * @returns The total number of pages read.
 */
export async function getUserTotalPagesRead( userId: string ): Promise<number> {
  const t = await getTranslations( "GetUserUsersBooksAction" );
  const supabase = await createClient();

  const { data, error } = await supabase.rpc( "get_user_total_pages_read", {
    p_user_id: userId,
  } );

  if (error) {
    console.error( "Error fetching total pages read via RPC:", error );
    throw new Error( t( "fetchStatsFailed" ) );
  }

  return data ?? 0;
}