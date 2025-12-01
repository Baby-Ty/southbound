'use client';

import React, { useEffect, useState } from 'react';

export const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPosition = window.scrollY;
      const currentProgress = totalHeight > 0 ? (scrollPosition / totalHeight) * 100 : 0;
      
      setProgress(Math.min(100, Math.max(0, currentProgress)));
      setIsVisible(scrollPosition > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-50 transition-opacity duration-300 pointer-events-none ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Progress Track */}
      <div className="h-1 w-full bg-stone-200/50 backdrop-blur-sm">
        {/* Progress Fill */}
        <div 
          className="h-full bg-gradient-to-r from-sb-teal-400 to-sb-orange-400 transition-all duration-100 ease-out relative"
          style={{ width: `${progress}%` }}
        >
          {/* Plane Icon */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 text-lg leading-none transform rotate-90">
            ✈️
          </div>
        </div>
      </div>
    </div>
  );
};




