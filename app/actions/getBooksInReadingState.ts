"use server";

import { createClient } from "@/app/utils/supabase/server";
import { UserBook } from "@/app/types/user-book";
import { flattenUserBookData } from "@/app/utils/flattenUserBook";

type ActionResponse = {
  data?: UserBook[];
  error?: string;
}

/**
 * Récupère les livres en cours de lecture pour l'utilisateur connecté.
 */
export async function getBooksInReadingState(): Promise<ActionResponse> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { data: [] };
  }

  const { data, error } = await supabase
    .from( "users_books" )
    .select( `
      id,
      uid,
      book_id,
      state,
      current_page,
      is_favorite,
      books (
        title,
        pages
      )
    ` )
    .eq( "uid", user.id )
    .eq( "state", "reading" );

  if (error) {
    console.error( "Error fetching reading state books:", error.message );
    return { error: "Failed to load your books. Please try again." };
  }

  return { data: flattenUserBookData( data as UserBook[] ) as UserBook[] };
}