'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Shield, Heart, Plane, Luggage, Phone, ChevronDown, ExternalLink } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import PreFooterCTA from '@/components/sections/PreFooterCTA';
import { useInViewReveal } from '@/hooks/useInViewReveal';

// ─── Coverage Cards ───────────────────────────────────────────────────────────

const coverageItems = [
  {
    icon: Heart,
    title: 'Emergency medical',
    description: 'Cover for illness or injury while you\'re on the road. Includes inpatient and outpatient costs, with direct payment to international providers.',
    highlight: 'Up to R120 million',
    rotation: -1.5,
    tapeColor: 'bg-rose-200/80',
  },
  {
    icon: Plane,
    title: 'Trip cancellation',
    description: 'If something forces you to cut the trip short or cancel before you leave, you\'re covered for non-refundable costs.',
    highlight: 'Pre and post departure',
    rotation: 1,
    tapeColor: 'bg-amber-200/80',
  },
  {
    icon: Luggage,
    title: 'Lost or delayed luggage',
    description: 'Theft, loss, or baggage delays are covered. We know a laptop going missing abroad is a nightmare. This helps.',
    highlight: 'Bags and valuables',
    rotation: -0.5,
    tapeColor: 'bg-teal-200/80',
  },
  {
    icon: Phone,
    title: '24/7 emergency support',
    description: 'Santam\'s multilingual emergency team is reachable any time via WhatsApp or phone, wherever you are in the world.',
    highlight: 'WhatsApp + phone',
    rotation: 1.5,
    tapeColor: 'bg-violet-200/80',
  },
];

