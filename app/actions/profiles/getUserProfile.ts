"use server";

import { createClient } from "@/app/utils/supabase/server";
import { Profile } from "@/app/types/profile";

/**
 * Fetches a user's profile from the database.
 * @param email - The email of the user to fetch.
 * @returns The user's profile data, or null if the user is not found.
 */
export async function getUserProfile( email: string ): Promise<Profile | null> {
  if (!email || !email.includes( "@" )) {
    return null;
  }

  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from( "profiles" )
    .select( "*" )
    .eq( "email", email )
    .single();

  if (( error && error.code !== "PGRST116" ) || !profile) {
    console.error( "Unexpected database error fetching profile:", error );
    return null;
  }

  return profile as Profile;
}