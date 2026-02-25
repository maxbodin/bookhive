"use server";

import { createClient } from "@/app/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { getUserProfile } from "@/app/actions/profiles/getUserProfile";
import { BookType } from "@/app/types/book";
import { z } from "zod";

const createBookSchema = z.object( {
  title: z.string().min( 1, "Title is required" ),
  authors: z.string().optional(), // Comma separated.
  description: z.string().optional(),
  publisher: z.string().optional(),
  publication_date: z.string().optional(),
  isbn_10: z.string().max( 10 ).optional(),
  isbn_13: z.string().max( 13 ).optional(),
  pages: z.coerce.number().int().nonnegative().optional(),
  type: z.enum( ["bd", "manga", "roman"] ).optional(),
  categories: z.string().optional(), // Comma separated.
  height: z.coerce.number().nonnegative().optional(),
  length: z.coerce.number().nonnegative().optional(),
  width: z.coerce.number().nonnegative().optional(),
  weight: z.coerce.number().nonnegative().optional(),
  cover_url: z.string().url().optional().or( z.literal( "" ) ),
} );

// TODO : Add translations.
export async function createBook( formData: FormData ) {
  const supabase = await createClient();
  const currentUser = await getCurrentUser();

  if (!currentUser?.email) {
    return { success: false, message: "Unauthorized." };
  }

  const profile = await getUserProfile( currentUser.email );
  if (!profile?.is_admin) {
    return { success: false, message: "Only administrators can create books." };
  }

  // Parse form data.
  const rawData = Object.fromEntries( formData.entries() );
  const validated = createBookSchema.safeParse( rawData );

  if (!validated.success) {
    return { success: false, message: "Invalid input data." };
  }

  const data = validated.data;

  // TODO : Refactor implementations in a dedicated file.
  // Helper to process arrays.
  const toArray = ( str?: string ) => str ? str.split( "," ).map( s => s.trim() ).filter( Boolean ) : null;

  const { error } = await supabase.from( "books" ).insert( {
    title: data.title,
    description: data.description || null,
    authors: toArray( data.authors ),
    publisher: data.publisher || null,
    publication_date: data.publication_date || null,
    isbn_10: data.isbn_10 || null,
    isbn_13: data.isbn_13 || null,
    pages: data.pages || null,
    type: data.type as BookType || null,
    categories: toArray( data.categories ),
    height: data.height || 0,
    length: data.length || 0,
    width: data.width || 0,
    weight: data.weight || null,
    cover_url: data.cover_url || null,
  } );

  if (error) {
    console.error( "Create book error:", error.message );
    return { success: false, message: "Failed to create book." };
  }

  // TODO : revalidate path with the search. or revalidate and redirect to book details page.
  revalidatePath( "/" );
  return { success: true, message: "Book created successfully!" };
}