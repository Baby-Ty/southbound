'use client';

import React from 'react';
import { motion } from 'framer-motion';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: '🖥️',
      title: 'Remote-Work Ready',
      description: 'High-speed Wi-Fi, coworking access, and backup power. Everything you need to stay productive wherever you are.'
    },
    {
      icon: '🎒',
      title: 'All-Inclusive Setup',
      description: 'From SIM cards to airport pickups, we handle the details so you can plug in and feel at home from day one.'
    },
    {
      icon: '🤝',
      title: 'Community & Support',
      description: 'Around-the-clock support and an instant network of remote workers and locals who get it. From quick questions to shared adventures, you are never on your own.'
    }
  ];

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
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6
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

  return (
    <section id="features" className="bg-gradient-to-r from-[#FDF6EF] to-[#E8FDFD]">
      <div className="max-w-screen-xl mx-auto">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-12 pt-16 px-6"
          variants={headerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#1C2D3A] mb-2">
            Built for Remote Workers. Powered by Experience.
          </h2>
          <p className="text-[#64748b] text-base leading-relaxed max-w-2xl mx-auto">
            We take care of the tricky stuff so you can focus on your work and your adventure.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 py-16 items-start"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-center group"
              whileHover={{ 
                y: -8,
                transition: { duration: 0.2 }
              }}
            >
              {/* Icon Circle */}
              <motion.div 
                className="bg-[#C2F5D8] w-14 h-14 flex items-center justify-center rounded-full mx-auto mb-4 group-hover:bg-[#AEE6E6] transition-colors duration-300"
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3 + (index * 0.1), duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ 
                  scale: 1.1,
                  rotate: 10,
                  transition: { duration: 0.2 }
                }}
              >
                <span className="text-2xl">{feature.icon}</span>
              </motion.div>

              {/* Feature Title */}
              <motion.h3 
                className="text-lg font-semibold text-[#1C2D3A] mb-3"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5 + (index * 0.1) }}
                viewport={{ once: true }}
              >
                {feature.title}
              </motion.h3>

              {/* Feature Description */}
              <motion.p 
                className="text-sm text-[#475569] leading-relaxed"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.7 + (index * 0.1) }}
                viewport={{ once: true }}
              >
                {feature.description}
              </motion.p>

              {/* Decorative Element */}
              <motion.div 
                className="w-8 h-0.5 bg-sb-orange-400 mx-auto mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ delay: 0.9 + (index * 0.1), duration: 0.4 }}
                viewport={{ once: true }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Accent */}
        <motion.div 
          className="text-center pb-8 px-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-3 text-[#64748b] text-sm">
            <span className="text-lg">✨</span>
            <span>Helping South Africans work from anywhere in 25+ destinations</span>
            <span className="text-lg">🌍</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection; 
