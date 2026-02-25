import Link from "next/link";
import { getUsername } from "@/lib/getUsername";
import { getTranslations } from "next-intl/server";

interface UsernameProps {
  email?: string;
  customUsername?: string | null;
}

export async function Username( { email, customUsername }: UsernameProps ) {
  const t = await getTranslations( "Username" );

  if (!email) {
    return null;
  }

  const displayUsername = getUsername( email, customUsername );

  return (
    <div className="flex items-center">
      <p className="text-lg font-semibold">
        { t( "greeting" ) }{ " " }
        <Link
          href={ `/${ email }` }
          className="hover:underline"
        >
          { displayUsername }
        </Link>
        !
      </p>
    </div>
  );
}