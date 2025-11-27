import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RouteBuilderData {
  region: string;
  lifestyle: string[];
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
}

const RegionCard = ({ region, isSelected, onSelect }: RegionCardProps) => {
  const [imgFallbackIndex, setImgFallbackIndex] = useState(-1);

  const currentSrc = imgFallbackIndex >= 0 && Array.isArray(region.fallbacks)
    ? region.fallbacks[Math.min(imgFallbackIndex, region.fallbacks.length - 1)]
    : region.bgImage;

  return (
    <motion.div
      onClick={onSelect}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`group relative flex flex-col bg-white rounded-xl overflow-hidden cursor-pointer transition-all duration-500 h-full border ${
        isSelected
          ? 'border-sb-orange-500 shadow-lg ring-2 ring-sb-orange-200 order-last md:order-none'
          : 'border-gray-100 shadow-md hover:shadow-xl hover:border-sb-orange-200'
      }`}
    >
      {/* Image Area - Reduced Height */}
      <div className="relative h-32 w-full overflow-hidden">
        <Image
          src={currentSrc}
          alt={region.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          onError={() => setImgFallbackIndex(prev => prev + 1)}
        />
        
        {/* Selected Checkmark - Smaller */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute top-2 right-2 bg-sb-orange-500 text-white w-6 h-6 rounded-full shadow-md flex items-center justify-center z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Region Icon Badge - Compact */}
        <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm flex items-center gap-1.5">
          <span className="text-base leading-none">{region.icon}</span>
          <span className="text-[10px] font-bold text-sb-navy-900 tracking-wide uppercase leading-none mt-0.5">{region.name}</span>
        </div>
      </div>

      {/* Content Area - Tighter Padding */}
      <div className="p-4 flex flex-col flex-1">
        {/* Header */}
        <div className="mb-3 text-center">
          <h3 className="text-lg font-bold text-sb-navy-900 mb-1 leading-tight group-hover:text-sb-orange-600 transition-colors">
            {region.name}
          </h3>
          <p className="text-sb-navy-500 text-xs font-medium leading-snug px-1 line-clamp-2">
            {region.tagline}
          </p>
        </div>

        {/* Stats Row - Compact Pills */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-green-50 text-green-700 text-[10px] font-bold border border-green-100">
            {region.budget} {region.budgetLabel}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-100">
            {region.timezone}
          </span>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-100 mb-3" />

        {/* Highlights - Compact List */}
        <div className="space-y-1.5 mb-3 flex-1 px-1">
          {region.highlights.map((highlight: string, idx: number) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-sb-navy-600">
              <div className="w-1 h-1 rounded-full bg-sb-orange-400 shrink-0" />
              <span className="line-clamp-1">{highlight}</span>
            </div>
          ))}
        </div>

        {/* Vibe Footer - Integrated */}
        <div className="mt-auto pt-2 border-t border-dashed border-gray-100 text-center">
          <p className="text-xs text-sb-navy-800">
             <span className="text-gray-400 uppercase text-[10px] font-bold mr-1">Vibe:</span> {region.vibe}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const RegionStep = ({ data, onUpdate, onNext }: RegionStepProps) => {
  const [isMobile, setIsMobile] = useState(false);
  const regions = [
    {
      id: 'latin-america',
      name: 'Latin America',
      tagline: 'Rhythm, culture, and endless adventure.',
      icon: '🌎',
      bgImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
      fallbacks: [
        'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80'
      ],
      budget: '$$',
      budgetLabel: 'Value',
      timezone: '-2h to -5h',
      highlights: ['Spanish immersion', 'Stunning beaches', 'Vibrant street life'],
      vibe: 'Social & Adventurous'
    },
    {
      id: 'southeast-asia',
      name: 'Southeast Asia',
      tagline: 'Tropical paradises and incredible food.',
      icon: '🌴',
      bgImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80',
      fallbacks: [
        'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80'
      ],
      budget: '$',
      budgetLabel: 'Affordable',
      timezone: '+5h to +6h',
      highlights: ['Digital nomad hubs', 'World-class cuisine', 'Island hopping'],
      vibe: 'Relaxed & Creative'
    },
    {
      id: 'europe',
      name: 'Europe',
      tagline: 'Historic cities meeting modern life.',
      icon: '☕',
      bgImage: 'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?auto=format&fit=crop&w=1600&q=80',
      fallbacks: [
        'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=1600&q=80'
      ],
      budget: '$$$',
      budgetLabel: 'Premium',
      timezone: '+1h to +2h',
      highlights: ['Café culture', 'Easy train travel', 'Workday overlap'],
      vibe: 'Sophisticated'
    },
  ];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (data.region && isMobile) {
      // Small delay to allow for layout shift
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
    }
  }, [data.region, isMobile]);

  const handleNext = () => {
    if (data.region) {
      onNext();
    }
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Header - Condensed */}
      <div className="text-center space-y-1 pt-2">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="text-sb-orange-500 font-bold tracking-wider text-xs uppercase block">Step 1</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-sb-navy-900 tracking-tight">
            Choose Your Region
          </h2>
          <p className="text-sm text-sb-navy-500 max-w-xl mx-auto">
            Where do you see yourself waking up?
          </p>
        </motion.div>
      </div>

      {/* Region Cards - 3 Column Grid - Reduced Gap */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto px-4 w-full flex-1">
        {regions.map((region) => (
          <RegionCard
            key={region.id}
            region={region}
            isSelected={data.region === region.id}
            onSelect={() => onUpdate({ region: region.id })}
          />
        ))}
      </div>

      {/* Next Button - Closer to content */}
      <motion.div 
        className="flex justify-center pt-2 pb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.button
          onClick={handleNext}
          disabled={!data.region}
          whileHover={{ scale: data.region ? 1.02 : 1 }}
          whileTap={{ scale: data.region ? 0.98 : 1 }}
          className={`px-8 py-3 rounded-full font-bold text-sm transition-all duration-200 flex items-center gap-2 ${
            data.region
              ? 'bg-sb-navy-900 text-white hover:bg-sb-navy-800 shadow-lg'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {data.region ? (
            <>
              Continue
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          ) : (
            'Select a region'
          )}
        </motion.button>
      </motion.div>
    </div>
  );
};

export default RegionStep;
