'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Wifi, Shield, Sun, ArrowRight, MapPin, Zap } from 'lucide-react';

const destinations = [
  {
    id: 1,
    name: 'Bali, Indonesia',
    tag: 'Tropical Coworking',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    price: 'R25,000/mo',
    vibe: 'Chill & Surf',
    stats: {
      internet: '50 Mbps',
      safety: '4.5/5',
      weather: '27°C',
    },
    bestFor: 'Surfing & Cafes'
  },
  {
    id: 2,
    name: 'Lisbon, Portugal',
    tag: 'European Summer',
    image: 'https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&w=800&q=80',
    price: 'R35,000/mo',
    vibe: 'City & Culture',
    stats: {
      internet: '100 Mbps',
      safety: '4.9/5',
      weather: '22°C',
    },
    bestFor: 'History & Nightlife'
  },
  {
    id: 3,
    name: 'Cape Town, SA',
    tag: 'Local Legend',
    image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=800&q=80',
    price: 'R20,000/mo',
    vibe: 'Mountain & Sea',
    stats: {
      internet: '80 Mbps',
      safety: '4.0/5',
      weather: '24°C',
    },
    bestFor: 'Hiking & Wine'
  },
  {
    id: 4,
    name: 'Medellin, Colombia',
    tag: 'Digital Nomad Hub',
    image: 'https://images.unsplash.com/photo-1599553642826-712a364f9623?auto=format&fit=crop&w=800&q=80',
    price: 'R22,000/mo',
    vibe: 'Urban & Green',
    stats: {
      internet: '60 Mbps',
      safety: '4.2/5',
      weather: '25°C',
    },
    bestFor: 'Community & Salsa'
  }
];

const DestinationCard = ({ dest }: { dest: typeof destinations[0] }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group relative h-[480px] w-full overflow-hidden rounded-3xl cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-500"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={dest.image}
          alt={dest.name}
          fill
          className={`object-cover transition-transform duration-700 ${isExpanded ? 'scale-110' : 'scale-100'}`}
        />
        <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500 ${isExpanded ? 'opacity-90' : 'opacity-80'}`} />
      </div>

      {/* Top Badge */}
      <div className="absolute top-6 left-6 z-10">
        <span className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-2">
          <MapPin size={12} />
          {dest.tag}
        </span>
      </div>

      {/* Content Overlay */}
      <div className={`absolute bottom-0 left-0 right-0 p-6 text-white z-10 transform transition-transform duration-500 ease-out ${isExpanded ? 'translate-y-0' : 'translate-y-4'}`}>
        
        <div className="mb-2 overflow-hidden">
          <h3 className="text-3xl font-bold mb-1">{dest.name}</h3>
          <div className="flex items-center gap-2 text-orange-300 font-medium">
            <span>{dest.price}</span>
            <span className="w-1 h-1 bg-white/50 rounded-full" />
            <span className="text-white/80">{dest.vibe}</span>
          </div>
        </div>

        {/* Expandable Stats Area */}
        <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
          <div className="overflow-hidden">
            <div className={`pt-6 space-y-6 transition-opacity duration-500 delay-100 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 border-t border-white/20 pt-4">
                <div className="flex flex-col items-center text-center gap-1">
                  <Wifi className="w-5 h-5 text-orange-400" />
                  <span className="text-xs text-white/70">Speed</span>
                  <span className="font-bold text-sm">{dest.stats.internet}</span>
                </div>
                <div className="flex flex-col items-center text-center gap-1">
                  <Shield className="w-5 h-5 text-orange-400" />
                  <span className="text-xs text-white/70">Safety</span>
                  <span className="font-bold text-sm">{dest.stats.safety}</span>
                </div>
                <div className="flex flex-col items-center text-center gap-1">
                  <Sun className="w-5 h-5 text-orange-400" />
                  <span className="text-xs text-white/70">Weather</span>
                  <span className="font-bold text-sm">{dest.stats.weather}</span>
                </div>
              </div>

              <Link 
                href="/route-builder"
                className="flex items-center justify-center gap-2 w-full bg-[#E86B32] hover:bg-[#d55a24] text-white font-bold py-3.5 rounded-xl transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                Build This Trip
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const DestinationsGrid = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Subtle Background Decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-[#E86B32] font-semibold mb-2 uppercase tracking-wider text-sm">
              <Zap size={16} />
              <span>Curated Locations</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-stone-900 mb-4 tracking-tight">
              Where will you work next?
            </h2>
            <p className="text-xl text-stone-600 leading-relaxed">
              Handpicked destinations with reliable WiFi, great communities, and endless adventure. 
              <span className="hidden md:inline"> We've done the scouting so you don't have to.</span>
            </p>
          </div>
          <Link 
            href="/route-builder" 
            className="hidden md:inline-flex items-center font-semibold text-[#E86B32] hover:text-[#d55a24] transition-colors group text-lg"
          >
            Explore all destinations 
            <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {destinations.map((dest) => (
            <DestinationCard key={dest.id} dest={dest} />
          ))}
        </div>

        <div className="mt-12 text-center md:hidden">
          <Link 
            href="/route-builder" 
            className="inline-flex items-center font-semibold text-[#E86B32] text-lg"
          >
            Explore all destinations <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DestinationsGrid;
