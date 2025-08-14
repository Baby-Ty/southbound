import Link from 'next/link'
import Image from 'next/image'
import { TripCard as TripCardType } from '@/types/sanity'
import { urlFor } from '@/lib/sanity'

interface StaticTrip {
  _id: string;
  title: string;
  destination: string;
  duration: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  featured: boolean;
  imageUrl?: string;
  heroImage?: {
    _type: string;
    asset: { _ref: string; _type: string };
    alt?: string;
  };
  slug?: { current: string };
}

interface EnhancedTripCardProps {
  trip: TripCardType | StaticTrip
  onClick?: (trip: TripCardType | StaticTrip) => void
}

// Define common vibe tags based on destination or category
const getVibeTag = (destination: string, category: string): { label: string; color: string; emoji: string } => {
  const destinationLower = destination.toLowerCase()
  
  // Define vibe mappings
  if (destinationLower.includes('bali') || destinationLower.includes('thailand') || destinationLower.includes('beach')) {
    return { label: 'Beach Vibes', color: 'bg-cyan-100 text-cyan-800', emoji: '🏖️' }
  }
  if (destinationLower.includes('lisbon') || destinationLower.includes('paris') || destinationLower.includes('europe')) {
    return { label: 'Cultural', color: 'bg-purple-100 text-purple-800', emoji: '🏛️' }
  }
  if (destinationLower.includes('mexico') || destinationLower.includes('guatemala') || destinationLower.includes('latin')) {
    return { label: 'Adventure', color: 'bg-orange-100 text-orange-800', emoji: '🌋' }
  }
  if (destinationLower.includes('cape town') || destinationLower.includes('africa')) {
    return { label: 'Safari & City', color: 'bg-yellow-100 text-yellow-800', emoji: '🦁' }
  }
  if (category === 'local') {
    return { label: 'Local Gem', color: 'bg-green-100 text-green-800', emoji: '💎' }
  }
  
  // Default based on category
  if (category === 'popular') {
    return { label: 'Trending', color: 'bg-blue-100 text-blue-800', emoji: '🔥' }
  }
  
  return { label: 'Budget-Friendly', color: 'bg-emerald-100 text-emerald-800', emoji: '💰' }
}

// Common inclusions for remote work trips
const getInclusions = (): { label: string; icon: string }[] => {
  return [
    { label: 'Coworking', icon: '💻' },
    { label: 'Fast WiFi', icon: '📶' },
    { label: 'Local SIM', icon: '📱' },
    { label: 'Airport Pickup', icon: '✈️' },
    { label: '24/7 Support', icon: '🆘' }
  ]
}

const EnhancedTripCard = ({ trip, onClick }: EnhancedTripCardProps) => {
  // Handle both Sanity images and static imageUrl
  const imageUrl = ('imageUrl' in trip && trip.imageUrl) || (trip.heroImage 
    ? urlFor(trip.heroImage).width(400).height(300).url()
    : 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=60')

  const vibeTag = getVibeTag(trip.destination, trip.category)
  const inclusions = getInclusions()

  const handleClick = () => {
    if (onClick) {
      onClick(trip)
    }
  }

  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (onClick) {
      return (
        <button onClick={handleClick} className="w-full text-left">
          {children}
        </button>
      )
    }
    return <div>{children}</div>
  }

  return (
    <CardWrapper>
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
        {/* Image Section */}
        <div className="relative h-48 w-full overflow-hidden cursor-pointer">
          <Image
            src={imageUrl}
            alt={trip.heroImage?.alt || trip.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          
          {/* Featured Badge */}
          {trip.featured && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              ⭐ Featured
            </div>
          )}
          
          {/* Vibe Tag */}
          <div className={`absolute top-3 right-3 ${vibeTag.color} px-3 py-1 rounded-full text-xs font-medium shadow-lg backdrop-blur-sm`}>
            <span className="mr-1">{vibeTag.emoji}</span>
            {vibeTag.label}
          </div>
          
          {/* Duration */}
          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-medium shadow-lg">
            📅 {trip.duration}
          </div>
        </div>
        
        {/* Content Section */}
        <div className="p-6">
          {/* Header */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500 font-medium">📍 {trip.destination}</span>
              <div className="text-right">
                <div className="text-xs text-gray-400">Starting from</div>
                <div className="text-lg font-bold text-blue-600">
                  {trip.currency === 'USD' ? '$' : trip.currency === 'ZAR' ? 'R' : trip.currency}
                  {trip.price.toLocaleString()}
                </div>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors line-clamp-1">
              {trip.title}
            </h3>
            
            <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
              {trip.description}
            </p>
          </div>
          
          {/* Inclusions */}
          <div className="mb-4">
            <div className="text-xs text-gray-500 mb-2 font-medium">✅ Includes:</div>
            <div className="flex flex-wrap gap-1">
              {inclusions.slice(0, 4).map((inclusion, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 bg-gray-50 text-gray-700 px-2 py-1 rounded-md text-xs font-medium border"
                >
                  <span>{inclusion.icon}</span>
                  <span>{inclusion.label}</span>
                </span>
              ))}
              {inclusions.length > 4 && (
                <span className="inline-flex items-center bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs">
                  +{inclusions.length - 4} more
                </span>
              )}
            </div>
          </div>
          
          {/* CTA Button */}
          {onClick ? (
            <button
              onClick={handleClick}
              className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-center px-4 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-md hover:scale-105"
            >
              View Details
              <span className="ml-2">→</span>
            </button>
          ) : (
            <Link
              href={`/trips/${trip.slug?.current || '#'}`}
              className="block w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-center px-4 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-md hover:scale-105"
            >
              See Trip Details
              <span className="ml-2">→</span>
            </Link>
          )}
        </div>
      </div>
    </CardWrapper>
  )
}

export default EnhancedTripCard 