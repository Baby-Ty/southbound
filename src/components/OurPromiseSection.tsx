'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Container } from './ui/Container';
import { Section } from './ui/Section';

interface OurPromiseSectionProps {
  embedded?: boolean;
  greeting?: string;
  bodyParagraphs?: string[];
  closing?: string;
}

const OurPromiseSection: React.FC<OurPromiseSectionProps> = ({ 
  embedded = false,
  greeting = "Howzit,",
  bodyParagraphs = [
    "South Bound was built for remote workers who want a bit more out of everyday life, without turning everything upside down.",
    "It's about staying longer, settling in properly, and building a rhythm that works for both work and living somewhere new.",
    "We help make that transition feel simpler and more intentional, so you're not figuring it all out on your own.",
    "Less hassle. More living."
  ],
  closing = "See you out there,"
}) => {
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
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
            {/* Pin Head */}
            <div className="w-8 h-8 rounded-full bg-red-600 border-b-4 border-red-800 shadow-lg relative flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white/30 absolute top-1 left-1"></div>
            </div>
            {/* Pin Body Shadow */}
            <div className="w-1 h-4 bg-stone-800/20 -mt-1 blur-[1px]"></div>
        </div>

        {/* Washi Tape Visual (Top Right) */}
        <div 
          className="absolute -top-8 -right-8 w-32 h-10 bg-orange-100/60 opacity-90 transform rotate-[15deg] shadow-sm z-20 backdrop-blur-[2px] border-x border-orange-200/30" 
          style={{ 
            clipPath: 'polygon(5% 0%, 95% 0%, 100% 20%, 98% 80%, 95% 100%, 5% 100%, 0% 80%, 2% 20%)',
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)'
          }}
        ></div>

        {/* The Note Paper */}
        <div 
          className="bg-[#fef9c3] p-6 md:p-8 rounded-sm shadow-[0_20px_50px_-10px_rgba(0,0,0,0.2)] relative text-[#1c1917] transform rotate-1 overflow-hidden"
          style={{
            backgroundImage: `
              linear-gradient(90deg, transparent 49px, #ab3d3d30 49px, #ab3d3d30 51px, transparent 51px),
              repeating-linear-gradient(transparent, transparent 35px, #94a3b830 35px, #94a3b830 36px)
            `,
            backgroundSize: '100% 100%, 100% 36px',
            backgroundPosition: '0 0, 0 28px',
            backgroundRepeat: 'no-repeat, repeat'
          }}
        >
          {/* Subtle Paper Texture Overlay */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")' }}></div>

          <div className="relative pl-14 md:pl-16">
            
            {/* Title */}
            <h2 className="text-4xl md:text-5xl font-bold text-[#E86B32] font-handwritten -rotate-1 mb-9 leading-[36px] m-0 pt-2">
              A Note from Us
            </h2>

            {/* Greeting */}
            <p className="font-handwritten text-3xl font-bold leading-[36px] mb-9">
              {greeting}
            </p>

            {/* Body Text */}
            <div className="font-handwritten text-2xl font-medium leading-[36px]">
              {bodyParagraphs.map((paragraph, index) => (
                <div key={index} className="mb-9">
                  <p className={index === bodyParagraphs.length - 1 ? "font-bold" : ""}>
                    {paragraph}
                  </p>
                </div>
              ))}
            </div>

            {/* Footer / Signature */}
            <div className="pt-0 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
              <div className="space-y-9">
                <p className="font-handwritten text-2xl leading-[36px] mb-0">{closing}</p>
                <div className="font-handwritten text-3xl font-bold flex items-center gap-2 leading-[36px]">
                  – The South Bound team <span className="text-2xl">🌍</span>
                </div>
              </div>

              {/* Stamp Graphic */}
              <div className="border-4 border-[#E86B32]/10 rounded-full w-20 h-20 flex items-center justify-center transform -rotate-12 font-sans font-bold text-[8px] tracking-widest text-[#E86B32]/30 uppercase text-center leading-tight shadow-sm bg-white/30 backdrop-blur-sm">
                Official<br/>Promise<br/>Est. 2024
              </div>
            </div>

            {/* CTA Button */}
            <div className="mt-8 mb-2">
                <Link href="/contact" className="inline-block bg-[#E86B32] text-white font-bold py-2 px-6 rounded-sm shadow-md hover:bg-[#d55a24] hover:-translate-y-0.5 transition-all font-sans text-xs transform -rotate-1">
                    Let&apos;s Chat
                </Link>
            </div>

          </div>
        </div>
        
        {/* Washi Tape Visual (Bottom Left) */}
        <div 
          className="absolute -bottom-6 -left-6 w-28 h-10 bg-blue-100/40 opacity-80 transform -rotate-[10deg] shadow-sm z-20 backdrop-blur-[1px] border-x border-blue-200/20"
          style={{ 
            clipPath: 'polygon(2% 10%, 98% 0%, 100% 90%, 95% 100%, 5% 95%, 0% 85%)',
            backgroundImage: 'repeating-linear-gradient(-45deg, transparent, transparent 15px, rgba(255,255,255,0.05) 15px, rgba(255,255,255,0.05) 30px)'
          }}
        ></div>

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
