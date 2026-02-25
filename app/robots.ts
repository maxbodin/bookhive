import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/login", "/error", "/api/"],
    },
    sitemap: "https://bookhive.maximebodin.com/sitemap.xml",
  };
}