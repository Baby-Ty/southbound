'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Info } from 'lucide-react';
import { RegionKey, REGION_HUBS } from '@/lib/cityPresets';
import { getCitiesForRegion } from '@/lib/cityData';
import { CityPreset } from '@/lib/cityPresets';
import { apiUrl } from '@/lib/api';
import { RouteCard } from '@/types/routeCard';

interface RegionSelectorProps {
  selectedRegions: RegionKey[];
  onRegionToggle: (region: RegionKey) => void;
}

interface RegionData {
  id: RegionKey;
  name: string;
  tagline: string;
  icon: string;
  bgImage: string;
  budget: string;
  budgetLabel: string;
  timezone: string;
  vibe: string;
  overview: string;
  hubCity: CityPreset | null;
  featuredCities: string[];
}

// Fallback data if API is unavailable
const FALLBACK_REGIONS: RegionData[] = [
  {
    id: 'latin-america',
    name: 'Latin America',
    tagline: 'Rhythm, culture, and endless adventure.',
    icon: '🌎',
    bgImage: '/SouthAmerica.webp',
    budget: '$$',
    budgetLabel: 'Value',
    timezone: '-2h to -5h',
    vibe: 'Social & Adventurous',
    overview: 'Latin America is a vibrant tapestry of cultures, offering everything from the white-sand beaches of the Caribbean to the rugged peaks of the Andes.',
    hubCity: null,
    featuredCities: [],
  },
  {
    id: 'southeast-asia',
    name: 'Southeast Asia',
    tagline: 'Tropical paradises and incredible food.',
    icon: '🌴',
    bgImage: '/southeastasia.webp',
    budget: '$',
    budgetLabel: 'Affordable',
    timezone: '+5h to +6h',
    vibe: 'Relaxed & Creative',
    overview: 'Southeast Asia is the undisputed capital of the digital nomad world. With established hubs like Chiang Mai, Bali, and Da Nang, you will find high-speed internet and a supportive community.',
    hubCity: null,
    featuredCities: [],
  },
  {
    id: 'europe',
    name: 'Europe',
    tagline: 'Historic cities meeting modern life.',
    icon: '☕',
    bgImage: '/europe.webp',
    budget: '$$$',
    budgetLabel: 'Premium',
    timezone: '+1h to +2h',
    vibe: 'Sophisticated',
    overview: 'Europe offers a blend of deep history, modern convenience, and incredible diversity. Excellent train networks make weekend trips easy.',
    hubCity: null,
    featuredCities: [],
  },
];

interface RegionData {
  id: RegionKey;
  name: string;
  tagline: string;
  icon: string;
  bgImage: string;
  budget: string;
  budgetLabel: string;
  timezone: string;
  vibe: string;
  overview: string;
  hubCity: CityPreset | null;
  featuredCities: string[];
}

