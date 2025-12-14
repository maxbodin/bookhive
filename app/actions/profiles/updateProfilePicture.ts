"use server";

import { createClient } from "@/app/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getTranslations } from "next-intl/server";

/**
 * Updates the profile picture URL for the currently authenticated user.
 * @param formData - The form data containing the new picture URL.
 */
export async function updateProfilePicture( formData: FormData ) {
  const t = await getTranslations( "UpdateProfilePictureAction" );

  const profileUpdateSchema = z.object( {
    pictureUrl: z.url( t( "errors.invalidUrl" ) ).max( 512, t( "errors.urlTooLong" ) ),
    userEmail: z.email(),
  } );

  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, message: t( "errors.authRequired" ) };
  }

  const validatedFields = profileUpdateSchema.safeParse( {
    pictureUrl: formData.get( "pictureUrl" ),
    userEmail: formData.get( "userEmail" ),
  } );

  if (!validatedFields.success) {
    return {
      success: false,
      message: validatedFields.error.flatten().fieldErrors.pictureUrl?.[0] || t( "errors.invalidInput" ),
    };
  }

  const { pictureUrl, userEmail } = validatedFields.data;

  const { error } = await supabase
    .from( "profiles" )
    .update( { picture: pictureUrl } )
    .eq( "id", user.id );

  if (error) {
    return { success: false, message: t( "errors.updateFailed" ) };
  }

  // Revalidate the user's profile page to show the new image instantly.
  revalidatePath( `/${ userEmail }` );

  return { success: true, message: t( "success.updateSuccess" ) };
}