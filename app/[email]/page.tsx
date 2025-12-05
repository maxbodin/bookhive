import { createClient } from "@/app/utils/supabase/server";
import { UserBook } from "@/app/types/user-book";
import { UserBookshelf } from "@/components/books/user-bookshelf";
import { UserAvatar } from "@/components/profile/user-avatar";
import { getUsername } from "@/lib/getUsername";

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
  // @ts-expect-error RAM
  const formattedBooks: UserBook[] = userBooksData.map( item => ( {
    ...item.books,
    state: item.state
  } ) );

  return { profile, userBooks: formattedBooks };
}

/**
 * Fetch the current user's session from the server.
 */
async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}


interface UserProfilePageProps {
  params?: Promise<{ email: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}


export default async function UserProfile({ params }: UserProfilePageProps) {
  try {
    const resolvedParams = params ? await params : undefined;
    const decodedEmail = decodeURIComponent(resolvedParams?.email ?? "");

    const [
      // @ts-ignore
      { profile, userBooks },
      currentUser
    ] = await Promise.all( [
      getUserProfileAndBooks( decodedEmail ),
      getCurrentUser()
    ] );


    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="mb-12 flex flex-col md:flex-row items-center gap-6">
          <UserAvatar profile={ profile } currentUser={ currentUser }/>
          <div>
            <h1 className="text-3xl font-bold">{ getUsername(profile.email) }'s shelves</h1>
            <p className="text-md text-gray-500">
              Joined: { new Date( profile.created_at ).toLocaleDateString() }
            </p>
          </div>
        </div>

        { userBooks.length > 0 ? (
          <UserBookshelf userBooks={ userBooks }/>
        ) : (
          // TODO : Improve with dedicated component.
          <p className="text-center text-gray-500 py-8">
            { profile.email } hasn&apos;t added any books yet.
          </p>
        ) }
      </div>
    );
  } catch (error: unknown) {
    let errorMessage = "An unexpected error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return <div className="container mx-auto p-4 text-center text-red-600">
      <strong>Error:</strong> { errorMessage }
    </div>;
  }
}