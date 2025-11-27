'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { TripCard } from '@/types/sanity';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { digitalNomadHubs, featuredJourneys, defaultFeaturedJourney, FeaturedJourney } from '@/lib/digitalNomadHubs';
import { DestinationPin } from './Globe3D';

// Dynamically import Globe3D to avoid SSR issues with Three.js
const Globe3D = dynamic(() => import('./Globe3D'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0a1628] to-[#1e3a5f] rounded-2xl animate-pulse">
      <div className="text-white text-center">
        <div className="w-24 h-24 rounded-full border-4 border-white/10 border-t-sb-orange-500 animate-spin mx-auto mb-6"></div>
        <p className="text-lg font-medium tracking-widest text-white/70 uppercase">Loading Globe...</p>
      </div>
    </div>
  )
});

interface DestinationsSectionProps {
  trips: TripCard[];
}

const DestinationsSection: React.FC<DestinationsSectionProps> = () => {
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [currentJourney, setCurrentJourney] = useState<FeaturedJourney>(defaultFeaturedJourney);

  const handlePinClick = (destination: DestinationPin) => {
    setSelectedDestination(destination.id);
    const journey = featuredJourneys[destination.id] || defaultFeaturedJourney;
    setCurrentJourney(journey);
  };

  return (
    <section
      id="places-youll-see"
      className="relative isolate py-12 md:py-16 px-4 sm:px-6 lg:px-8 min-h-[600px] md:min-h-[700px] lg:min-h-[800px] flex items-center overflow-hidden"
    >
      <div className="absolute inset-0 -z-30 bg-[#03070f]" />
      <div
        className="absolute inset-0 -z-20"
        style={{
          background: 'radial-gradient(140% 165% at 18% 12%, #172a4b 0%, #0f1c34 40%, #071223 72%, #040914 100%)',
          filter: 'saturate(110%)'
        }}
      />
      <div
        className="absolute inset-0 -z-10 opacity-80 mix-blend-screen"
        style={{
          backgroundImage: 'radial-gradient(68% 58% at 80% 18%, rgba(74, 189, 198, 0.32) 0%, rgba(74, 189, 198, 0) 70%), radial-gradient(74% 60% at 22% 82%, rgba(255, 160, 105, 0.28) 0%, rgba(255, 160, 105, 0) 78%)',
          backgroundPosition: '80% 20%, 18% 82%',
          backgroundRepeat: 'no-repeat, no-repeat'
        }}
      />

      <div className="max-w-[1400px] mx-auto w-full relative z-10 text-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
          {/* Left Column - Interactive Globe */}
          <div className="space-y-4 order-2 lg:order-1">
            {/* Globe Header */}
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                EXPLORE THE GLOBE
              </h2>
              <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-lg">
                Drag to spin the world and tap a glowing pin to preview a journey.
              </p>
            </div>
              
            {/* 3D Globe */}
            <div className="w-full h-[350px] sm:h-[450px] lg:h-[420px] xl:h-[480px]">
              <Globe3D
                destinations={digitalNomadHubs}
                onPinClick={handlePinClick}
                selectedDestination={selectedDestination}
              />
            </div>

            {/* Country Selector Buttons */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <p className="text-white/70 text-xs text-center mb-3">Select a destination:</p>
              <div className="grid grid-cols-5 gap-2">
                {digitalNomadHubs.slice(0, 10).map((hub) => {
                  const countryFlags: Record<string, string> = {
                    'Portugal': '🇵🇹',
                    'Colombia': '🇨🇴',
                    'Thailand': '🇹🇭',
                    'Indonesia': '🇮🇩',
                    'South Africa': '🇿🇦',
                    'Mexico': '🇲🇽',
                    'Georgia': '🇬🇪',
                    'Argentina': '🇦🇷'
                  };
                  
                  return (
                    <button
                      key={hub.id}
                      onClick={() => handlePinClick(hub)}
                      className={`
                        p-2.5 rounded-lg transition-all duration-300 text-2xl
                        ${selectedDestination === hub.id 
                          ? 'bg-sb-orange-500 scale-110 shadow-lg' 
                          : 'bg-white/10 hover:bg-white/20 hover:scale-105'
                        }
                      `}
                      title={hub.name}
                    >
                      {countryFlags[hub.country] || '📍'}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Featured Journey Details */}
          <div className="space-y-4 order-1 lg:order-2 relative min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentJourney.destination}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-4"
              >
                {/* Journey Badge */}
                <div className="inline-block">
                  <div className="bg-sb-orange-500/20 text-sb-orange-300 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm border border-sb-orange-500/30 uppercase tracking-wide">
                    FEATURED JOURNEY
                  </div>
                </div>

                {/* Journey Image */}
                <div className="relative h-56 sm:h-64 lg:h-56 xl:h-64 rounded-2xl overflow-hidden shadow-2xl group">
                  <Image
                    src={currentJourney.imageUrl}
                    alt={currentJourney.destination}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Location Badge */}
                  <div className="absolute top-6 left-6">
                    <div className="bg-white/95 backdrop-blur-sm text-sb-navy-700 px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      {currentJourney.destination}
                    </div>
                  </div>
                </div>

                {/* Journey Details */}
                <div className="space-y-3">
                  <h3 className="text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-bold text-white leading-tight">
                    {currentJourney.title}
                  </h3>
                  <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                    {currentJourney.description}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-2 pt-2">
                    {currentJourney.highlights.map((highlight, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                        className="flex items-center gap-2.5 text-white/90 bg-white/5 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/10 hover:bg-white/10 transition-colors"
                      >
                        <span className="text-base sm:text-lg flex-shrink-0">{highlight.split(' ')[0]}</span>
                        <span className="text-xs sm:text-sm">{highlight.substring(highlight.indexOf(' ') + 1)}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <div className="pt-4">
                    <Link
                      href="/route-builder"
                      className="inline-flex items-center px-5 sm:px-7 py-2.5 sm:py-3 bg-sb-orange-500 hover:bg-sb-orange-600 text-white font-semibold text-sm rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 group"
                    >
                      <span className="text-base sm:text-lg mr-2">🗺️</span>
                      <span className="hidden sm:inline">Plan {currentJourney.destination.split(',')[0]}</span>
                      <span className="sm:hidden">Plan Trip</span>
                      <svg 
                        className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DestinationsSection;
