'use client';

import React from 'react';
import { Wifi, Users, Headphones } from 'lucide-react';
import { Container } from '../ui/Container';
import { Section } from '../ui/Section';
import { Heading } from '../ui/Heading';
import { Button } from '../ui/Button';
import { useInViewReveal } from '@/hooks/useInViewReveal';

const features = [
  {
    icon: Wifi,
    title: 'Reliable internet',
    description: 'Every apartment pre-tested for video calls and uploads. Backup options included.',
    rotation: -1,
    tapeColor: 'bg-rose-200/80'
  },
  {
    icon: Users,
    title: 'Coworking access',
    description: 'Day passes or monthly memberships at quality spaces with meeting rooms.',
    rotation: 1,
    tapeColor: 'bg-amber-200/80'
  },
  {
    icon: Headphones,
    title: 'Local support',
    description: 'On-ground contact in every city if anything goes wrong—or you just need tips.',
    rotation: -0.5,
    tapeColor: 'bg-teal-200/80'
  }
];

const WorkReadyFeatureCard: React.FC<{ feature: (typeof features)[number] }> = ({
  feature,
}) => {
  const { ref, isVisible } = useInViewReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`sb-reveal ${isVisible ? 'is-visible' : ''}`}
    >
      <div 
        className="relative texture-lined-paper p-6 pt-10 h-full shadow-[0_4px_15px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 transform"
        style={{ rotate: `${feature.rotation}deg` }}
      >
        {/* Washi Tape Effect */}
        <div 
          className={`absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-8 ${feature.tapeColor} opacity-90 shadow-sm rotate-1 backdrop-blur-sm`}
          style={{
            maskImage: 'url("data:image/svg+xml,%3Csvg width=\'200\' height=\'50\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0,10 L5,0 L195,5 L200,15 L200,35 L195,45 L5,40 L0,30 Z\' fill=\'black\'/%3E%3C/svg%3E")',
            WebkitMaskImage: 'url("data:image/svg+xml,%3Csvg width=\'200\' height=\'50\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0,10 L5,0 L195,5 L200,15 L200,35 L195,45 L5,40 L0,30 Z\' fill=\'black\'/%3E%3C/svg%3E")',
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center'
          }}
        ></div>

        {/* Icon - Hand-drawn style circle */}
        <div className="relative mb-4 inline-block">
          <svg className="absolute inset-0 w-full h-full -m-1 transform scale-125 text-stone-400/30" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
             <path d="M20,50 a30,30 0 1,1 60,0 a30,30 0 1,1 -60,0" strokeDasharray="100" strokeDashoffset="20" pathLength="100" />
          </svg>
          <div className="relative z-10 w-10 h-10 flex items-center justify-center">
            <feature.icon className="w-6 h-6 text-stone-700" />
          </div>
        </div>

        <h3 className="text-xl font-handwritten font-bold text-stone-800 mb-2">
          {feature.title}
        </h3>
        <p className="text-stone-600 text-sm leading-relaxed font-handwritten text-base">
          {feature.description}
        </p>
      </div>
    </div>
  );
};

export const WorkReadySection: React.FC = () => {
  const { ref: textRef, isVisible: textVisible } =
    useInViewReveal<HTMLDivElement>();

  return (
    <Section className="bg-[#FDF6EF] relative overflow-hidden">
      {/* Texture Overlay */}
      <div className="absolute inset-0 texture-paper opacity-60 pointer-events-none"></div>
      
      <Container className="relative z-10">
        <div className="grid grid-cols-12 gap-8 md:gap-12 items-center">
          {/* Left side - Text */}
          <div
            ref={textRef}
            className={`col-span-12 lg:col-span-5 sb-reveal ${
              textVisible ? 'is-visible' : ''
            }`}
          >
            <div className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-sm font-bold rounded-full mb-4 transform -rotate-2 border border-orange-200 shadow-sm">
              FIELD NOTES
            </div>
            <Heading level={2} className="mb-6 font-serif">
              Work-ready from day one
            </Heading>
            <p className="text-stone-700 text-lg md:text-xl leading-relaxed mb-8 font-sans">
              We know you're not just on holiday—you're building your empire (or at least clearing your inbox). We've logged the essentials so you don't have to.
            </p>
            <div className="mb-10 bg-white/50 p-4 rounded-lg border border-stone-200/50 backdrop-blur-sm transform rotate-1">
              <p className="text-stone-800 text-base md:text-lg font-handwritten">
                <strong className="text-stone-900 font-bold">Included in every trip:</strong> Local SIM, airport pickup, and our 24/7 chat support.
              </p>
            </div>
            <Button href="/route-builder" variant="primary">
              Start your journey
            </Button>
          </div>

          {/* Right side - Feature cards */}
          <div className="col-span-12 lg:col-span-7">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-0">
              {features.map((feature, index) => (
                <WorkReadyFeatureCard key={feature.title} feature={feature} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
};
