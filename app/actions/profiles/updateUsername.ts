"use server";

import { createClient } from "@/app/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { getTranslations } from "next-intl/server";

/**
 * Secure username update.
 * @param formData
 */
export async function updateUsername( formData: FormData ) {
  const t = await getTranslations( "EditableUsername" );

  const rawUsername = formData.get( "username" ) as string;

  const newUsername = rawUsername.trim().normalize( "NFKC" );

  const USERNAME_REGEX = /^[a-zA-Z0-9._-]{3,30}$/;
  if (!USERNAME_REGEX.test( newUsername )) {
    return { success: false, message: t( "invalidUsername" ) };
  }

  const supabase = await createClient();
  const currentUser = await getCurrentUser();
  const userEmail = currentUser?.email ?? ( formData.get( "userEmail" ) as string );

  if (!currentUser || currentUser.email !== userEmail) {
    return { success: false, message: t( "unauthorized" ) };
  }

  const { error } = await supabase
    .from( "profiles" )
    .update( { username: newUsername } )
    .eq( "id", currentUser.id );

  if (error) {
    return { success: false, message: error.message };
  }

  // Revalidate the profile page to instantly show the new username.
  revalidatePath( `/${ encodeURIComponent( userEmail ) }` );

  return { success: true, message: t( "success" ) };
}
