import { createClient } from "@/app/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/login/actions";
import Link from "next/link";
import { Username } from "@/components/username";
import { getUserProfile } from "@/app/actions/profiles/getUserProfile";

export default async function AuthButtons() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;
  if (user?.email) {
    profile = await getUserProfile( user.email );
  }

  return (
    <div className="flex items-center gap-4">
      { user ? (
        <>
          <div className="hidden md:block">
            <Username email={ user.email } customUsername={ profile?.username }/>
          </div>
          <form action={ signOut }>
            <Button variant="outline" type="submit">
              Sign out
            </Button>
          </form>
        </>
      ) : (
        <Button asChild>
          <Link href="/login">Sign in</Link>
        </Button>
      ) }
    </div>
  );
}