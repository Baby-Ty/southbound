import Link from 'next/link'
import Image from 'next/image'
import { TripCard as TripCardType } from '@/types/sanity'
import { urlFor } from '@/lib/sanity'

interface TripCardProps {
  trip: TripCardType
}

const TripCard = ({ trip }: TripCardProps) => {
  const imageUrl = trip.imageUrl
    || (trip.heroImage ? urlFor(trip.heroImage).width(400).height(300).url() : '')
    || 'https://images.unsplash.com/photo-1441716844725-09cedc13a4e7?auto=format&fit=crop&w=800&q=60'

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link href={`/trips/${trip.slug.current}`}>
        <div className="relative h-48 w-full">
          <Image
            src={imageUrl}
            alt={trip.heroImage?.alt || trip.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {trip.featured && (
            <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
              Featured
            </div>
          )}
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
            {trip.category === 'popular' ? 'Popular' : 'Local'}
          </div>
        </div>
      </Link>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">{trip.destination}</span>
          <span className="text-sm text-gray-500">{trip.duration}</span>
        </div>
        
        <Link href={`/trips/${trip.slug.current}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
            {trip.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {trip.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">
            {trip.currency === 'USD' ? '$' : trip.currency}{trip.price.toLocaleString()}
          </div>
          <Link
            href={`/trips/${trip.slug.current}`}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default TripCard 
