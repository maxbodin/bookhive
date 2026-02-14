import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import { Username } from "@/components/username";
import Search from "@/components/search";
import Link from "next/link";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import LocaleSwitcher from "@/components/locale-switcher";
import { createClient } from "@/app/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/login/actions";

export default async function Navbar() {
  const t = await getTranslations( "Navbar" );
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-10 flex w-full flex-col items-center">
      <div
        className="flex h-auto w-full flex-wrap items-center justify-between gap-x-6 gap-y-4 px-6 py-4 shadow-md backdrop-blur-2xl lg:h-20 lg:flex-nowrap lg:py-0">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold md:text-3xl">
            <Link href="/">{ t( "title" ) }</Link>
          </h1>
        </div>

        <div className="order-last w-full lg:order-none lg:flex-1 max-w-md">
          <Suspense fallback={ <div className="h-10 w-full bg-muted rounded-md"/> }>
            <Search placeholder={ t( "search_placeholder" ) }/>
          </Suspense>
        </div>

        {/*// TODO : Refactor in dedicated file like auth buttons.*/ }
        <div className="flex items-center gap-4">
          { user ? (
            <>
              <div className="hidden md:block">
                <Username/>
              </div>
              <form action={ signOut }>
                <Button variant="outline" type="submit">Sign out</Button>
              </form>
            </>
          ) : (
            <Button asChild>
              <Link href="/login">Sign in</Link>
            </Button>
          ) }

          <div className="hidden lg:flex gap-4">
            <ModeToggle/>
            <LocaleSwitcher/>
          </div>
        </div>
      </div>
      <Separator/>
    </header>
  );
}