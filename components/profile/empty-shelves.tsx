import type { LucideIcon } from "lucide-react";
import { Library, SearchX } from "lucide-react";
import React from "react";
import { useTranslations } from "next-intl";

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
export function EmptyState( { icon: Icon, title, message }: { icon: LucideIcon; title: string; message: React.ReactNode } ) {
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
  const t = useTranslations( "EmptyShelves" );

  if (query) {
    return (
      <EmptyState
        icon={ SearchX }
        title={ t( "noMatch.title" ) }
        message={ t.rich( "noMatch.message", {
          query: query,
          username: username,
          strong: ( chunks ) => <strong>{ chunks }</strong>,
        } ) }
      />
    );
  }

  return (
    <EmptyState
      icon={ Library }
      title={ t( "empty.title" ) }
      message={ t( "empty.message", { username } ) }
    />
  );
}