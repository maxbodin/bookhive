import Link from "next/link";
import LocaleSwitcher from "@/components/locale-switcher";
import { getTranslations } from "next-intl/server";
import { ROUTES } from "@/app/utils/routes";

export async function Footer() {
  const t = await getTranslations( "Footer" );
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t pb-20">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-center md:text-left">
            <Link href="/" className="flex items-center justify-center gap-2 md:justify-start">
              <span className="text-xl font-bold">{ t( "title" ) }</span>
            </Link>
            <p className="mt-2 text-sm text-muted-foreground">
              © { currentYear } { t( "title" ) }. All rights reserved.
            </p>
          </div>

          <LocaleSwitcher/>

          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium text-muted-foreground">
            <Link href={ `/${ ROUTES.ABOUT }` } className="transition-colors hover:text-primary">
              About
            </Link>
            <Link href={ `/${ ROUTES.TERMS }` } className="transition-colors hover:text-primary">
              Terms of Service
            </Link>
            <Link href={ `/${ ROUTES.PRIVACY }` } className="transition-colors hover:text-primary">
              Privacy Policy
            </Link>
            <Link href={ `/${ ROUTES.CONTACT }` } className="transition-colors hover:text-primary">
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}