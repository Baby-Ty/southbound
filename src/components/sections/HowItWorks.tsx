'use client';

import React from 'react';
import { MessageCircle, Map, Edit3, Plane } from 'lucide-react';
import { Container } from '../ui/Container';
import { Section } from '../ui/Section';
import { Heading } from '../ui/Heading';
import { useInViewReveal } from '@/hooks/useInViewReveal';

const steps = [
  {
    id: 1,
    icon: MessageCircle,
    title: 'Tell us where you\'d love to work from',
    description: 'Choose your region and vibe (Asia, Europe, or the Americas). Share what matters most to you.'
  },
  {
    id: 2,
    icon: Map,
    title: 'We build your remote-ready route',
    description: 'We create a plan with work-friendly stays, coworking spaces, and curated activities that match your style.'
  },
  {
    id: 3,
    icon: Edit3,
    title: 'You personalize your trip',
    description: 'Adjust the vibe, duration, and highlights to match your lifestyle. Make it yours.'
  },
  {
    id: 4,
    icon: Plane,
    title: 'We handle the rest',
    description: 'From visa guidance to airport pickup—everything you need to focus on work and explore with ease. Just pack and go.'
  }
];

export const HowItWorksSection: React.FC = () => {
  const { ref: headerRef, isVisible: headerVisible } =
    useInViewReveal<HTMLDivElement>();

  return (
    <Section className="bg-gradient-to-b from-white via-sb-blue-50 to-sb-beige-50 relative pattern-stamps">
      
      <Container>
        <div
          ref={headerRef}
          className={`text-center mb-12 sb-reveal ${
            headerVisible ? 'is-visible' : ''
          }`}
        >
          <Heading level={2} className="mb-4">
            How it works
          </Heading>
          <p className="text-slate-600 md:text-lg max-w-2xl mx-auto">
            From idea to departure in four simple steps
          </p>
        </div>

        <div className="relative">
          {/* Connection line (desktop only) */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E8D5C4] to-transparent" style={{ zIndex: 0 }}></div>
          
          <div className="grid grid-cols-12 gap-6 md:gap-8">
            {steps.map((step, index) => (
              <HowItWorksStep key={step.id} step={step} />
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
};

const HowItWorksStep: React.FC<{ step: (typeof steps)[number] }> = ({
  step,
}) => {
  const { ref, isVisible } = useInViewReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`col-span-12 md:col-span-6 lg:col-span-3 relative sb-reveal ${
        isVisible ? 'is-visible' : ''
      }`}
    >
      {/* Flow arrow between steps (desktop only) */}
      {step.id < steps.length && (
        <div className="hidden lg:block absolute top-24 -right-4 z-10">
          <svg
            className="w-8 h-8 text-[#E86B32]/40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </div>
      )}

      <div className="relative h-full p-6 rounded-2xl bg-white shadow-[0_8px_24px_rgba(232,107,50,0.08)] border border-[#F5E6DC] hover:shadow-[0_12px_32px_rgba(232,107,50,0.12)] transition-all duration-300">
        {/* Icon with small number badge */}
        <div className="mb-5 relative inline-block">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FFF8F0] to-[#FFE8D6] border border-[#E8D5C4] flex items-center justify-center shadow-sm">
            <step.icon className="w-7 h-7 text-[#E86B32]" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#E86B32] text-white flex items-center justify-center text-xs font-bold shadow-md">
            {step.id}
          </div>
        </div>

        {/* Content */}
        <h3 className="text-lg font-semibold text-stone-800 mb-2.5">
          {step.title}
        </h3>
        <p className="text-stone-600 text-sm leading-relaxed">
          {step.description}
        </p>
      </div>
    </div>
  );
};

