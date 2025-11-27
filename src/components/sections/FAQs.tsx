'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Container } from '../ui/Container';
import { Section } from '../ui/Section';
import { Heading } from '../ui/Heading';

const faqs = [
  {
    id: 1,
    question: 'How long are the trips?',
    answer: 'All trips start at 90 days. This gives you enough time to settle in, build a routine, and really experience your destination—while still qualifying for most tourist visas.'
  },
  {
    id: 2,
    question: 'Can I travel with friends or a partner?',
    answer: 'Right now, our trips are designed for individual travelers. We focus on solo remote workers who want to meet other nomads and build community along the way.'
  },
  {
    id: 3,
    question: 'What if I need to come home early?',
    answer: 'Life happens. We build flexibility into every booking where possible. Contact us and we\'ll work with you to adjust dates or arrange early returns.'
  },
  {
    id: 4,
    question: 'Do you handle visa applications?',
    answer: 'Yes—we guide you through the process, provide all required documents, and handle submissions for destinations that allow it. Some countries require you to apply in person, and we\'ll prep you for that too.'
  },
  {
    id: 5,
    question: 'What\'s included in the price?',
    answer: 'Accommodation, coworking access, airport transfers, SIM card with data, 24/7 support, and visa assistance. Flights can be added, or you can book your own.'
  },
  {
    id: 6,
    question: 'Is this only for South Africans?',
    answer: 'We\'re built by South Africans, for South Africans—with SA remote work culture, time zones, and budgets in mind. If you\'re from elsewhere but vibe with that, get in touch!'
  }
];

interface FAQsSectionProps {
  embedded?: boolean;
}

export const FAQsSection: React.FC<FAQsSectionProps> = ({ embedded = false }) => {
  const [openId, setOpenId] = useState<number | null>(null);

  const content = (
    <div className="w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className={`mb-12 ${embedded ? 'text-left' : 'text-center'}`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-4">
            Frequently asked questions
          </h2>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Everything you need to know about the South Bound experience.
          </p>
        </motion.div>

        <div className={`space-y-4 ${embedded ? '' : 'max-w-3xl mx-auto'}`}>
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <button
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className={`w-full text-left p-6 rounded-xl transition-all duration-300 ${
                  openId === faq.id 
                    ? 'bg-white shadow-md border-transparent' 
                    : 'bg-white border border-stone-200 hover:border-[#E86B32]/30'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className={`text-lg font-bold pr-8 ${openId === faq.id ? 'text-[#E86B32]' : 'text-stone-900'}`}>
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: openId === faq.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className={`w-5 h-5 flex-shrink-0 ${openId === faq.id ? 'text-[#E86B32]' : 'text-stone-400'}`} />
                  </motion.div>
                </div>
                
                <AnimatePresence>
                  {openId === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="text-stone-600 mt-4 leading-relaxed text-base">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>
    </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <Section className="bg-stone-50 relative py-24">
      <Container>
        {content}
      </Container>
    </Section>
  );
};
