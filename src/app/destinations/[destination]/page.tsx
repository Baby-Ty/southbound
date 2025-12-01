import { client, queries } from '@/lib/sanity'
import { TripCard } from '@/types/sanity'
import TripGrid from '@/components/TripGrid'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'
import { notFound } from 'next/navigation'

interface DestinationPageProps {
  params: Promise<{
    destination: string
  }>
}

// This function runs at build time for static generation
async function getDestinationTrips(destinationSlug: string): Promise<{trips: TripCard[], destination: string}> {
  try {
    // Check if Sanity is properly configured
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID === 'your-project-id') {
      console.log('[DestinationPage] Sanity not configured, using fallback data')
      // Convert slug back to destination name
      const destinationName = destinationSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      // Return empty trips array - page will still render but show empty state
      return {
        trips: [],
        destination: destinationName
      }
    }
    
    const trips = await client.fetch(queries.allTrips).catch((err) => {
      console.error('[DestinationPage] Error fetching trips from Sanity:', err)
      return []
    })
    
    // Convert slug back to destination name
    const destinationName = destinationSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    
    // Filter trips by destination
    const destinationTrips = trips.filter((trip: TripCard) => 
      trip.destination.toLowerCase() === destinationName.toLowerCase()
    )
    
    // Don't call notFound() during build - just return empty array
    // The page will render but show empty state
    if (destinationTrips.length === 0) {
      return {
        trips: [],
        destination: destinationName
      }
    }
    
    return {
      trips: destinationTrips,
      destination: destinationTrips[0].destination
    }
  } catch (error) {
    console.error('[DestinationPage] Error fetching destination trips:', error)
    // Convert slug back to destination name for fallback
    const destinationName = destinationSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    return {
      trips: [],
      destination: destinationName
    }
  }
}

export default async function DestinationPage({ params }: DestinationPageProps) {
  const { destination } = await params
  const { trips, destination: destinationName } = await getDestinationTrips(destination)
  
  // Get the hero image from the first trip
  const heroImage = trips[0]?.heroImage
  const heroImageUrl = heroImage ? urlFor(heroImage).width(1200).height(600).url() : null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-br from-teal-800 to-teal-900">
        {heroImageUrl && (
          <>
            <Image
              src={heroImageUrl}
              alt={`${destination} destination`}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </>
        )}
        
        <div className="relative h-full flex items-center justify-center text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {destinationName}
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Discover amazing remote work experiences in {destinationName}. Work productively while exploring this incredible destination.
            </p>
          </div>
        </div>
      </section>

      {/* Trips Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Remote Work Experiences in {destinationName}
            </h2>
            <p className="text-lg text-gray-600">
              Choose from our curated collection of {trips.length} experience{trips.length !== 1 ? 's' : ''} in {destinationName}
            </p>
          </div>
          
          <TripGrid 
            trips={trips} 
            emptyMessage={`No trips available for ${destinationName} yet. Check back soon!`}
          />
        </div>
      </section>
    </div>
  )
}

// Generate static params for all destinations
export async function generateStaticParams() {
  // Use mock data for static generation
  const trips = [
    { destination: 'Bangkok, Thailand' },
    { destination: 'Lisbon, Portugal' },
    { destination: 'Medellín, Colombia' },
    { destination: 'Canggu, Bali' },
    { destination: 'Cape Town, South Africa' },
    { destination: 'Johannesburg, South Africa' }
  ]
  
  // Get unique destinations
  const destinations = Array.from(new Set(trips.map((trip) => trip.destination)))
  
  return destinations.map((destination) => ({
    destination: destination.toLowerCase().replace(/\s+/g, '-')
  }))
} 