'use client';

import React, { useState } from 'react';
import { Metadata } from 'next';
import { motion } from 'framer-motion';
import PrelaunchModal from '@/components/PrelaunchModal';

const HowItWorksPage = () => {
  const [prelaunchOpen, setPrelaunchOpen] = useState(false);

  const steps = [
    {
      number: "01",
      title: "Share Your Vibe",
      description: "Tell us your dream destinations, work style, and travel timeline. We'll craft a remote work adventure that's uniquely you.",
      icon: "✨",
      iconBg: "from-sb-teal-300 to-sb-teal-400",
      detail: "Answer a few quick questions about your work setup, preferred destinations, and travel style to help us understand your perfect trip."
    },
    {
      number: "02", 
      title: "We Handle Everything",
      description: "Accommodation, Wi-Fi, co-working spaces, local SIM cards, and airport transfers – all sorted before you even pack.",
      icon: "🛠️",
      iconBg: "from-sb-orange-400 to-sb-orange-500",
      detail: "Our team researches and books work-friendly accommodations, verifies internet speeds, and arranges local essentials."
    },
    {
      number: "03",
      title: "Get Your Roadmap",
      description: "Receive a detailed itinerary with work-friendly stays, local experiences, emergency contacts, and insider tips.",
      icon: "📋",
      iconBg: "from-sb-mint-300 to-sb-mint-400",
      detail: "A comprehensive guide with daily schedules, recommended co-working spaces, local experiences, and 24/7 support contacts."
    },
    {
      number: "04",
      title: "Pack & Plug In",
      description: "Grab your laptop and passport. Everything else is covered. Time to live your remote work dreams.",
      icon: "✈️",
      iconBg: "from-sb-beige-300 to-sb-beige-400",
      detail: "Arrive at your destination and immediately start working and exploring, knowing all the logistics are taken care of."
    }
  ];

  const benefits = [
    {
      icon: "🎯",
      title: "Perfectly Curated",
      description: "Every destination is tested for reliable internet, great workspaces, and incredible experiences.",
      color: "from-sb-teal-100 to-sb-teal-200"
    },
    {
      icon: "🌍",
      title: "Local Expertise",
      description: "Connect with local guides and co-working communities who know the hidden gems and best spots to work.",
      color: "from-sb-orange-100 to-sb-orange-200"
    },
    {
      icon: "⚡",
      title: "Seamless Setup",
      description: "Pre-tested internet speeds, backup connectivity options, and work-optimized accommodation selections.",
      color: "from-sb-mint-100 to-sb-mint-200"
    },
    {
      icon: "🤝",
      title: "Always Supported",
      description: "24/7 support before, during, and after your trip with local emergency contacts and assistance.",
      color: "from-sb-beige-200 to-sb-beige-300"
    }
  ];

  const processFlow = [
    { phase: "Discovery", duration: "Day 1", icon: "🔍" },
    { phase: "Planning", duration: "2-3 Days", icon: "📋" },
    { phase: "Preparation", duration: "1 Week", icon: "⚙️" },
    { phase: "Adventure", duration: "Your Timeline", icon: "🚀" }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sb-beige-100 via-white to-sb-teal-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sb-teal-100 via-sb-beige-100 to-sb-mint-100 py-24 lg:py-32">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-sb-navy-700 mb-8 leading-tight">
              How It{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-white font-black">Works</span>
                <span className="absolute inset-0 bg-sb-orange-500 rounded-lg transform -skew-x-12 z-0"></span>
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-sb-navy-600 max-w-4xl mx-auto leading-relaxed mb-8">
              From dream to departure in 4 simple steps. We make remote work travel effortless 
              so you can focus on productivity and adventure.
            </p>
            <div className="flex justify-center items-center gap-6 text-4xl opacity-80">
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
          </motion.div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-sb-navy-700 mb-4">
              Your Journey Timeline
            </h2>
            <p className="text-sb-navy-600 max-w-2xl mx-auto">
              From first contact to takeoff – here's what to expect
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {processFlow.map((phase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                className="relative text-center"
              >
                <div className="bg-white rounded-xl p-6 shadow-medium hover:shadow-large transition-shadow duration-300">
                  <div className="text-3xl mb-3">{phase.icon}</div>
                  <h3 className="text-lg font-semibold text-sb-navy-700 mb-2">{phase.phase}</h3>
                  <p className="text-sm text-sb-navy-600 font-medium">{phase.duration}</p>
                </div>
                {index < processFlow.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2 text-sb-orange-500 text-2xl">
                    →
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Steps Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-sb-navy-700 mb-6">
              Your Adventure in Detail
            </h2>
            <div className="w-24 h-1 bg-sb-orange-500 rounded-full mx-auto mb-8"></div>
            <p className="text-xl text-sb-navy-600 max-w-3xl mx-auto leading-relaxed">
              Every step designed to make your remote work journey seamless and unforgettable
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-16"
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}
              >
                {/* Step Content */}
                <div className="flex-1 text-center lg:text-left">
                  <div className="inline-flex items-center gap-3 mb-6">
                    <div className="px-4 py-2 bg-sb-orange-500 text-white rounded-full text-sm font-bold">
                      Step {step.number}
                    </div>
                    <div className="w-12 h-0.5 bg-sb-orange-500 rounded-full"></div>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-sb-navy-700 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-xl text-sb-navy-600 mb-6 leading-relaxed">
                    {step.description}
                  </p>
                  <p className="text-sb-navy-500 leading-relaxed">
                    {step.detail}
                  </p>
                </div>

                {/* Step Visual */}
                <div className="flex-1 flex justify-center">
                  <motion.div
                    className={`relative w-80 h-80 bg-gradient-to-br ${step.iconBg} rounded-3xl shadow-large flex items-center justify-center`}
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-8xl">{step.icon}</div>
                    <div className="absolute -top-4 -right-4 w-16 h-16 bg-sb-navy-700 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                      {step.number}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-24 bg-gradient-to-br from-white to-sb-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-sb-navy-700 mb-6">
              Why Choose Southbound?
            </h2>
            <p className="text-xl text-sb-navy-600 max-w-3xl mx-auto leading-relaxed">
              We're not just another booking platform – we're your remote work adventure partners
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`bg-gradient-to-br ${benefit.color} rounded-2xl p-8 hover:shadow-large transition-all duration-300 hover:scale-105`}
                whileHover={{ y: -5 }}
              >
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-2xl font-bold text-sb-navy-700 mb-4">{benefit.title}</h3>
                <p className="text-sb-navy-600 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-r from-sb-orange-500 via-sb-orange-600 to-sb-orange-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-center items-center gap-4 mb-6">
              <span className="text-4xl">🚀</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Ready to Transform Your Work?
              </h2>
              <span className="text-4xl">🌍</span>
            </div>
            <p className="text-xl text-orange-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              Join the remote work revolution. Work from paradise, connect with amazing people, 
              and make every day an adventure.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.button
                onClick={() => setPrelaunchOpen(true)}
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-sb-orange-600 font-bold text-lg rounded-full hover:bg-gray-100 transition-colors shadow-large hover:shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="mr-3">🎯</span>
                Start Planning My Trip
                <svg className="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.button>
              <motion.a
                href="/popular-trips"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-bold text-lg rounded-full hover:bg-white hover:text-sb-orange-600 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="mr-3">✨</span>
                Browse Destinations
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Floating Emojis */}
      <div className="fixed bottom-8 right-8 text-6xl animate-bounce pointer-events-none opacity-20">
        🏝️
      </div>

      {prelaunchOpen && (
        <PrelaunchModal isOpen={prelaunchOpen} onClose={() => setPrelaunchOpen(false)} />
      )}
    </div>
  );
};

export default HowItWorksPage;