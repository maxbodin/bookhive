import { createClient } from "@/app/utils/supabase/server";
import { UserBook } from "@/app/types/user-book";
import { UserBookshelf } from "@/components/books/user-bookshelf";

/**
 * Fetches a user's profile and their entire book collection.
 */
async function getUserProfileAndBooks( email: string ) {
  const supabase = await createClient();
  const { data: profile, error: profileError } = await supabase
    .from( "profiles" )
    .select( "*" )
    .eq( "email", email )
    .single();

  if (profileError || !profile) {
    throw new Error( profileError?.message || "User not found" );
  }

  // Fetch all books for this user, joining with the books table.
  const { data: userBooksData, error: booksError } = await supabase
    .from( "users_books" )
    .select( `
      state,
      books (*)
    ` )
    .eq( "uid", profile.id );

  if (booksError) {
    throw new Error( booksError?.message || `Failed to fetch user's books: ${ booksError.message }` );
  }

  if (!userBooksData) {
    return { profile, userBooks: [] };
  }

  // Reshape the data to match our UserBook type.
  // @ts-ignore
  const formattedBooks: UserBook[] = userBooksData.map( item => ( {
    ...item.books,
    state: item.state
  } ) );

  return { profile, userBooks: formattedBooks };
}


export default async function UserProfile( { params }: { params: { email: string } } ) {
  try {
    const decodedEmail = decodeURIComponent( params.email );
    const { profile, userBooks } = await getUserProfileAndBooks( decodedEmail );

    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="mb-12">
          <h1 className="text-3xl font-bold">Shelves for { profile.email }</h1>
          <p className="text-md text-gray-500">Joined: { new Date( profile.created_at ).toLocaleDateString() }</p>
        </div>

        { userBooks.length > 0 ? (
          <UserBookshelf userBooks={ userBooks }/>
        ) : (
          <p>{ profile.email } hasn't added any books yet. :(</p>
        ) }
      </div>
    );
  } catch (error: any) {
    return <div className="container mx-auto p-4">{ error.message }</div>;
  }
}