"use client";
import { createClient } from "@/app/utils/supabase/client";
import { useEffect, useState } from "react";
import Link from "next/link";


const supabase = createClient();

function getUsername( user: { email?: string } | null ): string {
  if (!user?.email) {
    return "Guest"; // Fallback if user or email is undefined.
  }

  return user.email
    .split( "@" )[0] // Get the part before the '@'.
    .replace( ".", " " ) // Replace '.' with spaces.
    .split( " " ) // Split by spaces.
    .map( ( part ) => part.charAt( 0 ).toUpperCase() + part.slice( 1 ).toLowerCase() ) // Capitalize each part.
    .join( " " ); // Rejoin into a single string.
}


export function Username() {
  const [session, setSession] = useState<any>( null );

  useEffect( () => {
    setSession( supabase.auth.getSession() );

    supabase.auth.onAuthStateChange( ( _event, session ) => {
      setSession( session );
    } );
  }, [] );

  const username = session?.user ? getUsername( session.user ) : null;

  return (
    <div className="flex items-center">
      { username ? (
        <p className="text-lg font-semibold">
          Hi{ " " }
          <Link
            href={ `/${ session.user.email }` }
            className="hover:underline"
          >
            { username }
          </Link>
          !
        </p>
      ) : (
        // TODO : Allow user to enter its email directly in this area then he can click on sign-in to log in.
        <p>Welcome ...... !</p>
      ) }
    </div>
  );
}