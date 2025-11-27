'use client';

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '../ui/Container';
import { regions, RegionData } from '@/lib/regionsData';
import { useInViewReveal } from '@/hooks/useInViewReveal';
import { ArrowRight, ChevronLeft, ChevronRight, MapPin, Sparkles } from 'lucide-react';
import Link from 'next/link';

// Region card images (using Unsplash for visual appeal)
const regionImages: Record<string, string> = {
  'south-america': 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=800&q=80',
  'southeast-asia': 'https://images.unsplash.com/photo-1528181304800-259b08848526?auto=format&fit=crop&w=800&q=80',
  'central-east-europe': 'https://images.unsplash.com/photo-1541343672885-9be56236a37b?auto=format&fit=crop&w=800&q=80',
  'south-europe': 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=800&q=80'
};

interface RegionCardProps {
  region: RegionData;
  isSelected: boolean;
  onClick: () => void;
}

const RegionCard: React.FC<RegionCardProps> = ({ region, isSelected, onClick }) => {
  return (
    <motion.div
      className="flex-shrink-0 w-[300px] md:w-[340px] cursor-pointer group"
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <div 
        className={`relative h-[420px] rounded-3xl overflow-hidden shadow-xl transition-all duration-500 ${
          isSelected 
            ? 'ring-4 ring-offset-4 ring-offset-[#f0fdf4]' 
            : 'hover:shadow-2xl'
        }`}
        style={{ 
          ringColor: isSelected ? region.color : 'transparent'
        }}
      >
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
          style={{ backgroundImage: `url(${regionImages[region.id]})` }}
        />
        
        {/* Gradient Overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, ${region.color}ee 0%, ${region.color}99 30%, transparent 70%)`
          }}
        />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
          {/* Region Badge */}
          <div className="flex items-center gap-2 mb-3">
            <div 
              className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
            >
              <MapPin className="w-3 h-3" />
              Region
            </div>
            {isSelected && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-3 py-1 bg-white rounded-full text-xs font-bold uppercase tracking-wider"
                style={{ color: region.color }}
              >
                Selected
              </motion.div>
            )}
          </div>

          {/* Region Name */}
          <h3 className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg">
            {region.name}
          </h3>

          {/* Vibe Line */}
          <p className="text-white/90 text-sm md:text-base mb-4 flex items-start gap-2">
            <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" />
            {region.vibeLine}
          </p>

          {/* Destinations Preview */}
          <div className="flex flex-wrap gap-2 mb-4">
            {region.destinations.map((dest) => (
              <span 
                key={dest.name}
                className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium flex items-center gap-1.5"
              >
                <span>{dest.emoji}</span>
                {dest.name}
              </span>
            ))}
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-white/70 mb-1">From</div>
              <div className="text-xl font-bold">{region.monthlyCost.split('–')[0].trim()}<span className="text-sm font-normal text-white/80">/mo</span></div>
            </div>
            <div 
              className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110"
            >
              <ArrowRight className="w-5 h-5" style={{ color: region.color }} />
            </div>
          </div>
        </div>

        {/* Selected Indicator Glow */}
        {isSelected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              boxShadow: `inset 0 0 60px ${region.color}40`
            }}
          />
        )}
      </div>
    </motion.div>
  );
};

