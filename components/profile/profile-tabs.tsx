"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import { ProfileTab } from "@/app/types/profile-tab";

interface ProfileTabsProps {
  shelvesTab: React.ReactNode;
  sessionsTab: React.ReactNode;
  statsTab: React.ReactNode;
  shelvesLabel: string;
  sessionsLabel: string;
  statsLabel: string;
  activeTab: ProfileTab;
}

export function ProfileTabs( {
                               shelvesTab,
                               sessionsTab,
                               statsTab,
                               shelvesLabel,
                               sessionsLabel,
                               statsLabel,
                               activeTab,
                             }: ProfileTabsProps ) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onTabChange = ( value: string ) => {
    const currentParams = new URLSearchParams( Array.from( searchParams.entries() ) );
    currentParams.set( "tab", value );
    const search = currentParams.toString();
    const query = search ? `?${ search }` : "";
    router.replace( `${ pathname }${ query }`, { scroll: false } );
  };

  return (
    <Tabs
      value={ activeTab }
      className="w-full"
      onValueChange={ onTabChange }
    >
      <div className="mb-8 flex justify-center">
        <TabsList>
          <TabsTrigger value="shelves">{ shelvesLabel }</TabsTrigger>
          <TabsTrigger value="sessions">{ sessionsLabel }</TabsTrigger>
          <TabsTrigger value="stats">{ statsLabel }</TabsTrigger>
        </TabsList>
      </div>

      { activeTab === "shelves" && <TabsContent value="shelves">{ shelvesTab }</TabsContent> }
      { activeTab === "sessions" && <TabsContent value="sessions">{ sessionsTab }</TabsContent> }
      { activeTab === "stats" && <TabsContent value="stats">{ statsTab }</TabsContent> }
    </Tabs>
  );
}