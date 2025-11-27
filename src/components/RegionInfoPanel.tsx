'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, MapPin, DollarSign, Sparkles } from 'lucide-react';
import { RegionData } from '@/lib/regionsData';
import Link from 'next/link';

interface RegionInfoPanelProps {
  region: RegionData | null;
  isVisible: boolean;
}

export const RegionInfoPanel: React.FC<RegionInfoPanelProps> = ({ region, isVisible }) => {
  return (
    <AnimatePresence mode="wait">
      {isVisible && region && (
        <motion.div
          key={region.id}
          initial={{ opacity: 0, x: 20, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -20, scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="relative bg-gradient-to-br from-[#FAF5ED] via-[#FFF8F0] to-[#FFF5EA] rounded-3xl border border-[#E7D7C1] shadow-[0_20px_50px_rgba(180,143,92,0.25)] p-6 md:p-8 space-y-6 overflow-hidden"
          style={{
            boxShadow: `0 20px 50px -12px rgba(180,143,92,0.25), 0 0 0 1px ${region.color}22`
          }}
        >
          {/* Decorative background accent - subtle waves */}
          <div className="absolute top-0 right-0 w-48 h-48 opacity-10 pointer-events-none">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <path
                d="M 0,100 Q 50,80 100,100 T 200,100 L 200,0 L 0,0 Z"
                fill={region.color}
                opacity="0.4"
              />
              <path
                d="M 0,140 Q 50,120 100,140 T 200,140 L 200,0 L 0,0 Z"
                fill={region.color}
                opacity="0.2"
              />
            </svg>
          </div>

          {/* Region Header */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-white text-xs font-bold rounded-full mb-3 shadow-md"
              style={{ 
                background: `linear-gradient(135deg, ${region.color} 0%, ${region.color}dd 100%)`
              }}
            >
              <MapPin className="w-3.5 h-3.5" />
              FEATURED REGION
            </motion.div>
            
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-3xl md:text-4xl font-bold text-stone-800 mb-2 leading-tight"
            >
              {region.name}
            </motion.h3>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-start gap-2.5 text-stone-700"
            >
              <Sparkles 
                className="w-5 h-5 flex-shrink-0 mt-0.5" 
                style={{ color: region.color }}
              />
              <p className="text-base leading-relaxed font-medium">
                {region.vibeLine}
              </p>
            </motion.div>
          </div>

          {/* Destinations */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="space-y-3 relative"
          >
            <div className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              ✈️ Featured Cities
            </div>
            <div className="flex flex-wrap gap-2.5">
              {region.destinations.map((destination, index) => (
                <motion.div
                  key={destination.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="px-4 py-2.5 bg-white/80 backdrop-blur-sm border-2 rounded-2xl flex items-center gap-2 shadow-sm hover:shadow-md transition-shadow"
                  style={{ 
                    borderColor: `${region.color}66`
                  }}
                >
                  <span className="text-xl">{destination.emoji}</span>
                  <span className="text-sm font-bold text-stone-800">
                    {destination.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Monthly Cost */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border-2 shadow-sm"
            style={{ 
              borderColor: `${region.color}88`,
              background: `linear-gradient(135deg, ${region.color}15 0%, ${region.color}08 100%)`
            }}
          >
            <div className="flex items-start gap-3.5">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md"
                style={{
                  background: `linear-gradient(135deg, ${region.color} 0%, ${region.color}dd 100%)`
                }}
              >
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
                  💰 Average Monthly Cost
                </div>
                <div 
                  className="text-2xl md:text-3xl font-extrabold mb-1"
                  style={{ color: region.color }}
                >
                  {region.monthlyCost}
                </div>
                <div className="text-xs text-stone-600 font-medium">
                  Accommodation • Coworking • Living
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="pt-2 relative"
          >
            <Link
              href="/route-builder"
              className="w-full flex items-center justify-center gap-2 text-base font-bold py-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] border-2 border-white/20 text-white"
              style={{
                background: `linear-gradient(135deg, ${region.color} 0%, ${region.color}dd 100%)`
              }}
            >
              <span>🗺️</span>
              <span>Explore {region.name}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          {/* Warm clay texture overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay rounded-3xl">
            <svg className="w-full h-full">
              <filter id="noise">
                <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" />
              </filter>
              <rect width="100%" height="100%" filter="url(#noise)" />
            </svg>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};


