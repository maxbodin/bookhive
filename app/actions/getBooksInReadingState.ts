"use server";

import { createClient } from "@/app/utils/supabase/server";
import { UserBook } from "@/app/types/user-book";
import { Book } from "@/app/types/book";

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

  console.log( data );

  if (error) {
    console.error( "Error fetching reading state books:", error.message );
    return { error: "Failed to load your books. Please try again." };
  }

  const flattenedData = data?.map(item => {
    const { books, ...userBookData } = item;
    return {
      ...userBookData,
      ...(books as Partial<Book>), // Type assertion to merge book properties
    };
  }) || [];

  return { data: flattenedData as UserBook[] };
}