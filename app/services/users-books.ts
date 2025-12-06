"use server";

import { createClient } from "@/app/utils/supabase/server";
import { BookState } from "@/app/types/book-state";
import { revalidatePath } from "next/cache";

/**
 * Creates or updates the state of a book for the current user.
 */
export async function upsertBookState(
  bookId: number,
  newState: BookState | null, // Allow null to remove the book from shelves.
  updates: Record<string, any> = {}
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to modify your bookshelf." };
  }

  // If the new state is null, we are removing the book entry.
  if (newState === null) {
    const { error } = await supabase
      .from( "users_books" )
      .delete()
      .match( { uid: user.id, book_id: bookId } );

    if (error) return { error: "Failed to remove book from shelf." };
  } else {
    // Combine base data with additional updates (dates).
    const dataToUpsert = {
      ...updates,
      uid: user.id,
      book_id: bookId,
      state: newState,
    };

    const { error } = await supabase.from( "users_books" ).upsert( dataToUpsert );
    if (error) return { error: "Failed to update book state." };
  }

  // Revalidate the pages where the book grids are displayed.
  revalidatePath( "/" );

  if (user.email) {
    revalidatePath( `/${ encodeURIComponent( user.email ) }` ); // Revalidate user's profile.
  }

  return { success: true };
}