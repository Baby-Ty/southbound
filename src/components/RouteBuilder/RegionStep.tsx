import Image from 'next/image';
import { useState } from 'react';
import { motion } from 'framer-motion';

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

const RegionStep = ({ data, onUpdate, onNext }: RegionStepProps) => {
  const [imgFallbackIndex, setImgFallbackIndex] = useState<Record<string, number>>({});

  const regions = [
    {
      id: 'latin-america',
      name: 'Latin America',
      tagline: 'Vibrant culture, affordable living',
      icon: '🌎',
      bgImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
      fallbacks: [
        'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80'
      ],
      budget: '$$',
      budgetLabel: 'Budget Friendly',
      timezone: '2-5 hrs behind SA',
      highlights: ['Spanish immersion', 'Beach escapes', 'Lively street culture'],
      vibe: 'Social & Adventurous'
    },
    {
      id: 'southeast-asia',
      name: 'Southeast Asia',
      tagline: 'Tropical paradise, incredible value',
      icon: '🌴',
      bgImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80',
      fallbacks: [
        'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80'
      ],
      budget: '$',
      budgetLabel: 'Very Affordable',
      timezone: '5-6 hrs ahead of SA',
      highlights: ['Beach coworking', 'Amazing food scene', 'Nomad communities'],
      vibe: 'Relaxed & Creative'
    },
    {
      id: 'europe',
      name: 'Europe',
      tagline: 'Rich history, modern infrastructure',
      icon: '☕',
      bgImage: 'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?auto=format&fit=crop&w=1600&q=80',
      fallbacks: [
        'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=1600&q=80'
      ],
      budget: '$$$',
      budgetLabel: 'Premium',
      timezone: '1-2 hrs ahead of SA',
      highlights: ['World-class cafés', 'Easy train travel', 'Full workday overlap'],
      vibe: 'Sophisticated & Productive'
    },
  ];

  const handleNext = () => {
    if (data.region) {
      onNext();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-sb-navy-700 tracking-tight">
          Where do you want to go?
        </h2>
        <p className="text-base sm:text-lg text-sb-navy-500 max-w-2xl mx-auto">
          Choose a region that matches your vibe. We'll customize the rest based on your pick.
        </p>
      </div>

      {/* Region Cards - 3 Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {regions.map((region) => {
          const selected = data.region === region.id;
          const currentIdx = imgFallbackIndex[region.id] ?? -1;
          const currentSrc = currentIdx >= 0 && Array.isArray((region as any).fallbacks)
            ? (region as any).fallbacks[Math.min(currentIdx, (region as any).fallbacks.length - 1)]
            : region.bgImage;

          return (
            <motion.button
              key={region.id}
              type="button"
              onClick={() => onUpdate({ region: region.id })}
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className={`group relative rounded-2xl overflow-hidden text-left transition-all duration-300 h-full flex flex-col ${
                selected 
                  ? 'ring-4 ring-sb-orange-400 ring-offset-4 shadow-2xl' 
                  : 'hover:shadow-xl shadow-lg ring-1 ring-gray-200'
              }`}
            >
              {/* Top: Image */}
              <div className="relative w-full h-56">
                <Image
                  src={currentSrc}
                  alt={region.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={() => setImgFallbackIndex(prev => ({ ...prev, [region.id]: (prev[region.id] ?? -1) + 1 }))}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                
                {/* Selected Badge */}
                {selected && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute top-4 right-4 bg-sb-orange-500 text-white p-2 rounded-full shadow-lg"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}

                {/* Floating Icon */}
                <div className="absolute -bottom-6 left-6 bg-white w-14 h-14 rounded-xl shadow-lg flex items-center justify-center text-3xl z-10 border border-gray-100">
                  {region.icon}
                </div>
              </div>

              {/* Bottom: Content */}
              <div className="bg-white p-6 pt-8 flex flex-col flex-1 w-full">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-sb-navy-700 leading-tight mb-1">
                    {region.name}
                  </h3>
                  <p className="text-sm text-sb-navy-500 font-medium">
                    {region.tagline}
                  </p>
                </div>

                {/* Quick Info Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sb-teal-50 rounded-full border border-sb-teal-100">
                    <span className="text-sm font-bold text-sb-teal-700">{region.budget}</span>
                    <span className="text-xs font-medium text-sb-teal-600">
                      {region.budgetLabel}
                    </span>
                  </div>
                </div>

                {/* Highlights */}
                <div className="space-y-2 mb-4 flex-1">
                  {region.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="text-sb-orange-500 text-sm mt-0.5">✓</span>
                      <span className="text-sm text-sb-navy-600 leading-snug">
                        {highlight}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Bottom: Vibe Tag */}
                <div className="pt-4 border-t border-gray-100 mt-auto">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                     <span className="text-lg">✨</span>
                    <span className="font-semibold text-sb-navy-700 uppercase tracking-wide">
                      {region.vibe}
                    </span>
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Next Button */}
      <div className="flex justify-center pt-6">
        <motion.button
          onClick={handleNext}
          disabled={!data.region}
          whileHover={{ scale: data.region ? 1.05 : 1 }}
          whileTap={{ scale: data.region ? 0.95 : 1 }}
          className={`px-10 py-4 rounded-full font-bold text-lg transition-all duration-200 flex items-center gap-2 ${
            data.region
              ? 'bg-sb-orange-500 text-white hover:bg-sb-orange-600 shadow-lg hover:shadow-xl ring-4 ring-sb-orange-200'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {data.region ? (
            <>
              Continue to Lifestyle 
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          ) : (
            'Select a region to continue'
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default RegionStep;
