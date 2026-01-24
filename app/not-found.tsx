import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NotFoundPage() {
  const t = await getTranslations( "NotFoundPage" );

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <div className="max-w-md p-8">
        <h1 className="text-9xl font-bold text-primary">{ t( "errorCode" ) }</h1>
        <h2 className="mt-4 text-3xl font-semibold text-foreground">
          { t( "title" ) }
        </h2>
        <p className="mt-4 text-muted-foreground">
          { t( "description" ) }
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <ArrowLeft className="h-4 w-4"/>
          { t( "goHome" ) }
        </Link>
      </div>
    </div>
  );
}