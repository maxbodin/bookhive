import { ReadingSessionWithBook } from "@/app/types/reading-session";
import { AddNewSessionButton } from "@/components/sessions/add-new-session-button";
import { ReadingSessionItem } from "@/components/sessions/reading-session-item";
import { EmptySessions } from "@/components/sessions/empty-sessions";

interface ReadingSessionsTabProps {
  sessions: ReadingSessionWithBook[];
  isOwner: boolean;
}

export const ReadingSessionsTab = async ( { sessions, isOwner }: ReadingSessionsTabProps ) => {
  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-4">
      { isOwner && <AddNewSessionButton/> }

      { sessions.length === 0 ? (
        <EmptySessions isOwner={ isOwner }/>
      ) : (
        sessions.map( ( session ) => (
          <ReadingSessionItem key={ session.id } session={ session }/>
        ) )
      ) }
    </div>
  );
};