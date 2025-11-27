'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PrelaunchModal from './PrelaunchModal';
import { Container } from './ui/Container';
import { Section } from './ui/Section';
import { Heading } from './ui/Heading';
import { Button } from './ui/Button';

const LuggageTag: React.FC<{ 
  icon: string; 
  title: string; 
  description: string; 
  color: string; 
  rotate: string;
  delay: number;
}> = ({ icon, title, description, color, rotate, delay }) => (
  <motion.div 
    className={`relative p-6 ${color} rounded-lg shadow-md transform border border-stone-200/60`}
    style={{ rotate: rotate }}
    initial={{ opacity: 0, y: 20, rotate: 0 }}
    whileInView={{ opacity: 1, y: 0, rotate: rotate }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    whileHover={{ scale: 1.02, rotate: '0deg', zIndex: 10, transition: { duration: 0.2 } }}
  >
    {/* Tag Hole */}
    <div className="absolute top-1/2 -left-3 w-6 h-6 bg-white rounded-full border border-stone-300 flex items-center justify-center transform -translate-y-1/2 shadow-inner">
      <div className="w-2 h-2 bg-stone-200 rounded-full"></div>
    </div>
    
    <div className="flex items-start gap-4 ml-2">
      <div className="text-4xl flex-shrink-0 drop-shadow-sm">{icon}</div>
      <div>
        <h3 className="text-lg font-bold text-stone-800 mb-2 font-handwritten tracking-wide">{title}</h3>
        <p className="text-stone-700 text-sm md:text-base leading-relaxed font-medium font-handwritten opacity-90">
          {description}
        </p>
      </div>
    </div>
  </motion.div>
);

const Sticker: React.FC<{
  emoji: string;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
}> = ({ emoji, className = '', style, delay = 0 }) => (
  <motion.div
    className={`absolute flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-md border-4 border-white ${className}`}
    style={style}
    initial={{ scale: 0, opacity: 0 }}
    whileInView={{ scale: 1, opacity: 1 }}
    transition={{ 
      type: "spring",
      stiffness: 260,
      damping: 20,
      delay 
    }}
    viewport={{ once: true }}
    whileHover={{ scale: 1.1, rotate: 5 }}
  >
    <span className="text-4xl filter drop-shadow-sm">{emoji}</span>
  </motion.div>
);

const WhosThisForSection: React.FC = () => {
  const [prelaunchOpen, setPrelaunchOpen] = useState(false);

  return (
    <Section id="whos-this-for" className="bg-[#f6f3eb] relative overflow-hidden">
      {/* Texture Overlay */}
      <div className="absolute inset-0 texture-paper opacity-80 pointer-events-none"></div>
      
      {/* Background Stamps */}
      <div className="absolute top-10 right-10 opacity-5 rotate-12 text-9xl font-bold tracking-widest text-stone-400 select-none pointer-events-none">
        EXPLORE
      </div>
      <div className="absolute bottom-10 left-10 opacity-5 -rotate-6 text-9xl font-bold tracking-widest text-stone-400 select-none pointer-events-none">
        WANDER
      </div>

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20 items-center">
          {/* Left Column - Luggage Tags */}
          <div className="lg:col-span-7 space-y-10">
            {/* Main Heading */}
            <div className="space-y-4 text-center lg:text-left">
              <Heading level={2} className="font-serif">
                Who's this for?
              </Heading>
              <p className="text-stone-600 text-lg font-handwritten max-w-md mx-auto lg:mx-0">
                If you see yourself in these tags, pack your bags.
              </p>
            </div>

            {/* Tags Stack */}
            <div className="space-y-6 relative pl-4">
              {/* Connecting String Line */}
              <div className="absolute left-0 top-4 bottom-4 w-0.5 border-l-2 border-dashed border-stone-300 hidden lg:block"></div>

              <LuggageTag 
                icon="🧑‍💻" 
                title="Digital Nomads" 
                description="You've mastered working from anywhere. We handle the logistics (WiFi, desks, SIMs) so you can focus on the work."
                color="bg-sky-100"
                rotate="-2deg"
                delay={0.1}
              />

              <LuggageTag 
                icon="✈️" 
                title="Aspiring Adventurers" 
                description="Dreaming of Bali or Lisbon? We've done the groundwork to find safe, fun, and connected spots for your first leap."
                color="bg-orange-100"
                rotate="1deg"
                delay={0.3}
              />

              <LuggageTag 
                icon="🌍" 
                title="Experience Seekers" 
                description="You want transformation, not just a vacation. Live like a local, learn new skills, and return with real stories."
                color="bg-teal-100"
                rotate="-1deg"
                delay={0.5}
              />
            </div>

            {/* Call to Action */}
            <div className="pt-6 text-center lg:text-left">
              <Button href="/route-builder" variant="primary">
                Start your journey
              </Button>
            </div>
          </div>

          {/* Right Column - Travel Journal */}
          <div className="lg:col-span-5 flex justify-center relative min-h-[400px]">
            <motion.div 
              className="relative w-full max-w-sm"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              style={{ transform: 'rotate(3deg)' }}
            >
              {/* Journal Book */}
              <div className="relative aspect-[3/4]">
                {/* Page edges (visible from right side) */}
                <div className="absolute right-1 top-3 bottom-3 w-3 bg-gradient-to-r from-stone-200 via-stone-100 to-stone-50 rounded-r-sm"
                  style={{ 
                    boxShadow: 'inset -2px 0 4px rgba(0,0,0,0.1)',
                    background: 'repeating-linear-gradient(to bottom, #faf9f7 0px, #faf9f7 2px, #f5f4f2 2px, #f5f4f2 4px)'
                  }}
                />
                <div className="absolute right-2 top-4 bottom-4 w-2 bg-gradient-to-r from-stone-100 to-stone-50 rounded-r-sm opacity-80" />
                
                {/* Main Journal Cover */}
                <div 
                  className="relative w-full h-full rounded-md shadow-2xl overflow-hidden"
                  style={{
                    background: 'linear-gradient(145deg, #8B5A2B 0%, #6B4423 50%, #5D3A1A 100%)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.1)'
                  }}
                >
                  {/* Leather texture overlay */}
                  <div 
                    className="absolute inset-0 opacity-30 pointer-events-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    }}
                  />
                  
                  {/* Spine binding */}
                  <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#4a3520] via-[#5D3A1A] to-transparent">
                    {/* Binding stitches */}
                    <div className="absolute left-3 top-0 bottom-0 w-0.5 flex flex-col justify-around py-6">
                      {[...Array(12)].map((_, i) => (
                        <div key={i} className="w-1.5 h-3 border border-amber-900/40 rounded-full" style={{ marginLeft: '-2px' }} />
                      ))}
                    </div>
                  </div>
                  
                  {/* Cover wear/aging at corners */}
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#9B6A3B]/30 to-transparent rounded-bl-full" />
                  <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-tl from-[#9B6A3B]/20 to-transparent rounded-tl-full" />
                  
                  {/* Embossed title area */}
                  <div className="absolute top-8 left-10 right-6">
                    <div 
                      className="text-center py-4 px-3 border-2 border-amber-900/30 rounded"
                      style={{ 
                        textShadow: '1px 1px 0 rgba(0,0,0,0.3), -1px -1px 0 rgba(255,255,255,0.1)',
                      }}
                    >
                      <span className="text-amber-100/80 text-sm tracking-[0.3em] uppercase font-medium">Travel</span>
                      <h3 className="text-amber-50 text-2xl font-bold font-handwritten mt-1 tracking-wide">Journal</h3>
                    </div>
                  </div>
                  
                  {/* Elastic band closure */}
                  <div 
                    className="absolute top-0 bottom-0 right-12 w-3 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800 rounded-full"
                    style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)' }}
                  />

                  {/* Travel Stickers on cover */}
                  <Sticker emoji="🏔️" style={{ top: '35%', left: '15%', rotate: '-10deg' }} delay={0.6} className="bg-blue-50 !w-14 !h-14" />
                  <Sticker emoji="🏄‍♂️" style={{ top: '55%', right: '20%', rotate: '15deg' }} delay={0.7} className="bg-yellow-50 !w-14 !h-14" />
                  <Sticker emoji="🍜" style={{ top: '70%', left: '20%', rotate: '-5deg' }} delay={0.8} className="bg-red-50 !w-12 !h-12" />
                  <Sticker emoji="💻" style={{ bottom: '8%', right: '25%', rotate: '-12deg' }} delay={0.9} className="bg-indigo-50 !w-12 !h-12" />
                  
                  {/* Southbound Sticker */}
                  <motion.div 
                    className="absolute w-24 h-24 bg-orange-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg z-10"
                    style={{ top: '42%', left: '50%', transform: 'translate(-50%, -50%)' }}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1, rotate: -10 }}
                    transition={{ type: "spring", delay: 1.0 }}
                    viewport={{ once: true }}
                  >
                    <span className="text-white font-bold text-sm text-center leading-tight font-handwritten">
                      SOUTH<br/>BOUND
                    </span>
                  </motion.div>
                  
                  {/* Corner bookmark ribbon */}
                  <div className="absolute -top-1 right-16 w-6 h-16 bg-red-600 shadow-md" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 50% 85%, 0 100%)' }} />
                </div>
                
                {/* Book shadow underneath */}
                <div className="absolute -bottom-2 left-4 right-2 h-4 bg-gradient-to-t from-black/20 to-transparent blur-sm rounded-full" />
              </div>
            </motion.div>
          </div>
        </div>
      </Container>

      {/* PrelaunchModal */}
      {prelaunchOpen && (
        <PrelaunchModal isOpen={prelaunchOpen} onClose={() => setPrelaunchOpen(false)} />
      )}
    </Section>
  );
};

export default WhosThisForSection;
