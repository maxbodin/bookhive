import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Terms of Service | BookHive",
  description: "Read the Terms of Service for BookHive. Understand your rights and responsibilities when using our book tracking platform.",
  robots: {
    index: false,
    follow: true,
  }
};

export default async function TermsPage() {
  const t = await getTranslations( "TermsPage" );

  return (
    <article className="container mx-auto max-w-3xl py-12 px-4">
      <h1 className="text-4xl font-bold mb-6">{ t( "title" ) }</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. { t( "section_acceptance_title" ) }</h2>
          <p>{ t( "section_acceptance_text" ) }</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">2. { t( "section_accounts_title" ) }</h2>
          <p>{ t( "section_accounts_text" ) }</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>{ t( "account_rule_1" ) }</li>
            <li>{ t( "account_rule_2" ) }</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">3. { t( "section_content_title" ) }</h2>
          <p>{ t( "section_content_text" ) }</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">4. { t( "section_termination_title" ) }</h2>
          <p>{ t( "section_termination_text" ) }</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">5. { t( "section_disclaimer_title" ) }</h2>
          <p>{ t( "section_disclaimer_text" ) }</p>
        </section>
      </div>
    </article>
  );
}