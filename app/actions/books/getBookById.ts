"use server";

import { Book } from "@/app/types/book";
import { createClient } from "@/app/utils/supabase/server";
import { BOOK_DETAIL_COLUMNS } from "@/app/utils/supabase/selectColumns";

/**
 * Gets a single book based on its id.
 * @param id
 */
export async function getBookById( id: number ): Promise<Book | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from( "books" )
    .select( BOOK_DETAIL_COLUMNS )
    .eq( "id", id )
    .single();

  if (error) {
    console.error( "Error fetching book by ID:", error.message );
    return null;
  }

  return data;
}