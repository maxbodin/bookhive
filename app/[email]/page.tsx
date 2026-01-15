import { getTranslations } from "next-intl/server";
import { parseISO } from "date-fns";
import { UserAvatar } from "@/components/profile/user-avatar";
import { EmptyShelves } from "@/components/profile/empty-shelves";
import { FavoriteBookshelf } from "@/components/profile/favorite-bookshelf";
import { UserBookshelf } from "@/components/books/user-bookshelf";
import { PaginatedBookshelf } from "@/components/profile/paginated-bookshelf";
import { ProfileStatsSummary } from "@/components/profile/profile-stats-summary";
import { ReadingActivityCalendar } from "@/components/profile/reading-activity-calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { getUserProfile } from "@/app/actions/profiles/getUserProfile";
import { getUsername } from "@/lib/getUsername";
import { getUserReadingSessions } from "@/app/actions/reading-sessions/getUserReadingSessions";
import { BookState } from "@/app/types/book-state";
import { UserBook } from "@/app/types/user-book";
import { Profile } from "@/app/types/profile";
import { User } from "@supabase/supabase-js";
import { ReadingSession } from "@/app/types/reading-session";
import { UserStats } from "@/components/profile/user-stats";
import { getUserFavoriteUsersBooks } from "@/app/actions/users-books/getUserFavoriteUsersBooks";
import { getUserBooksByState } from "@/app/actions/users-books/getUserBooksByState";
import { getPaginatedUserBooksByState } from "@/app/actions/users-books/getPaginatedUserBooksByState";
import { getUserTotalPagesRead } from "@/app/actions/users-books/getUserTotalPagesRead";
import {
  getConnectedUserBooksForDisplayedBooks
} from "@/app/actions/users-books/getConnectedUserBooksForDisplayedBooks";

interface UserProfilePageProps {
  params?: Promise<{ email: string }>;
  searchParams?: Promise<{ query: string }>;
}

