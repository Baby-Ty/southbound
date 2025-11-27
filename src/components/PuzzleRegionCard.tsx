'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { RegionData } from '@/lib/regionsData';
import { useInViewReveal } from '@/hooks/useInViewReveal';

interface PuzzleRegionCardProps {
  region: RegionData;
  isSelected: boolean;
  onClick: () => void;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// Slight base rotation per position so the grid feels like scattered postcards
const baseRotationByPosition: Record<
  PuzzleRegionCardProps['position'],
  number
> = {
  'top-left': -2.2,
  'top-right': 1.8,
  'bottom-left': 2.1,
  'bottom-right': -1.6
};

// Grid placement / stacking for the 2x2 layout
const positionStyles: Record<
  PuzzleRegionCardProps['position'],
  { gridArea: string; zIndex: number }
> = {
  'top-left': { gridArea: '1 / 1 / 2 / 2', zIndex: 1 },
  'top-right': { gridArea: '1 / 2 / 2 / 3', zIndex: 2 },
  'bottom-left': { gridArea: '2 / 1 / 3 / 2', zIndex: 3 },
  'bottom-right': { gridArea: '2 / 2 / 3 / 3', zIndex: 4 }
};

export const PuzzleRegionCard: React.FC<PuzzleRegionCardProps> = ({
  region,
  isSelected,
  onClick,
  position
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const { ref, isVisible } = useInViewReveal<HTMLDivElement>();

  const baseRotation = baseRotationByPosition[position];

  return (
    <div
      ref={ref}
      className={`relative cursor-pointer sb-reveal ${
        isVisible ? 'is-visible' : ''
      }`}
      style={{
        ...positionStyles[position],
        zIndex: isSelected ? 10 : isHovered ? 8 : positionStyles[position].zIndex
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow behind each postcard */}
      <motion.div
        className="absolute inset-0 -z-10 blur-3xl"
        style={{
          background: region.color
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: isSelected ? 0.35 : isHovered ? 0.22 : 0.15,
          scale: isSelected ? 1.15 : isHovered ? 1.05 : 1
        }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 18, rotate: baseRotation - 2 }}
        animate={{
          opacity: 1,
          scale: isSelected ? 1.03 : isHovered ? 1.01 : 1,
          y: isSelected ? -10 : isHovered ? -6 : 0,
          rotate: isSelected
            ? baseRotation * 0.7
            : isHovered
            ? baseRotation + 0.6
            : baseRotation
        }}
        transition={{
          duration: 0.35,
          ease: [0.4, 0, 0.2, 1]
        }}
        whileHover={{
          y: -6
        }}
        className="relative overflow-hidden rounded-[4px] px-5 py-4 sm:px-6 sm:py-5"
        style={{
          background: '#FFFDF8',
          boxShadow: isSelected
            ? '0 2px 3px rgba(0,0,0,0.08), 0 12px 28px rgba(0,0,0,0.15), 0 20px 50px rgba(0,0,0,0.12), inset 0 1px 1px rgba(255,255,255,0.6)'
            : isHovered
            ? '0 2px 3px rgba(0,0,0,0.08), 0 8px 20px rgba(0,0,0,0.12), 0 16px 40px rgba(0,0,0,0.10), inset 0 1px 1px rgba(255,255,255,0.6)'
            : '0 1px 2px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.10), 0 12px 28px rgba(0,0,0,0.08), inset 0 1px 1px rgba(255,255,255,0.6)'
        }}
      >
        {/* Vintage paper border - inner frame */}
        <div 
          className="pointer-events-none absolute inset-[8px] border-[1.5px] rounded-[2px]"
          style={{
            borderColor: `${region.color}20`,
            boxShadow: 'inset 0 0 0 1px rgba(139, 92, 46, 0.08)'
          }}
        />
        
        {/* Outer border edge detail */}
        <div 
          className="pointer-events-none absolute inset-0 border-[0.5px] rounded-[4px]"
          style={{
            borderColor: 'rgba(139, 92, 46, 0.15)'
          }}
        />

        {/* Paper texture - more visible grain */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.15] mix-blend-multiply rounded-[4px]">
          <svg className="w-full h-full">
            <filter id={`postcard-noise-${region.id}`}>
              <feTurbulence
                type="fractalNoise"
                baseFrequency="2.2"
                numOctaves="4"
                seed="5"
              />
              <feColorMatrix
                type="saturate"
                values="0"
              />
            </filter>
            <rect
              width="100%"
              height="100%"
              filter={`url(#postcard-noise-${region.id})`}
            />
          </svg>
        </div>

        {/* Subtle vignette for depth */}
        <div 
          className="pointer-events-none absolute inset-0 rounded-[4px]"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(139, 92, 46, 0.04) 100%)'
          }}
        />

