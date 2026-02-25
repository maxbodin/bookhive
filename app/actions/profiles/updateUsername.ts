"use server";

import { createClient } from "@/app/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { getTranslations } from "next-intl/server";

/**
 *
 * @param formData
 */
export async function updateUsername( formData: FormData ) {

  const t = await getTranslations( "EditableUsername" );
  const newUsername = formData.get( "username" ) as string;
  const userEmail = formData.get( "userEmail" ) as string;

  if (!newUsername || newUsername.trim() === "" || !userEmail) {
    return { success: false, message: t( "invalidUsername" ) };
  }

  const supabase = await createClient();
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.email !== userEmail) {
    return { success: false, message: t( "unauthorized" ) };
  }

  const { error } = await supabase
    .from( "profiles" )
    .update( { username: newUsername.trim() } )
    .eq( "id", currentUser.id );

  console.log( error );
  if (error) {
    return { success: false, message: error.message };
  }

  // Revalidate the profile page to instantly show the new username.
  revalidatePath( `/${ encodeURIComponent( userEmail ) }` );

  return { success: true, message: t( "success" ) };
}