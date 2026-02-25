import { MetadataRoute } from "next";
import { createClient } from "@/app/utils/supabase/server";
import { ROUTES } from "@/app/utils/routes";

const BASE_URL = "https://bookhive.maximebodin.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const { data: books } = await supabase
    .from( "books" )
    .select( "id, updated_at" )
    .limit( 10000 );

  const bookUrls = ( books || [] ).map( ( book ) => ( {
    url: `${ BASE_URL }/${ ROUTES.BOOK }/${ book.id }`,
    lastModified: new Date( book.updated_at ),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  } ) );

  const staticRoutes = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${ BASE_URL }/${ ROUTES.PROFILE }`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.7,
    }
  ];

  return [...staticRoutes, ...bookUrls];
}