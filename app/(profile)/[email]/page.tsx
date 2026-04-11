import { getTranslations } from "next-intl/server";
import { UserAvatar } from "@/components/profile/user-avatar";
import { EmptyShelves } from "@/components/profile/empty-shelves";
import { FavoriteBookshelf } from "@/components/profile/favorite-bookshelf";
import { UserBookshelf } from "@/components/books/user-bookshelf";
import { PaginatedBookshelf } from "@/components/profile/paginated-bookshelf";
import { ProfileStatsSummary } from "@/components/profile/profile-stats-summary";
import { ReadingActivityCalendar } from "@/components/profile/reading-activity-calendar";
import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { getUserProfile } from "@/app/actions/profiles/getUserProfile";
import { getUsername } from "@/lib/getUsername";
import { getUserReadingSessions } from "@/app/actions/reading-sessions/getUserReadingSessions";
import { BookState } from "@/app/types/book-state";
import { UserBook, UserBookStateRecord, UserBookStatsRecord } from "@/app/types/user-book";
import { Profile } from "@/app/types/profile";
import { User } from "@supabase/supabase-js";
import { ReadingSession, ReadingSessionWithBook } from "@/app/types/reading-session";
import { UserStats } from "@/components/profile/user-stats";
import { getUserFavoriteUsersBooks } from "@/app/actions/users-books/getUserFavoriteUsersBooks";
import { getUserBooksByState } from "@/app/actions/users-books/getUserBooksByState";
import { getPaginatedUserBooksByState } from "@/app/actions/users-books/getPaginatedUserBooksByState";
import {
  getConnectedUserBooksForDisplayedBooks
} from "@/app/actions/users-books/getConnectedUserBooksForDisplayedBooks";
import { getUserBooksForStats } from "@/app/actions/users-books/getUserBooksForStats";
import { ReadingSessionsTab } from "@/components/sessions/reading-sessions-tab";
import { ProfileTabs } from "@/components/profile/profile-tabs";
import { ProfileTab } from "@/app/types/profile-tab";
import { getPaginatedUserReadingSessions } from "@/app/actions/reading-sessions/getPaginatedUserReadingSessions";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import { Suspense, ViewTransition } from "react";
import { ProfileStatsSummarySkeleton } from "@/components/skeletons/profile/profile-stats-summary-skeleton";
import { YearSelectionProvider } from "@/app/contexts/year-selection-context";
import { EditableUsername } from "@/components/profile/editable-username";

interface UserProfilePageProps {
  params?: Promise<{ email: string }>;
  searchParams?: Promise<{
    query: string;
    tab: string;
    year: string;
    types?: string;
  }>;
}

