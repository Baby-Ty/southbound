'use client';

import React from 'react';
import { motion } from 'framer-motion';

const AboutSection: React.FC = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section className="bg-gradient-to-r from-[#FDF6EF] to-[#E8FDFD]">
      <div className="max-w-screen-xl mx-auto">
        <motion.div 
          className="flex flex-col items-center text-center px-8 py-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Centered Text Content */}
          <motion.div 
            className="space-y-4 max-w-3xl"
            variants={itemVariants}
          >
            {/* Main Heading */}
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-[#1C2D3A] leading-snug"
              variants={itemVariants}
            >
              <span className="font-handwritten text-sb-teal-600">Swap Routine</span>{' '}
              <span>for Adventure</span>
            </motion.h2>

            {/* Condensed Description */}
            <motion.p 
              className="leading-relaxed text-base md:text-lg text-[#475569] max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Remote work doesn't have to mean staying put. South Bound helps you turn your remote job into a chance to live and work from new countries—with your work-ready apartment, co-working access, SIM card, visas, and travel details all sorted.
            </motion.p>

            {/* Quick Stats Icons */}
            <motion.div 
              className="flex flex-wrap gap-4 justify-center pt-4"
              variants={itemVariants}
            >
              <div className="flex items-center gap-2 text-[#475569]">
                <span className="text-2xl">🌍</span>
                <span className="text-sm font-medium">25+ Countries</span>
              </div>
              <div className="flex items-center gap-2 text-[#475569]">
                <span className="text-2xl">💻</span>
                <span className="text-sm font-medium">Work Ready</span>
              </div>
              <div className="flex items-center gap-2 text-[#475569]">
                <span className="text-2xl">🤝</span>
                <span className="text-sm font-medium">Community</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection; 
