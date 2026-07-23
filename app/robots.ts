import { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://adn-community.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/espace-eleve", "/connexion", "/inscription"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