const CoverageCard: React.FC<{ item: (typeof coverageItems)[number]; index: number }> = ({ item, index }) => {
  const { ref, isVisible } = useInViewReveal<HTMLDivElement>();

  return (
    <motion.div
      ref={ref}
      className={`sb-reveal ${isVisible ? 'is-visible' : ''}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <div
        className="relative texture-lined-paper p-6 pt-10 h-full shadow-[0_4px_15px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 transform"
        style={{ rotate: `${item.rotation}deg` }}
      >
        {/* Washi Tape */}
        <div
          className={`absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-8 ${item.tapeColor} opacity-90 shadow-sm rotate-1 backdrop-blur-sm`}
          style={{
            maskImage: 'url("data:image/svg+xml,%3Csvg width=\'200\' height=\'50\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0,10 L5,0 L195,5 L200,15 L200,35 L195,45 L5,40 L0,30 Z\' fill=\'black\'/%3E%3C/svg%3E")',
            WebkitMaskImage: 'url("data:image/svg+xml,%3Csvg width=\'200\' height=\'50\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0,10 L5,0 L195,5 L200,15 L200,35 L195,45 L5,40 L0,30 Z\' fill=\'black\'/%3E%3C/svg%3E")',
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center',
          }}
        />

        {/* Icon */}
        <div className="relative mb-4 inline-block">
          <svg className="absolute inset-0 w-full h-full -m-1 transform scale-125 text-stone-400/30" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20,50 a30,30 0 1,1 60,0 a30,30 0 1,1 -60,0" strokeDasharray="100" strokeDashoffset="20" pathLength="100" />
          </svg>
          <div className="relative z-10 w-10 h-10 flex items-center justify-center">
            <item.icon className="w-6 h-6 text-stone-700" />
          </div>
        </div>

        <h3 className="text-xl font-handwritten font-bold text-stone-800 mb-1">{item.title}</h3>
        <p className="text-xs font-bold text-[#E86B32] uppercase tracking-wide mb-3 font-sans">{item.highlight}</p>
        <p className="text-stone-600 text-sm leading-relaxed font-handwritten text-base">{item.description}</p>
      </div>
    </motion.div>
  );
};

// ─── FAQ Accordion ────────────────────────────────────────────────────────────

const faqs = [
  {
    id: 1,
    question: 'Is this real insurance or just credit card cover?',
    answer: 'Real insurance. South Bound includes a Santam travel insurance policy in every package. Santam is one of South Africa\'s leading short-term insurers, part of the Sanlam group, and this is a fully underwritten policy, not a credit card benefit.',
  },
  {
    id: 2,
    question: 'Does it cover the full 90 days?',
    answer: 'Yes. The policy is matched to your trip duration. Whether you\'re doing 90 days or longer, your cover runs for the full period.',
  },
  {
    id: 3,
    question: 'What if I have a pre-existing condition?',
    answer: 'Santam covers pre-existing conditions for travelers up to age 69. If you have something specific, let us know when you book so we can make sure it\'s noted on the policy.',
  },
  {
    id: 4,
    question: 'Am I covered for adventure activities?',
    answer: 'Leisure sporting activities like surfing, hiking, and scuba diving are included. Extreme or professional adventure sports may need a top-up. If you\'re planning something specific, ask us and we\'ll check.',
  },
  {
    id: 5,
    question: 'What if I need to cut my trip short?',
    answer: 'Trip curtailment is covered. If something at home or a medical situation forces you back early, you\'re not losing everything you\'ve paid. Contact Santam\'s 24/7 support line and they\'ll guide you through it.',
  },
  {
    id: 6,
    question: 'Can I travel with a partner or family?',
    answer: 'Yes. Dependent children under 21 are covered at no extra cost. Partners can be added to the policy. Let us know when you book.',
  },
];

const FAQItem: React.FC<{ faq: (typeof faqs)[number]; isOpen: boolean; onToggle: () => void }> = ({ faq, isOpen, onToggle }) => (
  <div className="border-b border-stone-200 last:border-0">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between py-5 text-left gap-4 hover:text-[#E86B32] transition-colors"
    >
      <span className="font-semibold text-stone-900 text-base leading-snug">{faq.question}</span>
      <ChevronDown className={`w-5 h-5 shrink-0 text-stone-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
    </button>
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden"
        >
          <p className="pb-5 text-stone-600 leading-relaxed text-base">{faq.answer}</p>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TravelInsurancePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white text-stone-900">

      {/* Hero */}
      <section className="bg-[#FDF6EF] pt-24 pb-0 relative overflow-hidden min-h-[600px]">

        {/* ── Background layers ── */}
        <div className="absolute inset-0 texture-paper opacity-40 pointer-events-none" />

        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #b8a898 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            opacity: 0.18,
          }}
        />

        {/* Large faint stamp ring — top right */}
        <svg
          className="absolute -top-16 -right-16 w-[480px] h-[480px] pointer-events-none"
          viewBox="0 0 480 480" fill="none"
        >
          <circle cx="240" cy="240" r="200" stroke="#E86B32" strokeWidth="1.5" strokeDasharray="6 6" opacity="0.12" />
          <circle cx="240" cy="240" r="222" stroke="#E86B32" strokeWidth="0.8" opacity="0.07" />
          <circle cx="240" cy="240" r="170" stroke="#b8a898" strokeWidth="0.8" opacity="0.1" />
        </svg>

        {/* Small stamp ring — bottom left */}
        <svg
          className="absolute -bottom-10 -left-10 w-[260px] h-[260px] pointer-events-none"
          viewBox="0 0 260 260" fill="none"
        >
          <circle cx="130" cy="130" r="110" stroke="#E86B32" strokeWidth="1" strokeDasharray="5 5" opacity="0.10" />
          <circle cx="130" cy="130" r="90" stroke="#b8a898" strokeWidth="0.8" opacity="0.08" />
        </svg>

        {/* Dashed travel route line across bottom */}
        <svg
          className="absolute bottom-0 left-0 w-full pointer-events-none"
          height="60" preserveAspectRatio="none"
          viewBox="0 0 1440 60" fill="none"
        >
          <path
            d="M0 40 Q180 10 360 38 T720 30 T1080 38 T1440 28"
            stroke="#E86B32" strokeWidth="1" strokeDasharray="8 6" opacity="0.15" fill="none"
          />
        </svg>

        {/* Warm glow centre */}
        <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-[#E86B32]/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />

        {/* ── Content ── */}
        <Container className="relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-end">

            {/* Left — text */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.22, 0.61, 0.36, 1] }}
              className="pb-20"
            >
              {/* Eyebrow */}
              <div className="flex items-center gap-2 mb-8">
                <div className="w-6 h-px bg-[#E86B32]" />
                <span className="text-[#E86B32] text-xs font-bold uppercase tracking-[0.2em]">
                  Included in every package
                </span>
              </div>

              {/* Heading */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-stone-900 leading-[1.1] tracking-tight mb-8">
                Covered,<br />
                before you<br />
                <span className="text-[#E86B32]">even land.</span>
              </h1>

              <p className="text-lg text-stone-600 leading-relaxed mb-10 max-w-lg">
                Every South Bound trip includes a Santam travel insurance policy. Medical emergencies, cancellations, lost luggage, 24/7 emergency support — sorted before you pack.
              </p>

              <div className="flex flex-wrap gap-4 items-center mb-16">
                <Link
                  href="/route-builder"
                  className="inline-block bg-[#E86B32] text-white font-bold py-3.5 px-8 rounded-sm shadow-md hover:bg-[#d55a24] hover:-translate-y-0.5 transition-all text-sm tracking-wide"
                >
                  Plan your trip
                </Link>
                <a
                  href="https://travelinsurance.santam.co.za"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-stone-500 text-sm hover:text-stone-800 transition-colors font-medium"
                >
                  About Santam
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Quick-stat strip */}
              <div className="grid grid-cols-3 gap-4 border-t border-stone-200/70 pt-8">
                {[
                  { value: 'R120m', label: 'Medical cover' },
                  { value: '24/7', label: 'Emergency support' },
                  { value: '90–360', label: 'Days covered' },
                ].map((s) => (
                  <div key={s.label}>
                    <p className="text-stone-900 font-bold text-xl tracking-tight">{s.value}</p>
                    <p className="text-stone-400 text-xs mt-0.5 uppercase tracking-wide">{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right — policy card visual */}
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 0.61, 0.36, 1] }}
              className="flex justify-center lg:justify-end pb-0 relative"
            >
              <div className="relative w-full max-w-sm">
                {/* Main policy card */}
                <div className="relative bg-white rounded-sm overflow-hidden shadow-[0_2px_4px_rgba(0,0,0,0.04),0_8px_16px_rgba(0,0,0,0.06),0_24px_48px_rgba(0,0,0,0.10),0_2px_32px_rgba(232,107,50,0.06)]">

                  {/* Card header strip */}
                  <div className="bg-[#2a1d13] px-6 pt-6 pb-5 relative overflow-hidden">
                    {/* Subtle ring watermark on the dark header */}
                    <svg className="absolute -right-8 -top-8 w-36 h-36 pointer-events-none" viewBox="0 0 144 144" fill="none">
                      <circle cx="72" cy="72" r="60" stroke="white" strokeWidth="1" opacity="0.07" />
                      <circle cx="72" cy="72" r="44" stroke="white" strokeWidth="0.8" strokeDasharray="4 4" opacity="0.05" />
                    </svg>
                    <div className="flex items-start justify-between mb-4 relative z-10">
                      <div>
                        <p className="text-[#a08060] text-xs uppercase tracking-widest mb-1">Travel Policy</p>
                        <p className="text-[#f5ede4] font-bold text-lg tracking-tight">South Bound</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-[#f5ede4]" />
                      </div>
                    </div>
                    <div className="flex items-end justify-between relative z-10">
                      <div>
                        <p className="text-[#7a5c40] text-xs mb-0.5">Underwritten by</p>
                        <p className="text-[#f5ede4] font-semibold text-sm">Santam Limited</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[#7a5c40] text-xs mb-0.5">Medical cover</p>
                        <p className="text-[#f5ede4] font-bold text-sm">R120 million</p>
                      </div>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="px-6 py-5 space-y-3.5 bg-white">
                    {[
                      { label: 'Emergency medical', value: 'Included' },
                      { label: 'Trip cancellation', value: 'Included' },
                      { label: 'Lost or delayed luggage', value: 'Included' },
                      { label: '24/7 emergency support', value: 'WhatsApp + phone' },
                      { label: 'Children under 21', value: 'Free' },
                      { label: 'Trip duration', value: 'Matched to your route' },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center justify-between border-b border-stone-50 pb-3.5 last:border-0 last:pb-0">
                        <span className="text-stone-500 text-sm">{row.label}</span>
                        <span className="text-stone-900 text-sm font-semibold">{row.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Card footer */}
                  <div className="px-6 py-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                    <p className="text-stone-400 text-xs">Included in every package</p>
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#E86B32]" style={{ opacity: 0.3 + i * 0.35 }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </Container>

        <div className="border-t border-stone-200/60 mt-0" />
      </section>

      {/* Coverage Cards */}
      <Section className="bg-[#FDF6EF] relative overflow-hidden">
        <div className="absolute inset-0 texture-paper opacity-60 pointer-events-none" />
        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-sm font-bold rounded-full mb-4 transform rotate-1 border border-orange-200 shadow-sm">
              WHAT'S COVERED
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-stone-900">
              The important stuff, covered.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4 md:px-0">
            {coverageItems.map((item, index) => (
              <CoverageCard key={item.title} item={item} index={index} />
            ))}
          </div>
        </Container>
      </Section>

      {/* Why it matters for long trips */}
      <section className="py-20 bg-stone-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <Container className="relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="inline-block px-3 py-1 bg-white/10 text-orange-300 text-xs font-bold uppercase tracking-widest rounded-full mb-6 border border-white/10">
                90+ DAY TRIPS
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-serif mb-6 leading-tight">
                Standard travel insurance<br />
                <span className="text-[#E86B32]">wasn't built for this.</span>
              </h2>
              <p className="text-stone-300 text-lg leading-relaxed mb-6">
                Most travel policies max out at 30 or 60 days. When you're living abroad for 90 days or more, that's not good enough. South Bound includes a Santam policy matched to your actual trip length — whether you're doing 90, 180, or longer.
              </p>
              <p className="text-stone-300 text-lg leading-relaxed">
                We handle the policy so you don't have to research it, compare providers, or guess whether you're actually covered. It's sorted before you arrive.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {[
                { label: 'Medical cover', value: 'Up to R120m' },
                { label: 'Trip duration', value: 'Matched to your route' },
                { label: 'Emergency line', value: '24/7 via WhatsApp' },
                { label: 'Kids under 21', value: 'Covered free' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/5 border border-white/10 rounded-sm p-5">
                  <p className="text-[#E86B32] font-bold text-lg mb-1">{stat.value}</p>
                  <p className="text-stone-400 text-sm">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </Container>
      </section>

      {/* What's not covered — honest section */}
      <section className="py-20 bg-white border-b border-stone-100">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-3xl"
          >
            <h2 className="text-2xl md:text-3xl font-bold font-serif text-stone-900 mb-4">
              What isn't covered
            </h2>
            <p className="text-stone-500 text-base leading-relaxed mb-6">
              We'd rather be upfront than have you find out on the ground.
            </p>
            <ul className="space-y-3 text-stone-700 text-base leading-relaxed">
              {[
                'Professional or extreme adventure sports (free-climbing, base jumping, etc.)',
                'Travel to countries under South African government travel advisories',
                'Loss or damage from unattended belongings in public spaces',
                'Elective medical procedures or cosmetic treatments',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-stone-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-stone-500 text-sm mt-6">
              For a full list of exclusions, the policy wording is available from{' '}
              <a
                href="https://travelinsurance.santam.co.za"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E86B32] underline underline-offset-2 hover:text-[#d55a24] transition-colors"
              >
                Santam's website
              </a>.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-stone-50 border-b border-stone-100">
        <Container>
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="sticky top-8"
            >
              <div className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-sm font-bold rounded-full mb-4 border border-orange-200">
                QUESTIONS
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-serif text-stone-900 mb-4">
                Common questions
              </h2>
              <p className="text-stone-500 text-base leading-relaxed">
                If something isn't answered here,{' '}
                <Link href="/contact" className="text-[#E86B32] underline underline-offset-2 hover:text-[#d55a24] transition-colors">
                  just ask us directly
                </Link>.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="divide-y divide-stone-200 border-t border-stone-200"
            >
              {faqs.map((faq) => (
                <FAQItem
                  key={faq.id}
                  faq={faq}
                  isOpen={openFaq === faq.id}
                  onToggle={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                />
              ))}
            </motion.div>
          </div>
        </Container>
      </section>

      <PreFooterCTA />
    </div>
  );
}
