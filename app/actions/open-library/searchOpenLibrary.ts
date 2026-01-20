"use server";
import { Book } from "@/app/types/book";
import { OpenLibraryEditionEntry, OpenLibrarySearchDoc, OpenLibraryWorkDetails } from "@/app/types/open-library";

const SEARCH_LIMIT: number = 10;

/**
 * Searches the Open Library API for books.
 * @param query The search query string.
 * @returns A promise that resolves to an array of partial books for display.
 */
export async function searchOpenLibrary( query: string ): Promise<Book[]> {
  query = query.trim().toLowerCase();

  if (!query || query === "") {
    return [];
  }

  const searchUrl = new URL( "https://openlibrary.org/search.json" );
  searchUrl.searchParams.set( "q", query );
  searchUrl.searchParams.set( "fields", "key,title,author_name,cover_i,number_of_pages_median" );
  searchUrl.searchParams.set( "limit", SEARCH_LIMIT.toString() );

  try {
    const response = await fetch( searchUrl.toString() );

    if (!response.ok) {
      console.error( `Open Library API failed with status: ${ response.status }` );
      return [];
    }

    const data: { docs: OpenLibrarySearchDoc[] } = await response.json();

    const bookPromises = data.docs.map( transformOpenLibrarySearchDoc );
    return await Promise.all( bookPromises );

  } catch (error) {
    console.error( "Error fetching from Open Library:", error );
    return [];
  }
}

/**
 * Transforms an Open Library SEARCH document into a partial Book object for display.
 * This is for the initial search results grid.
 */
export async function transformOpenLibrarySearchDoc( doc: OpenLibrarySearchDoc ): Promise<Book> {
  return {
    // We use a temporary ID for React keys, it's not a real DB ID.
    id: Math.random(),
    created_at: new Date().toISOString(),
    title: doc.title,
    authors: doc.author_name || [],
    cover_url: doc.cover_i
      ? `https://covers.openlibrary.org/b/id/${ doc.cover_i }-L.jpg`
      : null,
    pages: doc.number_of_pages_median || null,
    open_library_key: doc.key,
    // All other fields as null to satisfy the Book type.
    isbn_10: null,
    description: null,
    publisher: null,
    side_url: null,
    back_url: null,
    height: 0,
    length: 0,
    width: 0,
    weight: null,
    categories: [],
    publication_date: null,
    isbn_13: null,
    type: null,
  };
}

/**
 * Transforms the detailed Open Library work data into a complete Book object for DB insertion.
 */
export async function transformOpenLibraryWorkDetails(
  workDetails: OpenLibraryWorkDetails,
  authorNames: string[],
  editionDetails: OpenLibraryEditionEntry
): Promise<Partial<Book>> {

  let descriptionText: string | null = null;
  if (typeof workDetails.description === "string") {
    descriptionText = workDetails.description;
  } else
    if (workDetails.description?.value) {
      descriptionText = workDetails.description.value;
    }

  // Ensure hyphen in isbn_13.
  let formattedIsbn13: string | null = editionDetails?.isbn_13?.[0] || null;
  if (formattedIsbn13 && formattedIsbn13.length === 13 && /^\d+$/.test( formattedIsbn13 )) {
    formattedIsbn13 = `${ formattedIsbn13.slice( 0, 3 ) }-${ formattedIsbn13.slice( 3 ) }`;
  } else
    if (formattedIsbn13 && formattedIsbn13.length !== 14) {
      // If it's not a 13-digit string we can fix, or already 14, nullify it to avoid DB errors.
      formattedIsbn13 = null;
    }

  // Handles full dates (e.g., "25 May 2023") by converting to "YYYY-MM-DD".
  // Handles year-only strings (e.g., "1962") by returning the year.
  let dateString = editionDetails?.publish_date;
  if (dateString) {
    const yearOnlyRegex = /^\d{4}$/;
    if (yearOnlyRegex.test( dateString )) {
      const dateObj = new Date( dateString );

      if (!isNaN( dateObj.getTime() )) {
        dateString = dateObj.toISOString().slice( 0, 10 );
      }
    }
  }

  return {
    authors: authorNames.length > 0 ? authorNames : null,
    categories: workDetails.subjects?.slice( 0, 5 ) || null,
    cover_url: editionDetails?.covers?.[0]
      ? `https://covers.openlibrary.org/b/id/${ editionDetails.covers[0] }-L.jpg`
      : null,
    description: descriptionText,
    isbn_10: editionDetails?.isbn_10?.[0] || null,
    isbn_13: formattedIsbn13,
    open_library_key: workDetails.key.replace( "/works/", "" ),
    pages: editionDetails?.number_of_pages || null,
    publication_date: dateString || null,
    publisher: editionDetails?.publishers?.[0] || null,
    title: workDetails.title,
  };
}