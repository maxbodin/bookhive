import { Library, SearchX } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import React from "react";

interface EmptyShelvesProps {
  username: string;
  query?: string | null;
}

/**
 * Shared UI component for displaying an empty state with an icon, title, and message.
 *
 * @param Icon
 * @param title
 * @param message
 * @constructor
 */
function EmptyState( { icon: Icon, title, message }: { icon: LucideIcon; title: string; message: React.ReactNode } ) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-primary p-8 text-center">
      <Icon className="h-16 w-16 text-primary mb-4"/>
      <h2 className="text-2xl font-bold mb-2 tracking-tight">{ title }</h2>
      <p className="text-muted-foreground mt-2">{ message }</p>
    </div>
  );
}


/**
 * Displays a contextual message for a user's empty bookshelf.
 * It differentiates between a generally empty shelf and a shelf that's empty due to a search filter.
 *
 * @param username
 * @param query
 * @constructor
 */
export function EmptyShelves( { username, query }: EmptyShelvesProps ) {
  if (query) {
    return (
      <EmptyState
        icon={ SearchX }
        title="No Matching Books Found"
        message={
          <>
            We couldn&apos;t find any books matching "<strong>{ query }</strong>" on { username }&apos;s shelves.
          </>
        }
      />
    );
  }

  return (
    <EmptyState
      icon={ Library }
      title="Shelves are Empty"
      message={ `It looks like ${ username } hasn't added any books to their collection yet.` }
    />
  );
}