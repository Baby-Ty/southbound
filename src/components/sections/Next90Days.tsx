'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const journeyPhases = [
  {
    phase: 'Week 1',
    title: 'Settle in',
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=600&q=80',
    description: 'Get your bearings, set up your workspace',
    verticalOffset: -8,
    rotation: -2.2,
    tapeColor: 'bg-orange-200/80',
    tapeRotation: -3,
    shadow: 'shadow-[0_4px_14px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.04)]',
    hoverShadow: 'md:hover:shadow-[0_12px_28px_rgba(0,0,0,0.15),0_6px_12px_rgba(0,0,0,0.08)]',
    hasSticker: false,
  },
  {
    phase: 'Weeks 2–4',
    title: 'Work rhythms',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80',
    description: 'Find your flow, explore coworking spaces',
    verticalOffset: 12,
    rotation: 1.8,
    tapeColor: 'bg-amber-200/80',
    tapeRotation: 2,
    shadow: 'shadow-[0_3px_12px_rgba(0,0,0,0.09),0_1px_5px_rgba(0,0,0,0.05)]',
    hoverShadow: 'md:hover:shadow-[0_10px_24px_rgba(0,0,0,0.14),0_5px_10px_rgba(0,0,0,0.07)]',
    hasSticker: true,
    stickerColor: 'bg-gradient-to-br from-yellow-200 to-yellow-300',
  },
  {
    phase: 'Weeks 5–8',
    title: 'Deep immersion',
    image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=600&q=80',
    description: 'Balance productivity with local experiences',
    verticalOffset: -6,
    rotation: -1.3,
    tapeColor: 'bg-stone-200/80',
    tapeRotation: -1.5,
    shadow: 'shadow-[0_5px_15px_rgba(0,0,0,0.07),0_2px_7px_rgba(0,0,0,0.04)]',
    hoverShadow: 'md:hover:shadow-[0_14px_32px_rgba(0,0,0,0.13),0_7px_14px_rgba(0,0,0,0.07)]',
    hasSticker: false,
  },
  {
    phase: 'Weeks 9–10',
    title: 'Weekend escapes',
    image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=600&q=80',
    description: 'Explore nearby destinations',
    verticalOffset: 10,
    rotation: 2.1,
    tapeColor: 'bg-orange-100/80',
    tapeRotation: 1,
    shadow: 'shadow-[0_4px_13px_rgba(0,0,0,0.08),0_2px_6px_rgba(0,0,0,0.05)]',
    hoverShadow: 'md:hover:shadow-[0_11px_26px_rgba(0,0,0,0.14),0_6px_11px_rgba(0,0,0,0.08)]',
    hasSticker: true,
    stickerColor: 'bg-gradient-to-br from-orange-200 to-orange-300',
  },
  {
    phase: 'Weeks 11–12',
    title: 'Connections',
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80',
    description: 'Build lasting friendships and networks',
    verticalOffset: -14,
    rotation: -1.7,
    tapeColor: 'bg-rose-100/80',
    tapeRotation: -2.5,
    shadow: 'shadow-[0_4px_16px_rgba(0,0,0,0.09),0_2px_8px_rgba(0,0,0,0.05)]',
    hoverShadow: 'md:hover:shadow-[0_13px_30px_rgba(0,0,0,0.15),0_7px_13px_rgba(0,0,0,0.09)]',
    hasSticker: false,
  },
  {
    phase: 'Week 13',
    title: 'Reflect & plan',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
    description: 'Look back on growth, plan what\'s next',
    verticalOffset: 6,
    rotation: 1.2,
    tapeColor: 'bg-stone-200/80',
    tapeRotation: 3,
    shadow: 'shadow-[0_3px_11px_rgba(0,0,0,0.07),0_1px_5px_rgba(0,0,0,0.04)]',
    hoverShadow: 'md:hover:shadow-[0_10px_22px_rgba(0,0,0,0.12),0_5px_9px_rgba(0,0,0,0.07)]',
    hasSticker: true,
    stickerColor: 'bg-gradient-to-br from-green-200 to-emerald-300',
  },
];

interface ScrapbookSpreadProps {
  phase: typeof journeyPhases[0];
  index: number;
}

