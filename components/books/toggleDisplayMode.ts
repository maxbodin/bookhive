"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

/**
 * Toggles the display mode cookie between 'grid' and 'carousel'.
 * Revalidates the root path to ensure the UI updates immediately.
 */
export async function toggleDisplayMode() {
  // Retrieve the current display mode from cookies, defaulting to 'grid'.
  const currentMode = ( await cookies() ).get( "display_mode" )?.value || "grid";
  const newMode = currentMode === "grid" ? "carousel" : "grid";

  // Set the new display mode in the cookies.
  ( await cookies() ).set( "display_mode", newMode, { path: "/" } );

  // Revalidate the root layout to reflect the changes instantly across the site.
  revalidatePath( "/", "layout" );
}