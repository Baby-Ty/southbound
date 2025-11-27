'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Container } from '../ui/Container';
import { Section } from '../ui/Section';

export const ShortCopySection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <Section className="bg-[#faf9f6] relative overflow-hidden py-20 md:py-28">
      {/* Texture Overlay */}
      <div className="absolute inset-0 texture-paper opacity-60 pointer-events-none"></div>
      
      {/* Soft ambient glow */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-100/30 blur-3xl pointer-events-none" />
      
      <Container>
        <div
          ref={sectionRef}
          className="max-w-[1120px] mx-auto"
        >
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center relative z-10">
            
            {/* Left Column - Heading */}
            <div className="space-y-6 text-center lg:text-left">
              {/* Stamped effect heading */}
              <h2 
                className={`text-5xl md:text-6xl lg:text-7xl font-bold text-stone-900 leading-[0.95] tracking-tight transition-all duration-1000 font-serif ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: '0ms' }}
              >
                Work anywhere.<br/>
                <span className="text-stone-400 italic font-serif relative inline-block mt-2">
                  Live everywhere.
                  <svg className="absolute -bottom-2 left-0 w-full h-3 text-orange-400 opacity-60" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0,5 Q50,10 100,5" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                </span>
              </h2>

              {/* Hand-drawn arrow */}
              <div 
                className={`hidden lg:block absolute left-[80%] top-[60%] transform -translate-y-1/2 w-24 h-24 transition-all duration-1000 delay-500 ${
                  isVisible ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-12'
                }`}
              >
                 <svg viewBox="0 0 100 100" className="w-full h-full text-stone-400" fill="none" stroke="currentColor" strokeWidth="1.5">
                   <path d="M10,10 C30,10 50,50 90,50" strokeDasharray="5,5" />
                   <path d="M90,50 L80,40 M90,50 L80,60" />
                 </svg>
              </div>
            </div>
            
            {/* Right Column - Paragraph (Typewriter style) */}
            <div className="relative">
               <div 
                className={`absolute -top-6 -left-6 w-12 h-12 border-t-2 border-l-2 border-orange-300 opacity-50 transition-all duration-1000 ${
                  isVisible ? 'scale-100' : 'scale-50 opacity-0'
                }`} 
              />
              <div 
                className={`absolute -bottom-6 -right-6 w-12 h-12 border-b-2 border-r-2 border-orange-300 opacity-50 transition-all duration-1000 ${
                  isVisible ? 'scale-100' : 'scale-50 opacity-0'
                }`} 
              />

              <p 
                className={`text-xl md:text-2xl text-stone-700 leading-relaxed font-handwritten transition-all duration-1000 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: '400ms' }}
              >
                "We make remote life simple — accommodation, coworking spaces, SIM cards, and support — so you can focus on doing great work while experiencing the world. It's life with more freedom, more balance, and more adventure."
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};
