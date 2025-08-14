import { client, queries } from '@/lib/sanity'
import { TripCard } from '@/types/sanity'
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'

// This function runs at build time for static generation
async function getDestinations(): Promise<TripCard[]> {
  try {
    const trips = await client.fetch(queries.allTrips)
    
    // Group by destination to show unique destinations
    const uniqueDestinations = trips.reduce((acc: TripCard[], trip: TripCard) => {
      if (!acc.find(item => item.destination === trip.destination)) {
        acc.push(trip);
      }
      return acc;
    }, []);
    
    return uniqueDestinations
  } catch (error) {
    console.error('Error fetching destinations:', error)
    return []
  }
}

export default async function DestinationsPage() {
  const destinations = await getDestinations()

  return (
    <div className="min-h-screen bg-sb-beige-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-sb-teal-700 to-sb-navy-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            All Destinations
          </h1>
          <p className="text-xl md:text-2xl text-sb-teal-100 max-w-3xl mx-auto leading-relaxed">
            Discover amazing places where work meets adventure. Each destination is carefully chosen for remote workers seeking productivity and inspiration.
          </p>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {destinations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {destinations.map((destination) => {
                const imageUrl = destination.heroImage 
                  ? urlFor(destination.heroImage).width(400).height(300).url()
                  : `https://images.unsplash.com/photo-1494475673543-6a6a27143b22?auto=format&fit=crop&w=800&q=60`;

                return (
                  <Link
                    key={destination._id}
                    href={`/destinations/${destination.destination.toLowerCase().replace(/\s+/g, '-')}`}
                    className="group relative h-64 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    <Image
                      src={imageUrl}
                      alt={destination.heroImage?.alt || destination.destination}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
                    
                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      <h3 className="text-white text-xl font-bold mb-2">
                        {destination.destination}
                      </h3>
                      <p className="text-white/90 text-sm line-clamp-2">
                        {destination.description}
                      </p>
                    </div>

                    {/* Hover Arrow */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">No destinations available yet</h3>
              <p className="text-gray-600">Check back soon for amazing travel destinations!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
} 
