'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { TripCard } from '@/types/sanity';
import { urlFor } from '@/lib/sanity';
import { mockTrips } from '@/lib/mockData';
import TripDetailsModal from './TripDetailsModal';

interface DestinationsSectionProps {
  trips: TripCard[];
}

const DestinationsSection: React.FC<DestinationsSectionProps> = ({ trips }) => {
  const [selectedDestination, setSelectedDestination] = useState<{
    name: string;
    imageUrl: string;
  } | null>(null);
  const [imageErrorMap, setImageErrorMap] = useState<Record<string, boolean>>({});

  // Ensure we have at least 4 items by merging mockTrips if needed
  const sourceTrips: TripCard[] = trips.length >= 4 ? trips : [...trips, ...mockTrips];

  // Group trips by destination to show unique destinations
  const uniqueDestinations = sourceTrips.reduce((acc, trip) => {
    if (!acc.find(item => item.destination === trip.destination)) {
      acc.push(trip);
    }
    return acc;
  }, [] as TripCard[]);

  // Take first 4 destinations for the grid, but try to ensure Medellín appears if available
  const medellinTrip = uniqueDestinations.find(t => /medell[ií]n/i.test(t.destination));
  let featuredDestinations = uniqueDestinations.slice(0, 4);
  if (medellinTrip && !featuredDestinations.some(t => t._id === medellinTrip._id)) {
    if (featuredDestinations.length < 4) {
      featuredDestinations = [...featuredDestinations, medellinTrip];
    } else if (featuredDestinations.length > 0) {
      featuredDestinations = [...featuredDestinations.slice(0, 3), medellinTrip];
    }
  }

  // Badge colors for different destinations
  const badgeColors = [
    'bg-[#FFB3A7]', // Soft coral
    'bg-sb-mint-300', // Mint green
    'bg-sb-orange-300', // Sunset orange
    'bg-sb-teal-300', // Soft teal
    'bg-purple-300', // Light purple
    'bg-yellow-300', // Light yellow
  ];

  const handleDestinationClick = (destination: string, imageUrl: string) => {
    setSelectedDestination({ name: destination, imageUrl });
  };

  const closeModal = () => {
    setSelectedDestination(null);
  };

  return (
    <>
      <section id="places-youll-see" className="py-20 px-4 sm:px-6 lg:px-8 bg-sb-teal-300">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column - Text Content */}
            <div className="lg:col-span-4 space-y-8">
              {/* Main Heading */}
              <div className="space-y-4">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-sb-navy-700 leading-tight">
                  PLACES<br />
                  YOU'LL SEE
                </h2>
                <div className="w-24 h-1 bg-sb-orange-500 rounded-full"></div>
              </div>
              
              {/* Description with Icons */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl flex-shrink-0 mt-1">🏙️</div>
                  <div>
                    <h3 className="text-xl font-bold text-sb-navy-700 mb-2">Vibrant Cities</h3>
                    <p className="text-base text-sb-navy-600 leading-relaxed">
                      Explore bustling streets and cultural hubs from Mexico City's energetic neighborhoods to Medellín's innovation districts.
                    </p>
                  </div>
                </div>

                <div className="border-t border-sb-navy-300 my-4"></div>

                <div className="flex items-start gap-4">
                  <div className="text-3xl flex-shrink-0 mt-1">🏖️</div>
                  <div>
                    <h3 className="text-xl font-bold text-sb-navy-700 mb-2">Sunlit Beaches</h3>
                    <p className="text-base text-sb-navy-600 leading-relaxed">
                      Work with ocean views in Playa del Carmen, Canggu, or discover hidden gems along Brazil's coastline.
                    </p>
                  </div>
                </div>

                <div className="border-t border-sb-navy-300 my-4"></div>

                <div className="flex items-start gap-4">
                  <div className="text-3xl flex-shrink-0 mt-1">🏔️</div>
                  <div>
                    <h3 className="text-xl font-bold text-sb-navy-700 mb-2">Mountain Escapes</h3>
                    <p className="text-base text-sb-navy-600 leading-relaxed">
                      Find inspiration in Tbilisi's ancient charm or Chiang Mai's peaceful mountain vibes, perfect for focused work sessions.
                    </p>
                  </div>
                </div>

                <div className="border-t border-sb-navy-300 my-4"></div>

                <div className="pt-4">
                  <p className="text-lg text-sb-navy-700 font-medium flex items-center gap-2">
                    <span>✈️</span>
                    Destinations chosen to keep you inspired, productive, and exploring
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Destinations Grid */}
            <div className="lg:col-span-8">
              {featuredDestinations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {featuredDestinations.map((trip, index) => {
                    // Prefer explicit imageUrl, else Sanity heroImage, else fallback
                    let imageUrl = trip.imageUrl || '';
                    if (!imageUrl) {
                      if (trip.heroImage && (trip.heroImage as any).asset?._ref?.startsWith('image-')) {
                        try {
                          imageUrl = urlFor(trip.heroImage).width(800).height(640).url();
                        } catch {}
                      }
                    }
                    if (!imageUrl) {
                      imageUrl = `https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=60`;
                    }

                    if (imageErrorMap[trip._id]) {
                      imageUrl = `https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=60`;
                    }

                    return (
                      <button
                        key={trip._id}
                        onClick={() => handleDestinationClick(trip.destination, imageUrl)}
                        className="group relative h-80 rounded-2xl overflow-hidden shadow-soft hover:shadow-large transition-all duration-300 hover:scale-[1.03] text-left w-full"
                      >
                        <Image
                          src={imageUrl}
                          alt={trip.heroImage?.alt || trip.destination}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                          onError={() => setImageErrorMap(prev => ({ ...prev, [trip._id]: true }))}
                        />
                        
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-70 transition-opacity duration-300"></div>
                        
                        {/* Location Badge - Top Left */}
                        <div className="absolute top-4 left-4">
                          <div className="bg-white/95 backdrop-blur-sm text-sb-navy-700 px-3 py-1.5 rounded-full text-sm font-semibold shadow-medium">
                            {trip.destination}
                          </div>
                        </div>

                        {/* Status Badge - Top Right */}
                        <div className="absolute top-4 right-4">
                          <div className={`${badgeColors[index % badgeColors.length]} text-sb-navy-700 px-3 py-1.5 rounded-full text-xs font-medium shadow-soft`}>
                            View Details
                          </div>
                        </div>

                        {/* Hover Arrow Indicator */}
                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                // Fallback when no destinations are available
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Mock destination cards for demo */}
                    {[
                    { name: 'Mexico', image: 'https://images.unsplash.com/photo-1543352634-8730b1ac87f7?auto=format&fit=crop&w=800&q=60' },
                    { name: 'Bali', image: 'https://images.unsplash.com/photo-1526779259212-939e64788e3c?auto=format&fit=crop&w=800&q=60' },
                    { name: 'Thailand', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=60' },
                    { name: 'Brazil', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=60' }
                  ].map((destination, index) => {
                    return (
                      <button
                        key={destination.name}
                        onClick={() => handleDestinationClick(destination.name, destination.image)}
                        className="group relative h-80 rounded-2xl overflow-hidden shadow-soft hover:shadow-large transition-all duration-300 hover:scale-[1.03] cursor-pointer text-left w-full"
                      >
                        <Image
                          src={destination.image}
                          alt={destination.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                        />
                        
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-70 transition-opacity duration-300"></div>
                        
                        {/* Location Badge - Top Left */}
                        <div className="absolute top-4 left-4">
                          <div className="bg-white/95 backdrop-blur-sm text-sb-navy-700 px-3 py-1.5 rounded-full text-sm font-semibold shadow-medium">
                            {destination.name}
                          </div>
                        </div>

                        {/* Status Badge - Top Right */}
                        <div className="absolute top-4 right-4">
                          <div className={`${badgeColors[index % badgeColors.length]} text-sb-navy-700 px-3 py-1.5 rounded-full text-xs font-medium shadow-soft`}>
                            View Details
                          </div>
                        </div>

                        {/* Hover Arrow Indicator */}
                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
              
              {/* View All Destinations Button */}
              <div className="mt-12 text-center border-t border-sb-navy-300 pt-8">
                <Link
                  href="/popular-trips"
                  className="inline-flex items-center px-8 py-4 bg-sb-orange-500 hover:bg-sb-orange-600 text-white font-semibold rounded-full transition-all duration-300 shadow-medium hover:shadow-large hover:scale-105"
                >
                  <span>🗺️</span>
                  <span className="ml-2">View Popular Destinations</span>
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trip Details Modal */}
      {selectedDestination && (
        <TripDetailsModal
          isOpen={!!selectedDestination}
          onClose={closeModal}
          destination={selectedDestination.name}
          imageUrl={selectedDestination.imageUrl}
        />
      )}
    </>
  );
};

export default DestinationsSection; 