export default async function UserProfile( { params, searchParams }: UserProfilePageProps ) {
  const t = await getTranslations( "UserProfilePage" );
  const tShelf = await getTranslations( "UserBookshelf" );

  try {
    const resolvedParams = params ? await params : undefined;
    const decodedEmail = decodeURIComponent( resolvedParams?.email ?? "" );
    const resolvedSearchParams = searchParams ? await searchParams : undefined;
    const query: string = resolvedSearchParams?.query ?? "";

    const visitedProfile: Profile = await getUserProfile( decodedEmail );
    const currentUser: User | null = await getCurrentUser();
    const isOwner: boolean = currentUser?.id === visitedProfile.id;
    const visitedProfileUsername: string = getUsername( visitedProfile.email );

    // Fetch favorite books.
    const visitedProfileFavoriteBooks: UserBook[] = await getUserFavoriteUsersBooks( visitedProfile.id );

    // Fetch all books on the 'reading' shelf (not paginated).
    const visitedProfileReadingBooks: UserBook[] = await getUserBooksByState( visitedProfile.id, "reading", query );

    // Fetch the first page and total count for each paginated shelf.
    const [
      readData,
      laterData,
      wishlistData,
    ] = await Promise.all( [
      getPaginatedUserBooksByState( visitedProfile.id, "read", 1, query ),
      getPaginatedUserBooksByState( visitedProfile.id, "later", 1, query ),
      getPaginatedUserBooksByState( visitedProfile.id, "wishlist", 1, query ),
    ] );

    // Fetch all reading sessions for the visited profile.
    const readingSessions: ReadingSession[] = await getUserReadingSessions( visitedProfile.id );

    // Total reading time.
    const totalMilliseconds = readingSessions.reduce( ( acc, session ) => {
      const start = parseISO( session.start_time );
      const end = parseISO( session.end_time );
      // Ensure dates are valid before calculating duration.
      if (!isNaN( start.getTime() ) && !isNaN( end.getTime() )) {
        return acc + ( end.getTime() - start.getTime() );
      }
      return acc;
    }, 0 );
    // Convert to hours and round to the nearest whole number.
    const totalHoursRead = Math.round( totalMilliseconds / ( 1000 * 60 * 60 ) );

    // Total pages read.
    const totalPagesRead = await getUserTotalPagesRead( visitedProfile.id );

    let connectedUserDataWithBooks: UserBook[] = [];

    const allDisplayedBooks = [
      ...visitedProfileFavoriteBooks,
      ...visitedProfileReadingBooks,
      ...readData.data,
      ...laterData.data,
      ...wishlistData.data,
    ];

    if (currentUser && !isOwner) {
      // If the viewer is the owner, their data is the same as the profile's data.
      // Otherwise, fetch their data separately.

      const uniqueBookIds = Array.from( new Set( allDisplayedBooks.map( ( b ) => b.book_id ) ) );

      if (uniqueBookIds.length > 0) {
        connectedUserDataWithBooks = await getConnectedUserBooksForDisplayedBooks(
          currentUser.id,
          uniqueBookIds
        );
      }
    } else
      if (currentUser) {
        connectedUserDataWithBooks = allDisplayedBooks;
      }

    const hasAnyBooks =
      visitedProfileFavoriteBooks.length > 0 || visitedProfileReadingBooks.length > 0 ||
      readData.count > 0 || laterData.count > 0 || wishlistData.count > 0;

    // Configuration for shelves to map over
    const paginatedShelvesConfig: { state: BookState; title: string; data: any[]; count: number }[] = [
      { state: "read", title: tShelf( "read" ), data: readData.data, count: readData.count },
      { state: "later", title: tShelf( "later" ), data: laterData.data, count: laterData.count },
      { state: "wishlist", title: tShelf( "wishlist" ), data: wishlistData.data, count: wishlistData.count },
    ];

    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="mb-12 flex flex-col items-center gap-6 md:flex-row">
          <UserAvatar profile={ visitedProfile } isOwner={ isOwner }/>
          <div className="flex-grow">
            <h1 className="text-3xl font-bold">{ visitedProfileUsername }</h1>
            { visitedProfile.created_at &&
              <p className="text-md text-gray-500">
                { t( "joined" ) }: { new Date( visitedProfile.created_at ).toLocaleDateString() }
              </p>
            }

            <ProfileStatsSummary
              totalHoursRead={ totalHoursRead }
              totalPagesRead={ totalPagesRead }
            />
          </div>
        </div>

        <ReadingActivityCalendar readingSessions={ readingSessions }/>

        <Tabs defaultValue="shelves" className="w-full">
          <div className="mb-8 flex justify-center">
            <TabsList>
              <TabsTrigger value="shelves">{ t( "shelvesTab" ) }</TabsTrigger>
              <TabsTrigger value="stats">{ t( "statsTab" ) }</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="shelves">
            <div className="space-y-12">
              { visitedProfileFavoriteBooks.length > 0 && (
                <FavoriteBookshelf
                  favoriteUserBooks={ visitedProfileFavoriteBooks }
                  isOwner={ isOwner }
                  connectedUserBooks={ connectedUserDataWithBooks }
                />
              ) }

              { visitedProfileReadingBooks.length > 0 && (
                <UserBookshelf
                  userBooks={ visitedProfileReadingBooks }
                  connectedUserBooks={ connectedUserDataWithBooks }
                  isOwner={ isOwner }
                  readingSessions={ readingSessions }
                />
              ) }

              { paginatedShelvesConfig.map( ( shelf ) => (
                <PaginatedBookshelf
                  key={ shelf.state }
                  userId={ visitedProfile.id }
                  initialData={ shelf.data }
                  totalCount={ shelf.count }
                  shelfState={ shelf.state }
                  shelfTitle={ shelf.title }
                  isOwner={ isOwner }
                  initialConnectedUserBooks={ connectedUserDataWithBooks }
                  connectedUserId={ currentUser?.id }
                />
              ) ) }

              { !hasAnyBooks && <EmptyShelves username={ visitedProfileUsername } query={ query }/> }
            </div>
          </TabsContent>

          <TabsContent value="stats">
            <UserStats userBooks={ allDisplayedBooks }/>
          </TabsContent>
        </Tabs>
      </div>
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : t( "unexpectedError" );
    return (
      <div className="container mx-auto p-4 text-center text-red-600">
        <strong>{ t( "errorLabel" ) }:</strong> { errorMessage }
      </div>
    );
  }
}