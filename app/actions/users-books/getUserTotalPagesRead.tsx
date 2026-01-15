/**
 * Calculates the total number of pages read by a user using a database RPC for performance.
 * NOTE: Requires a PostgreSQL function 'get_user_total_pages_read' to be created in your Supabase SQL editor.

 // TODO : custom query to db for fetching this logic instead of doing it in the app.
 // Total pages read.
 const totalPagesRead = allVisitedProfileUserBooks.reduce( ( acc, book ) => {
 // Add total pages for books marked as 'read'.
 if (book.state === "read" && book.pages) {
 return acc + book.pages;
 }
 // Add current page for books 'in progress'.
 if (book.state === "reading" && book.current_page) {
 return acc + book.current_page;
 }
 return acc;
 }, 0 );

 * Calculates the total number of pages read by a user.
 * This includes fully read books and the current page of books being read.
 * @param userId - The ID of the user.
 * @returns The total number of pages read.

 *
 *

 const t = await getTranslations( "GetUserUsersBooksAction" );
 const supabase = await createClient();


 SQL for the required database function:

 CREATE OR REPLACE FUNCTION get_user_total_pages_read(p_user_id uuid)
 RETURNS bigint AS $$
 BEGIN
 RETURN (
 SELECT COALESCE(SUM(b.pages), 0)
 FROM users_books ub
 JOIN books b ON ub.book_id = b.id
 WHERE ub.uid = p_user_id AND ub.state = 'read' AND b.pages IS NOT NULL
 ) + (
 SELECT COALESCE(SUM(ub.current_page), 0)
 FROM users_books ub
 WHERE ub.uid = p_user_id AND ub.state = 'reading' AND ub.current_page IS NOT NULL
 );
 END;
 $$ LANGUAGE plpgsql SECURITY DEFINER;

 const { data, error } = await supabase.rpc( "get_user_total_pages_read", {
 p_user_id: userId,
 } );

 if (error) {
 console.error( "Error fetching total pages read via RPC:", error );
 throw new Error( t( "fetchStatsFailed", { default: "Failed to fetch reading statistics." } ) );
 }

 return data ?? 0;
 }

 */
export async function getUserTotalPagesRead( userId: string ): Promise<number> {
  return 0;
}