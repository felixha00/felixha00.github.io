import HomePage from "@/components/HomePage";
import { client } from "@/sanity/lib/client"; // adjust path to your client
import { PROFILE_QUERY } from "@/sanity/lib/queries";
export default async function Page() {

  const profile = await client.fetch(PROFILE_QUERY);

  return <HomePage profile={profile} />;
}