        {/* Realistic postage stamp */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
          {/* Stamp with perforated edges */}
          <div
            className="relative flex items-center justify-center w-12 h-12 rotate-[8deg] shadow-md"
            style={{
              background: '#FFFFFF',
              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${region.color}12 2px, ${region.color}12 3px)`,
              boxShadow: '0 1px 3px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.8)'
            }}
          >
            {/* Perforated edge effect using dashed border trick */}
            <div 
              className="absolute inset-0"
              style={{
                background: `
                  radial-gradient(circle at 0% 0%, transparent 1.5px, #FFFFFF 1.5px),
                  radial-gradient(circle at 100% 0%, transparent 1.5px, #FFFFFF 1.5px),
                  radial-gradient(circle at 0% 100%, transparent 1.5px, #FFFFFF 1.5px),
                  radial-gradient(circle at 100% 100%, transparent 1.5px, #FFFFFF 1.5px),
                  repeating-linear-gradient(0deg, #FFFFFF 0px, #FFFFFF 3px, transparent 3px, transparent 4px),
                  repeating-linear-gradient(90deg, #FFFFFF 0px, #FFFFFF 3px, transparent 3px, transparent 4px)
                `,
                backgroundSize: '100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 4px, 4px 100%',
                backgroundPosition: 'top left, top right, bottom left, bottom right, top left, top left',
                backgroundRepeat: 'no-repeat, no-repeat, no-repeat, no-repeat, repeat-x, repeat-y',
                maskImage: `
                  radial-gradient(circle at 0% 0%, transparent 1.5px, black 1.5px),
                  radial-gradient(circle at 100% 0%, transparent 1.5px, black 1.5px),
                  radial-gradient(circle at 0% 100%, transparent 1.5px, black 1.5px),
                  radial-gradient(circle at 100% 100%, transparent 1.5px, black 1.5px),
                  repeating-radial-gradient(circle at 50% 0%, transparent 0px, transparent 1.5px, black 1.5px, black 3px),
                  repeating-radial-gradient(circle at 50% 100%, transparent 0px, transparent 1.5px, black 1.5px, black 3px),
                  repeating-radial-gradient(circle at 0% 50%, transparent 0px, transparent 1.5px, black 1.5px, black 3px),
                  repeating-radial-gradient(circle at 100% 50%, transparent 0px, transparent 1.5px, black 1.5px, black 3px)
                `,
                maskSize: '100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 3px, 100% 3px, 3px 100%, 3px 100%',
                maskPosition: 'top left, top right, bottom left, bottom right, top, bottom, left, right',
                maskRepeat: 'no-repeat',
                WebkitMaskComposite: 'source-in'
              }}
            />
            
            {/* Stamp content */}
            <div className="relative z-10 flex flex-col items-center gap-0.5">
              <MapPin
                className="w-5 h-5"
                strokeWidth={2.5}
                style={{ color: region.color }}
              />
              <div 
                className="text-[7px] font-bold tracking-wider uppercase"
                style={{ color: region.color }}
              >
                {region.name.substring(0, 2)}
              </div>
            </div>
          </div>
          
          {/* Postmark circle */}
          <div 
            className="relative w-14 h-8 flex items-center justify-center -mr-1 -rotate-3"
            style={{
              opacity: 0.6
            }}
          >
            {/* Postmark wavy lines */}
            <svg viewBox="0 0 56 32" className="w-full h-full absolute inset-0">
              <path
                d="M 2,10 Q 8,8 14,10 T 26,10 T 38,10 T 50,10 T 54,10"
                fill="none"
                stroke={region.color}
                strokeWidth="0.8"
                opacity="0.5"
              />
              <path
                d="M 2,16 Q 8,14 14,16 T 26,16 T 38,16 T 50,16 T 54,16"
                fill="none"
                stroke={region.color}
                strokeWidth="0.8"
                opacity="0.5"
              />
              <path
                d="M 2,22 Q 8,20 14,22 T 26,22 T 38,22 T 50,22 T 54,22"
                fill="none"
                stroke={region.color}
                strokeWidth="0.8"
                opacity="0.5"
              />
              <circle
                cx="28"
                cy="16"
                r="10"
                fill="none"
                stroke={region.color}
                strokeWidth="1"
                opacity="0.4"
                strokeDasharray="2 2"
              />
            </svg>
            
            {/* Date text */}
            <div 
              className="relative z-10 text-[6px] font-mono font-semibold tracking-tight"
              style={{ color: region.color }}
            >
              2025
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="relative flex h-full flex-col justify-between gap-3 min-h-[150px]">
          {/* Postcard-style dividing line (like vintage address line) */}
          <div 
            className="absolute left-0 right-0 top-12 h-[1px] opacity-20"
            style={{
              background: `linear-gradient(90deg, transparent, ${region.color}, transparent)`
            }}
          />
          
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.15em] border-[1.5px]"
                style={{
                  color: region.color,
                  borderColor: `${region.color}40`,
                  background: `${region.color}08`
                }}
              >
                <span
                  className="inline-block h-1 w-1 rounded-full"
                  style={{ backgroundColor: region.color }}
                />
                Region
              </div>
            </div>
            
            <motion.h3
              className="text-xl sm:text-2xl font-bold text-stone-900 leading-tight tracking-tight"
              style={{
                fontFamily: 'Georgia, serif',
                textShadow: '0 1px 2px rgba(0,0,0,0.08)'
              }}
              animate={{
                scale: isSelected ? 1.03 : 1
              }}
              transition={{ duration: 0.2 }}
            >
              {region.name}
            </motion.h3>
          </div>

          {/* Destinations preview - postcard style */}
          <div className="space-y-2 pt-2">
            {region.destinations.slice(0, 2).map((destination, idx) => (
              <div
                key={destination.name}
                className="flex items-center gap-2.5 text-sm text-stone-800"
              >
                <span className="text-lg flex-shrink-0">{destination.emoji}</span>
                <span className="font-semibold" style={{ fontFamily: 'Georgia, serif' }}>
                  {destination.name}
                </span>
                {idx === 0 && (
                  <div 
                    className="ml-auto h-[1px] w-6 opacity-30"
                    style={{ background: region.color }}
                  />
                )}
              </div>
            ))}
            {region.destinations.length > 2 && (
              <p 
                className="text-xs font-medium italic pl-8"
                style={{ color: `${region.color}cc` }}
              >
                +{region.destinations.length - 2} more destinations
              </p>
            )}
          </div>

          {/* Bottom pricing strip - like vintage airmail label */}
          <div 
            className="mt-2 -mx-5 -mb-4 sm:-mx-6 sm:-mb-5 px-5 py-2.5 sm:px-6 border-t-[1.5px] flex items-center justify-between"
            style={{
              borderColor: `${region.color}25`,
              background: `linear-gradient(135deg, ${region.color}06, ${region.color}02)`
            }}
          >
            <div className="flex items-center gap-2">
              <span 
                className="text-[10px] font-bold uppercase tracking-[0.12em]"
                style={{ color: region.color }}
              >
                From
              </span>
              <span 
                className="text-sm font-bold text-stone-900"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {region.monthlyCost.split('–')[0].trim()}
              </span>
            </div>
            
            <div 
              className="text-[9px] italic tracking-wide opacity-60"
              style={{ color: region.color }}
            >
              /month
            </div>
          </div>
        </div>

        {/* Selected indicator - vintage wax seal style */}
        {isSelected && (
          <motion.div
            className="absolute -left-1 -top-1 z-20"
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 12 }}
            exit={{ opacity: 0, scale: 0, rotate: 180 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 24
            }}
          >
            {/* Wax seal background */}
            <div 
              className="relative w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${region.color}ee, ${region.color}cc)`,
                boxShadow: `0 2px 6px rgba(0,0,0,0.25), inset 0 1px 2px rgba(255,255,255,0.3), 0 0 0 2px ${region.color}40`
              }}
            >
              {/* Seal texture */}
              <div 
                className="absolute inset-0 rounded-full opacity-20 mix-blend-overlay"
                style={{
                  background: 'radial-gradient(circle at 40% 40%, white, transparent 70%)'
                }}
              />
              
              {/* Check icon */}
              <svg
                className="w-6 h-6 text-white relative z-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};


