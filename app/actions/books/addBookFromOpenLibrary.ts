"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/app/utils/supabase/server";
import {
  OpenLibraryAuthorDetails,
  OpenLibraryEditionEntry,
  OpenLibraryEditionsResponse,
  OpenLibraryWorkDetails
} from "@/app/types/open-library";
import { transformOpenLibraryWorkDetails } from "@/app/actions/open-library/searchOpenLibrary";

interface ActionResult {
  success: boolean;
  message: string;
}

/**
 * Fetch utility.
 * @param url The URL to fetch.
 * @returns A promise that resolves to the parsed JSON.
 */
async function fetchJson<T>( url: string ): Promise<T> {
  const response = await fetch( url );
  if (!response.ok) {
    throw new Error( `Failed to fetch ${ url } with status ${ response.status }` );
  }
  return await response.json() as Promise<T>;
}

/**
 * Server action for admins to add a book from Open Library to the sovereign database.
 * @param openLibraryKey The book's Open Library key (e.g., "OL45804W").
 * @returns A promise resolving to a success/error object.
 */
export async function addBookFromOpenLibrary( openLibraryKey: string ): Promise<ActionResult> {
  const supabase = await createClient();

  // Check if the book already exists using its unique key.
  const { data: existingBook } = await supabase
    .from( "books" )
    .select( "id" )
    .eq( "open_library_key", openLibraryKey )
    .single();

  if (existingBook) {
    return { success: false, message: "This book is already in the database." };
  }

  try {
    // Fetch detailed data from Open Library.
    const workDetails: OpenLibraryWorkDetails = await fetchJson<OpenLibraryWorkDetails>( `https://openlibrary.org${ openLibraryKey }.json` );

    // Fetch author names from their individual author pages for accuracy.
    const authorKeys: string[] = workDetails.authors?.map( ( a ) => a.author.key ) || [];

    const authorPromises: Promise<OpenLibraryAuthorDetails>[] = authorKeys.map( ( key: string ) =>
      fetchJson<OpenLibraryAuthorDetails>( `https://openlibrary.org${ key }.json` )
    );
    const authorDetails: OpenLibraryAuthorDetails[] = await Promise.all( authorPromises );
    const authorNames: string[] = authorDetails.map( ( a: OpenLibraryAuthorDetails ) => a.name );

    // Fetch edition details to get publisher, page count, ISBNs etc.
    const editionsResponse: OpenLibraryEditionsResponse = await fetchJson<OpenLibraryEditionsResponse>(
      `https://openlibrary.org${ openLibraryKey }/editions.json?limit=1`
    );
    const firstEdition: OpenLibraryEditionEntry | undefined = editionsResponse.entries?.[0];

    // Transform data into our schema.
    const bookDataToInsert = await transformOpenLibraryWorkDetails(
      workDetails,
      authorNames,
      firstEdition || {}
    );

    // Insert the new book.
    const { error } = await supabase.from( "books" ).insert( bookDataToInsert );

    if (error) {
      console.error( "Failed to add book from API:", error );
      return { success: false, message: "Database error: Could not add the book." };
    }

    // Revalidate the home page to show the new book in sovereign results.
    revalidatePath( "/" );
    return {
      success: true,
      message: `'${ bookDataToInsert.title }' was added successfully.`,
    };

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    console.error( "Error processing addBookFromApi:", errorMessage );
    return { success: false, message: "Failed to fetch full book details from the API." };
  }
}