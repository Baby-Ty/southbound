import { PortableTextBlock } from '@sanity/types'

export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
}

export interface Trip {
  _id: string
  title: string
  slug: {
    current: string
    _type: 'slug'
  }
  heroImage?: SanityImage | null
  destination: string
  duration: string
  description: string
  inclusions?: string[]
  exclusions?: string[]
  itinerary?: PortableTextBlock[]
  price: number
  currency: string
  category: 'popular' | 'local'
  featured: boolean
  publishedAt: string
  imageUrl?: string
}

export interface FAQ {
  _id: string
  question: string
  answer: PortableTextBlock[]
  category: 'general' | 'booking' | 'travel' | 'payment' | 'cancellation'
  order: number
  isActive: boolean
}

// Simplified types for list views
export interface TripCard {
  _id: string
  title: string
  slug: {
    current: string
    _type: 'slug'
  }
  heroImage?: SanityImage | null
  destination: string
  duration: string
  description: string
  price: number
  currency: string
  category: 'popular' | 'local'
  featured: boolean
  publishedAt: string
  imageUrl?: string
} 