import { client, queries } from '@/lib/sanity'
import { TripCard } from '@/types/sanity'
import TripGrid from '@/components/TripGrid'
import { Metadata } from 'next'
import { mockTrips } from '@/lib/mockData'

export const metadata: Metadata = {
  title: 'All Trips - Southbound',
  description: 'Discover our complete collection of amazing travel experiences, from popular destinations to hidden local gems.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

// This function runs at build time for static generation
async function getTrips(): Promise<TripCard[]> {
  try {
    const trips = await client.fetch(queries.allTrips)
    // Return mock data if no trips found or if Sanity is not configured
    return trips.length > 0 ? trips : mockTrips
  } catch (error) {
    console.error('Error fetching trips from Sanity, using mock data:', error)
    return mockTrips
  }
}

export default async function TripsPage() {
  const trips = await getTrips()

  return (
    <div className="min-h-screen bg-sb-beige-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-sb-teal-600 to-sb-navy-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            All Trips
          </h1>
          <p className="text-xl md:text-2xl text-sb-teal-100 max-w-3xl mx-auto leading-relaxed">
            Discover our complete collection of amazing travel experiences, from popular destinations to hidden local gems.
          </p>
        </div>
      </section>

      {/* Trips Grid */}
      <TripGrid 
        trips={trips} 
        emptyMessage="No trips available yet. Check back soon for amazing travel experiences!"
      />
    </div>
  )
} 
