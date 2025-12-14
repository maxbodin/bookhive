"use server";

import { createClient } from "@/app/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const profileUpdateSchema = z.object( {
  pictureUrl: z.url( "Please enter a valid URL." ).max( 512, "URL is too long." ),
  userEmail: z.email(),
} );

/**
 * Updates the profile picture URL for the currently authenticated user.
 * @param formData - The form data containing the new picture URL.
 */
export async function updateProfilePicture( formData: FormData ) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, message: "Authentication required." };
  }

  const validatedFields = profileUpdateSchema.safeParse( {
    pictureUrl: formData.get( "pictureUrl" ),
    userEmail: formData.get( "userEmail" ),
  } );

  if (!validatedFields.success) {
    return {
      success: false,
      message: validatedFields.error.flatten().fieldErrors.pictureUrl?.[0] || "Invalid input.",
    };
  }

  const { pictureUrl, userEmail } = validatedFields.data;

  const { error } = await supabase
    .from( "profiles" )
    .update( { picture: pictureUrl } )
    .eq( "id", user.id );

  if (error) {
    return { success: false, message: "Failed to update profile picture. Please try again." };
  }

  // Revalidate the user's profile page to show the new image instantly.
  revalidatePath( `/${ userEmail }` );

  return { success: true, message: "Profile picture updated successfully!" };
}