// Detail panel that shows when a region is selected
const RegionDetailPanel: React.FC<{ region: RegionData | null }> = ({ region }) => {
  return (
    <AnimatePresence mode="wait">
      {region && (
        <motion.div
          key={region.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="mt-12 max-w-2xl mx-auto"
        >
          <div 
            className="relative bg-white rounded-3xl shadow-2xl p-8 overflow-hidden border-2"
            style={{ borderColor: `${region.color}40` }}
          >
            {/* Decorative corner accent */}
            <div 
              className="absolute top-0 right-0 w-32 h-32 opacity-10"
              style={{
                background: `radial-gradient(circle at top right, ${region.color}, transparent 70%)`
              }}
            />

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-stone-900 mb-2">
                    Ready to explore {region.name}?
                  </h3>
                  <p className="text-stone-600">
                    Start building your perfect remote work adventure today.
                  </p>
                </div>
                <Link
                  href="/route-builder"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-bold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex-shrink-0"
                  style={{ backgroundColor: region.color }}
                >
                  <span>Start your journey</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>

              {/* Quick Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-stone-50 rounded-2xl p-4 text-center">
                  <div className="text-2xl mb-1">💰</div>
                  <div className="text-xs text-stone-500 uppercase tracking-wider mb-1">Budget</div>
                  <div className="font-bold text-stone-900 text-sm">{region.monthlyCost}</div>
                </div>
                <div className="bg-stone-50 rounded-2xl p-4 text-center">
                  <div className="text-2xl mb-1">🏙️</div>
                  <div className="text-xs text-stone-500 uppercase tracking-wider mb-1">Cities</div>
                  <div className="font-bold text-stone-900 text-sm">{region.destinations.length} destinations</div>
                </div>
                <div className="bg-stone-50 rounded-2xl p-4 text-center">
                  <div className="text-2xl mb-1">📅</div>
                  <div className="text-xs text-stone-500 uppercase tracking-wider mb-1">Duration</div>
                  <div className="font-bold text-stone-900 text-sm">90+ days</div>
                </div>
                <div className="bg-stone-50 rounded-2xl p-4 text-center">
                  <div className="text-2xl mb-1">✨</div>
                  <div className="text-xs text-stone-500 uppercase tracking-wider mb-1">Vibe</div>
                  <div className="font-bold text-stone-900 text-sm">Work & Play</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const GlobeSection: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const { ref: headerRef, isVisible: headerVisible } = useInViewReveal<HTMLDivElement>();

  const selectedRegion = regions.find(r => r.id === selectedRegionId) || null;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 360;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section
      id="globe"
      className="relative bg-gradient-to-b from-[#f0fdf4] via-white to-[#f0fdf4] overflow-hidden py-20 md:py-28"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, rgba(110, 181, 162, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, rgba(231, 122, 66, 0.1) 0%, transparent 50%)`
        }} />
      </div>

      <Container>
        {/* Section Header */}
        <div
          ref={headerRef}
          className={`text-center mb-12 md:mb-16 sb-reveal ${headerVisible ? 'is-visible' : ''}`}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 bg-gradient-to-r from-teal-100 to-orange-100 text-stone-700 text-sm font-bold rounded-full mb-4 border border-teal-200/50"
          >
            🌍 EXPLORE DESTINATIONS
          </motion.div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-stone-900 mb-4">
            Where will you work from?
          </h2>
          <p className="text-stone-600 text-lg md:text-xl max-w-2xl mx-auto">
            Pick a region and start building your remote work adventure
          </p>
        </div>
      </Container>

      {/* Carousel */}
      <div className="relative">
        {/* Navigation Buttons */}
        <div className="hidden md:block">
          <button
            onClick={() => scroll('left')}
            className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform duration-300 border border-stone-200"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6 text-stone-700" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-14 h-14 bg-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform duration-300 border border-stone-200"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6 text-stone-700" />
          </button>
        </div>

        {/* Gradient Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-8 md:w-24 bg-gradient-to-r from-[#f0fdf4] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-8 md:w-24 bg-gradient-to-l from-[#f0fdf4] to-transparent z-10 pointer-events-none" />

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide px-8 md:px-16 lg:px-24 py-4 snap-x snap-mandatory"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {regions.map((region, index) => (
            <motion.div
              key={region.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="snap-center"
            >
              <RegionCard
                region={region}
                isSelected={selectedRegionId === region.id}
                onClick={() => setSelectedRegionId(
                  selectedRegionId === region.id ? null : region.id
                )}
              />
            </motion.div>
          ))}
        </div>

        {/* Scroll Indicator for Mobile */}
        <div className="flex justify-center mt-6 md:hidden">
          <div className="flex gap-2">
            {regions.map((region) => (
              <button
                key={region.id}
                onClick={() => setSelectedRegionId(region.id)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  selectedRegionId === region.id 
                    ? 'w-8' 
                    : 'bg-stone-300 hover:bg-stone-400'
                }`}
                style={{
                  backgroundColor: selectedRegionId === region.id ? region.color : undefined
                }}
                aria-label={`Select ${region.name}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      <Container>
        <RegionDetailPanel region={selectedRegion} />
        
        {/* Fallback CTA when nothing selected */}
        {!selectedRegion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <p className="text-stone-500 text-lg mb-4">
              Tap a card above to learn more about each region
            </p>
            <Link
              href="/route-builder"
              className="inline-flex items-center gap-2 text-[#E86B32] font-semibold hover:underline"
            >
              Or skip ahead and start planning
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </Container>
    </section>
  );
};