export default async function UserProfile( { params, searchParams }: UserProfilePageProps ) {
  const resolvedParams = params ? await params : undefined;
  const decodedEmail = decodeURIComponent( resolvedParams?.email ?? "" );

  const [visitedProfile, currentUser] = await Promise.all( [
    getUserProfile( decodedEmail ),
    getCurrentUser(),
  ] ) as [Profile | null, User | null];

  if (!visitedProfile) {
    notFound();
  }

  const [t, tShelf] = await Promise.all( [
    getTranslations( "UserProfilePage" ),
    getTranslations( "UserBookshelf" ),
  ] );

  try {
    const resolvedSearchParams = searchParams ? await searchParams : undefined;
    const query: string = resolvedSearchParams?.query ?? "";
    const types: string = resolvedSearchParams?.types ?? "";
    const tabParam: string = resolvedSearchParams?.tab ?? "";

    // Validate tab param or set default.
    const validTabs: ProfileTab[] = ["shelves", "sessions", "stats"];
    const activeTab: ProfileTab = ( tabParam && validTabs.includes( tabParam as ProfileTab ) ? tabParam : "shelves" ) as ProfileTab;

    const isOwner: boolean = currentUser?.id === visitedProfile.id;
    const visitedProfileUsername: string = getUsername( visitedProfile.email, visitedProfile.username );

    const shouldLoadShelves = activeTab === "shelves";
    const shouldLoadSessionsTab = activeTab === "sessions";
    const shouldLoadStatsTab = activeTab === "stats";
    const shouldLoadReadingSessions = true;

    type PaginatedShelfResult = Awaited<ReturnType<typeof getPaginatedUserBooksByState>>;
    const emptyPaginatedResult: PaginatedShelfResult = { data: [], count: 0 };

    const [
      readingSessions,
      visitedProfileFavoriteBooks,
      visitedProfileReadingBooks,
      readData,
      laterData,
      wishlistData,
      statsUserBooks,
    ]: [
      ReadingSession[],
      UserBook[],
      UserBook[],
      PaginatedShelfResult,
      PaginatedShelfResult,
      PaginatedShelfResult,
      UserBookStatsRecord[]
    ] = await Promise.all( [
      shouldLoadReadingSessions
        ? getUserReadingSessions( visitedProfile.id )
        : Promise.resolve( [] ),
      shouldLoadShelves
        ? getUserFavoriteUsersBooks( visitedProfile.id, query, types )
        : Promise.resolve( [] ),
      shouldLoadShelves
        ? getUserBooksByState( visitedProfile.id, "reading", query, types )
        : Promise.resolve( [] ),
      shouldLoadShelves
        ? getPaginatedUserBooksByState( visitedProfile.id, "read", 1, query, types )
        : Promise.resolve( emptyPaginatedResult ),
      shouldLoadShelves
        ? getPaginatedUserBooksByState( visitedProfile.id, "later", 1, query, types )
        : Promise.resolve( emptyPaginatedResult ),
      shouldLoadShelves
        ? getPaginatedUserBooksByState( visitedProfile.id, "wishlist", 1, query, types )
        : Promise.resolve( emptyPaginatedResult ),
      shouldLoadStatsTab
        ? getUserBooksForStats( visitedProfile.id )
        : Promise.resolve( [] ),
    ] );

    const extractValidYear = ( dateValue?: string | null ): number | null => {
      if (!dateValue) return null;

      const year = new Date( dateValue ).getUTCFullYear();
      return Number.isFinite( year ) ? year : null;
    };

    const readingSessionYears = Array.from(
      new Set(
        readingSessions
          .map( ( session ) => extractValidYear( session.start_time ) )
          .filter( ( year ): year is number => year !== null )
      )
    ).sort( ( a, b ) => b - a );

    const statsYears = shouldLoadStatsTab
      ? Array.from(
        new Set(
          statsUserBooks
            .flatMap( ( book ) => [
              book.end_reading_date,
              book.read_date,
              book.start_reading_date,
              book.start_later_date,
              book.start_wishlist_date,
            ] )
            .map( extractValidYear )
            .filter( ( year ): year is number => year !== null )
        )
      ).sort( ( a, b ) => b - a )
      : [];

    const allAvailableYears = Array.from( new Set( [...readingSessionYears, ...statsYears] ) )
      .sort( ( a, b ) => b - a );

    const availableYears = readingSessionYears.length > 0
      ? [
        readingSessionYears[0],
        ...allAvailableYears.filter( ( year ) => year !== readingSessionYears[0] )
      ]
      : allAvailableYears;

    const yearParam = Number.parseInt( resolvedSearchParams?.year ?? "", 10 );
    const selectedYear = Number.isFinite( yearParam ) && availableYears.includes( yearParam )
      ? yearParam
      : ( availableYears[0] || new Date().getUTCFullYear() );

    let initialSessions: ReadingSessionWithBook[] = [];
    let initialTotalCount = 0;

    if (shouldLoadSessionsTab && availableYears.length > 0) {
      const paginatedSessions = await getPaginatedUserReadingSessions( {
        userId: visitedProfile.id,
        page: 1,
        year: selectedYear,
        query,
        types
      } );

      initialSessions = paginatedSessions.sessions;
      initialTotalCount = paginatedSessions.totalCount;
    }

    let connectedUserDataWithBooks: UserBookStateRecord[] = [];

    const allDisplayedBooks = shouldLoadShelves
      ? [
        ...visitedProfileFavoriteBooks,
        ...visitedProfileReadingBooks,
        ...readData.data,
        ...laterData.data,
        ...wishlistData.data,
      ]
      : [];

    if (shouldLoadShelves && currentUser && !isOwner) {
      // If the viewer is the owner, their data is the same as the profile's data.
      // Otherwise, fetch their data separately.

      const uniqueBookIds = Array.from( new Set( allDisplayedBooks.map( ( b ) => b.book_id ) ) );

      if (uniqueBookIds.length > 0) {
        connectedUserDataWithBooks = await getConnectedUserBooksForDisplayedBooks(
          currentUser.id,
          uniqueBookIds
        );
      }
    } else if (shouldLoadShelves && currentUser) {
      connectedUserDataWithBooks = allDisplayedBooks;
    }

    const hasAnyBooks = allDisplayedBooks.length > 0;


    // Configuration for shelves to map over
    const paginatedShelvesConfig: { state: BookState; title: string; data: UserBook[]; count: number }[] = shouldLoadShelves
      ? [
        { state: "read", title: tShelf( "read" ), data: readData.data, count: readData.count },
        { state: "later", title: tShelf( "later" ), data: laterData.data, count: laterData.count },
        { state: "wishlist", title: tShelf( "wishlist" ), data: wishlistData.data, count: wishlistData.count },
      ]
      : [];

    return (
      <ViewTransition>
        <YearSelectionProvider initialYears={ availableYears }>
          <div className="container mx-auto p-4 md:p-8">
            <div className="mb-12 flex flex-col items-center gap-6 md:flex-row">
              <UserAvatar profile={ visitedProfile } isOwner={ isOwner }/>
              <div className="flex-grow">
                <ViewTransition name={ `username-${ visitedProfile.email.replace( /[^a-zA-Z0-9]/g, "-" ) }` }>
                  <div className="flex flex-row items-center gap-6">
                    <EditableUsername
                      profile={ visitedProfile }
                      isOwner={ isOwner }
                      displayUsername={ visitedProfileUsername }
                    />

                    { visitedProfile.is_admin && (
                      <Badge variant="outline">{ t( "adminBadge" ) }</Badge>
                    ) }
                  </div>
                </ViewTransition>

                { visitedProfile.created_at && (
                  <p className="text-sm text-muted-foreground">
                    { t( "joined" ) }: { new Date( visitedProfile.created_at ).toLocaleDateString() }
                  </p>
                ) }

                <Suspense fallback={ <ProfileStatsSummarySkeleton/> }>
                  <ProfileStatsSummary userId={ visitedProfile.id }/>
                </Suspense>
              </div>
            </div>

            { shouldLoadReadingSessions && <ReadingActivityCalendar readingSessions={ readingSessions }/> }

            <ProfileTabs
              activeTab={ activeTab }
              shelvesLabel={ t( "shelvesTab" ) }
              sessionsLabel={ t( "sessionsTab" ) }
              statsLabel={ t( "statsTab" ) }
              shelvesTab={
                shouldLoadShelves ? ( <div className="space-y-12">
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
                      query={ query }
                      types={ types }
                    />
                  ) ) }

                  { !hasAnyBooks &&
                    <EmptyShelves username={ visitedProfileUsername } query={ query } types={ types }/> }
                </div> ) : null
              }
              sessionsTab={
                shouldLoadSessionsTab ? <ReadingSessionsTab
                  userId={ visitedProfile.id }
                  isOwner={ isOwner }
                  initialSessions={ initialSessions }
                  initialTotalCount={ initialTotalCount }
                  query={ query }
                  types={ types }
                /> : null }
              statsTab={ shouldLoadStatsTab ? <UserStats userBooks={ statsUserBooks }/> : null }
            />
          </div>
        </YearSelectionProvider>
      </ViewTransition>
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