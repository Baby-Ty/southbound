import { client, queries } from '@/lib/sanity'
import { TripCard } from '@/types/sanity'
import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'
import { getAllCities } from '@/data/cities'

// This function runs at build time for static generation
async function getDestinations(): Promise<TripCard[]> {
  try {
    // Check if Sanity is properly configured
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID === 'your-project-id') {
      console.log('[DestinationsPage] Sanity not configured, returning empty array')
      return []
    }
    
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
  const cityGuides = getAllCities()

  return (
    <div className="min-h-screen bg-sb-beige-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-sb-teal-700 to-sb-navy-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Destinations
          </h1>
          <p className="text-xl md:text-2xl text-sb-teal-100 max-w-3xl mx-auto leading-relaxed">
            Every city we recommend works for remote work. Good internet, safe neighbourhoods, and a lifestyle worth showing up for.
          </p>
        </div>
      </section>

      {/* City Guides Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-sb-navy-700 mb-2">City guides</h2>
            <p className="text-sb-navy-500">Detailed overviews of each destination: neighbourhoods, costs, visa info, and everything you need to plan a 30-day stay.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cityGuides.map((city) => (
              <Link
                key={city.slug}
                href={`/destinations/${city.slug}`}
                className="group relative h-72 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
              >
                <Image
                  src={city.heroImage}
                  alt={city.altText}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-xs text-sb-teal-200 font-medium">{city.flag} {city.country}</span>
                  </div>
                  <h3 className="text-white text-2xl font-bold mb-1">{city.name}</h3>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-white/80 text-xs">⭐ {city.nomadRating.overall}/10</span>
                    <span className="text-white/80 text-xs">💰 {city.quickStats.monthlyBudget}</span>
                  </div>
                  <div className="bg-sb-teal-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 w-fit opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    View city guide →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trip Packages from Sanity */}
      {destinations.length > 0 && (
        <section className="py-8 pb-16 px-4 sm:px-6 lg:px-8 border-t border-sb-beige-300">
          <div className="max-w-7xl mx-auto">
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-sb-navy-700 mb-2">Trip packages</h2>
              <p className="text-sb-navy-500">Curated routes ready to book.</p>
            </div>
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                      <h3 className="text-white text-xl font-bold mb-2">{destination.destination}</h3>
                      <p className="text-white/90 text-sm line-clamp-2">{destination.description}</p>
                    </div>
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
          </div>
        </section>
      )}
    </div>
  )
} 
