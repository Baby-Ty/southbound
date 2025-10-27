'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PrelaunchModal from './PrelaunchModal';
import { motion } from 'framer-motion';

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Find Your Vibe',
      description:
        'Choose your region, lifestyle, work setup, and travel style in our quick Route Builder. We’ll get a feel for how you like to live, work, and explore.',
      iconBg: 'bg-sb-teal-100',
      icon: '🧭'
    },
    {
      number: '02',
      title: 'See Your Route',
      description:
        'We’ll show you a few handpicked routes. Think tropical coworking hubs, city escapes, and coastal towns that fit your budget and vibe.',
      iconBg: 'bg-sb-orange-100',
      icon: '🗺️'
    },
    {
      number: '03',
      title: 'Personalize Your Trip',
      description:
        'Adjust your route, swap destinations, or add extras like surf lessons or wellness passes. We’ll handle the details and confirm your itinerary.',
      iconBg: 'bg-sb-mint-100',
      icon: '🎒'
    },
    {
      number: '04',
      title: 'Pack & Go',
      description:
        'Everything’s ready, just show up. We handle your stay, Wi‑Fi, SIM, airport pickup, and local support so you can focus on the adventure.',
      iconBg: 'bg-sb-beige-200',
      icon: '🌍'
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.5, // Increased from 0.1 to 0.5 for clear sequential loading
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8
      }
    }
  };

  const [prelaunchOpen, setPrelaunchOpen] = useState(false);

  return (
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#FDF6EF] to-[#E8FDFD]">
      <div className="max-w-screen-xl mx-auto">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-sb-navy-700 mb-6 leading-tight">
            How It Works
          </h2>
          <div className="w-24 h-1 bg-sb-orange-500 rounded-full mx-auto mb-6"></div>
          <p className="text-xl text-sb-navy-600 leading-relaxed max-w-3xl mx-auto">
            From spark to route, here’s how we match you with your perfect remote work destination.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex flex-col items-center text-center p-6 bg-white rounded-3xl shadow-medium hover:shadow-large transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-y-2"
              whileHover={{ 
                scale: 1.05,
                y: -8,
                transition: { duration: 0.2 }
              }}
            >
              {/* Step Number Badge */}
              <motion.div 
                className="rounded-full bg-[#C2F5D8] text-sb-navy-700 text-sm font-bold px-3 py-1 mb-4"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                viewport={{ once: true }}
              >
                Step {step.number}
              </motion.div>

              {/* Icon Circle */}
              <motion.div 
                className={`w-20 h-20 ${step.iconBg} rounded-full flex items-center justify-center shadow-md mb-6 transition-transform duration-300 hover:rotate-12`}
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ rotate: 12 }}
              >
                <span className="text-3xl">{step.icon}</span>
              </motion.div>

              {/* Title with Emoji */}
              <motion.div 
                className="flex items-center gap-2 mb-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                viewport={{ once: true }}
              >
                <span className="text-2xl">{step.icon}</span>
                <h3 className="text-lg font-semibold text-sb-navy-700">
                  {step.title}
                </h3>
              </motion.div>

              {/* Description */}
              <motion.p 
                className="text-sb-navy-600 leading-relaxed text-sm"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                viewport={{ once: true }}
              >
                {step.description}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div 
          className="text-center mt-16 p-8 bg-white/70 backdrop-blur-sm rounded-3xl border border-sb-orange-200"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-3xl">🚀</span>
            <h3 className="text-2xl font-bold text-sb-navy-700">Ready to Start Your Adventure?</h3>
            <span className="text-3xl">🌍</span>
          </div>
          <p className="text-sb-navy-600 mb-6 leading-relaxed">
            Work from anywhere, live fully, and turn your everyday into something unforgettable.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              href="/route-builder"
              className="inline-flex items-center px-8 py-4 bg-sb-orange-500 hover:bg-sb-orange-600 text-white font-semibold rounded-full transition-all duration-300 shadow-medium hover:shadow-large hover:scale-105"
            >
              <span>🎯</span>
              <span className="ml-2">let&apos;s Plan Your Trip</span>
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>

        {/* Bottom Illustration */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-4 text-6xl opacity-80">
            {['🏖️', '💻', '☕', '🌴', '✈️'].map((emoji, index) => (
              <motion.span
                key={index}
                className="animate-bounce"
                style={{animationDelay: `${index * 0.1}s`}}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.8 + (index * 0.1), duration: 0.3 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.2 }}
              >
                {emoji}
              </motion.span>
            ))}
          </div>
        </motion.div>
        {prelaunchOpen && (
          <PrelaunchModal isOpen={prelaunchOpen} onClose={() => setPrelaunchOpen(false)} />
        )}
      </div>
    </section>
  );
};

export default HowItWorksSection; 
