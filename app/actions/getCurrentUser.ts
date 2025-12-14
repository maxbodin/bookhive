"use server";

import { createClient } from "@/app/utils/supabase/server";
import { User } from "@supabase/supabase-js";

/**
 * Fetch the current user's session from the server.
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}