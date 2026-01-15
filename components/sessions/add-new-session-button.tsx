"use client";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReadingLogger from "@/components/sessions/reading-logger";
import React from "react";

export const AddNewSessionButton = () => {
  const t = useTranslations( "ReadingSessions" );
  const router = useRouter();

  // Refreshes server components to show the newly added session.
  const handleSessionLogged = () => {
    router.refresh();
  };

  const triggerButton = (
    <Button className="w-full shadow-lg hover:scale-105 transition-transform">
      <Plus className="mr-2 h-4 w-4"/>
      { t( "addSession" ) }
    </Button>
  );

  return <ReadingLogger customTrigger={ triggerButton } onSessionLogged={ handleSessionLogged }/>;
};