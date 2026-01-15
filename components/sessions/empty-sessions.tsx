"use client";

import { useTranslations } from "next-intl";
import { FileText } from "lucide-react";
import { EmptyState } from "@/components/profile/empty-shelves";

interface EmptySessionsProps {
  isOwner: boolean;
  className?: string;
}

/**
 * Displays a contextual message for an empty list of reading sessions.
 *
 */
export function EmptySessions( { isOwner }: EmptySessionsProps ) {
  const t = useTranslations( "ReadingSessions" );

  const title = t( "noSessionsTitle" );
  const message = isOwner ? t( "noSessionsOwner" ) : t( "noSessionsVisitor" );

  return (
    <EmptyState
      icon={ FileText }
      title={ title }
      message={ message }
    />
  );
}