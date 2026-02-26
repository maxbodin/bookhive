import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { BookOpen, BookOpenCheck, Github, Lock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About BookHive | Personal Library Manager",
  description: "BookHive allows you to track your reading journey, organize and manage your bookshelves, and discover new books tailored to your interests.",
  alternates: {
    canonical: "https://bookhive.maximebodin.com/about",
  },
};

export default async function AboutPage() {
  const t = await getTranslations( "AboutPage" );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "BookHive",
    "applicationCategory": "ReferenceApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Modern book tracking application.",
    "author": {
      "@type": "Person",
      "name": "Maxime Bodin",
      "url": "https://bookhive.maximebodin.com"
    }
  };

  return (
    <article className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={ { __html: JSON.stringify( jsonLd ) } }
      />

      {/* Hero section */ }
      <section className="py-20 px-4 md:px-8 bg-muted/30">
        <div className="container mx-auto max-w-5xl text-center">
          <h1
            className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            { t( "hero_title" ) }
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            { t( "hero_subtitle" ) }
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/"><BookOpen className="mr-2 h-4 w-4"/> { t( "cta_start" ) }</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="https://github.com/maxbodin/bookhive" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4"/> GitHub
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Values */ }
      <section className="py-16 px-4 md:px-8">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row gap-8">
          <FeatureCard
            icon={ <BookOpen className="h-10 w-10 text-primary"/> }
            title={ t( "feature_library_title" ) }
            description={ t( "feature_library_desc" ) }
          />
          <FeatureCard
            icon={ <Lock className="h-10 w-10 text-primary"/> }
            title={ t( "feature_privacy_title" ) }
            description={ t( "feature_privacy_desc" ) }
          />
          <FeatureCard
            icon={ <BookOpenCheck className="h-10 w-10 text-primary"/> }
            title={ t( "feature_track_title" ) }
            description={ t( "feature_track_desc" ) }
          />
        </div>
      </section>

      {/* Story / Missions */ }
      <section className="py-16 px-4 md:px-8 border-t">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold mb-6">{ t( "mission_title" ) }</h2>
          <p className="text-lg text-muted-foreground">
            { t( "mission_text_1" ) }
          </p>
          <p className="text-lg text-muted-foreground mt-4">
            { t( "mission_text_2" ) }
          </p>
        </div>
      </section>
    </article>
  );
}

function FeatureCard( { icon, title, description }: { icon: React.ReactNode, title: string, description: string } ) {
  return (
    <div
      className="flex flex-col items-center text-center p-6 rounded-xl border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4 p-3 bg-primary/10 rounded-full">
        { icon }
      </div>
      <h3 className="text-xl font-semibold mb-2">{ title }</h3>
      <p className="text-muted-foreground">{ description }</p>
    </div>
  );
}