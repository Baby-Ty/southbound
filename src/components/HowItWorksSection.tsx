'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Pick your vibe',
      description: 'Tell us what you\'re into. We match you with places that fit your lifestyle and budget.',
      icon: '✨'
    },
    {
      number: '02',
      title: 'Book your trip',
      description: 'We lock in your stay, workspace, and a few local experiences. One simple itinerary. No admin.',
      icon: '📅'
    },
    {
      number: '03',
      title: 'Just show up',
      description: 'Arrive and settle in. Fast Wi-Fi, a smooth setup, and local support from day one.',
      icon: '🚀'
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
            How it works
          </h2>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            We\'ve stripped away the stress of planning so you can focus on living.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-stone-200 -z-10 border-t-2 border-dashed border-stone-300" />

          {steps.map((step, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white relative group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-white border-2 border-stone-100 rounded-full flex items-center justify-center text-4xl mb-6 shadow-sm group-hover:shadow-md group-hover:scale-110 group-hover:border-[#E86B32] transition-all duration-300 z-10 relative">
                  {step.icon}
                  <div className="absolute -top-2 -right-2 bg-stone-900 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-3 group-hover:text-[#E86B32] transition-colors">{step.title}</h3>
                <p className="text-stone-600 leading-relaxed text-sm md:text-base max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link 
            href="/route-builder"
            className="inline-block border-b-2 border-[#E86B32] text-stone-900 font-bold hover:text-[#E86B32] transition-colors pb-1"
          >
            Build your own itinerary &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
