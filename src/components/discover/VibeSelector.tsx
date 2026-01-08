'use client';

import { motion } from 'framer-motion';

export type VibeKey = 'beach' | 'city-culture' | 'adventure-wellness';

interface VibeSelectorProps {
  selectedVibes: VibeKey[];
  onVibeToggle: (vibe: VibeKey) => void;
  isCompact?: boolean;
}

interface VibeOption {
  id: VibeKey;
  name: string;
  icon: string;
  description: string;
}

export const VIBE_TAG_MAP: Record<VibeKey, string[]> = {
  'beach': ['beach', 'coastal', 'island', 'tropical', 'surf', 'relaxed'],
  'city-culture': ['urban', 'culture', 'city', 'food', 'nightlife', 'history', 'art', 'nomad', 'community', 'coworking'],
  'adventure-wellness': ['adventure', 'nature', 'hiking', 'mountain', 'wellness', 'yoga', 'spiritual'],
};

export default function VibeSelector({ selectedVibes, onVibeToggle, isCompact = false }: VibeSelectorProps) {
  const vibes: VibeOption[] = [
    {
      id: 'beach',
      name: 'Beach & Chill',
      icon: '🏝️',
      description: 'Coastal vibes and island life',
    },
    {
      id: 'city-culture',
      name: 'City & Culture',
      icon: '🏙️',
      description: 'Urban energy and nightlife',
    },
    {
      id: 'adventure-wellness',
      name: 'Adventure & Wellness',
      icon: '🌄',
      description: 'Nature and inner peace',
    },
  ];

  return (
    <div className={`w-full transition-all duration-500 ${isCompact ? 'space-y-2' : 'space-y-4 sm:space-y-6'}`}>
      {/* Header */}
      <div className={`text-center transition-all duration-500 ${isCompact ? 'space-y-0.5' : 'space-y-2'}`}>
        {!isCompact && (
          <p className="text-xs font-bold text-sb-navy-400 uppercase tracking-widest">
            Step 2
          </p>
        )}
        <h3 className={`font-extrabold text-sb-navy-900 tracking-tight transition-all duration-500 ${
          isCompact ? 'text-base sm:text-xl' : 'text-xl sm:text-3xl'
        }`}>
          What's your vibe?
        </h3>
        <p className={`text-sb-navy-600 transition-all duration-500 ${
          isCompact ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'
        }`}>
          Pick as many as you like
        </p>
      </div>

      {/* Vibe Cards Grid */}
      <div className={`grid mx-auto w-full transition-all duration-500 ${
        isCompact 
          ? 'grid-cols-3 gap-2 sm:gap-3 max-w-4xl' 
          : 'grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-5xl'
      }`}>
        {vibes.map((vibe, index) => {
          const isSelected = selectedVibes.includes(vibe.id);
          return (
            <motion.button
              key={vibe.id}
              onClick={() => onVibeToggle(vibe.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              whileHover={{ y: -8, scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className={`relative flex flex-col items-center justify-center text-center transition-all duration-500 border-2 ${
                isCompact 
                  ? 'rounded-xl sm:rounded-2xl p-2 sm:p-5 gap-1 sm:gap-2' 
                  : 'rounded-2xl sm:rounded-3xl p-6 sm:p-10 gap-3 sm:gap-4'
              } ${
                isSelected
                  ? 'bg-sb-navy-900 border-sb-orange-500 shadow-lg shadow-sb-navy-900/20'
                  : 'bg-white border-gray-100 hover:border-sb-navy-200 hover:shadow-md'
              }`}
            >
              <span className={`transition-all duration-500 ${isSelected ? 'scale-110' : ''} ${
                isCompact ? 'text-2xl sm:text-4xl' : 'text-4xl sm:text-6xl'
              }`}>
                {vibe.icon}
              </span>
              <div>
                <div className={`font-bold leading-tight transition-all duration-500 ${
                  isCompact ? 'text-xs sm:text-base mb-0 sm:mb-1' : 'text-base sm:text-xl mb-1 sm:mb-2'
                } ${isSelected ? 'text-white' : 'text-sb-navy-900'}`}>
                  {vibe.name}
                </div>
                {!isCompact && (
                  <div className={`hidden sm:block text-sm sm:text-base leading-relaxed transition-opacity duration-500 ${
                    isSelected ? 'text-white/80' : 'text-sb-navy-600'
                  }`}>
                    {vibe.description}
                  </div>
                )}
              </div>
              
              {isSelected && (
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.2, 1], opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute -top-2 -right-2 bg-sb-orange-500 text-white p-1 rounded-full shadow-md z-10 border-2 border-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
