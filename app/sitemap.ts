import { MetadataRoute } from "next";
import { FORMATIONS } from "@/lib/formations";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://adn-community.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/formations", "/communaute", "/a-propos", "/contact"].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const formationRoutes = FORMATIONS.map((f) => ({
    url: `${siteUrl}/formations/${f.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...formationRoutes];
}
