"use server";


import { createClient } from "@/app/utils/supabase/server";
import { Book } from "@/app/types/book";

/**
 * Fetches all book.
 * @returns {Promise<Book[]>} A list of all book.
 */
export async function getBooks(): Promise<Book[]> {
  const supabase = await createClient();

  const { data: books, error: booksError } = await supabase
    .from("books")
    .select()
    .order("created_at", { ascending: false }); // Sort by created_at in descending order.

  if (booksError) {
    console.error("Error fetching books:", booksError);
    return [];
  }

  return books as Book[];
}

/*

/!**
 * Fetches the books made by the current user.
 * If an optional list of books is provided, it filters them by the current user.
 * Otherwise, it fetches the user's books directly from the database.
 *
 * @param {Book[]} [books] Optional list of books to filter.
 * @returns {Promise<Book[]>} A list of books made by the current user.
 *!/
export async function getUserSuggestions(
  books?: Book[],
): Promise<Book[]> {
  const supabase = createClient();

  const { data: session, error: sessionError } = await supabase.auth.getUser();

  if (sessionError || !session?.user) {
    throw new Error(
      "Unable to retrieve the user session. Please try reconnecting.",
    );
  }

  if (books) {
    return books.filter(
      (book) => book.user_id === session.user.id,
    );
  }

  const { data: dbSuggestions, error: dbError } = await supabase
    .from("books")
    .select("*")
    .eq("user_id", session.user.id);

  if (dbError) {
    console.error("Error fetching user books:", dbError);
    return [];
  }

  return dbSuggestions as Book[];
}

/!**
 * Suggests a new movie by its TMDB ID.
 * @param {string} tmdb_id - The TMDB ID of the movie to suggest.
 * @returns {Promise<SuggestMovieResponse>} A response indicating the success or failure of the operation.
 *!/
export async function suggestMovie(
  tmdb_id: string,
): Promise<SuggestMovieResponse> {
  const supabase = createClient();

  const { data: session, error: sessionError } = await supabase.auth.getUser();

  if (sessionError || !session?.user) {
    throw new Error(
      "Unable to retrieve the user session. Please try reconnecting.",
    );
  }

  const { error } = await supabase.from("books").insert({
    tmdb_id,
    shown_at: null,
    created_at: new Date().toISOString(),
    user_id: session.user.id,
  });

  if (error) {
    console.error("Error suggesting movie:", error);

    if (error.code === "23505") {
      // Duplicate entry
      throw new Error("This movie has already been suggested.");
    }

    throw new Error(
      "An error occurred. Please try again later. The movie book was not recorded.",
    );
  }

  return {
    success: true,
    message: "Movie successfully suggested!",
  };
}

/!**
 * Removes a book for a movie by its TMDB ID.
 * @param {string} tmdb_id - The TMDB ID of the movie to remove the book for.
 * @returns {Promise<SuggestMovieResponse>} A response indicating the success or failure of the operation.
 *!/
export async function removeSuggestion(
  tmdb_id: string,
): Promise<SuggestMovieResponse> {
  const supabase = createClient();

  const { data: session, error: sessionError } = await supabase.auth.getUser();

  if (sessionError || !session?.user) {
    throw new Error(
      "Unable to retrieve the user session. Please try reconnecting.",
    );
  }

  const { error } = await supabase
    .from("books")
    .delete()
    .eq("tmdb_id", tmdb_id)
    .eq("user_id", session.user.id); // Ensure the deletion is scoped to the current user.

  if (error) {
    console.error("Error removing book:", error);

    throw new Error(
      "An error occurred. Please try again later. The movie book was not removed.",
    );
  }

  return {
    success: true,
    message: "Movie book successfully removed!",
  };
}
*/
