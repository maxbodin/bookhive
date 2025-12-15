"use server";

import { createClient } from "@/app/utils/supabase/server";
import { Profile } from "@/app/types/profile";
import { getTranslations } from "next-intl/server";

/**
 * Fetches a user's profile from the database.
 * @param email - The email of the user to fetch.
 * @returns The user's profile data.
 * @throws An error if the user is not found or if there's a database error.
 */
export async function getUserProfile( email: string ): Promise<Profile> {
  const t = await getTranslations( "GetUserProfileAction" );
  const supabase = await createClient();

  const { data: profile, error } = await supabase
    .from( "profiles" )
    .select( "*" )
    .eq( "email", email )
    .single();

  if (error || !profile) {
    throw new Error( error?.message || t( "userNotFound" ) );
  }

  return profile as Profile;
}