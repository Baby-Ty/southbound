import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BedDouble, BriefcaseBusiness, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { getCitiesForRegion } from '@/lib/cityData';
import { CityPreset, RegionKey, REGION_HUBS } from '@/lib/cityPresets';

interface RouteBuilderData {
  region: string;
  template?: string;
  workSetup: string[];
  travelStyle: string;
}

interface RegionStepProps {
  data: RouteBuilderData;
  onUpdate: (data: Partial<RouteBuilderData>) => void;
  onNext: () => void;
}

interface RegionCardProps {
  region: any;
  isSelected: boolean;
  onSelect: () => void;
  onDiscover: (e: React.MouseEvent) => void;
}

// Improved Modal Component
const RegionModal = ({ region, onClose }: { region: any; onClose: () => void }) => {
  if (!region) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-sb-navy-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-[2rem] overflow-hidden max-w-2xl w-full shadow-2xl relative max-h-[85vh] flex flex-col border border-white/20"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-md transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Header Image */}
          <div className="relative h-72 w-full shrink-0">
             <Image
              src={region.bgImage}
              alt={region.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-sb-navy-900/90 via-sb-navy-900/40 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-medium mb-3 border border-white/10">
                    {region.icon} {region.vibe}
                </div>
                <h2 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
                   {region.name}
                </h2>
                <p className="text-white/90 font-medium text-lg max-w-lg">{region.tagline}</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 overflow-y-auto">
             <div className="prose prose-sm max-w-none text-sb-navy-600">
                <div className="mb-8">
                    <h3 className="text-sm font-bold text-sb-navy-900 uppercase tracking-wider mb-3">Overview</h3>
                    <p className="text-base leading-relaxed text-sb-navy-700">
                        {region.overview}
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-sb-teal-50/50 p-5 rounded-2xl border border-sb-teal-100">
                        <h4 className="font-bold text-sb-teal-900 mb-1 flex items-center gap-2 text-sm uppercase tracking-wide">
                            💰 Budget
                        </h4>
                        <p className="text-2xl font-bold text-sb-teal-700 mb-1">{region.budget}</p>
                        <p className="text-sm text-sb-teal-800 font-medium">{region.budgetLabel}</p>
                        <p className="text-xs text-sb-teal-600 mt-2 leading-relaxed">Typical monthly costs for a digital nomad in this region.</p>
                    </div>
                    <div className="bg-sb-orange-50/50 p-5 rounded-2xl border border-sb-orange-100">
                         <h4 className="font-bold text-sb-orange-900 mb-1 flex items-center gap-2 text-sm uppercase tracking-wide">
                            ⏰ Timezone
                        </h4>
                         <p className="text-2xl font-bold text-sb-orange-700 mb-1">{region.timezone}</p>
                        <p className="text-sm text-sb-orange-800 font-medium">vs EST</p>
                        <p className="text-xs text-sb-orange-600 mt-2 leading-relaxed">Ideal work overlap windows for US-based teams.</p>
                    </div>
                </div>
             </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const RegionCard = ({ region, isSelected, onSelect, onDiscover }: RegionCardProps) => {
  const [imgFallbackIndex, setImgFallbackIndex] = useState(-1);
  const [isHovered, setIsHovered] = useState(false);

  const currentSrc = imgFallbackIndex >= 0 && Array.isArray(region.fallbacks)
    ? region.fallbacks[Math.min(imgFallbackIndex, region.fallbacks.length - 1)]
    : region.bgImage;

  return (
    <motion.div
      onClick={onSelect}
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
      {/* Image Section - Taller Aspect Ratio */}
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        <Image
          src={currentSrc}
          alt={region.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className={`object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
          onError={() => {
             if (region.fallbacks && imgFallbackIndex < region.fallbacks.length - 1) {
               setImgFallbackIndex(prev => prev + 1);
             }
          }}
        />
        
        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${isSelected ? 'opacity-90' : 'opacity-70 group-hover:opacity-80'}`} />

        {/* Selected State Ring/Border (Inner) */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 border-[6px] border-sb-orange-500 z-20 rounded-[2rem]"
            />
          )}
        </AnimatePresence>

        {/* Top Content */}
        <div className="absolute top-0 left-0 w-full p-6 z-10 flex justify-between items-start">
             <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold shadow-sm border border-white/10">
                <span>{region.icon}</span> {region.vibe}
             </div>
             
             {/* Info Button */}
             <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDiscover(e);
                }}
                className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-sb-navy-900 transition-colors border border-white/10"
            >
                <Info size={16} strokeWidth={2.5} />
            </button>
        </div>

        {/* Bottom Content */}
        <div className="absolute bottom-0 left-0 w-full p-6 z-10 text-white">
            <h3 className="text-3xl font-extrabold mb-2 tracking-tight">
                {region.name}
            </h3>
            <p className="text-white/90 text-sm font-medium leading-relaxed mb-4 line-clamp-2">
                {region.tagline}
            </p>

            {/* Quick Stats */}
            <div className="flex items-center gap-3">
                <div className="bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10">
                    <span className="text-[10px] uppercase tracking-wider opacity-70 block">Budget</span>
                    <span className="text-sm font-bold">{region.budget}</span>
                </div>
                 <div className="bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10">
                    <span className="text-[10px] uppercase tracking-wider opacity-70 block">Timezone</span>
                    <span className="text-sm font-bold">{region.timezone}</span>
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

const RegionStep = ({ data, onUpdate, onNext }: RegionStepProps) => {
  const [hubCityByRegion, setHubCityByRegion] = useState<Record<string, CityPreset | null>>({});

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

  const [selectedRegionDetails, setSelectedRegionDetails] = useState<any>(null);

  const regions = [
    {
      id: 'latin-america',
      name: 'Latin America',
      tagline: 'Rhythm, culture, and endless adventure.',
      icon: '🌎',
      bgImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
      fallbacks: ['https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1600&q=80'],
      budget: '$$',
      budgetLabel: 'Value',
      timezone: '-2h to -5h',
      highlights: ['Spanish immersion', 'Stunning beaches', 'Vibrant street life'],
      vibe: 'Social & Adventurous',
      overview: 'Latin America is a vibrant tapestry of cultures, offering everything from the white-sand beaches of the Caribbean to the rugged peaks of the Andes. It is the perfect destination for those looking to immerse themselves in a rich culture, learn Spanish, and enjoy a life full of passion and energy.',
      hubCity: hubCityByRegion['latin-america'],
    },
    {
      id: 'southeast-asia',
      name: 'Southeast Asia',
      tagline: 'Tropical paradises and incredible food.',
      icon: '🌴',
      bgImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80',
      fallbacks: ['https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1600&q=80'],
      budget: '$',
      budgetLabel: 'Affordable',
      timezone: '+5h to +6h',
      highlights: ['Digital nomad hubs', 'World-class cuisine', 'Island hopping'],
      vibe: 'Relaxed & Creative',
      overview: 'Southeast Asia is the undisputed capital of the digital nomad world. With established hubs like Chiang Mai, Bali, and Da Nang, you will find high-speed internet, comfortable coworking spaces, and a supportive community of like-minded individuals.',
      hubCity: hubCityByRegion['southeast-asia'],
    },
    {
      id: 'europe',
      name: 'Europe',
      tagline: 'Historic cities meeting modern life.',
      icon: '☕',
      bgImage: 'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?auto=format&fit=crop&w=1600&q=80',
      fallbacks: ['https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80'],
      budget: '$$$',
      budgetLabel: 'Premium',
      timezone: '+1h to +2h',
      highlights: ['Café culture', 'Easy train travel', 'Workday overlap'],
      vibe: 'Sophisticated',
      overview: 'Europe offers a blend of deep history, modern convenience, and incredible diversity packed into a small continent. Excellent train networks make weekend trips easy, and the timezone is convenient for those working with US East Coast or Asian clients.',
      hubCity: hubCityByRegion['europe'],
    },
  ];

  return (
    <div className="space-y-8 flex flex-col items-center">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-sb-navy-900 tracking-tight">
            Where's your next chapter?
          </h2>
          <p className="text-lg text-sb-navy-500 mt-2">
            Select a region to start building your ideal journey.
          </p>
        </motion.div>
      </div>

      {/* Region Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {regions.map((region) => (
          <RegionCard
            key={region.id}
            region={region}
            isSelected={data.region === region.id}
            onSelect={() => onUpdate({ region: region.id })}
            onDiscover={(e) => {
              setSelectedRegionDetails(region);
            }}
          />
        ))}
      </div>

      {/* Floating Action Button for Next */}
      <AnimatePresence>
        {data.region && (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-8 z-40"
            >
                <button
                    onClick={onNext}
                    className="bg-sb-navy-900 text-white px-8 py-4 rounded-full font-bold shadow-2xl hover:bg-sb-navy-800 transition-all transform hover:scale-105 flex items-center gap-2 text-lg"
                >
                    Continue
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </button>
            </motion.div>
        )}
      </AnimatePresence>

       {/* Region Details Modal */}
       {selectedRegionDetails && (
        <RegionModal 
          region={selectedRegionDetails} 
          onClose={() => setSelectedRegionDetails(null)} 
        />
      )}
    </div>
  );
};

export default RegionStep;