'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '../ui/Container';
import { Section } from '../ui/Section';
import { Heading, Eyebrow } from '../ui/Heading';
import { Button } from '../ui/Button';
import DestinationRotator from '../DestinationRotator';

export const HeroSection: React.FC = () => {
  const destinations = ['BALI', 'MEXICO', 'LISBON', 'CAPE TOWN', 'BANGKOK', 'MEDELLÍN'];

  return (
    <Section className="bg-white relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-teal-50 to-orange-50 rounded-full blur-3xl opacity-30 -z-10"></div>
      
      <Container>
        <div className="grid grid-cols-12 gap-8 md:gap-12 items-center">
          {/* Left 8 cols - Text */}
          <motion.div 
            className="col-span-12 lg:col-span-8 space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Eyebrow>Work from abroad</Eyebrow>
            
            <Heading level={1}>
              Ready for a change of scene?
            </Heading>
            
            <p className="text-slate-600 text-lg md:text-xl leading-relaxed max-w-2xl">
              We make it easy for South African remote workers to live and work from exciting, 
              affordable destinations. Trips are for individuals and start at 90 days.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-6">
              <Button href="/discover" variant="primary">
                Start your journey
              </Button>
              <Button href="#globe" variant="secondary">
                Explore the globe
              </Button>
            </div>
          </motion.div>
          
          {/* Right 4 cols - Boarding Pass */}
          <motion.div 
            className="col-span-12 lg:col-span-4"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div
              className="relative"
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              {/* Main Boarding Pass Card */}
              <div className="bg-gradient-to-b from-white via-white to-orange-50/20 rounded-2xl shadow-[0_10px_30px_rgba(2,6,23,0.08)] border border-slate-200/60 p-8 relative overflow-hidden backdrop-blur-sm">
                {/* Paper texture overlay */}
                <div className="absolute inset-0 opacity-[0.02]" style={{
                  backgroundImage: `repeating-linear-gradient(
                    45deg,
                    transparent,
                    transparent 2px,
                    rgba(0,0,0,0.1) 2px,
                    rgba(0,0,0,0.1) 4px
                  )`
                }}></div>
                
                {/* Left side notch cutouts */}
                <div className="absolute -left-[2px] top-1/4 w-4 h-8 bg-white rounded-r-full"></div>
                <div className="absolute -left-[2px] bottom-1/4 w-4 h-8 bg-white rounded-r-full"></div>
                
                {/* Right side notch cutouts */}
                <div className="absolute -right-[2px] top-1/4 w-4 h-8 bg-white rounded-r-full"></div>
                <div className="absolute -right-[2px] bottom-1/4 w-4 h-8 bg-white rounded-r-full"></div>

                {/* Boarding Pass Header */}
                <div className="text-center mb-6 relative z-10">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-600 font-medium mb-3">
                    Remote Work Pass
                  </div>
                  <div className="w-20 h-[1px] bg-gradient-to-r from-teal-500 to-orange-500 mx-auto"></div>
                </div>

                {/* Destination Rotator */}
                <div className="mb-6 relative z-10">
                  <DestinationRotator destinations={destinations} />
                </div>

                {/* Dashed divider */}
                <div className="border-t border-dashed border-slate-300 my-6 relative z-10"></div>

                {/* Flight Details */}
                <div className="space-y-4 text-center relative z-10">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-xs uppercase tracking-[0.15em] text-slate-500 mb-1">From</div>
                      <div className="font-mono font-bold text-slate-900">JNB</div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-[0.15em] text-slate-500 mb-1">Class</div>
                      <div className="font-mono font-bold text-slate-900">REMOTE</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-xs uppercase tracking-[0.15em] text-slate-500 mb-1">Gate</div>
                      <div className="font-mono font-bold text-slate-900">A22</div>
                    </div>
                    <div>
                      <div className="text-xs uppercase tracking-[0.15em] text-slate-500 mb-1 flex items-center justify-center gap-1">
                        Zone
                      </div>
                      <div className="font-mono font-bold text-slate-900">ADVENTURE</div>
                    </div>
                  </div>
                  
                  <div className="border-t border-dashed border-slate-300 my-6"></div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-bold text-slate-900 uppercase tracking-[0.2em]">
                      SOUTH BOUND
                    </div>
                    {/* Simple barcode representation */}
                    <div className="flex space-x-[1px]">
                      {[...Array(8)].map((_, i) => (
                        <div key={i} className={`w-[2px] bg-slate-600 ${i % 2 === 0 ? 'h-4' : 'h-3'}`}></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-orange-200/60 rounded-full blur-sm -z-10"></div>
              <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-teal-200/40 rounded-full blur-md -z-10"></div>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
};

