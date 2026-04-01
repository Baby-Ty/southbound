'use client';

import React from 'react';
import Link from 'next/link';
import { SlidersHorizontal, Map, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import { Container } from '../ui/Container';
import { Section } from '../ui/Section';
import { Heading } from '../ui/Heading';
import { Button } from '../ui/Button';
import { useInViewReveal } from '@/hooks/useInViewReveal';

const steps = [
  {
    number: '01',
    icon: SlidersHorizontal,
    title: 'Define your lifestyle',
    description: 'Work hours, pace, budget, and priorities. This sets the foundation for the route ahead.',
  },
  {
    number: '02',
    icon: Map,
    title: 'Shape your route',
    description: 'Your route comes together around real workdays, routines, and everyday life, with room to adjust as you go.',
  },
  {
    number: '03',
    icon: Home,
    title: 'Settle in',
    description: 'Arrive, find your rhythm, and start living and working from day one.',
  },
];

const features = [
  {
    icon: Home,
    title: 'Before you land',
    items: [
      { title: 'Accommodation sorted', desc: 'Remote-friendly, booked and ready' },
      { title: 'WiFi verified', desc: 'Tested, not just claimed' },
      { title: 'Coworking ready', desc: 'Flexible desks or monthly options' },
      { title: 'Airport pickup + SIM', desc: 'Arrive connected' },
    ],
    rotation: -1,
    tapeColor: 'bg-amber-200/80',
    href: null as string | null,
  },
  {
    icon: Map,
    title: 'While you\'re there',
    items: [
      { title: 'Work spots mapped', desc: 'Cafés and backup spaces ready' },
      { title: 'Gym + essentials nearby', desc: 'Everything in your area' },
      { title: 'Local guide included', desc: 'Hit the ground running' },
      { title: 'Support when needed', desc: 'Medical, delays, and logistics' },
    ],
    rotation: 0.8,
    tapeColor: 'bg-teal-200/80',
    href: null as string | null,
  },
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
        className="relative texture-lined-paper px-11 pb-14 pt-[96px] h-full shadow-[0_4px_15px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 transform"
        style={{
          rotate: `${feature.rotation}deg`,
          backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #dde3eb 32px)',
        }}
      >
        {/* Washi Tape */}
        <div
          className={`absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 ${feature.tapeColor} opacity-90 shadow-sm rotate-1 backdrop-blur-sm`}
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

        {/* Icon — absolutely positioned so it doesn't break text flow */}
        <div className="absolute top-[30px] left-11 w-8 h-8 flex items-center justify-center">
          <feature.icon className="w-5 h-5 text-stone-600" strokeWidth={1.5} />
        </div>

        {/* Title */}
        <h3
          className="font-handwritten font-bold text-stone-900 mb-0"
          style={{ fontSize: '1.4rem', lineHeight: '32px', letterSpacing: '-0.01em' }}
        >
          {feature.title}
        </h3>

        {/* List — two-line items with bold title + lighter description */}
        <ul className="mt-[32px] space-y-[26px]">
          {feature.items.map((item) => (
            <li
              key={item.title}
              className="flex items-start gap-3"
            >
              {/* Small dot, aligned to the cap-height of the title text */}
              <span
                className="shrink-0 rounded-full bg-[#E86B32]"
                style={{ width: '5px', height: '5px', marginTop: '7px' }}
              />
              <span className="font-handwritten">
                <span className="font-bold text-stone-900" style={{ fontSize: '1.05rem', lineHeight: '1.45' }}>
                  {item.title}
                </span>
                <span className="block text-stone-400" style={{ fontSize: '0.975rem', lineHeight: '1.45' }}>
                  {item.desc}
                </span>
              </span>
            </li>
          ))}
        </ul>

        {feature.href && (
          <div className="mt-8">
            <Link
              href={feature.href}
              className="text-sm font-bold text-[#E86B32] uppercase tracking-wide hover:underline font-sans"
            >
              Learn more →
            </Link>
          </div>
        )}
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

        {/* How it works — 3-step row */}
        <div
          ref={textRef}
          className={`mb-16 sb-reveal ${textVisible ? 'is-visible' : ''}`}
        >
          <div className="text-center mb-10">
            <div className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-sm font-bold rounded-full mb-4 transform -rotate-1 border border-orange-200 shadow-sm">
              HOW IT WORKS
            </div>
            <Heading level={2} className="mb-3">
              Work-ready from day one
            </Heading>
            <p className="text-stone-600 text-lg max-w-2xl mx-auto">
              A simple, flexible approach to living and working abroad.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting dashed line (desktop only) */}
            <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-px border-t-2 border-dashed border-stone-300/70 -z-10" />

            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center group"
              >
                <div className="relative w-20 h-20 bg-white border-2 border-stone-200 rounded-full flex items-center justify-center mb-5 shadow-sm group-hover:shadow-md group-hover:scale-105 group-hover:border-[#E86B32] transition-all duration-300 z-10">
                  <step.icon size={28} className="text-stone-700 group-hover:text-[#E86B32] transition-colors duration-300" strokeWidth={1.5} />
                  <div className="absolute -top-2 -right-2 bg-stone-900 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-stone-900 mb-2 group-hover:text-[#E86B32] transition-colors">
                  {step.title}
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-stone-200/70 mb-16" />

        {/* What's included — feature cards + text */}
        <div className="grid grid-cols-12 gap-8 md:gap-12 items-center">
          {/* Left side - Text */}
          <div className="col-span-12 lg:col-span-4">
            <div className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-sm font-bold rounded-full mb-4 transform -rotate-2 border border-orange-200 shadow-sm">
              FIELD NOTES
            </div>
            <Heading level={3} className="mb-5 text-2xl md:text-3xl font-bold text-stone-900">
              Everything handled before you land
            </Heading>
            <p className="text-stone-700 text-base md:text-lg leading-relaxed mb-6 font-sans">
              We know you're not just on holiday. We've logged the essentials so you don't have to.
            </p>
            <div className="mb-8 bg-white/50 p-4 rounded-lg border border-stone-200/50 backdrop-blur-sm transform rotate-1">
              <p className="text-stone-900 font-bold mb-3 font-handwritten text-base">Included in every trip:</p>
              <ul className="space-y-2">
                {[
                  'Remote-friendly accommodation, booked and ready',
                  'Coworking sorted — flex days or a monthly desk',
                  'Gym or yoga options mapped in your neighbourhood',
                  'Local SIM + airport pickup on arrival',
                  'Santam travel insurance + 24/7 chat support',
                ].map((item) => (
                  <li key={item} className="flex items-baseline gap-2 text-stone-700 font-handwritten text-base leading-snug">
                    <span className="text-[#E86B32] font-bold shrink-0">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <Button href="/route-builder" variant="primary">
              Start your journey
            </Button>
          </div>

          {/* Right side - Feature cards */}
          <div className="col-span-12 lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 px-4 md:px-0">
              {features.map((feature) => (
                <WorkReadyFeatureCard key={feature.title} feature={feature} />
              ))}
            </div>
          </div>
        </div>

      </Container>
    </Section>
  );
};
