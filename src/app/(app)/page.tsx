import type { Metadata } from "next";
import HomePage from "@/components/HomePage";
import { client } from "@/sanity/lib/client";
import { PROFILE_QUERY, PROJECTS_CAROUSEL_QUERY } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: 'felix ha',
  description: 'Felix Ha — multidisciplinary designer and developer working across software, hardware, visual branding, and ventures.',
  openGraph: {
    title: 'felix ha',
    description: 'Felix Ha — multidisciplinary designer and developer working across software, hardware, visual branding, and ventures.',
  },
};

export const revalidate = 60;

export default async function Page() {

  const profile = await client.fetch(PROFILE_QUERY);
  const projectsCarousel = await client.fetch(PROJECTS_CAROUSEL_QUERY);

  return <HomePage profile={profile} projectsCarousel={projectsCarousel} />;
}