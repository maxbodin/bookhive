import { AuthButtons } from "@/app/auth/buttons";
import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import { Username } from "@/components/username";
import Search from "@/components/search";
import Link from "next/link";
import { Suspense } from "react";

export default async function Navbar() {
  return (
    <div className="sticky top-0 z-10 flex w-full flex-col items-center justify-between">
      <div
        className="flex h-auto w-full flex-wrap items-center justify-between gap-x-6 gap-y-4 px-6 py-4 shadow-md backdrop-blur-2xl lg:h-20 lg:flex-nowrap lg:py-0">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold md:text-3xl">
            <Link href={ `/` }>
              BookHive
            </Link>
          </h1>
        </div>

        <div className="order-last w-full lg:order-none lg:flex-1 max-w-md">
          <Suspense>
            <Search placeholder="Search a book..."/>
          </Suspense>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <Username/>
          </div>
          <AuthButtons/>
          <div className="hidden lg:flex">
            <ModeToggle/>
          </div>
        </div>
      </div>
      <Separator/>
    </div>
  );
}
