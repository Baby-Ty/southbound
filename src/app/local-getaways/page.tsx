'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EnhancedTripCard, HowItWorksTeaser, StickyMobileCTA, TripDetailsModal, PrelaunchModal } from '@/components';

// Static trip data for Local Getaways (South African & African destinations)
const localTrips = [
  {
    _id: 'cape-town-1',
    title: 'Cape Town Digital Nomad Hub',
    slug: { current: 'cape-town-digital-hub', _type: 'slug' as const },
    heroImage: {
      _type: 'image',
      asset: { _ref: 'cape-town-ref', _type: 'reference' },
      alt: 'Table Mountain and Cape Town city bowl view'
    },
    destination: 'Cape Town, South Africa',
    duration: '14-30 Days',
    description: 'Work from the Mother City with stunning mountain and ocean views. Perfect for local nomads wanting to experience their own backyard differently.',
    price: 15500,
    currency: 'ZAR',
    category: 'local' as const,
    featured: true,
    publishedAt: '2024-01-20',
    imageUrl: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=60'
  },
  {
    _id: 'johannesburg-1',
    title: 'Joburg Innovation District',
    slug: { current: 'johannesburg-innovation', _type: 'slug' as const },
    heroImage: {
      _type: 'image',
      asset: { _ref: 'joburg-ref', _type: 'reference' },
      alt: 'Johannesburg skyline and business district'
    },
    destination: 'Johannesburg, South Africa',
    duration: '7-21 Days',
    description: 'Tap into Africa\'s financial capital. Work from trendy Maboneng, explore Soweto, and network with the continent\'s top entrepreneurs.',
    price: 12800,
    currency: 'ZAR',
    category: 'local' as const,
    featured: true,
    publishedAt: '2024-01-18',
    imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=60'
  },
  {
    _id: 'durban-1',
    title: 'Durban Beachfront Co-working',
    slug: { current: 'durban-beachfront', _type: 'slug' as const },
    heroImage: {
      _type: 'image',
      asset: { _ref: 'durban-ref', _type: 'reference' },
      alt: 'Durban golden mile and beachfront'
    },
    destination: 'Durban, South Africa',
    duration: '10-28 Days',
    description: 'Work with ocean views along the Golden Mile. Enjoy perfect weather year-round, incredible curry, and vibrant Indian Ocean culture.',
    price: 11200,
    currency: 'ZAR',
    category: 'local' as const,
    featured: false,
    publishedAt: '2024-01-16',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=60'
  },
  {
    _id: 'stellenbosch-1',
    title: 'Stellenbosch Wine & Work',
    slug: { current: 'stellenbosch-wine-work', _type: 'slug' as const },
    heroImage: {
      _type: 'image',
      asset: { _ref: 'stellenbosch-ref', _type: 'reference' },
      alt: 'Stellenbosch vineyards and mountains'
    },
    destination: 'Stellenbosch, South Africa',
    duration: '5-14 Days',
    description: 'Work from wine country! Beautiful vineyards, mountain views, and excellent WiFi in this charming university town just outside Cape Town.',
    price: 8900,
    currency: 'ZAR',
    category: 'local' as const,
    featured: false,
    publishedAt: '2024-01-14',
    imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=60'
  },
  {
    _id: 'hermanus-1',
    title: 'Hermanus Whale Coast Retreat',
    slug: { current: 'hermanus-whale-coast', _type: 'slug' as const },
    heroImage: {
      _type: 'image',
      asset: { _ref: 'hermanus-ref', _type: 'reference' },
      alt: 'Hermanus coastal cliffs and whale watching'
    },
    destination: 'Hermanus, South Africa',
    duration: '3-10 Days',
    description: 'Work from the world\'s best land-based whale watching destination. Peaceful coastal town perfect for focused work and nature breaks.',
    price: 7500,
    currency: 'ZAR',
    category: 'local' as const,
    featured: false,
    publishedAt: '2024-01-12',
    imageUrl: 'https://images.unsplash.com/photo-1517954943531-1ba7b6eb5bb1?auto=format&fit=crop&w=800&q=60'
  },
  {
    _id: 'mozambique-1',
    title: 'Maputo Modern Africa',
    slug: { current: 'maputo-modern-africa', _type: 'slug' as const },
    heroImage: {
      _type: 'image',
      asset: { _ref: 'maputo-ref', _type: 'reference' },
      alt: 'Maputo city and modern architecture'
    },
    destination: 'Maputo, Mozambique',
    duration: '7-21 Days',
    description: 'Experience Portuguese-African culture in this vibrant coastal capital. Great seafood, beautiful beaches, and emerging tech scene.',
    price: 13500,
    currency: 'ZAR',
    category: 'local' as const,
    featured: true,
    publishedAt: '2024-01-10',
    imageUrl: 'https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&w=800&q=60'
  }
];

