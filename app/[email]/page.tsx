import { UserBookshelf } from "@/components/books/user-bookshelf";
import { UserAvatar } from "@/components/profile/user-avatar";
import { getUsername } from "@/lib/getUsername";
import { EmptyShelves } from "@/components/profile/empty-shelves";
import { FavoriteBookshelf } from "@/components/profile/favorite-bookshelf";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserStats } from "@/components/profile/user-stats";
import { getUserProfile } from "@/app/actions/profiles/getUserProfile";
import { Profile } from "@/app/types/profile";
import { getUserUsersBooks } from "@/app/actions/users-books/getUserUsersBooks";
import { User } from "@supabase/supabase-js";
import { getUserReadingSessions } from "@/app/actions/reading-sessions/getUserReadingSessions";
import { UserBook } from "@/app/types/user-book";
import { ReadingSession } from "@/app/types/reading-session";
import { ProfileStatsSummary } from "@/components/profile/profile-stats-summary";
import { parseISO } from "date-fns";
import { ReadingActivityCalendar } from "@/components/profile/reading-activity-calendar";

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

    const visitedProfile: Profile = await getUserProfile( decodedEmail );
    const visitedProfileUserBooks: UserBook[] = await getUserUsersBooks( visitedProfile.id, query );
    const currentUser: User | null = await getCurrentUser();
    const isOwner: boolean = currentUser?.id === visitedProfile.id;
    const visitedProfileUsername: string = getUsername( visitedProfile.email );
    const visitedProfileFavoriteBooks: UserBook[] = visitedProfileUserBooks.filter( b => b.is_favorite );

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
    const totalPagesRead = visitedProfileUserBooks.reduce( ( acc, book ) => {
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

    // Fetch the connected user's book data if they are logged in.
    let connectedUserDataWithBooks: UserBook[] = [];
    if (currentUser) {
      // If the viewer is the owner, their data is the same as the profile's data.
      // Otherwise, fetch their data separately.
      connectedUserDataWithBooks = isOwner ? visitedProfileUserBooks : await getUserUsersBooks( currentUser.id );
    }

    return (
      <div className="container mx-auto p-4 md:p-8">
        <div className="mb-12 flex flex-col items-center gap-6 md:flex-row">
          <UserAvatar profile={ visitedProfile } isOwner={ isOwner }/>
          <div className="flex-grow">
            <h1 className="text-3xl font-bold">{ visitedProfileUsername }&apos;s profile</h1>
            { visitedProfile.created_at &&
              <p className="text-md text-gray-500">
                Joined: { new Date( visitedProfile.created_at ).toLocaleDateString() }
              </p>
            }

            <ReadingActivityCalendar readingSessions={ readingSessions }/>
            <ProfileStatsSummary
              totalHoursRead={ totalHoursRead }
              totalPagesRead={ totalPagesRead }
            />
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
            { visitedProfileUserBooks.length > 0 ? (
              <>
                <FavoriteBookshelf
                  favoriteUserBooks={ visitedProfileFavoriteBooks }
                  isOwner={ isOwner }
                  connectedUserBooks={ connectedUserDataWithBooks }
                />
                <UserBookshelf
                  userBooks={ visitedProfileUserBooks }
                  isOwner={ isOwner }
                  connectedUserBooks={ connectedUserDataWithBooks }
                  readingSessions={ readingSessions }
                />
              </>
            ) : (
              <EmptyShelves username={ visitedProfileUsername } query={ query }/>
            ) }
          </TabsContent>
          <TabsContent value="stats">
            <UserStats userBooks={ visitedProfileUserBooks }/>
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