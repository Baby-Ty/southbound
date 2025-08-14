'use client';

import React from 'react';
import Image from 'next/image';
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

  const imageVariants = {
    hidden: { opacity: 0, x: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.8
      }
    }
  };

  return (
    <section className="bg-gradient-to-r from-[#FDF6EF] to-[#E8FDFD]">
      <div className="max-w-screen-xl mx-auto">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center px-8 py-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Left Column - Image Collage */}
          <motion.div 
            className="flex justify-center"
            variants={imageVariants}
          >
            <div className="bg-white shadow-md rounded-xl p-6">
              {/* Primary Image */}
              <div className="relative mb-4">
                <Image
                  src="images/about-graphic.png"
                  alt="Illustration of passport, tickets, and digital nomad with map"
                  width={400}
                  height={300}
                  className="w-full h-auto object-contain rounded-xl"
                  priority={false}
                />
              </div>

              {/* Floating Elements Collage */}
              <div className="flex flex-wrap gap-4 justify-center">
                {/* Element 1 */}
                <motion.div 
                  className="bg-white rounded-lg p-3 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                  whileHover={{ rotate: 5 }}
                >
                  <div className="text-2xl mb-1">🌍</div>
                  <div className="text-xs text-[#475569] font-medium">25+ Countries</div>
                </motion.div>

                {/* Element 2 */}
                <motion.div 
                  className="bg-white rounded-lg p-3 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                  whileHover={{ rotate: -5 }}
                >
                  <div className="text-2xl mb-1">💻</div>
                  <div className="text-xs text-[#475569] font-medium">Work Ready</div>
                </motion.div>

                {/* Element 3 */}
                <motion.div 
                  className="bg-white rounded-lg p-3 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                  whileHover={{ rotate: 3 }}
                >
                  <div className="text-2xl mb-1">🤝</div>
                  <div className="text-xs text-[#475569] font-medium">Community</div>
                </motion.div>

                {/* Element 4 */}
                <motion.div 
                  className="bg-white rounded-lg p-3 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                  whileHover={{ rotate: -3 }}
                >
                  <div className="text-2xl mb-1">✈️</div>
                  <div className="text-xs text-[#475569] font-medium">Adventure</div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Text Content */}
          <motion.div 
            className="space-y-6 max-w-2xl"
            variants={itemVariants}
          >
            {/* Kicker Text */}
            <motion.div 
              className="uppercase tracking-wide text-sm text-[#FFA069] font-semibold mb-2"
              variants={itemVariants}
            >
              WHO WE ARE
            </motion.div>

            {/* Main Heading */}
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-[#1C2D3A] leading-snug mb-6"
              variants={itemVariants}
            >
              <span className="font-handwritten text-sb-teal-600">Swap Routine</span>{' '}
              <span className="block">for Adventure</span>
            </motion.h2>

            {/* Badge/Subheading */}
            <motion.div 
              className="inline-block mb-6"
              variants={itemVariants}
            >
              <span className="bg-[#FFA069] text-white px-4 py-2 rounded-full text-sm font-medium shadow-md">
                Tired of working from the same place every day?
              </span>
            </motion.div>

            {/* Description Paragraphs */}
            <motion.div 
              className="space-y-6"
              variants={itemVariants}
            >
              <p className="leading-relaxed tracking-normal text-base md:text-lg text-[#475569]">
                South Bound makes it easy for South African remote workers to live and work from destinations 
                across the globe — without the stress of planning.
              </p>
              
              <p className="leading-relaxed tracking-normal text-base md:text-lg text-[#475569]">
                We arrange work-friendly accommodation, passes to co-working spaces, visas, and travel logistics, 
                so you can focus on what matters — your work, your experience, and your freedom.
              </p>
            </motion.div>

            {/* CTA Button */}
            <motion.div 
              className="pt-6"
              variants={itemVariants}
            >
              <motion.a
                href="#whos-this-for"
                className="bg-[#1BA39C] text-white px-6 py-3 rounded-full font-medium hover:bg-[#178f87] transition-colors duration-300 shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Why We Built This
              </motion.a>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Bottom accent */}
        <motion.div 
          className="text-center pb-8 px-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-3 text-[#64748b] text-sm">
            <span className="text-lg">🇿🇦</span>
            <span>Proudly South African • Built for digital nomads</span>
            <span className="text-lg">🚀</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection; 
