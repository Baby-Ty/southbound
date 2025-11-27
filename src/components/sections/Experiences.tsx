'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Container } from '../ui/Container';
import { Section } from '../ui/Section';
import { Heading } from '../ui/Heading';

const experiences = [
  {
    id: 1,
    title: 'City Hopper',
    description: '3–4 cities across one region. Perfect for exploring diverse cultures while staying productive.',
    tags: ['Culture', 'Coworking', 'Community'],
    gradient: 'from-teal-500/80 to-transparent'
  },
  {
    id: 2,
    title: 'Deep Dive',
    description: 'One city for 90 days. Settle in, build routines, and become a local.',
    tags: ['Routine', 'Networking', 'Local'],
    gradient: 'from-orange-500/80 to-transparent'
  },
  {
    id: 3,
    title: 'Mixed Adventure',
    description: 'Combine regions for variety. Start tropical, finish European—or vice versa.',
    tags: ['Variety', 'Adventure', 'Flexible'],
    gradient: 'from-purple-500/80 to-transparent'
  }
];

export const ExperiencesSection: React.FC = () => {
  return (
    <Section className="bg-white">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Heading level={2} className="mb-4">
            Choose your experience
          </Heading>
          <p className="text-slate-600 md:text-lg max-w-2xl mx-auto">
            Every trip is tailored to your work needs and travel style
          </p>
        </motion.div>

        <div className="grid grid-cols-12 gap-6 md:gap-8">
          {experiences.map((experience, index) => (
            <motion.div
              key={experience.id}
              className="col-span-12 md:col-span-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="group relative aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(2,6,23,0.08)] border border-slate-200/60 hover:shadow-[0_20px_40px_rgba(2,6,23,0.12)] transition-all duration-300">
                {/* Background with subtle pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-50">
                  <div className="absolute inset-0 opacity-30">
                    <svg width="100%" height="100%">
                      <pattern id={`pattern-${experience.id}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                        <circle cx="20" cy="20" r="1" fill="#64748b" opacity="0.3" />
                      </pattern>
                      <rect width="100%" height="100%" fill={`url(#pattern-${experience.id})`} />
                    </svg>
                  </div>
                </div>

                {/* Overlay gradient */}
                <div className={`absolute inset-0 bg-gradient-to-t ${experience.gradient}`} />

                {/* Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <h3 className="text-2xl font-semibold text-white mb-2 group-hover:scale-105 transition-transform duration-300">
                    {experience.title}
                  </h3>
                  <p className="text-white/90 text-sm mb-4">
                    {experience.description}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {experience.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white border border-white/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </Section>
  );
};










