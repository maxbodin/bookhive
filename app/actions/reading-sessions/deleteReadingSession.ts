"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/app/utils/supabase/server";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { ActionState } from "@/app/types/action-state";

/**
 * Deletes a reading session, ensuring the user is the owner.
 * @param sessionId The ID of the session to delete.
 * @returns A promise resolving to a success/error object.
 */
export async function deleteReadingSession( sessionId: number ): Promise<ActionState> {
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, message: "Authentication required." };
  }

  // First, verify the user owns the session they are trying to delete.
  const { data: session, error: fetchError } = await supabase
    .from( "reading_sessions" )
    .select( "id, uid" )
    .eq( "id", sessionId )
    .single();

  if (fetchError || !session) {
    return { success: false, message: "Session not found." };
  }

  if (session.uid !== user.id) {
    return { success: false, message: "Permission denied." };
  }

  // If ownership is verified, proceed with deletion.
  const { error: deleteError } = await supabase
    .from( "reading_sessions" )
    .delete()
    .eq( "id", sessionId );

  if (deleteError) {
    console.error( "Failed to delete session:", deleteError );
    return { success: false, message: "Database error: Could not delete session." };
  }

  revalidatePath( "/profile/[email]" );

  return { success: true, message: "Session deleted successfully." };
}