export default function LocalGetawaysPage() {
  const [selectedTrip, setSelectedTrip] = useState<typeof localTrips[0] | null>(null);
  const [prelaunchOpen, setPrelaunchOpen] = useState(false);
  const [filterLocation, setFilterLocation] = useState<'all' | 'sa' | 'regional'>('all');

  const handleTripClick = (trip: typeof localTrips[0]) => {
    setSelectedTrip(trip);
  };

  const closeModal = () => {
    setSelectedTrip(null);
  };

  // Filter trips based on location
  const filteredTrips = localTrips.filter(trip => {
    if (filterLocation === 'sa') return trip.destination.includes('South Africa');
    if (filterLocation === 'regional') return !trip.destination.includes('South Africa');
    return true;
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const saDestinations = ['Cape Town', 'Johannesburg', 'Durban', 'Stellenbosch', 'Hermanus'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sb-mint-50 via-white to-sb-beige-100">
      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sb-mint-500 via-sb-teal-600 to-sb-navy-600 text-white py-32">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 opacity-30">
            {/* South African flag colors floating elements */}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-3 h-3 rounded-full ${
                  i % 4 === 0 ? 'bg-green-400' : 
                  i % 4 === 1 ? 'bg-blue-400' : 
                  i % 4 === 2 ? 'bg-red-400' : 'bg-yellow-400'
                }`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  x: [0, 10, 0],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                }}
              />
            ))}
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
              <span className="text-2xl">🇿🇦</span>
              <span className="font-semibold text-lg">Discover South Africa</span>
              <span className="text-2xl">💎</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight">
              Local{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-white">Getaways</span>
                <span className="absolute inset-0 bg-sb-orange-500 rounded-lg transform -skew-x-12 z-0"></span>
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-4xl mx-auto mb-12">
              Explore South Africa's hidden remote work gems and nearby African destinations. 
              No visa hassles, same timezone, incredible value.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {saDestinations.map((destination, index) => (
                <motion.div
                  key={destination}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + (index * 0.1), duration: 0.3 }}
                  className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium"
                >
                  {destination}
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4"
              >
                <span className="text-2xl">🚗</span>
                <span className="font-medium">Easy Travel</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4"
              >
                <span className="text-2xl">💰</span>
                <span className="font-medium">Budget Friendly</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.5 }}
                className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4"
              >
                <span className="text-2xl">🌟</span>
                <span className="font-medium">Hidden Gems</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Local Advantages Section */}
      <section className="py-16 bg-white/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-sb-navy-700 mb-6">
              Why Go Local First?
            </h2>
            <p className="text-xl text-sb-navy-600 max-w-3xl mx-auto leading-relaxed">
              Master remote work travel close to home before venturing overseas
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: '⏰',
                title: 'Quick Escapes',
                description: 'Short flights or drives mean long weekends become mini workations',
                color: 'from-sb-mint-100 to-sb-mint-200'
              },
              {
                icon: '🏠',
                title: 'Familiar Territory',
                description: 'Same language, currency, and culture - focus on work, not logistics',
                color: 'from-sb-teal-100 to-sb-teal-200'
              },
              {
                icon: '📱',
                title: 'Same Timezone',
                description: 'No jet lag, easy client calls, perfect work-life balance',
                color: 'from-sb-orange-100 to-sb-orange-200'
              },
              {
                icon: '💎',
                title: 'Hidden Treasures',
                description: 'Discover incredible places in your own backyard',
                color: 'from-sb-beige-200 to-sb-beige-300'
              }
            ].map((advantage, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className={`bg-gradient-to-br ${advantage.color} rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-105`}
              >
                <div className="text-4xl mb-4">{advantage.icon}</div>
                <h3 className="text-lg font-bold text-sb-navy-700 mb-3">{advantage.title}</h3>
                <p className="text-sb-navy-600 text-sm leading-relaxed">{advantage.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-sb-navy-700">
                {filteredTrips.length} Local Destinations
              </h2>
              <div className="hidden sm:block w-px h-6 bg-gray-300"></div>
              <p className="text-sm text-sb-navy-600">Starting from R7,500</p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-sb-navy-700 mr-2">Filter by:</span>
              {[
                { key: 'all', label: 'All Local', emoji: '🌍' },
                { key: 'sa', label: 'South Africa', emoji: '🇿🇦' },
                { key: 'regional', label: 'Nearby', emoji: '🌍' }
              ].map(({ key, label, emoji }) => (
                <button
                  key={key}
                  onClick={() => setFilterLocation(key as any)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    filterLocation === key
                      ? 'bg-sb-mint-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span>{emoji}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trip Cards Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredTrips.map((trip) => (
              <motion.div key={trip._id} variants={itemVariants}>
                <EnhancedTripCard 
                  trip={trip} 
                  onClick={() => handleTripClick(trip)}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Local Benefits Showcase */}
      <section className="py-20 bg-gradient-to-br from-sb-mint-50 to-sb-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-sb-navy-700 mb-8">
                Start Your Remote Work Journey at Home
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-sb-mint-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">🎯</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-sb-navy-700 mb-2">Perfect Practice Ground</h3>
                    <p className="text-sb-navy-600 leading-relaxed">Test your remote work setup and routines in familiar territory before international adventures.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-sb-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">💡</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-sb-navy-700 mb-2">Local Insights</h3>
                    <p className="text-sb-navy-600 leading-relaxed">Discover incredible co-working spaces, reliable internet, and hidden productive spots in South Africa.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-sb-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">🌟</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-sb-navy-700 mb-2">Rediscover Home</h3>
                    <p className="text-sb-navy-600 leading-relaxed">See familiar places with fresh eyes and appreciate the incredible diversity in your own country.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="text-3xl mb-3">🏔️</div>
                  <h4 className="font-semibold text-sb-navy-700 mb-2">Mountain Views</h4>
                  <p className="text-sm text-sb-navy-600">Drakensberg, Table Mountain, Magaliesberg</p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="text-3xl mb-3">🍷</div>
                  <h4 className="font-semibold text-sb-navy-700 mb-2">Wine Country</h4>
                  <p className="text-sm text-sb-navy-600">Stellenbosch, Franschhoek, Robertson</p>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="text-3xl mb-3">🏖️</div>
                  <h4 className="font-semibold text-sb-navy-700 mb-2">Coastal Vibes</h4>
                  <p className="text-sm text-sb-navy-600">Hermanus, Plettenberg Bay, Durban</p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="text-3xl mb-3">🏙️</div>
                  <h4 className="font-semibold text-sb-navy-700 mb-2">Urban Energy</h4>
                  <p className="text-sm text-sb-navy-600">Cape Town, Johannesburg, Pretoria</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-sb-mint-500 via-sb-teal-500 to-sb-mint-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-center items-center gap-4 mb-8">
              <span className="text-4xl">🇿🇦</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Explore Your Backyard
              </h2>
              <span className="text-4xl">💎</span>
            </div>
            <p className="text-xl text-mint-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              Start your remote work adventure right here at home. Perfect your setup, 
              discover incredible places, and gain confidence for bigger adventures ahead.
            </p>
            <motion.button
              onClick={() => setPrelaunchOpen(true)}
              className="inline-flex items-center justify-center px-10 py-5 bg-white text-sb-mint-600 font-bold text-xl rounded-full hover:bg-gray-100 transition-colors shadow-xl hover:shadow-2xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="mr-3">🎯</span>
              Plan Your Local Adventure
              <svg className="ml-3 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* How It Works Teaser */}
      <HowItWorksTeaser />

      {/* Sticky Mobile CTA */}
      <StickyMobileCTA />

      {/* Trip Details Modal */}
      {selectedTrip && (
        <TripDetailsModal
          isOpen={!!selectedTrip}
          onClose={closeModal}
          trip={selectedTrip}
        />
      )}

      {/* Prelaunch Modal */}
      {prelaunchOpen && (
        <PrelaunchModal isOpen={prelaunchOpen} onClose={() => setPrelaunchOpen(false)} />
      )}
    </div>
  )
} 