import { TripCard as TripCardType } from '@/types/sanity'
import TripCard from './TripCard'

interface TripGridProps {
  trips: TripCardType[]
  title?: string
  emptyMessage?: string
}

const TripGrid = ({ 
  trips, 
  title,
  emptyMessage = "No trips available at the moment." 
}: TripGridProps) => {
  if (trips.length === 0) {
    return (
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          {title && (
            <h2 className="text-3xl font-bold text-gray-900 mb-8">{title}</h2>
          )}
          <div className="bg-gray-50 rounded-lg p-12">
            <div className="text-gray-500 text-lg">{emptyMessage}</div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {title && (
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            {title}
          </h2>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <TripCard key={trip._id} trip={trip} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default TripGrid 