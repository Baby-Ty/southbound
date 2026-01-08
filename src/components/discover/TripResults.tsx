'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import { RegionKey, CITY_PRESETS } from '@/lib/cityPresets';
import { TripTemplate, TRIP_TEMPLATES } from '@/lib/tripTemplates';
import { VibeKey, VIBE_TAG_MAP } from './VibeSelector';

interface TripResultsProps {
  selectedRegions: RegionKey[];
  selectedVibes: VibeKey[];
}

export default function TripResults({ selectedRegions, selectedVibes }: TripResultsProps) {
  const [matchedTrips, setMatchedTrips] = useState<TripTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function filterTrips() {
      setLoading(true);
      
      // Gather all templates from selected regions
      const allTemplates: TripTemplate[] = [];
      for (const region of selectedRegions) {
        const templates = TRIP_TEMPLATES[region] || [];
        allTemplates.push(...templates);
      }

      // Filter by vibes
      const filtered = allTemplates.filter((template) => {
        // Check if any selected vibe matches the template tags
        return selectedVibes.some((vibe) => {
          const vibeTags = VIBE_TAG_MAP[vibe];
          
          // Check if template tags match any vibe tags
          return vibeTags.some((tag) => template.tags.includes(tag));
        });
      });

      setMatchedTrips(filtered);
      setLoading(false);
      // Reset selection when filters change
      setSelectedTripId(null);
    }

    filterTrips();
  }, [selectedRegions, selectedVibes]);

  // Reorder trips: selected trip goes to top
  const orderedTrips = selectedTripId
    ? [
        ...matchedTrips.filter(t => t.id === selectedTripId),
        ...matchedTrips.filter(t => t.id !== selectedTripId)
      ]
    : matchedTrips;

  const handleTripClick = (tripId: string) => {
    if (selectedTripId === tripId) {
      // Clicking the same trip collapses it
      setSelectedTripId(null);
    } else {
      // Selecting a new trip
      setSelectedTripId(tripId);
      // Scroll to top of cards container smoothly
      setTimeout(() => {
        cardsContainerRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }, 100);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const TripCard = ({ 
    trip, 
    isTopMatch, 
    isExpanded,
    onClick 
  }: { 
    trip: TripTemplate; 
    isTopMatch?: boolean;
    isExpanded?: boolean;
    onClick: () => void;
  }) => {
    const [isHovered, setIsHovered] = useState(false);
    const regionPresets = CITY_PRESETS[trip.region] || [];
    const cityFlags = trip.presetCities
      .map((cityName) => regionPresets.find((p) => p.city === cityName)?.flag)
      .filter(Boolean)
      .slice(0, 3);

    return (
      <motion.div
        layoutId={trip.id}
        variants={itemVariants}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
        tabIndex={0}
        role="button"
        aria-expanded={isExpanded}
        aria-label={`${trip.name} - Click to ${isExpanded ? 'collapse' : 'expand'} details`}
        whileHover={!isExpanded ? { y: -4, scale: 1.01 } : {}}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`relative flex flex-col bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 shadow-lg hover:shadow-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-sb-orange-500 focus:ring-offset-2 ${
          isTopMatch ? 'md:col-span-2 lg:col-span-3' : ''
        }`}
      >
        {/* Top Match Badge */}
        {isTopMatch && !isExpanded && (
          <div className="absolute top-2 left-2 md:top-4 md:left-4 z-20 bg-sb-orange-500 text-white px-2 py-1 md:px-4 md:py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-1 md:gap-2">
            <span className="text-xs md:text-base">⭐</span> 
            <span className="hidden xs:inline">Top Match</span>
            <span className="xs:hidden">Top</span>
          </div>
        )}

        {/* Close Button (when expanded) */}
        {isExpanded && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="absolute top-4 right-4 z-30 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
            aria-label="Close"
          >
            <span className="text-sb-navy-700 text-xl">×</span>
          </button>
        )}

        <div className={`relative ${isTopMatch ? 'aspect-[16/9] md:aspect-[2.5/1]' : 'aspect-[1.2/1]'} w-full overflow-hidden`}>
          <Image
            src={trip.imageUrl}
            alt={trip.name}
            fill
            sizes={isTopMatch ? '100vw' : '(max-width: 768px) 100vw, 33vw'}
            className={`object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 w-full p-6 z-10 text-white">
            <div className="flex items-center gap-2 mb-3">
              {cityFlags.map((flag, idx) => (
                <span key={idx} className="text-2xl filter drop-shadow-sm">
                  {flag}
                </span>
              ))}
              {trip.presetCities.length > 3 && (
                <span className="text-xs font-bold text-white/80 bg-white/10 px-2 py-1 rounded-md">
                  +{trip.presetCities.length - 3}
                </span>
              )}
            </div>

            <h3 className={`font-extrabold tracking-tight drop-shadow-md leading-tight mb-2 ${
              isTopMatch ? 'text-3xl md:text-4xl' : 'text-xl'
            }`}>
              {trip.name}
            </h3>
            
            <p className={`text-white/90 font-medium leading-relaxed line-clamp-2 ${
              isTopMatch ? 'text-base md:text-lg mb-4' : 'text-sm mb-3'
            }`}>
              {trip.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {trip.tags.slice(0, isTopMatch ? 4 : 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-wider rounded-lg border border-white/10"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Duration */}
            <div className="mt-3 text-sm text-white/80 font-medium">
              {trip.presetCities.length} months • One month per city
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence mode="wait">
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="px-6 pb-6 pt-4 space-y-6"
            >
            {/* Divider */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-sb-navy-200 to-transparent" />

            {/* Story */}
            <div>
              <h4 className="text-lg font-bold text-sb-navy-900 mb-3">The Journey</h4>
              <p className="text-sb-navy-600 leading-relaxed text-base">
                {trip.story}
              </p>
            </div>

            {/* Route */}
            <div>
              <h4 className="text-sm font-semibold text-sb-navy-500 uppercase tracking-wider mb-3">Route</h4>
              <div className="flex flex-wrap items-center gap-2">
                {trip.presetCities.map((city, idx) => (
                  <div key={city} className="flex items-center gap-2">
                    <div className="px-4 py-2 bg-sb-beige-100 rounded-lg text-sb-navy-900 font-medium text-sm flex items-center gap-2">
                      <span>{cityFlags[idx]}</span>
                      <span>{city}</span>
                    </div>
                    {idx < trip.presetCities.length - 1 && (
                      <span className="text-sb-navy-300 text-xl">→</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Scroll to lead capture form
                  const formElement = document.getElementById('lead-capture-form');
                  if (formElement) {
                    formElement.scrollIntoView({ 
                      behavior: 'smooth', 
                      block: 'start' 
                    });
                    // Focus the name input after scroll
                    setTimeout(() => {
                      const nameInput = document.getElementById('name');
                      nameInput?.focus();
                    }, 500);
                  }
                }}
                className="w-full md:w-auto px-8 py-3 bg-sb-orange-500 hover:bg-sb-orange-600 text-white font-semibold rounded-full transition-all hover:scale-105 shadow-medium"
              >
                Use this as a starting point
              </button>
            </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-sb-orange-500" />
      </div>
    );
  }

  if (matchedTrips.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="text-6xl mb-4">🤔</div>
        <h3 className="text-2xl font-bold text-sb-navy-900 mb-2">No matches yet</h3>
        <p className="text-sb-navy-600">
          Try selecting different vibes or regions to see more trip options
        </p>
      </motion.div>
    );
  }

  const topMatch = orderedTrips[0];
  const otherTrips = orderedTrips.slice(1, 7); // Show up to 6 more trips

  return (
    <div className="space-y-8 w-full">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sb-orange-50 text-sb-orange-600 text-sm font-semibold border border-sb-orange-100">
          <span>🗺️</span>
          <span>{matchedTrips.length} {matchedTrips.length === 1 ? 'route' : 'routes'} found</span>
        </div>
        
        <h3 className="text-3xl sm:text-4xl font-extrabold text-sb-navy-900 tracking-tight">
          Popular Remote Work Routes
        </h3>
        
        <p className="text-base sm:text-lg text-sb-navy-500 max-w-2xl mx-auto leading-relaxed">
          These are well-loved remote work routes based on how people usually travel. They're just starting points—you'll customise the countries, cities, and activities to fit your lifestyle.
        </p>
      </motion.div>

      {/* Trip Cards */}
      <motion.div
        ref={cardsContainerRef}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Top Match - Full Width */}
        <TripCard 
          trip={topMatch} 
          isTopMatch={true}
          isExpanded={selectedTripId === topMatch.id}
          onClick={() => handleTripClick(topMatch.id)}
        />

        {/* Other Matches - Grid */}
        {otherTrips.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherTrips.map((trip) => (
              <TripCard 
                key={trip.id} 
                trip={trip}
                isExpanded={false}
                onClick={() => handleTripClick(trip.id)}
              />
            ))}
          </div>
        )}

        {matchedTrips.length > 7 && (
          <motion.div variants={itemVariants} className="text-center text-sb-navy-500 font-medium">
            + {matchedTrips.length - 7} more {matchedTrips.length - 7 === 1 ? 'trip' : 'trips'} available
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
