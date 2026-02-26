import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Privacy Policy | BookHive",
  description: "BookHive is committed to your privacy. Learn how we handle your data, our use of Supabase, and your rights.",
};

export default async function PrivacyPage() {
  const t = await getTranslations( "PrivacyPage" );

  return (
    <article className="container mx-auto max-w-3xl py-12 px-4">
      <h1 className="text-4xl font-bold mb-6">{ t( "title" ) }</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-3">{ t( "overview_title" ) }</h2>
          <p>{ t( "overview_text" ) }</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">{ t( "collection_title" ) }</h2>
          <p>{ t( "collection_text" ) }</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>{ t( "data_account" ) }</strong>: { t( "data_account_desc" ) }</li>
            <li><strong>{ t( "data_library" ) }</strong>: { t( "data_library_desc" ) }</li>
            <li><strong>{ t( "data_usage" ) }</strong>: { t( "data_usage_desc" ) }</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">{ t( "storage_title" ) }</h2>
          <p>{ t( "storage_text" ) }</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">{ t( "cookies_title" ) }</h2>
          <p>{ t( "cookies_text" ) }</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">{ t( "rights_title" ) }</h2>
          <p>{ t( "rights_text" ) }</p>
        </section>
      </div>
    </article>
  );
}