import { createClient } from "@/app/utils/supabase/server";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUsername } from "@/lib/getUsername";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getInitial } from "@/lib/getInitial";

/**
 * Récupère les profils utilisateurs depuis la base de données.
 */
async function getAllProfiles() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from( "profiles" )
    .select( "email, picture" )
    .order( "created_at", { ascending: false } );

  if (error) {
    console.error( "Erreur lors de la récupération des profils :", error );
    return [];
  }
  return data;
}

/**
 * Bandeau affichant liste horizontale d'avatars d'utilisateurs
 * cliquables qui redirigent vers leurs étagères.
 */
export async function UserBanner() {
  const profiles = await getAllProfiles();

  if (!profiles || profiles.length === 0) {
    return null;
  }

  return (
    <section className="w-full max-w-7xl mx-auto px-4">
      <TooltipProvider delayDuration={ 100 }>
        <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 p-4">
          { profiles.map( ( profile ) => (
            <Tooltip key={ profile.email }>
              <TooltipTrigger asChild>
                <Link href={ `/${ encodeURIComponent( profile.email ) }` }>
                  <Avatar className="h-20 w-20 hover:ring-2 hover:ring-primary transition-all">
                    <AvatarImage src={ profile.picture ?? undefined } alt={ getUsername( profile.email ) }/>
                    <AvatarFallback>{ getInitial( profile.email ) }</AvatarFallback>
                  </Avatar>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>{ getUsername( profile.email ) }</p>
              </TooltipContent>
            </Tooltip>
          ) ) }
        </div>
      </TooltipProvider>
    </section>
  );
}