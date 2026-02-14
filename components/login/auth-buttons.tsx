import { createClient } from "@/app/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/login/actions";
import Link from "next/link";
import { Username } from "@/components/username";

export default async function AuthButtons() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex items-center gap-4">
      { user ? (
        <>
          <div className="hidden md:block">
            <Username/>
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