const ScrapbookSpread: React.FC<ScrapbookSpreadProps> = ({ phase, index }) => {
  const tapeMaskImage = "url(\"data:image/svg+xml,%3Csvg width='200' height='50' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,10 L5,0 L195,5 L200,15 L200,35 L195,45 L5,40 L0,30 Z' fill='black'/%3E%3C/svg%3E\")";

  return (
    <div className="flex-shrink-0 snap-center px-6 md:px-8" style={{ minWidth: '320px', maxWidth: '320px' }}>
      <div
        className="relative flex flex-col md:flex-row justify-center items-center md:items-start gap-6 md:gap-4"
        style={{
          marginTop: `${phase.verticalOffset}px`,
        }}
      >
        {/* Polaroid photo frame */}
        <div
          className={`relative bg-white p-3 pb-14 transition-all duration-300 ${phase.shadow} ${phase.hoverShadow} border border-stone-200 z-10 group`}
          style={{
            transform: `rotate(${phase.rotation}deg)`,
            width: '280px',
          }}
        >
          {/* Paper Texture on Polaroid */}
           <div className="absolute inset-0 texture-paper opacity-20 pointer-events-none"></div>

          {/* Tape decoration at top */}
          <div
            className={`absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-6 ${phase.tapeColor} shadow-sm backdrop-blur-sm`}
            style={{
              transform: `rotate(${phase.tapeRotation}deg)`,
              opacity: 0.9,
               maskImage: tapeMaskImage,
               WebkitMaskImage: tapeMaskImage,
               maskSize: 'contain',
               WebkitMaskSize: 'contain'
            }}
          />

          {/* Optional decorative sticker */}
          {phase.hasSticker && (
            <div
              className={`absolute -top-3 right-4 w-8 h-8 ${phase.stickerColor} rounded-full shadow-md border-2 border-white`}
              style={{
                transform: 'rotate(12deg)',
                opacity: 0.9,
              }}
            />
          )}

          {/* Photo */}
          <div
            className="relative aspect-square bg-stone-100 overflow-hidden shadow-inner"
          >
            <Image
              src={phase.image}
              alt={phase.title}
              fill
              className="object-cover sepia-[0.1]"
              sizes="280px"
            />
          </div>

          {/* Handwritten label at bottom of Polaroid */}
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <p className="text-stone-800 text-lg font-medium font-handwritten opacity-80">
              {phase.phase}
            </p>
          </div>
        </div>

        {/* Lined Paper Sticky Note */}
        <div
          className="relative mt-2 md:mt-4 texture-lined-paper p-5 pt-8 shadow-[0_4px_15px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.12)] transition-all duration-300 transform origin-top-left group-hover:rotate-0"
          style={{
            width: '220px',
            transform: `rotate(${-phase.rotation * 0.8}deg)`,
            marginLeft: '-20px',
            zIndex: 5,
          }}
        >
           {/* Washi Tape for Note */}
           <div 
             className={`absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 ${phase.tapeColor} opacity-90 shadow-sm rotate-2 backdrop-blur-sm`}
             style={{
               maskImage: tapeMaskImage,
               WebkitMaskImage: tapeMaskImage,
               maskSize: 'contain',
               WebkitMaskSize: 'contain'
             }}
           />

          {/* Handwritten Content */}
          <h3 className="text-xl font-bold text-stone-800 mb-2 font-handwritten leading-tight">
            {phase.title}
          </h3>
          <p className="text-stone-600 leading-relaxed font-handwritten text-lg">
            {phase.description}
          </p>

          {/* Doodle Arrow connecting Photo to Note */}
          {index % 2 === 0 && (
            <svg className="absolute -left-8 top-1/2 w-10 h-10 text-stone-400 transform -rotate-12 hidden md:block" viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M45,10 Q25,25 5,25" strokeDasharray="3,3" />
              <path d="M5,25 L15,20 M5,25 L15,30" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};

export const Next90DaysSection: React.FC = () => {
  // Duplicate phases for seamless looping
  const carouselPhases = [...journeyPhases, ...journeyPhases];

  return (
    <section className="relative bg-[#FFF5EA] py-16 md:py-24 overflow-hidden">
      
      {/* Background Texture */}
      <div className="absolute inset-0 texture-paper opacity-40 pointer-events-none"></div>

      {/* Background Path - Dashed Line */}
      <div className="absolute top-[55%] left-0 h-[2px] pointer-events-none z-0 hidden md:block" style={{ width: '200%' }}>
        <svg className="w-full h-32 overflow-visible" preserveAspectRatio="none">
           <path d="M0,60 Q300,20 600,60 T1200,60 T1800,60 T2400,60 T3000,60 T3600,60" fill="none" stroke="#d6d3d1" strokeWidth="3" strokeDasharray="12,12" strokeLinecap="round" />
        </svg>
      </div>

      {/* Static Header */}
      <div className="text-center mb-12 md:mb-16 relative z-20 px-4">
        <div className="inline-block px-4 py-1 bg-orange-100 text-orange-800 text-sm font-bold rounded-full mb-4 transform rotate-2 border border-orange-200 shadow-sm font-handwritten">
          YOUR JOURNEY MAP
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-stone-800 mb-4 font-serif">
          Your next 90 days
        </h2>
        <p className="text-stone-600 text-base md:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed font-handwritten">
          From landing to living locally—a scrapbook of what's to come.
        </p>
      </div>

      {/* Carousel Container */}
      <div className="relative w-full overflow-hidden pb-12">
        {/* Gradient masks for edges */}
        <div className="absolute left-0 top-0 bottom-0 w-8 md:w-32 z-10 bg-gradient-to-r from-[#FFF5EA] to-transparent pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-8 md:w-32 z-10 bg-gradient-to-l from-[#FFF5EA] to-transparent pointer-events-none"></div>

        <motion.div 
          className="flex items-center gap-8 md:gap-12 px-4"
          animate={{
            x: ["0%", "-50%"]
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 50,
              ease: "linear",
            },
          }}
          style={{
            width: "max-content"
          }}
        >
          {carouselPhases.map((phase, index) => (
            <ScrapbookSpread key={`phase-${index}`} phase={phase} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};
