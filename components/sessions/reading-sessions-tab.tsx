import { getTranslations } from "next-intl/server";
import { FileText } from "lucide-react";
import { ReadingSessionWithBook } from "@/app/types/reading-session";
import { AddNewSessionButton } from "@/components/sessions/add-new-session-button";
import { ReadingSessionItem } from "@/components/sessions/reading-session-item";

interface ReadingSessionsTabProps {
  sessions: ReadingSessionWithBook[];
  isOwner: boolean;
}

export const ReadingSessionsTab = async ( { sessions, isOwner }: ReadingSessionsTabProps ) => {
  const t = await getTranslations( "ReadingSessions" );

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-2">
      { isOwner && (
        <div className="max-w-md mx-auto">
          <AddNewSessionButton/>
        </div>
      ) }
      { sessions.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center mt-8">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground"/>
          <h3 className="mt-2 text-xl font-medium">{ t( "noSessionsTitle" ) }</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            { isOwner ? t( "noSessionsOwner" ) : t( "noSessionsVisitor" ) }
          </p>
        </div>
      ) : (
        sessions.map( ( session ) => (
          <ReadingSessionItem key={ session.id } session={ session }/>
        ) )
      ) }
    </div>
  );
};