export default function RegionSelector({ selectedRegions, onRegionToggle }: RegionSelectorProps) {
  const [hubCityByRegion, setHubCityByRegion] = useState<Record<string, CityPreset | null>>({});
  const [selectedRegionDetails, setSelectedRegionDetails] = useState<RegionData | null>(null);
  const [regions, setRegions] = useState<RegionData[]>(FALLBACK_REGIONS);

  useEffect(() => {
    let cancelled = false;
    async function loadHubCities() {
      const regionKeys: RegionKey[] = ['latin-america', 'southeast-asia', 'europe'];
      const entries = await Promise.all(
        regionKeys.map(async (regionKey) => {
          const cities = await getCitiesForRegion(regionKey);
          const hubName = REGION_HUBS[regionKey]?.[0];
          const hubCity = (hubName ? cities.find((c) => c.city === hubName) : null) || cities[0] || null;
          return [regionKey, hubCity] as const;
        })
      );
      if (!cancelled) {
        setHubCityByRegion(Object.fromEntries(entries));
      }
    }
    loadHubCities();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    async function loadRouteCards() {
      try {
        const url = apiUrl('route-cards?enabled=true');
        const response = await fetch(url, {
          headers: { 'Content-Type': 'application/json' },
        });
        
        if (!response.ok) {
          console.warn('[RegionSelector] Failed to load route cards, using fallback');
          return;
        }
        
        const data = await response.json();
        if (data.routeCards && Array.isArray(data.routeCards)) {
          // Map RouteCard[] to RegionData[]
          const mappedRegions: RegionData[] = data.routeCards.map((card: RouteCard) => ({
            id: card.region as RegionKey,
            name: card.name,
            tagline: card.tagline,
            icon: card.icon,
            bgImage: card.imageUrl,
            budget: card.budget,
            budgetLabel: card.budgetLabel,
            timezone: card.timezone,
            vibe: card.vibe,
            overview: card.overview,
            hubCity: hubCityByRegion[card.region] || null,
            featuredCities: card.featuredCities || [],
          }));
          
          // Ensure we have all 3 regions (fill missing with fallback)
          const regionIds = mappedRegions.map(r => r.id);
          const missingRegions = FALLBACK_REGIONS.filter(f => !regionIds.includes(f.id));
          
          // Only update if data actually changed (prevent unnecessary re-renders)
          const newRegions = [...mappedRegions, ...missingRegions];
          setRegions(prev => {
            // Check if image URLs changed
            const hasChanges = prev.some((oldRegion, idx) => 
              !newRegions[idx] || oldRegion.bgImage !== newRegions[idx].bgImage
            );
            return hasChanges ? newRegions : prev;
          });
        }
      } catch (error) {
        console.error('[RegionSelector] Error loading route cards:', error);
        // Keep fallback data
      }
    }
    loadRouteCards();
  }, [hubCityByRegion]);

  const RegionCard = ({ region }: { region: RegionData }) => {
    const [isHovered, setIsHovered] = useState(false);
    const isSelected = selectedRegions.includes(region.id);

    return (
      <motion.div
        onClick={() => onRegionToggle(region.id)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -12, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`group relative flex flex-col bg-white rounded-[2rem] overflow-hidden cursor-pointer h-full transition-all duration-300 ${
          isSelected
            ? 'shadow-2xl shadow-sb-orange-500/20 ring-4 ring-sb-orange-500/20'
            : 'shadow-lg shadow-sb-navy-900/5 hover:shadow-2xl hover:shadow-sb-navy-900/10 border border-transparent hover:border-gray-100'
        }`}
      >
        {/* Image Section - Responsive Aspect Ratio */}
        <div className="relative aspect-[4/5] md:aspect-[3/4] w-full overflow-hidden">
          <Image
            src={region.bgImage}
            alt={region.name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 33vw"
            className={`object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
          />
          
          {/* Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 ${isSelected ? 'opacity-95' : 'opacity-80 group-hover:opacity-85'}`} />

          {/* Selected State Ring */}
          {isSelected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 border-[6px] border-sb-orange-500 z-20 rounded-[2rem]"
            />
          )}

          {/* Top Content */}
          <div className="absolute top-0 left-0 w-full p-3 md:p-6 z-10 flex justify-between items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-md text-white text-xs font-bold shadow-sm border border-white/20">
              <span>{region.icon}</span> {region.vibe}
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedRegionDetails(region);
              }}
              className="w-8 h-8 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-sb-navy-900 transition-colors border border-white/20"
            >
              <Info size={16} strokeWidth={2.5} />
            </button>
          </div>

          {/* Bottom Content */}
          <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 z-10 text-white drop-shadow-md">
            <h3 className="text-2xl md:text-3xl font-extrabold mb-2 tracking-tight">
              {region.name}
            </h3>
            <p className="text-white text-xs md:text-sm font-semibold leading-relaxed mb-3 md:mb-4 line-clamp-2">
              {region.tagline}
            </p>

            {/* Quick Stats */}
            <div className="flex items-center gap-2 md:gap-3">
              <div className="bg-white/20 backdrop-blur-md px-2 md:px-3 py-1 md:py-1.5 rounded-lg border border-white/20">
                <span className="text-[9px] md:text-[10px] uppercase tracking-wider opacity-90 block font-bold">Budget</span>
                <span className="text-xs md:text-sm font-bold">{region.budget}</span>
              </div>
              <div className="bg-white/20 backdrop-blur-md px-2 md:px-3 py-1 md:py-1.5 rounded-lg border border-white/20">
                <span className="text-[9px] md:text-[10px] uppercase tracking-wider opacity-90 block font-bold">Timezone</span>
                <span className="text-xs md:text-sm font-bold">{region.timezone}</span>
              </div>
            </div>

            {/* Selected Indicator */}
            {isSelected && (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute bottom-6 right-6 bg-sb-orange-500 text-white p-2 rounded-full shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-8 flex flex-col items-center">
      {/* Header */}
      <div className="text-center space-y-3 md:space-y-4 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-sb-navy-900 tracking-tight">
            Where are you drawn to?
          </h2>
          <p className="text-base sm:text-lg text-sb-navy-500 mt-2">
            Select all regions that interest you
          </p>
        </motion.div>
      </div>

      {/* Region Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 w-full">
        {regions.map((region) => (
          <RegionCard key={region.id} region={region} />
        ))}
      </div>

      {/* Region Details Modal */}
      {selectedRegionDetails && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setSelectedRegionDetails(null)}
          className="fixed inset-0 bg-sb-navy-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[2rem] overflow-hidden max-w-2xl w-full shadow-2xl relative max-h-[85vh] flex flex-col border border-white/20"
          >
            <button 
              onClick={() => setSelectedRegionDetails(null)}
              className="absolute top-4 right-4 z-10 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-md transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            <div className="relative h-72 w-full shrink-0">
              <Image
                src={selectedRegionDetails.bgImage}
                alt={selectedRegionDetails.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sb-navy-900/90 via-sb-navy-900/40 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-medium mb-3 border border-white/10">
                  {selectedRegionDetails.icon} {selectedRegionDetails.vibe}
                </div>
                <h2 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
                  {selectedRegionDetails.name}
                </h2>
                <p className="text-white/90 font-medium text-lg max-w-lg">{selectedRegionDetails.tagline}</p>
              </div>
            </div>

            <div className="p-8 overflow-y-auto">
              <div className="prose prose-sm max-w-none text-sb-navy-600">
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-sb-navy-900 uppercase tracking-wider mb-3">Overview</h3>
                  <p className="text-base leading-relaxed text-sb-navy-700">
                    {selectedRegionDetails.overview}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="bg-sb-teal-50/50 p-5 rounded-2xl border border-sb-teal-100">
                    <h4 className="font-bold text-sb-teal-900 mb-1 flex items-center gap-2 text-sm uppercase tracking-wide">
                      💰 Budget
                    </h4>
                    <p className="text-2xl font-bold text-sb-teal-700 mb-1">{selectedRegionDetails.budget}</p>
                    <p className="text-sm text-sb-teal-800 font-medium">{selectedRegionDetails.budgetLabel}</p>
                  </div>
                  <div className="bg-sb-orange-50/50 p-5 rounded-2xl border border-sb-orange-100">
                    <h4 className="font-bold text-sb-orange-900 mb-1 flex items-center gap-2 text-sm uppercase tracking-wide">
                      ⏰ Timezone
                    </h4>
                    <p className="text-2xl font-bold text-sb-orange-700 mb-1">{selectedRegionDetails.timezone}</p>
                    <p className="text-sm text-sb-orange-800 font-medium">vs EST</p>
                  </div>
                </div>

                {selectedRegionDetails.featuredCities && selectedRegionDetails.featuredCities.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-bold text-sb-navy-900 uppercase tracking-wider mb-3">Featured Cities</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedRegionDetails.featuredCities.map((city, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-sb-teal-50 text-sb-teal-700 rounded-lg text-sm font-medium border border-sb-teal-100">
                          {city}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
