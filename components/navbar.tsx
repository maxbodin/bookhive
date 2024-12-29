import { AuthButtons } from "@/app/auth/buttons";
import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import { Username } from "@/components/username";
import Search from "@/components/search";
import Link from "next/link";

export default async function Navbar() {
  return (
    <div className="flex flex-col w-full items-center justify-between sticky top-0 z-50">
      <div
        className="flex flex-row h-16 w-full items-center justify-between px-6 sm:px-12 backdrop-blur-2xl shadow-md">
        <div className="flex items-center">
          <h1 className="text-2xl sm:text-3xl font-bold"><Link
            href={ `/` }
          >
            BookHive
          </Link></h1>
        </div>
        <div className="w-full max-w-56 flex justify-center sm:justify-end">
          <Search placeholder="Search a book..."/>
        </div>
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="hidden md:block">
            <Username/>
          </div>
          <AuthButtons/>
          <ModeToggle/>
        </div>
      </div>
      <Separator/>
    </div>
  );
}
