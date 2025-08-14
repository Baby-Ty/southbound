'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PrelaunchModal from './PrelaunchModal';

const StickyMobileCTA: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [prelaunchOpen, setPrelaunchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show CTA after user scrolls down 300px
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
      <div className="flex gap-2">
        {/* Main CTA */}
        <button
          onClick={() => setPrelaunchOpen(true)}
          className="flex-1 bg-gradient-to-r from-sb-orange-500 to-sb-orange-600 hover:from-sb-orange-600 hover:to-sb-orange-700 text-white px-4 py-3 rounded-lg font-medium shadow-lg transition-all duration-300 text-center flex items-center justify-center gap-2"
        >
          <span className="text-lg">🚀</span>
          <span>Start Planning</span>
        </button>
        
        {/* Secondary CTA */}
        <Link
          href="/popular-trips"
          className="bg-white hover:bg-gray-50 text-gray-800 px-4 py-3 rounded-lg font-medium shadow-lg border border-gray-200 transition-all duration-300 flex items-center justify-center"
        >
          <span className="text-lg">🗺️</span>
        </Link>
      </div>
      
      {/* Background blur overlay for better readability */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg -z-10"></div>
      
      {/* PrelaunchModal */}
      {prelaunchOpen && (
        <PrelaunchModal isOpen={prelaunchOpen} onClose={() => setPrelaunchOpen(false)} />
      )}
    </div>
  );
};

export default StickyMobileCTA; 
