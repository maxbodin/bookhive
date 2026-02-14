import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import Search from "@/components/search";
import Link from "next/link";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import LocaleSwitcher from "@/components/locale-switcher";
import { AuthButtonsSkeleton } from "@/components/skeletons/auth-buttons-skeleton";
import AuthButtons from "@/components/login/auth-buttons";

export default async function Navbar() {
  const t = await getTranslations( "Navbar" );

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
          <Suspense
            fallback={ <div className="h-10 w-full bg-muted rounded-md"/> }
          >
            <Search placeholder={ t( "search_placeholder" ) }/>
          </Suspense>
        </div>

        <div className="flex items-center gap-4">
          <Suspense fallback={ <AuthButtonsSkeleton/> }>
            <AuthButtons/>
          </Suspense>

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