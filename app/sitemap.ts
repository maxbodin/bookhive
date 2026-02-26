import { MetadataRoute } from "next";
import { createClient } from "@/app/utils/supabase/server";
import { ROUTES } from "@/app/utils/routes";

const BASE_URL = "https://bookhive.maximebodin.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const { data: books } = await supabase
    .from( "books" )
    .select( "id, updated_at, created_at" )
    .limit( 10000 );

  const bookUrls = ( books || [] ).map( ( book ) => ( {
    url: `${ BASE_URL }/${ ROUTES.BOOK }/${ book.id }`,
    lastModified: new Date( book.updated_at || book.created_at || new Date() ),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  } ) );

  const { data: profiles } = await supabase
    .from( "profiles" )
    .select( "email, updated_at" )
    .limit( 1000 );

  const profileUrls: MetadataRoute.Sitemap = ( profiles || [] ).map( ( profile ) => ( {
    url: `${ BASE_URL }/${ encodeURIComponent( profile.email ) }`,
    lastModified: new Date( profile.updated_at || new Date() ),
    changeFrequency: "weekly",
    priority: 0.6,
  } ) );

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${ BASE_URL }/${ ROUTES.ABOUT }`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${ BASE_URL }/${ ROUTES.TERMS }`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${ BASE_URL }/${ ROUTES.CONTACT }`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    },
    {
      url: `${ BASE_URL }/${ ROUTES.PRIVACY }`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    },
    {
      url: `${ BASE_URL }/${ ROUTES.LOGIN }`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.1,
    }
  ];

  return [...staticRoutes, ...bookUrls, ...profileUrls];
}