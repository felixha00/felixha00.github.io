import HomePage from "@/components/HomePage";
import { client } from "@/sanity/lib/client"; // adjust path to your client
import { PROFILE_QUERY, PROJECTS_CAROUSEL_QUERY } from "@/sanity/lib/queries";
export default async function Page() {

  const profile = await client.fetch(PROFILE_QUERY);
  const projectsCarousel = await client.fetch(PROJECTS_CAROUSEL_QUERY);

  return <HomePage profile={profile} projectsCarousel={projectsCarousel} />;
}