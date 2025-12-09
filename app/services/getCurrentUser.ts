import { createClient } from "@/app/utils/supabase/server";

/**
 * Fetch the current user's session from the server.
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}