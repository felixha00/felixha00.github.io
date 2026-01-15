import { groq } from "next-sanity";

// get all slugs for generateStaticParams
export const PROJECT_SLUGS_QUERY = groq`*[_type == "project" && defined(slug.current)]{
  "slug": slug.current
}`;


// get a specific project by slug
export const PROJECT_QUERY = groq`*[_type == "project" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  category,
  summary,
  image,
  date,
  url,
  tags,
  stack,
  links,
  content
}`;