import { getTranslations } from "next-intl/server";
import { getReadingSessionsForBook } from "@/app/actions/reading-sessions/getReadingSessionsForBook";
import { AddNewSessionButton } from "@/components/sessions/add-new-session-button";
import { ReadingSessionItem } from "@/components/sessions/reading-session-item";

interface BookReadingSessionsProps {
  userId: string;
  bookId: number;
}

export async function BookReadingSessions( { userId, bookId }: BookReadingSessionsProps ) {
  const sessions = await getReadingSessionsForBook( userId, bookId );
  const t = await getTranslations( "ReadingSessions" );

  return (
    <section className="mt-12 flex flex-col gap-6">
      <h2 className="text-xl font-bold tracking-tight">
        { t( "title", { count: sessions.length } ) }
      </h2>

      <AddNewSessionButton/>

      { sessions.length > 0 ? (
        <div className="flex flex-col gap-4">
          { sessions.map( ( session ) => (
            <ReadingSessionItem
              key={ session.id }
              session={ session }
              isOwner={ true }
            />
          ) ) }
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-8 text-center text-muted-foreground bg-muted/20">
          <p>{ t( "emptyBookSessions" ) }</p>
        </div>
      ) }
    </section>
  );
}