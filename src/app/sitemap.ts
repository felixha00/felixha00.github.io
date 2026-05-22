import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { PROJECT_SLUGS_QUERY } from "@/sanity/lib/queries";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://felixha.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs: { slug: string }[] = await client.fetch(PROJECT_SLUGS_QUERY);

  const projectUrls: MetadataRoute.Sitemap = slugs.map(({ slug }) => ({
    url: `${siteUrl}/projects/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...projectUrls,
  ];
}
