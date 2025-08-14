import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: process.env.NODE_ENV === 'production',
  apiVersion: '2024-01-01',
  // Only add token if we're in a server environment and need write access
  token: process.env.SANITY_API_TOKEN,
})

const builder = imageUrlBuilder(client)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return builder.image(source)
}

// GROQ queries for common data fetching
export const queries = {
  // Get all trips
  allTrips: `*[_type == "trip"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    heroImage,
    "imageUrl": heroImage.asset->url,
    destination,
    duration,
    description,
    price,
    currency,
    category,
    featured,
    publishedAt
  }`,

  // Get trips by category
  tripsByCategory: (category: 'popular' | 'local') => 
    `*[_type == "trip" && category == "${category}"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      heroImage,
      "imageUrl": heroImage.asset->url,
      destination,
      duration,
      description,
      price,
      currency,
      category,
      featured,
      publishedAt
    }`,

  // Get featured trips
  featuredTrips: `*[_type == "trip" && featured == true] | order(publishedAt desc) {
    _id,
    title,
    slug,
    heroImage,
    "imageUrl": heroImage.asset->url,
    destination,
    duration,
    description,
    price,
    currency,
    category,
    publishedAt
  }`,

  // Get single trip by slug
  tripBySlug: (slug: string) => 
    `*[_type == "trip" && slug.current == "${slug}"][0] {
      _id,
      title,
      slug,
      heroImage,
      "imageUrl": heroImage.asset->url,
      destination,
      duration,
      description,
      inclusions,
      exclusions,
      itinerary,
      price,
      currency,
      category,
      featured,
      publishedAt
    }`,

  // Get all active FAQs
  allFaqs: `*[_type == "faq" && isActive == true] | order(order asc) {
    _id,
    question,
    answer,
    category,
    order
  }`,

  // Get FAQs by category
  faqsByCategory: (category: string) => 
    `*[_type == "faq" && category == "${category}" && isActive == true] | order(order asc) {
      _id,
      question,
      answer,
      category,
      order
    }`,
} 