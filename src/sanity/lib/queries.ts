import { groq } from "next-sanity";

// ---- PROJECT QUERIES ----
export const PROJECT_SLUGS_QUERY = groq`*[_type == "project" && defined(slug.current) && coalesce(hidden, false) == false]{
  "slug": slug.current
}`;

export const PROJECTS_QUERY = groq`*[_type == "project" && coalesce(hidden, false) == false] | order(date desc) {
  _id,
  title,
  "slug": slug.current,
  summary,
  outcome,
  image,
  date,
  isCurrent,
  stack,
  category,
  for->{
    name,
    logo,
  }
}`;

// get a specific project by slug
export const PROJECT_QUERY = groq`*[_type == "project" && slug.current == $slug && coalesce(hidden, false) == false][0]{
  _id,
  title,
  slug,
  category,
  summary,
  outcome,
  image,
  date,
  isCurrent,
  url,
  tags,
  stack,
  links,
  content,
  readmeUrl,
  for->{
    name,
    logo,
  },
  attachments[] {
    title,
    "url": asset->url,
    "extension": asset->extension,
    "size": asset->size
  }
}`;

export const PROFILE_QUERY = groq`*[_type == "profile"][0] {
  fullName,
  headline,
  "profileImage": profileImage.asset->url, 
  shortBio,
  "resumeURL": resume.asset->url,
  links,
  fullBio,
  achievementsSimple,
  featuredProjects[coalesce(@->hidden, false) == false]->{
    _id,
    title,
    "slug": slug.current,
    summary,
    outcome,
    image,
    date,
    isCurrent,
    stack,
    category,
    for->{
      name,
      logo,
    }
  },
}`;

export const EXPERIENCES_QUERY = groq`*[_type == "experience"] | order(isCurrent desc, startDate desc) {
  _id,
  company,
  role,
  "logo": logo.asset->url,
  startDate,
  endDate,
  isCurrent,
  description, 
  technologies
}`;

export const POSTS_IDX_QUERY = groq`*[_type == "post"] | order(publishedAt desc) {
  title,
  "slug": slug.current,
  publishedAt,
  excerpt,
  "imageUrl": mainImage.asset->url,
  categories
}`;

export const POST_QUERY = groq`*[_type == "post" && slug.current == $slug][0] {
  title,
  publishedAt,
  "imageUrl": mainImage.asset->url,
  "alt": mainImage.alt,
  body,
}`;

export const PROJECTS_CAROUSEL_QUERY = groq`*[_type == "project" && defined(image) && coalesce(hidden, false) == false] | order(date desc) {
  _id,
  title,
  "slug": slug.current,
  image {
    asset->{
      _id,
      url,
      metadata {
        lqip,
        dimensions
      }
    },
    "alt": coalesce(alt, title)
  }
}`;
