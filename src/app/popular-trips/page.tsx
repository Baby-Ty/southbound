'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EnhancedTripCard, HowItWorksTeaser, StickyMobileCTA, TripDetailsModal, PrelaunchModal } from '@/components';
import { Metadata } from 'next';

// Static trip data for Popular Trips
const staticTrips = [
  {
    _id: 'mexico-playa-del-carmen',
    title: 'Mayan Coast Workation',
    slug: { current: 'mayan-coast-workation', _type: 'slug' as const },
    heroImage: {
      _type: 'image',
      asset: { _ref: 'playa-del-carmen-ref', _type: 'reference' },
      alt: 'Beautiful Playa del Carmen beach with turquoise waters'
    },
    destination: 'Playa del Carmen, Mexico',
    duration: '60 Days',
    description: 'Work from the Riviera Maya with a fun international community. Coworking hubs, tropical beaches and weekend trips to cenotes & ancient ruins.',
    price: 22000,
    currency: 'ZAR',
    category: 'popular' as const,
    featured: true,
    publishedAt: '2024-11-01',
    imageUrl: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=60'
  },
  {
    _id: 'argentina-buenos-aires',
    title: 'Port City Cowork & Tango',
    slug: { current: 'port-city-cowork-tango', _type: 'slug' },
    heroImage: {
      _type: 'image',
      asset: { _ref: 'buenos-aires-ref', _type: 'reference' },
      alt: 'Colorful buildings in Buenos Aires with European architecture'
    },
    destination: 'Buenos Aires, Argentina',
    duration: '60 Days',
    description: 'Europe meets Latin America: cosmopolitan cafés, tango clubs and leafy parks. Affordable living and good public transport make it easy to focus on work and play.',
    price: 18000,
    currency: 'ZAR',
    category: 'popular' as const,
    featured: false,
    publishedAt: '2024-12-01',
    imageUrl: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=800&q=60'
  },
  {
    _id: 'ecuador-cuenca',
    title: 'Andean Quietude & Work',
    slug: { current: 'andean-quietude-work', _type: 'slug' },
    heroImage: {
      _type: 'image',
      asset: { _ref: 'cuenca-ref', _type: 'reference' },
      alt: 'Colonial architecture and cobblestone streets in Cuenca'
    },
    destination: 'Cuenca, Ecuador',
    duration: '45 Days',
    description: 'Nestled in the Andes, Cuenca offers a safe, walkable city with UNESCO‑listed architecture and tranquil parks. Affordable living means more budget for Spanish lessons and mountain hikes.',
    price: 15000,
    currency: 'ZAR',
    category: 'popular' as const,
    featured: false,
    publishedAt: '2026-01-01',
    imageUrl: 'https://images.unsplash.com/photo-1543352634-8730b1ac87f7?auto=format&fit=crop&w=800&q=60'
  },
  {
    _id: 'indonesia-canggu-bali',
    title: 'Bali Beach & Balance',
    slug: { current: 'bali-beach-balance', _type: 'slug' },
    heroImage: {
      _type: 'image',
      asset: { _ref: 'canggu-bali-ref', _type: 'reference' },
      alt: 'Rice paddies and black sand beaches in Canggu, Bali'
    },
    destination: 'Canggu, Bali',
    duration: '60 Days',
    description: 'Live among rice paddies and black‑sand beaches. Canggu offers world‑class coworking, a huge international food scene and a vibrant nomad community.',
    price: 20000,
    currency: 'ZAR',
    category: 'popular' as const,
    featured: true,
    publishedAt: '2026-02-01',
    imageUrl: 'https://images.unsplash.com/photo-1526779259212-939e64788e3c?auto=format&fit=crop&w=800&q=60'
  },
  {
    _id: 'vietnam-da-nang',
    title: 'Vietnamese Coastline Workation',
    slug: { current: 'vietnamese-coastline-workation', _type: 'slug' },
    heroImage: {
      _type: 'image',
      asset: { _ref: 'da-nang-ref', _type: 'reference' },
      alt: 'My Khe Beach and Dragon Bridge in Da Nang, Vietnam'
    },
    destination: 'Da Nang, Vietnam',
    duration: '45 Days',
    description: 'Affordable coastal living with fast WiFi and a quieter pace than Saigon. Cafés double as offices and you\'re minutes from both beach and mountains.',
    price: 13000,
    currency: 'ZAR',
    category: 'popular' as const,
    featured: false,
    publishedAt: '2026-03-15',
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=60'
  },
  {
    _id: 'georgia-tbilisi',
    title: 'Caucasus City & Co‑Lab',
    slug: { current: 'caucasus-city-colab', _type: 'slug' },
    heroImage: {
      _type: 'image',
      asset: { _ref: 'tbilisi-ref', _type: 'reference' },
      alt: 'Historic Tbilisi with colorful balconies and Caucasus mountains'
    },
    destination: 'Tbilisi, Georgia',
    duration: '60 Days',
    description: 'Take advantage of Georgia\'s generous one‑year visa and affordable mobile data. Tbilisi blends historic architecture with rugged nature and an emerging expat community.',
    price: 17000,
    currency: 'ZAR',
    category: 'popular' as const,
    featured: false,
    publishedAt: '2026-04-01',
    imageUrl: 'https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&w=800&q=60'
  }
];

