'use client';

import React, { useState } from 'react';
import PrelaunchModal from './PrelaunchModal';

const WhosThisForSection: React.FC = () => {
  const [prelaunchOpen, setPrelaunchOpen] = useState(false);

  return (
    <section id="whos-this-for" className="py-20 px-4 sm:px-6 lg:px-8 bg-sb-navy-700">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="lg:col-span-7 space-y-8">
            {/* Main Heading */}
            <div className="space-y-4">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                who&apos;s THIS FOR?
              </h2>
              <div className="w-24 h-1 bg-sb-orange-500 rounded-full"></div>
            </div>

            {/* Target Audience Blocks */}
            <div className="space-y-8">
              {/* Digital Nomads */}
              <div className="flex items-start gap-4">
                <div className="text-4xl flex-shrink-0 mt-1">🧑‍💻</div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">Digital Nomads & Remote Workers</h3>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    You've mastered working from anywhere, but planning the logistics is exhausting. 
                    We handle the WiFi speeds, co-working spaces, and local SIM cards so you can focus on your craft.
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-sb-navy-500 my-6"></div>

              {/* Entrepreneurs */}
              <div className="flex items-start gap-4">
                <div className="text-4xl flex-shrink-0 mt-1">✈️</div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">Aspiring Adventurers</h3>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    You dream of working from Bali or Buenos Aires but don&apos;t know where to start. 
                    We've done the groundwork, finding the best neighborhoods, reliable internet, and like-minded communities.
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-sb-navy-500 my-6"></div>

              {/* Professionals */}
              <div className="flex items-start gap-4">
                <div className="text-4xl flex-shrink-0 mt-1">🌍</div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-3">Experience-Driven Professionals</h3>
                  <p className="text-lg text-gray-300 leading-relaxed">
                    You want more than a vacation, you want transformation. 
                    Work alongside locals, learn new cultures, and return home with stories that matter and skills that stick.
                  </p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="pt-8 border-t border-sb-navy-500">
              <p className="text-xl text-sb-mint-300 font-medium mb-6">
                Ready to swap routine for adventure? 🚀
              </p>
              <button 
                onClick={() => setPrelaunchOpen(true)}
                className="inline-flex items-center bg-sb-orange-500 hover:bg-sb-orange-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-medium hover:shadow-large hover:scale-105"
              >
                <span className="mr-3">🚀</span>
                Start Your Journey
                <svg className="ml-3 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Column - Visual Elements */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-80 h-80">
              {/* Main Globe */}
              <div className="absolute inset-0 bg-sb-teal-300 rounded-full flex items-center justify-center animate-bounce-gentle">
                <div className="text-8xl">🌍</div>
              </div>

              {/* Floating Suitcase */}
              <div className="absolute -top-8 -right-8 w-20 h-20 bg-sb-orange-300 rounded-full flex items-center justify-center animate-pulse shadow-large">
                <div className="text-3xl">🧳</div>
              </div>

              {/* Floating Laptop */}
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-sb-mint-300 rounded-full flex items-center justify-center animate-bounce shadow-large">
                <div className="text-2xl">💻</div>
              </div>

              {/* Floating Plane */}
              <div className="absolute top-4 left-4 w-14 h-14 bg-sb-beige-200 rounded-full flex items-center justify-center animate-pulse shadow-medium">
                <div className="text-xl">✈️</div>
              </div>

              {/* Floating Coffee */}
              <div className="absolute bottom-16 right-8 w-12 h-12 bg-sb-orange-200 rounded-full flex items-center justify-center animate-bounce shadow-medium">
                <div className="text-lg">☕</div>
              </div>
            </div>
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

export default WhosThisForSection; 
