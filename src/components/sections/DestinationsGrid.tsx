'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Wifi, Shield, Sun, ArrowRight, MapPin, Zap, Loader2 } from 'lucide-react';
import { TripTemplate } from '@/lib/tripTemplates';

// Fallback destinations in case API fails or no curated templates
const fallbackDestinations = [
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
    bestFor: 'Surfing & Cafes',
    link: '/discover?region=southeast-asia'
  },
  {
    id: 2,
    name: 'Ko Samui, Thailand',
    tag: 'Tropical Paradise',
    image: 'https://images.unsplash.com/photo-1738921993722-988364cd90ee?auto=format&fit=crop&w=800&q=80',
    price: 'R28,000/mo',
    vibe: 'Beach & Relaxation',
    stats: {
      internet: '60 Mbps',
      safety: '4.6/5',
      weather: '30°C',
    },
    bestFor: 'Beaches & Wellness',
    link: '/discover?region=southeast-asia'
  },
  {
    id: 3,
    name: 'Buenos Aires, Argentina',
    tag: 'Latin Culture',
    image: 'https://images.unsplash.com/photo-1637580980556-085dee659c7e?auto=format&fit=crop&w=800&q=80',
    price: 'R18,000/mo',
    vibe: 'City & Tango',
    stats: {
      internet: '70 Mbps',
      safety: '4.3/5',
      weather: '20°C',
    },
    bestFor: 'Culture & Nightlife',
    link: '/discover?region=latin-america'
  },
  {
    id: 4,
    name: 'Playa del Carmen, Mexico',
    tag: 'Caribbean Coast',
    image: 'https://images.unsplash.com/photo-1726147417354-cf82fb0548af?auto=format&fit=crop&w=800&q=80',
    price: 'R24,000/mo',
    vibe: 'Beach & Adventure',
    stats: {
      internet: '55 Mbps',
      safety: '4.4/5',
      weather: '28°C',
    },
    bestFor: 'Diving & Cenotes',
    link: '/discover?region=latin-america'
  }
];

type DestinationType = typeof fallbackDestinations[0] | (TripTemplate & { link: string; tag: string; price: string; vibe: string; stats: typeof fallbackDestinations[0]['stats']; bestFor: string });

