"use client";
import { createClient } from "@/app/utils/supabase/client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Session } from "@supabase/supabase-js";
import { getUsername } from "@/lib/getUsername";

const supabase = createClient();

export function Username() {
  const [session, setSession] = useState<Session | null>( null );
  const [loading, setLoading] = useState<boolean>( true );

  useEffect( () => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession( session );
      setLoading( false );
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange( ( _event, session ) => {
      setSession( session );
    } );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [] );

  if (loading) {
    return null;
  }

  const username = session?.user ? getUsername( session.user.email ) : null;

  return (
    <div className="flex items-center">
      { username && session?.user?.email ? (
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
      ) : null }
    </div>
  );
}