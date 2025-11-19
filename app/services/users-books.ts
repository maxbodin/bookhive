"use server";

import { createClient } from "@/app/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { BookState } from "@/app/types/book-state";

/**
 * Adds or updates a book's state in the current user's collection.
 *
 * @param bookId The ID of the book.
 * @param state The new state of the book.
 */
export async function upsertBookState( bookId: number, state: BookState ) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to manage your books." };
  }

  const { error } = await supabase.from( "users_books" ).upsert( {
    uid: user.id,
    book_id: bookId,
    state: state,
  } );

  if (error) {
    console.error( "Error upserting book state:", error );
    return { error: "Could not update your book's state." };
  }

  // Revalidate the pages where the book grids are displayed.
  revalidatePath( "/" );

  if (user.email) {
    revalidatePath( `/${ user.email }` );
  }

  return { success: true };
}