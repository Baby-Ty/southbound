'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

// Note: metadata moved to layout or handled differently since this is now a client component

const AboutPage = () => {
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

  const benefits = [
    {
      icon: "🏠",
      title: "Work-friendly stays",
      description: "Fast Wi-Fi and space to focus"
    },
    {
      icon: "💼",
      title: "Co-working access", 
      description: "Plug in and meet people"
    },
    {
      icon: "✈️",
      title: "Hassle-free logistics",
      description: "Airport pickups to local SIM cards"
    },
    {
      icon: "🎭",
      title: "Cultural experiences",
      description: "Beyond the tourist spots"
    }
  ];

  return (
    <div className="min-h-screen bg-sb-beige-100">
      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sb-beige-100 via-sb-teal-100 to-sb-mint-100 py-32">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="absolute inset-0 opacity-30">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-sb-orange-400/60 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </div>
        
        <motion.div 
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-12">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
              <span className="text-2xl">🌍</span>
              <span className="font-semibold text-lg text-sb-navy-700">Meet Southbound</span>
              <span className="text-2xl">✨</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-sb-navy-700 mb-8 leading-tight">
              Work anywhere.{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-white font-black">Live fully.</span>
                <span className="absolute inset-0 bg-sb-orange-500 rounded-lg transform -skew-x-12 z-0"></span>
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-sb-navy-600 max-w-4xl mx-auto leading-relaxed mb-12">
              We make remote work travel effortless for South Africans who want more from life 
              than the same desk, same view, and same routine.
            </p>
            
            <div className="flex justify-center items-center gap-6 text-4xl opacity-80 mb-8">
              {['💻', '✈️', '🏝️', '🌟'].map((emoji, index) => (
                <motion.span
                  key={index}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.5 + (index * 0.1), duration: 0.5 }}
                  className="hover:scale-125 transition-transform duration-300"
                >
                  {emoji}
                </motion.span>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center text-left">
            
            {/* Left Column - Content */}
            <motion.div 
              className="space-y-8" 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >

              <div className="space-y-8">
                <div className="inline-flex items-center gap-3 mb-6">
                  <div className="px-4 py-2 bg-sb-orange-500 text-white rounded-full text-sm font-bold">
                    Our Mission
                  </div>
                  <div className="w-12 h-0.5 bg-sb-orange-500 rounded-full"></div>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-sb-navy-700 mb-6">
                  Beyond Tourism, Into Transformation
                </h2>
                
                <p className="text-lg text-sb-navy-600 leading-relaxed mb-6">
                  We're not a tour company. We're your behind-the-scenes crew for remote work adventures. 
                  While others book you a hotel, we set up your entire work-life ecosystem abroad.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  {benefits.map((benefit, index) => (
                    <motion.div 
                      key={index}
                      className="bg-white/60 backdrop-blur-sm rounded-xl p-4 hover:shadow-lg transition-all duration-300"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="text-2xl mb-2">{benefit.icon}</div>
                      <div className="font-semibold text-sb-navy-700 text-sm mb-1">{benefit.title}</div>
                      <div className="text-xs text-sb-navy-600">{benefit.description}</div>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-gradient-to-br from-sb-teal-50 to-sb-mint-50 border-l-4 border-sb-teal-500 p-6 rounded-r-xl">
                  <p className="text-lg font-semibold text-sb-navy-700 mb-2">
                    Our goal is simple:
                  </p>
                  <p className="text-sb-navy-600 leading-relaxed">
                    You focus on your work and the adventure. We handle visas, accommodation, 
                    co-working spaces, SIM cards, airport transfers, and local insider tips.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Enhanced Visual */}
            <motion.div 
              className="flex justify-center"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <div className="relative">
                <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl mb-6">
                    <Image
                      src="/images/about-graphic.png"
                      alt="About South Bound illustration"
                      fill
                      className="object-contain"
                      priority={false}
                    />
                  </div>
                  
                  {/* Enhanced stats grid */}
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <motion.div 
                      className="bg-gradient-to-br from-sb-teal-100 to-sb-teal-200 rounded-xl p-4"
                      whileHover={{ scale: 1.05, y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="text-3xl mb-2">🌍</div>
                      <div className="text-sm text-sb-navy-700 font-bold">25+</div>
                      <div className="text-xs text-sb-navy-600">Countries</div>
                    </motion.div>
                    <motion.div 
                      className="bg-gradient-to-br from-sb-orange-100 to-sb-orange-200 rounded-xl p-4"
                      whileHover={{ scale: 1.05, y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="text-3xl mb-2">💻</div>
                      <div className="text-sm text-sb-navy-700 font-bold">100%</div>
                      <div className="text-xs text-sb-navy-600">Work Ready</div>
                    </motion.div>
                    <motion.div 
                      className="bg-gradient-to-br from-sb-mint-100 to-sb-mint-200 rounded-xl p-4"
                      whileHover={{ scale: 1.05, y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="text-3xl mb-2">🤝</div>
                      <div className="text-sm text-sb-navy-700 font-bold">24/7</div>
                      <div className="text-xs text-sb-navy-600">Support</div>
                    </motion.div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <motion.div 
                  className="absolute -top-4 -right-4 w-16 h-16 bg-sb-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🚀
                </motion.div>
                <motion.div 
                  className="absolute -bottom-4 -left-4 w-12 h-12 bg-sb-teal-500 rounded-full flex items-center justify-center text-white text-lg shadow-lg"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                >
                  ✨
                </motion.div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-white">
        <motion.div 
          className="max-w-4xl mx-auto px-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Section Header */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center space-x-2 bg-sb-orange-50 px-4 py-2 rounded-full border border-sb-orange-200 mb-6">
              <span className="text-lg">📖</span>
              <span className="text-sm font-medium text-sb-orange-700 uppercase tracking-wide">Our Story</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-sb-navy-700 mb-6">
              From Dream to{' '}
              <span className="font-handwritten text-sb-orange-500">Reality</span>
            </h2>
            <div className="w-24 h-1 bg-sb-orange-500 rounded-full mx-auto"></div>
          </motion.div>

          {/* Story Content */}
          <div className="space-y-8">
            {[
              "I started South Bound because I wanted the freedom to work from anywhere, and I knew I was not the only one.",
              
              "Like many South Africans, I would scroll through photos of people working from Bali cafés or exploring Mexico City and think, that looks amazing… but where do you even start?",
              
              "When I finally took my own work abroad, I realised how much admin there is. Visas, accommodation, reliable Wi-Fi, SIM cards, and building a daily routine in a new country all take time and planning. With the right setup, I found it is not only possible, it is life-changing.",
              
              "South Bound was born to make that setup easy for others. I handle the details - work-friendly stays, co-working access, local tips, and cultural experiences - so you can focus on your job and enjoy the adventure.",
              
              "What started as helping a few friends escape their routines has grown into a service for anyone ready to trade the same desk and same view for something new."
            ].map((paragraph, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0 w-8 h-8 bg-sb-orange-100 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-sb-orange-500 rounded-full"></div>
                  </div>
                  <p className="text-lg text-sb-navy-600 leading-relaxed pt-1">
                    {paragraph}
                  </p>
                </div>
                {index < 4 && (
                  <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-sb-orange-200"></div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Enhanced Bottom CTA */}
          <motion.div 
            className="text-center mt-20 p-10 bg-gradient-to-br from-sb-teal-50 via-white to-sb-orange-50 rounded-3xl border border-sb-teal-200 shadow-xl"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="text-4xl">🚀</span>
              <h3 className="text-3xl md:text-4xl font-bold text-sb-navy-700">Ready to Transform Your Work Life?</h3>
              <span className="text-4xl">🌍</span>
            </div>
            <p className="text-xl text-sb-navy-600 mb-8 leading-relaxed max-w-2xl mx-auto">
              Join hundreds of South Africans who've traded routine for adventure and made the world their office.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/popular-trips"
                className="inline-flex items-center justify-center px-8 py-4 bg-sb-orange-500 hover:bg-sb-orange-600 text-white font-bold text-lg rounded-full transition-all duration-300 shadow-large hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="mr-3">🗺️</span>
                Explore Destinations
                <svg className="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.a>
              <motion.a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-sb-teal-500 text-sb-teal-700 font-bold text-lg rounded-full hover:bg-sb-teal-500 hover:text-white transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="mr-3">💬</span>
                Let's Chat
              </motion.a>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* South African Pride Section */}
      <motion.section 
        className="py-12 bg-gradient-to-r from-sb-beige-100 to-sb-teal-100/60"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="text-center">
          <div className="inline-flex items-center gap-3 text-sb-navy-600">
            <span className="text-2xl">🇿🇦</span>
            <span className="font-medium">Proudly South African • Built for digital nomads</span>
            <span className="text-2xl">🚀</span>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default AboutPage;