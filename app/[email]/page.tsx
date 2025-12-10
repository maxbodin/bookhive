import { createClient } from "@/app/utils/supabase/server";
import { UserBook } from "@/app/types/user-book";
import { UserBookshelf } from "@/components/books/user-bookshelf";
import { UserAvatar } from "@/components/profile/user-avatar";
import { getUsername } from "@/lib/getUsername";
import { EmptyShelves } from "@/components/profile/empty-shelves";
import { sortNatural } from "@/lib/sortNatural";
import { FavoriteBookshelf } from "@/components/profile/favorite-bookshelf";
import { getCurrentUser } from "@/app/actions/getCurrentUser";

/**
 * Fetches a user's profile and their book collection,
 * optionally filtering by a search query.
 * @param email - The email of the user to fetch.
 * @param query - An optional search term to filter books by title.
 */
async function getUserProfileAndBooks( email: string, query?: string ) {
  const supabase = await createClient();
  const { data: profile, error: profileError } = await supabase
    .from( "profiles" )
    .select( "*" )
    .eq( "email", email )
    .single();

  if (profileError || !profile) {
    throw new Error( profileError?.message || "User not found" );
  }

  let queryBuilder = supabase
    .from( "users_books" )
    .select( `
      *,
      books (*)
    ` )
    .eq( "uid", profile.id );

  // If a search query is provided, filter the results on the joined 'books' table's title.
  if (query) {
    queryBuilder = queryBuilder.ilike( "books.title", `%${ query }%` );
  }

  const { data: userBooksData, error: booksError } = await queryBuilder;

  if (booksError) {
    throw new Error( booksError.message || `Failed to fetch user's books.` );
  }

  if (!userBooksData) {
    return { profile, userBooks: [] };
  }

  const formattedBooks: UserBook[] = userBooksData.map( item => ( {
    ...item.books,
    state: item.state,
    is_favorite: item.is_favorite,
  } ) )
    .filter( book => book.id );

  if (!formattedBooks) {
    return { profile, userBooks: [] };
  }

  return { profile, userBooks: sortNatural( formattedBooks ) };
}

interface UserProfilePageProps {
  params?: Promise<{ email: string }>;
  searchParams?: Promise<{ query: string }>;
}

export default async function UserProfile( { params, searchParams }: UserProfilePageProps ) {
  try {
    const resolvedParams = params ? await params : undefined;
    const decodedEmail = decodeURIComponent( resolvedParams?.email ?? "" );
    const resolvedSearchParams = searchParams ? await searchParams : undefined;
    const query: string = resolvedSearchParams?.query ?? "";

    const [
      { profile, userBooks },
      currentUser
    ] = await Promise.all( [
      getUserProfileAndBooks( decodedEmail, query ),
      getCurrentUser()
    ] );

    const username: string = getUsername( profile.email );

    const isOwner = currentUser?.id === profile.id;

    const favoriteBooks = userBooks.filter( b => b.is_favorite );

    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="mb-12 flex flex-col md:flex-row items-center gap-6">
          <UserAvatar profile={ profile } currentUser={ currentUser }/>
          <div>
            <h1 className="text-3xl font-bold">{ username }&apos;s shelves</h1>
            <p className="text-md text-gray-500">
              Joined: { new Date( profile.created_at ).toLocaleDateString() }
            </p>
          </div>
        </div>

        <FavoriteBookshelf favoriteBooks={ favoriteBooks } isOwner={ isOwner }/>

        { userBooks.length > 0 ? (
          <UserBookshelf userBooks={ userBooks } isOwner={ isOwner }/>
        ) : (
          <EmptyShelves username={ username } query={ query }/>
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