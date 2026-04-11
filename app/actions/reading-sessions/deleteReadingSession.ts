"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/app/utils/supabase/server";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { ActionState } from "@/app/types/action-state";
import { getTranslations } from "next-intl/server";

/**
 * Deletes a reading session, ensuring the user is the owner.
 * @param sessionId The ID of the session to delete.
 * @returns A promise resolving to a success/error object.
 */
export async function deleteReadingSession( sessionId: number ): Promise<ActionState> {
  const t = await getTranslations( "DeleteReadingSessionAction" );
  const supabase = await createClient();
  const user = await getCurrentUser();

  if (!user) {
    return { success: false, message: t( "errors.authRequired" ) };
  }

  // First, verify the user owns the session they are trying to delete.
  const { data: session, error: fetchError } = await supabase
    .from( "reading_sessions" )
    .select( "id, uid" )
    .eq( "id", sessionId )
    .single();

  if (fetchError || !session) {
    return { success: false, message: t( "errors.sessionNotFound" ) };
  }

  if (session.uid !== user.id) {
    return { success: false, message: t( "errors.permissionDenied" ) };
  }

  // If ownership is verified, proceed with deletion.
  const { error: deleteError } = await supabase
    .from( "reading_sessions" )
    .delete()
    .eq( "id", sessionId );

  if (deleteError) {
    console.error( "Failed to delete session:", deleteError );
    return { success: false, message: t( "errors.deleteFailed" ) };
  }

  revalidatePath( `/${ user.email }` );

  return { success: true, message: t( "success.deleted" ) };
}