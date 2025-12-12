import { createClient } from "@/app/utils/supabase/server";
import { UserBookshelf } from "@/components/books/user-bookshelf";
import { UserAvatar } from "@/components/profile/user-avatar";
import { getUsername } from "@/lib/getUsername";
import { EmptyShelves } from "@/components/profile/empty-shelves";
import { sortNatural } from "@/lib/sortNatural";
import { FavoriteBookshelf } from "@/components/profile/favorite-bookshelf";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserStats } from "@/components/profile/user-stats";
import { Book } from "@/app/types/book";

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

  const flattenedData = userBooksData?.map( item => {
    const { books, ...userBookData } = item;
    return {
      ...userBookData,
      ...( books as Partial<Book> ), // Type assertion to merge book properties
    };
  } ) || [];

  return { profile, userBooks: sortNatural( flattenedData ) };
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
        <div className="mb-12 flex flex-col items-center gap-6 md:flex-row">
          <UserAvatar profile={ profile } currentUser={ currentUser }/>
          <div>
            <h1 className="text-3xl font-bold">{ username }&apos;s profile</h1>
            <p className="text-md text-gray-500">
              Joined: { new Date( profile.created_at ).toLocaleDateString() }
            </p>
          </div>
        </div>

        <Tabs defaultValue="shelves" className="w-full">
          <div className="mb-8 flex justify-center">
            <TabsList>
              <TabsTrigger value="shelves">Shelves</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="shelves">
            { userBooks.length > 0 ? (
              <>
                <FavoriteBookshelf favoriteBooks={ favoriteBooks } isOwner={ isOwner }/>
                <UserBookshelf userBooks={ userBooks } isOwner={ isOwner }/>
              </>
            ) : (
              <EmptyShelves username={ username } query={ query }/>
            ) }
          </TabsContent>
          <TabsContent value="stats">
            <UserStats userBooks={ userBooks }/>
          </TabsContent>
        </Tabs>
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