export default function PopularTripsPage() {
  const [selectedTrip, setSelectedTrip] = useState<typeof staticTrips[0] | null>(null);
  const [prelaunchOpen, setPrelaunchOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<'all' | 'featured' | 'budget'>('all');

  const handleTripClick = (trip: typeof staticTrips[0]) => {
    setSelectedTrip(trip);
  };

  const closeModal = () => {
    setSelectedTrip(null);
  };

  // Filter trips based on selected category
  const filteredTrips = staticTrips.filter(trip => {
    if (filterCategory === 'featured') return trip.featured;
    if (filterCategory === 'budget') return trip.price < 16000;
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

  const destinations = ['Mexico', 'Argentina', 'Bali', 'Vietnam', 'Georgia', 'Ecuador'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-sb-beige-100 via-white to-sb-teal-50">
      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sb-navy-600 via-sb-teal-600 to-sb-orange-500 text-white py-32">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 opacity-20">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
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
              <span className="text-2xl">🌍</span>
              <span className="font-semibold text-lg">Global Remote Work Adventures</span>
              <span className="text-2xl">✨</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-tight">
              Popular{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-white">Trips</span>
                <span className="absolute inset-0 bg-sb-orange-500 rounded-lg transform -skew-x-12 z-0"></span>
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-4xl mx-auto mb-12">
              Work from the world's most inspiring destinations. Hand-picked locations 
              with reliable internet, amazing coworking spaces, and unforgettable experiences.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {destinations.map((destination, index) => (
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4"
              >
                <span className="text-2xl">💻</span>
                <span className="font-medium">World-Class Coworking</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4"
              >
                <span className="text-2xl">🚀</span>
                <span className="font-medium">High-Speed Internet</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.5 }}
                className="flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4"
              >
                <span className="text-2xl">🤝</span>
                <span className="font-medium">24/7 Local Support</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white/70 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-sb-navy-700">
                {filteredTrips.length} Amazing Destinations
              </h2>
              <div className="hidden sm:block w-px h-6 bg-gray-300"></div>
              <p className="text-sm text-sb-navy-600">Starting from R13,000</p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-sb-navy-700 mr-2">Filter by:</span>
              {[
                { key: 'all', label: 'All Trips', emoji: '🌍' },
                { key: 'featured', label: 'Featured', emoji: '⭐' },
                { key: 'budget', label: 'Budget', emoji: '💰' }
              ].map(({ key, label, emoji }) => (
                <button
                  key={key}
                  onClick={() => setFilterCategory(key as any)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    filterCategory === key
                      ? 'bg-sb-orange-500 text-white shadow-md'
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

      {/* Why Choose Section */}
      <section className="py-20 bg-gradient-to-br from-sb-teal-50 to-sb-mint-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-sb-navy-700 mb-6">
              Why Our Popular Trips?
            </h2>
            <p className="text-xl text-sb-navy-600 max-w-3xl mx-auto leading-relaxed">
              These destinations have been tested and loved by hundreds of remote workers
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🎯',
                title: 'Proven Destinations',
                description: 'Each location has been tested with the host by our team and remote work community for internet reliability, safety, and overall experience.',
                color: 'from-sb-orange-100 to-sb-orange-200'
              },
              {
                icon: '🌐',
                title: 'Nomad Communities',
                description: 'Join established remote worker communities with regular meetups, coworking sessions, and networking events.',
                color: 'from-sb-teal-100 to-sb-teal-200'
              },
              {
                icon: '🏆',
                title: 'Best Value',
                description: 'Carefully balanced pricing that includes everything you need for productive remote work and amazing experiences.',
                color: 'from-sb-mint-100 to-sb-mint-200'
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className={`bg-gradient-to-br ${benefit.color} rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:scale-105`}
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-sb-navy-700 mb-4">{benefit.title}</h3>
                <p className="text-sb-navy-600 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-sb-orange-500 via-sb-orange-600 to-sb-orange-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-center items-center gap-4 mb-8">
              <span className="text-4xl">🌟</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Ready for Your Next Adventure?
              </h2>
              <span className="text-4xl">✈️</span>
            </div>
            <p className="text-xl text-orange-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            Trade your usual desk view for a beach, city skyline, or mountain backdrop. Our curated trips keep you productive while you explore new places.
            </p>
            <motion.button
              onClick={() => setPrelaunchOpen(true)}
              className="inline-flex items-center justify-center px-10 py-5 bg-white text-sb-orange-600 font-bold text-xl rounded-full hover:bg-gray-100 transition-colors shadow-xl hover:shadow-2xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="mr-3">🎯</span>
              Start Planning Your Trip
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