const DestinationCard = ({ dest }: { dest: DestinationType }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  // Determine the image to use
  const image = 'curatedImageUrl' in dest && dest.curatedImageUrl 
    ? dest.curatedImageUrl 
    : 'imageUrl' in dest 
      ? dest.imageUrl 
      : dest.image;

  // Determine the link
  const link = 'link' in dest ? dest.link : `/templates?expanded=${dest.id}`;

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
          src={image}
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

        {/* Click for more indicator - mobile only */}
        {!isExpanded && (
          <div className="flex items-center gap-2 text-white/90 text-sm font-medium mb-2 md:hidden">
            <span>Click for more</span>
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </div>
        )}

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
                href={link}
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

// Skeleton card component for loading state
const DestinationCardSkeleton = () => {
  return (
    <div className="relative h-[480px] w-full overflow-hidden rounded-3xl bg-stone-200 animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-t from-stone-800/90 via-stone-600/40 to-transparent" />
      
      {/* Top Badge Skeleton */}
      <div className="absolute top-6 left-6 z-10">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full w-32 h-6" />
      </div>

      {/* Content Skeleton */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
        <div className="mb-2">
          <div className="h-8 bg-white/20 rounded w-3/4 mb-2" />
          <div className="h-5 bg-white/20 rounded w-1/2" />
        </div>
        
        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-3 gap-4 border-t border-white/20 pt-4 mt-6">
          <div className="flex flex-col items-center text-center gap-1">
            <div className="w-5 h-5 bg-white/20 rounded" />
            <div className="h-3 bg-white/20 rounded w-12" />
            <div className="h-4 bg-white/20 rounded w-16" />
          </div>
          <div className="flex flex-col items-center text-center gap-1">
            <div className="w-5 h-5 bg-white/20 rounded" />
            <div className="h-3 bg-white/20 rounded w-12" />
            <div className="h-4 bg-white/20 rounded w-16" />
          </div>
          <div className="flex flex-col items-center text-center gap-1">
            <div className="w-5 h-5 bg-white/20 rounded" />
            <div className="h-3 bg-white/20 rounded w-12" />
            <div className="h-4 bg-white/20 rounded w-16" />
          </div>
        </div>
      </div>
    </div>
  );
};

const DestinationsGrid = () => {
  const [destinations, setDestinations] = useState<DestinationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function loadCuratedTemplates() {
      try {
        setLoading(true);
        setError(false);
        
        // Try to fetch from API first (works in development)
        try {
          const { apiUrl } = await import('@/lib/api');
          const response = await fetch(apiUrl('trip-templates?curated=true&enabled=true'));
          
          if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
            const data = await response.json();
            const templates: TripTemplate[] = data.templates || [];
            
            if (templates.length > 0) {
              const mappedDestinations = templates.slice(0, 4).map((template) => ({
                ...template,
                image: template.curatedImageUrl || template.imageUrl,
                tag: template.tags[0] || 'Adventure',
                price: template.price || 'R25,000/mo',
                vibe: template.vibe || template.description.split('.')[0],
                stats: {
                  internet: template.internetSpeed || '50+ Mbps',
                  safety: template.safetyRating || '4.5/5',
                  weather: template.avgWeather || '25°C',
                },
                bestFor: template.bestFor || template.tags.slice(0, 2).join(' & '),
                link: `/templates?expanded=${template.id}`,
              }));
              
              setDestinations(mappedDestinations);
              setLoading(false);
              return;
            }
          }
        } catch (apiError) {
          console.log('[DestinationsGrid] API not available, using static templates');
        }
        
        // Fallback: Use static templates (for static export)
        const { TRIP_TEMPLATES } = await import('@/lib/tripTemplates');
        const allTemplates = [...TRIP_TEMPLATES['southeast-asia'], ...TRIP_TEMPLATES['latin-america'], ...TRIP_TEMPLATES['europe']];
        const curatedTemplates = allTemplates
          .filter(t => t.isCurated && t.enabled)
          .sort((a, b) => (a.curatedOrder || 999) - (b.curatedOrder || 999))
          .slice(0, 4);
        
        if (curatedTemplates.length > 0) {
          const mappedDestinations = curatedTemplates.map((template) => ({
            ...template,
            image: template.curatedImageUrl || template.imageUrl,
            tag: template.tags[0] || 'Adventure',
            price: template.price || 'R25,000/mo',
            vibe: template.vibe || template.description.split('.')[0],
            stats: {
              internet: template.internetSpeed || '50+ Mbps',
              safety: template.safetyRating || '4.5/5',
              weather: template.avgWeather || '25°C',
            },
            bestFor: template.bestFor || template.tags.slice(0, 2).join(' & '),
            link: `/templates?expanded=${template.id}`,
          }));
          
          setDestinations(mappedDestinations);
        } else {
          // Final fallback to hardcoded destinations
          setDestinations(fallbackDestinations);
        }
      } catch (error) {
        console.error('Error loading curated templates:', error);
        setError(true);
        setDestinations(fallbackDestinations);
      } finally {
        setLoading(false);
      }
    }

    loadCuratedTemplates();
  }, []);

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
            href="/templates" 
            className="hidden md:inline-flex items-center font-semibold text-[#E86B32] hover:text-[#d55a24] transition-colors group text-lg"
          >
            Explore all destinations 
            <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {loading ? (
            // Show skeleton cards while loading
            Array.from({ length: 4 }).map((_, idx) => (
              <DestinationCardSkeleton key={`skeleton-${idx}`} />
            ))
          ) : destinations.length > 0 ? (
            // Show actual destination cards
            destinations.map((dest) => (
              <DestinationCard key={'id' in dest ? dest.id : dest.name} dest={dest} />
            ))
          ) : null}
        </div>

        <div className="mt-12 text-center md:hidden">
          <Link 
            href="/templates" 
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
