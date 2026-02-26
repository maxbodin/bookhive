import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { BookOpen, Github, MessageCircleWarning, MessageSquare } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const metadata: Metadata = {
  title: "Contact Us | BookHive Support",
  description: "Get in touch with the BookHive team. Report bugs, suggest features via GitHub, or contact us for inquiries.",
  alternates: {
    canonical: "https://bookhive.maxbodin.com/contact",
  },
};

interface TeamMember {
  name: string;
  role: string;
  githubUrl: string;
  bookhiveUrl: string;
  avatarUrl: string;
  initials: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Maxime",
    role: "Lead Developer",
    githubUrl: "https://github.com/maxbodin",
    bookhiveUrl: "https://bookhive.maximebodin.com/maxime.bodin%40mailo.com",
    avatarUrl: "https://github.com/maxbodin.png",
    initials: "MB"
  },
];

export default async function ContactPage() {
  const t = await getTranslations( "ContactPage" );

  return (
    <div className="container mx-auto max-w-5xl py-12 px-4 md:px-8">
      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold mb-2">{ t( "title" ) }</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          { t( "subtitle" ) }
        </p>
      </div>

      <div className="space-y-18">
        <div className="flex flex-row gap-3 items-center justify-center">
          <Button asChild className="w-fit">
            <a href="https://github.com/maxbodin/bookhive/issues/new" target="_blank" rel="noopener noreferrer">

              <MessageCircleWarning className="h-4 w-4"/>
              { t( "btn_report_bug" ) }
            </a>
          </Button>
          <Button asChild variant="outline" className="w-fit">
            <a href="https://github.com/maxbodin/bookhive" target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4"/>
              { t( "btn_view_code" ) }
            </a>
          </Button>
        </div>

        <div className="space-y-4 flex flex-col items-center justify-center my-12">
          <h2
            className="text-2xl font-bold tracking-tight">{ t( "team_section_title", { defaultValue: "Meet the Team" } ) }</h2>
          <div className="flex flex-row items-center justify-center">
            { TEAM_MEMBERS.map( ( member ) => (
              <Card key={ member.name }
                    className="hover:shadow-md transition-shadow border-primary/20 shadow-lg h-full w-fit">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Avatar className="h-16 w-16 border-2 border-background shadow-sm">
                    <AvatarImage src={ member.avatarUrl } alt={ member.name }/>
                    <AvatarFallback>{ member.initials }</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <CardTitle className="text-lg">{ member.name }</CardTitle>
                    <CardDescription className="font-medium text-primary">
                      { member.role }
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button asChild variant="outline" size="sm" className="gap-2">
                      <a href={ member.githubUrl } target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4"/>
                        GitHub
                      </a>
                    </Button>
                    <Button asChild size="sm" className="gap-2">
                      <Link href={ member.bookhiveUrl }>
                        <BookOpen className="h-4 w-4"/>
                        BookHive
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) ) }
          </div>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-semibold mb-2">{ t( "community_title" ) }</h2>
          <p className="text-muted-foreground mb-4 max-w-lg mx-auto">
            { t( "community_text" ) }
          </p>
          <Link
            href="https://github.com/maxbodin/bookhive/discussions"
            className="inline-flex items-center text-primary hover:underline font-medium"
          >
            <MessageSquare className="mr-2 h-4 w-4"/>
            { t( "link_discussions" ) }
          </Link>
        </div>
      </div>
    </div>
  )
    ;
}