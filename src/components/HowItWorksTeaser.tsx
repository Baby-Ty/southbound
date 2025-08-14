'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import PrelaunchModal from './PrelaunchModal';

const HowItWorksTeaser: React.FC = () => {
  const [prelaunchOpen, setPrelaunchOpen] = useState(false);
  
  const steps = [
    {
      icon: '🎯',
      title: 'Choose a Trip',
      description: 'Pick from our curated remote work destinations, each with work-friendly stays and great internet.'
    },
    {
      icon: '🛠️',
      title: 'We Handle the Rest',
      description: 'Accommodation, co-working, SIM cards, and airport pickup are all sorted before you arrive.'
    },
    {
      icon: '✈️',
      title: 'You Land & Plug In',
      description: 'Everything you need to get started right away with WiFi, workspace, and local tips included.'
    },
    {
      icon: '🌟',
      title: 'Remote Meets Adventure',
      description: 'Work productively while exploring new cultures, landscapes, and experiences.'
    }
  ];

  return (
    <section className="py-16 px-4 md:px-8 bg-gradient-to-r from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From browsing to working abroad — we make remote work travel effortless
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              {/* Step Number */}
              <div className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-bold mb-4">
                {index + 1}
              </div>
              
              {/* Icon */}
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-200">
                {step.icon}
              </div>
              
              {/* Content */}
              <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                {step.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex-1 border-t border-gray-200"></div>
          <div className="px-4 text-gray-400 text-sm">Ready to get started?</div>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl">💼</span>
            <h3 className="text-xl font-semibold text-gray-900">
            ✈️ Make the World Your Office
            </h3>
            <span className="text-2xl">🏝️</span>
          </div>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
          From beachfront cafés to vibrant city co-working hubs, we set you up to work and live abroad without the hassle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/popular-trips"
              className="inline-flex items-center justify-center px-6 py-3 bg-sb-orange-500 hover:bg-sb-orange-600 text-white font-medium rounded-lg transition-colors duration-300"
            >
              <span className="mr-2">🗺️</span>
              Browse All Trips
              <span className="ml-2">→</span>
            </Link>
            <button
              onClick={() => setPrelaunchOpen(true)}
              className="inline-flex items-center justify-center px-6 py-3 border border-sb-teal-500 hover:bg-sb-teal-500 hover:text-white text-sb-teal-700 font-medium rounded-lg transition-colors duration-300"
            >
              <span className="mr-2">🚀</span>
              Plan My Trip
            </button>
          </div>
        </div>
      </div>

      {/* PrelaunchModal */}
      {prelaunchOpen && (
        <PrelaunchModal isOpen={prelaunchOpen} onClose={() => setPrelaunchOpen(false)} />
      )}
    </section>
  );
};

export default HowItWorksTeaser; 