'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Container } from './ui/Container';
import { Section } from './ui/Section';

interface OurPromiseSectionProps {
  embedded?: boolean;
}

const OurPromiseSection: React.FC<OurPromiseSectionProps> = ({ embedded = false }) => {
  const Content = () => (
    <div className={`${embedded ? 'w-full' : 'max-w-3xl mx-auto'} relative`}>
      {/* Sticky Note Container */}
      <motion.div 
        className="relative"
        initial={{ opacity: 0, rotate: -2, y: 20 }}
        whileInView={{ opacity: 1, rotate: 0, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        viewport={{ once: true }}
      >
        {/* Pin Visual */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 filter drop-shadow-md">
            <div className="w-6 h-6 rounded-full bg-[#E86B32] border-2 border-white shadow-sm"></div>
        </div>

        {/* Washi Tape Visual (Top Right) */}
        <div className="absolute -top-6 -right-6 w-32 h-8 bg-[#fef3c7] opacity-80 transform rotate-12 shadow-sm z-10 backdrop-blur-[1px]" style={{ clipPath: 'polygon(2% 0%, 98% 0%, 100% 100%, 0% 100%)' }}></div>

        {/* The Note Paper */}
        <div 
          className="bg-[#fef9c3] p-8 md:p-10 rounded-sm shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] relative text-[#1c1917] transform rotate-1"
          style={{
            backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #94a3b840 31px, #94a3b840 32px)',
            backgroundAttachment: 'local'
          }}
        >
          {/* Red Margin Line */}
          <div className="absolute left-8 md:left-12 top-0 bottom-0 w-[2px] bg-red-300/50 h-full"></div>

          <div className="relative pl-8 md:pl-10 space-y-6">
            
            {/* Title */}
            <h2 className="text-3xl md:text-4xl font-bold text-[#E86B32] font-handwritten -rotate-1 mb-6">
              A Note from Us
            </h2>

            {/* Greeting */}
            <p className="font-handwritten text-xl font-bold">
              Howzit,
            </p>

            {/* Body Text */}
            <div className="font-handwritten text-lg space-y-6 leading-[32px]">
              <p>
                South Bound was built for remote workers who want a bit more out of life.
              </p>
              
              <p>
                We take care of the tricky stuff: accommodation, co-working, SIMs, experiences. You just focus on exploring, working, and enjoying your new home.
              </p>

              <p className="font-bold">
                Less hassle. More living.
              </p>
            </div>

            {/* Footer / Signature */}
            <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
              <div>
                <p className="font-handwritten text-lg mb-1">See you out there,</p>
                <div className="font-handwritten text-xl font-bold flex items-center gap-2">
                  – The Team <span>🌍</span>
                </div>
              </div>

              {/* Stamp Graphic */}
              <div className="border-4 border-[#e5e5e5] rounded-full w-20 h-20 flex items-center justify-center transform -rotate-12 opacity-70 font-sans font-bold text-[9px] tracking-widest text-stone-400 uppercase text-center leading-tight">
                Official<br/>Promise<br/>Est. 2024
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-6">
                <Link href="/contact" className="inline-block bg-[#E86B32] text-white font-bold py-2 px-6 rounded-full shadow-md hover:bg-[#d55a24] hover:-translate-y-0.5 transition-all font-sans text-sm">
                    Let&apos;s Chat
                </Link>
            </div>

          </div>
        </div>
        
        {/* Washi Tape Visual (Bottom Left) */}
        <div className="absolute -bottom-5 -left-4 w-24 h-8 bg-[#fef3c7] opacity-80 transform -rotate-6 shadow-sm z-10 backdrop-blur-[1px]"></div>

      </motion.div>
    </div>
  );

  if (embedded) {
    return <Content />;
  }

  return (
    <Section className="bg-[#FFF8F0] relative overflow-hidden py-24">
      <Container>
        <Content />
      </Container>
    </Section>
  );
};

export default OurPromiseSection;
