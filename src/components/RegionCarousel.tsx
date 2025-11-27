'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { MapPin, DollarSign, Sparkles, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { RegionData } from '@/lib/regionsData';
import { Button } from './ui/Button';

interface RegionCarouselProps {
  regions: RegionData[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
}

export const RegionCarousel: React.FC<RegionCarouselProps> = ({
  regions,
  activeIndex,
  onIndexChange
}) => {
  const [direction, setDirection] = useState(0);

  const handleSwipe = (offset: number) => {
    if (offset > 50 && activeIndex > 0) {
      setDirection(-1);
      onIndexChange(activeIndex - 1);
    } else if (offset < -50 && activeIndex < regions.length - 1) {
      setDirection(1);
      onIndexChange(activeIndex + 1);
    }
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    handleSwipe(info.offset.x);
  };

  const goToNext = () => {
    if (activeIndex < regions.length - 1) {
      setDirection(1);
      onIndexChange(activeIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (activeIndex > 0) {
      setDirection(-1);
      onIndexChange(activeIndex - 1);
    }
  };

  const activeRegion = regions[activeIndex];

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.9
    })
  };

  return (
    <div className="relative w-full">
      {/* Main Card */}
      <div className="relative overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={activeIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
              scale: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="bg-gradient-to-br from-orange-50 via-white to-orange-50 rounded-2xl border-2 border-orange-200 shadow-[0_10px_30px_rgba(0,0,0,0.12)] p-6 space-y-5 cursor-grab active:cursor-grabbing"
          >
            {/* Region Header */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-teal-500 to-orange-500 text-white text-xs font-semibold rounded-full mb-3">
                <MapPin className="w-3 h-3" />
                Region {activeIndex + 1} of {regions.length}
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-stone-800 mb-2">
                {activeRegion.name}
              </h3>

              <div className="flex items-start gap-2 text-stone-600">
                <Sparkles className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm italic leading-relaxed">
                  {activeRegion.vibeLine}
                </p>
              </div>
            </div>

            {/* Destinations */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-stone-600 uppercase tracking-wide">
                Featured Destinations
              </div>
              <div className="flex flex-wrap gap-2">
                {activeRegion.destinations.map((destination) => (
                  <div
                    key={destination.name}
                    className="px-3 py-2 bg-gradient-to-r from-cyan-50 to-orange-100 border-2 border-cyan-400 rounded-full flex items-center gap-2"
                  >
                    <span className="text-lg">{destination.emoji}</span>
                    <span className="text-sm font-semibold text-stone-800">
                      {destination.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Cost */}
            <div className="bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl p-4 border-2 border-orange-300 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-orange-500 to-orange-400 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-stone-600 mb-1 uppercase tracking-wide">
                    Average Monthly Cost
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-orange-600 mb-1">
                    {activeRegion.monthlyCost}
                  </div>
                  <div className="text-xs text-stone-600">
                    Accommodation + Coworking + Living
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Button
              href="/route-builder"
              variant="primary"
              className="w-full flex items-center justify-center gap-2 text-base py-3 bg-gradient-to-r from-teal-500 to-orange-500 hover:from-teal-600 hover:to-orange-600 transition-all duration-300 shadow-lg"
            >
              <span>Explore {activeRegion.name}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <div className="flex items-center justify-between mt-4">
        <button
          onClick={goToPrevious}
          disabled={activeIndex === 0}
          className={`p-3 rounded-full transition-all duration-300 ${
            activeIndex === 0
              ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-teal-500 to-orange-500 text-white hover:shadow-lg active:scale-95'
          }`}
          aria-label="Previous region"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Pagination Dots */}
        <div className="flex gap-2">
          {regions.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > activeIndex ? 1 : -1);
                onIndexChange(index);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? 'w-8 bg-gradient-to-r from-teal-500 to-orange-500'
                  : 'w-2 bg-stone-300 hover:bg-stone-400'
              }`}
              aria-label={`Go to region ${index + 1}`}
            />
          ))}
        </div>

        <button
          onClick={goToNext}
          disabled={activeIndex === regions.length - 1}
          className={`p-3 rounded-full transition-all duration-300 ${
            activeIndex === regions.length - 1
              ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-teal-500 to-orange-500 text-white hover:shadow-lg active:scale-95'
          }`}
          aria-label="Next region"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Swipe Indicator */}
      <div className="text-center mt-4 text-xs text-stone-500 italic">
        Swipe or use arrows to explore more regions
      </div>
    </div>
  );
};




