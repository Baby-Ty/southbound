'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getCityBySlug, CityData } from '@/data/cities';
import { notFound } from 'next/navigation';

// ─── Score Bar ───────────────────────────────────────────────────────────────
function ScoreBar({ score, max = 10 }: { score: number; max?: number }) {
  const pct = (score / max) * 100;
  const color =
    pct >= 90
      ? 'bg-sb-mint-400'
      : pct >= 75
      ? 'bg-sb-teal-500'
      : pct >= 60
      ? 'bg-sb-orange-400'
      : 'bg-sb-beige-500';
  return (
    <div className="w-full bg-sb-beige-200 rounded-full h-2">
      <motion.div
        className={`h-2 rounded-full ${color}`}
        initial={{ width: 0 }}
        whileInView={{ width: `${pct}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
      />
    </div>
  );
}

// ─── Section Image Banner ─────────────────────────────────────────────────────
function SectionBanner({
  image,
  label,
  alt,
}: {
  image: string;
  label: string;
  alt: string;
}) {
  return (
    <div className="relative h-52 md:h-64 rounded-2xl overflow-hidden mb-8">
      <Image
        src={image}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 960px"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-sb-navy-900/70 via-sb-navy-800/30 to-transparent" />
      <div className="absolute inset-0 flex items-end p-6 md:p-8">
        <h2
          className="text-3xl md:text-4xl font-bold text-white"
          style={{ fontFamily: 'var(--font-plus-jakarta-sans)' }}
        >
          {label}
        </h2>
      </div>
    </div>
  );
}

// ─── Plain Section Heading (no banner) ───────────────────────────────────────
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-2xl md:text-3xl font-bold text-sb-navy-700 mb-6"
      style={{ fontFamily: 'var(--font-plus-jakarta-sans)' }}
    >
      {children}
    </h2>
  );
}

// ─── Fade-in wrapper ─────────────────────────────────────────────────────────
function FadeIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CityPage() {
  const params = useParams();
  const slug =
    typeof params?.city === 'string'
      ? params.city
      : Array.isArray(params?.city)
      ? params.city[0]
      : '';
  const city: CityData | undefined = getCityBySlug(slug);

  if (!city) {
    notFound();
    return null;
  }

  const navLinks = [
    { id: 'overview', label: 'Overview' },
    { id: 'food', label: 'Food' },
    { id: 'activities', label: 'Activities' },
    { id: 'neighbourhoods', label: 'Neighbourhoods' },
    { id: 'costs', label: 'Costs' },
    { id: 'remote-work', label: 'Remote Work' },
    { id: 'visa', label: 'Visa' },
    { id: 'rating', label: 'Rating' },
    { id: 'best-time', label: 'Best Time' },
  ];

  return (
    <div className="min-h-screen bg-sb-beige-100">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative h-[75vh] min-h-[540px] overflow-hidden">
        <Image
          src={city.heroImage}
          alt={city.altText}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* dual gradient: bottom-up dark + left-side fade for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-sb-navy-900/90 via-sb-navy-800/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-sb-navy-900/50 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end pb-14 px-4 sm:px-8 lg:px-12">
          <div className="max-w-5xl">
            {/* Breadcrumb */}
            <motion.div
              className="flex items-center gap-2 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Link href="/destinations" className="text-sb-teal-200 text-sm hover:text-white transition-colors">
                Destinations
              </Link>
              <span className="text-sb-teal-400 text-sm">›</span>
              <span className="text-sb-teal-200 text-sm">{city.region}</span>
            </motion.div>

            {/* City name */}
            <motion.h1
              className="text-6xl md:text-8xl font-bold text-white mb-3 leading-none tracking-tight"
              style={{ fontFamily: 'var(--font-plus-jakarta-sans)' }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {city.flag} {city.name}
            </motion.h1>

            {/* Country + tagline */}
            <motion.p
              className="text-sb-teal-100 text-lg md:text-xl max-w-2xl mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              {city.country} · {city.tagline}
            </motion.p>

            {/* Quick-stat chips */}
            <motion.div
              className="flex flex-wrap gap-3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {[
                { icon: '💰', text: `${city.quickStats.monthlyBudget}/month` },
                { icon: '⭐', text: `${city.quickStats.nomadRating}/10 nomad rating` },
                { icon: '🛂', text: city.quickStats.visaFree },
                { icon: '☀️', text: `Best: ${city.quickStats.bestMonths}` },
              ].map((chip) => (
                <div
                  key={chip.text}
                  className="bg-white/15 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-white text-sm font-medium flex items-center gap-2"
                >
                  <span>{chip.icon}</span>
                  <span>{chip.text}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Sticky Nav ───────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-sb-beige-300 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 overflow-x-auto">
          <div className="flex gap-1 py-3 whitespace-nowrap">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                className="px-3 py-1.5 rounded-full text-sm font-medium text-sb-navy-500 hover:text-sb-teal-700 hover:bg-sb-teal-50 transition-all"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-20">

        {/* ── Overview ── */}
        <section id="overview">
          <FadeIn>
            <SectionHeading>Overview</SectionHeading>
            <p className="text-lg md:text-xl text-sb-navy-600 leading-relaxed max-w-3xl">
              {city.overview}
            </p>
          </FadeIn>
        </section>

        {/* ── Culture & Vibe ── */}
        <section>
          <FadeIn>
            <SectionHeading>The Vibe</SectionHeading>
            <p className="text-sb-navy-600 leading-relaxed mb-6 max-w-3xl">
              {city.culture.description}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {city.culture.highlights.map((h, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-sm border border-sb-beige-200"
                >
                  <span className="text-sb-teal-500 mt-0.5 flex-shrink-0 font-bold">✓</span>
                  <span className="text-sb-navy-600 text-sm">{h}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </section>

        {/* ── Food ── */}
        <section id="food">
          <FadeIn>
            <SectionBanner
              image={city.sectionImages.food}
              label="Food"
              alt={`${city.name} food and local cuisine`}
            />

            <p className="text-sb-navy-600 leading-relaxed mb-8 max-w-3xl">
              {city.food.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Must Try */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-sb-beige-200">
                <h3 className="font-bold text-sb-navy-700 mb-4 flex items-center gap-2">
                  <span className="text-xl">🍽️</span> Must try
                </h3>
                <ul className="space-y-2.5">
                  {city.food.mustTry.map((item, i) => (
                    <li key={i} className="text-sb-navy-600 text-sm flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-sb-orange-400 flex-shrink-0 mt-1.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Budget Breakdown */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-sb-beige-200">
                <h3 className="font-bold text-sb-navy-700 mb-4 flex items-center gap-2">
                  <span className="text-xl">💸</span> What you will pay
                </h3>
                <div className="space-y-4">
                  {[
                    { label: 'Street food', color: 'text-sb-teal-600 bg-sb-teal-50', text: city.food.budgetBreakdown.street },
                    { label: 'Mid-range', color: 'text-sb-orange-600 bg-sb-orange-50', text: city.food.budgetBreakdown.midRange },
                    { label: 'Premium', color: 'text-sb-navy-600 bg-sb-navy-50', text: city.food.budgetBreakdown.premium },
                  ].map((tier) => (
                    <div key={tier.label}>
                      <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${tier.color}`}>
                        {tier.label}
                      </span>
                      <p className="text-sb-navy-600 text-sm mt-1.5">{tier.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top areas */}
            <div className="flex flex-wrap gap-2">
              {city.food.topAreas.map((area, i) => (
                <span
                  key={i}
                  className="bg-sb-orange-50 text-sb-orange-700 border border-sb-orange-200 rounded-full px-3 py-1.5 text-sm"
                >
                  📍 {area}
                </span>
              ))}
            </div>
          </FadeIn>
        </section>

        {/* ── Activities ── */}
        <section id="activities">
          <FadeIn>
            <SectionBanner
              image={city.sectionImages.activities}
              label="Activities"
              alt={`Things to do in ${city.name}`}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {city.activities.map((activity, i) => (
                <motion.div
                  key={i}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-sb-beige-200 hover:shadow-md hover:border-sb-teal-200 transition-all group"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.04 }}
                >
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-200 inline-block">
                    {activity.emoji}
                  </div>
                  <h3 className="font-bold text-sb-navy-700 mb-1.5 text-sm">{activity.name}</h3>
                  <p className="text-sb-navy-500 text-sm leading-relaxed">{activity.description}</p>
                </motion.div>
              ))}
            </div>
          </FadeIn>
        </section>

        {/* ── Sights ── */}
        <section>
          <FadeIn>
            <SectionBanner
              image={city.sectionImages.sights}
              label="Sights"
              alt={`Landmarks and sights in ${city.name}`}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-sb-beige-200">
                <h3 className="font-bold text-sb-navy-700 mb-5 text-sm uppercase tracking-wide flex items-center gap-2">
                  <span>🗺️</span> Worth seeing
                </h3>
                <div className="space-y-5">
                  {city.sights.mustSee.map((sight, i) => (
                    <div key={i} className="border-l-2 border-sb-orange-300 pl-4">
                      <p className="font-semibold text-sb-navy-700 text-sm">{sight.name}</p>
                      <p className="text-sb-navy-500 text-sm mt-0.5">{sight.note}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-sb-teal-50 rounded-2xl p-6 border border-sb-teal-200">
                <h3 className="font-bold text-sb-teal-700 mb-5 text-sm uppercase tracking-wide flex items-center gap-2">
                  <span>🏡</span> Lived-in experiences
                </h3>
                <div className="space-y-5">
                  {city.sights.livedIn.map((sight, i) => (
                    <div key={i} className="border-l-2 border-sb-teal-400 pl-4">
                      <p className="font-semibold text-sb-navy-700 text-sm">{sight.name}</p>
                      <p className="text-sb-navy-500 text-sm mt-0.5">{sight.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* ── Neighbourhoods ── */}
        <section id="neighbourhoods">
          <FadeIn>
            <SectionHeading>Neighbourhoods</SectionHeading>
            <div className="space-y-4">
              {city.neighbourhoods.map((n, i) => (
                <motion.div
                  key={i}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-sb-beige-200 hover:border-sb-teal-300 transition-all"
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full bg-sb-teal-400 flex-shrink-0" />
                        <h3 className="font-bold text-sb-navy-700 text-lg">{n.name}</h3>
                      </div>
                      <p className="text-sb-navy-600 text-sm leading-relaxed mb-3">{n.description}</p>
                      <p className="text-sb-teal-600 text-sm">
                        <span className="font-semibold">Best for:</span> {n.bestFor}
                      </p>
                    </div>
                    <div className="bg-sb-beige-100 border border-sb-beige-300 rounded-xl px-4 py-3 text-center flex-shrink-0 md:min-w-[160px]">
                      <p className="text-xs text-sb-navy-400 mb-1 uppercase tracking-wide font-medium">Monthly rent</p>
                      <p className="font-bold text-sb-navy-700 text-sm leading-snug">{n.monthlyRent}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </FadeIn>
        </section>

        {/* ── Week in the Life ── */}
        <section>
          <FadeIn>
            <SectionHeading>A week in the life</SectionHeading>
            <p className="text-sb-navy-500 text-sm mb-6 max-w-2xl">
              What does a working week actually look like here?
            </p>
            <div className="space-y-3">
              {city.weekInTheLife.map((entry, i) => (
                <motion.div
                  key={i}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-sb-beige-200 flex gap-4 hover:border-sb-teal-200 transition-all"
                  initial={{ opacity: 0, x: -14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                >
                  <div className="flex-shrink-0">
                    <span className="inline-block bg-sb-teal-100 text-sb-teal-700 text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                      {entry.label}
                    </span>
                  </div>
                  <p className="text-sb-navy-600 text-sm leading-relaxed">{entry.description}</p>
                </motion.div>
              ))}
            </div>
          </FadeIn>
        </section>

        {/* ── Cost of Living ── */}
        <section id="costs">
          <FadeIn>
            <SectionHeading>Cost of Living</SectionHeading>
            <p className="text-sb-navy-400 text-sm mb-8 italic max-w-2xl">{city.costOfLiving.note}</p>

            {/* Monthly total cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {[
                {
                  label: 'Budget',
                  value: city.costOfLiving.total.budget,
                  sub: 'Basic but comfortable',
                  color: 'border-sb-mint-300 bg-sb-mint-50',
                  badge: 'bg-sb-mint-200 text-sb-mint-800',
                },
                {
                  label: 'Mid-range',
                  value: city.costOfLiving.total.mid,
                  sub: 'Great quality of life',
                  color: 'border-sb-teal-300 bg-sb-teal-50',
                  badge: 'bg-sb-teal-200 text-sb-teal-800',
                },
                {
                  label: 'Premium',
                  value: city.costOfLiving.total.premium,
                  sub: 'Best of everything',
                  color: 'border-sb-orange-300 bg-sb-orange-50',
                  badge: 'bg-sb-orange-200 text-sb-orange-800',
                },
              ].map((tier) => (
                <div key={tier.label} className={`rounded-2xl p-6 border-2 ${tier.color}`}>
                  <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${tier.badge}`}>
                    {tier.label}
                  </span>
                  <p className="text-3xl font-bold text-sb-navy-700 mt-3 mb-1">{tier.value}</p>
                  <p className="text-xs text-sb-navy-400">{tier.sub} · per month</p>
                </div>
              ))}
            </div>

            {/* Breakdown table */}
            <div className="bg-white rounded-2xl shadow-sm border border-sb-beige-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-sb-beige-200 bg-sb-beige-50">
                <h3 className="font-semibold text-sb-navy-700 text-sm">Monthly breakdown</h3>
              </div>
              <div className="divide-y divide-sb-beige-100">
                {[
                  { icon: '🏠', label: 'Accommodation', budget: city.costOfLiving.accommodation.budget, mid: city.costOfLiving.accommodation.mid, premium: city.costOfLiving.accommodation.premium },
                  { icon: '💻', label: 'Coworking', budget: city.costOfLiving.coworking.monthly, mid: city.costOfLiving.coworking.monthly, premium: city.costOfLiving.coworking.monthly },
                  { icon: '🍜', label: 'Food', budget: city.costOfLiving.food.budget, mid: city.costOfLiving.food.mid, premium: city.costOfLiving.food.premium },
                  { icon: '🛵', label: 'Transport', budget: city.costOfLiving.transport.budget, mid: city.costOfLiving.transport.mid, premium: city.costOfLiving.transport.premium },
                  { icon: '🏋️', label: 'Gym', budget: city.costOfLiving.gym.budget, mid: city.costOfLiving.gym.mid, premium: city.costOfLiving.gym.premium },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-4 gap-4 px-6 py-4 hover:bg-sb-beige-50 transition-colors text-sm"
                  >
                    <div className="font-medium text-sb-navy-700 flex items-center gap-2">
                      <span>{row.icon}</span> {row.label}
                    </div>
                    <div className="text-sb-mint-700 font-medium">{row.budget}</div>
                    <div className="text-sb-teal-700 font-medium">{row.mid}</div>
                    <div className="text-sb-orange-700 font-medium">{row.premium}</div>
                  </div>
                ))}
                {/* Header row */}
              </div>
              <div className="grid grid-cols-4 gap-4 px-6 py-3 bg-sb-beige-50 border-t border-sb-beige-200 text-xs font-bold text-sb-navy-400 uppercase tracking-wide">
                <div />
                <div className="text-sb-mint-600">Budget</div>
                <div className="text-sb-teal-600">Mid</div>
                <div className="text-sb-orange-600">Premium</div>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* ── Remote Work ── */}
        <section id="remote-work">
          <FadeIn>
            <SectionBanner
              image={city.sectionImages.remoteWork}
              label="Remote Work Setup"
              alt={`Coworking and remote work in ${city.name}`}
            />

            {/* Internet quality bar */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-sb-beige-200 mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📶</span>
                  <h3 className="font-bold text-sb-navy-700">Internet quality</h3>
                </div>
                <span className="text-lg font-bold text-sb-teal-600">
                  {city.remoteWork.internetRating}<span className="text-sm font-normal text-sb-navy-400">/10</span>
                </span>
              </div>
              <ScoreBar score={city.remoteWork.internetRating} />
              <p className="text-sb-navy-600 text-sm mt-4 leading-relaxed">{city.remoteWork.internetQuality}</p>
            </div>

            {/* Coworking Spaces */}
            <h3 className="font-bold text-sb-navy-700 mb-4">Coworking spaces</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {city.remoteWork.coworkingSpaces.map((space, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-sb-beige-200 flex flex-col"
                >
                  <h4 className="font-bold text-sb-navy-700 text-sm mb-2">{space.name}</h4>
                  <p className="text-sb-navy-500 text-sm leading-relaxed flex-1 mb-3">{space.description}</p>
                  <p className="text-sb-teal-600 text-sm font-semibold border-t border-sb-beige-200 pt-3 mt-auto">
                    {space.price}
                  </p>
                </div>
              ))}
            </div>

            {/* Cafes */}
            <div className="bg-sb-orange-50 border border-sb-orange-200 rounded-2xl p-5 flex gap-4">
              <span className="text-2xl flex-shrink-0">☕</span>
              <div>
                <h3 className="font-bold text-sb-navy-700 mb-1.5 text-sm">Working from cafes</h3>
                <p className="text-sb-navy-600 text-sm leading-relaxed">{city.remoteWork.cafes}</p>
              </div>
            </div>
          </FadeIn>
        </section>

        {/* ── Visa ── */}
        <section id="visa">
          <FadeIn>
            <SectionHeading>Visa for South Africans</SectionHeading>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-sb-beige-200 mb-4">
              <div className="flex items-start gap-4 mb-5">
                <div className="w-10 h-10 rounded-full bg-sb-teal-100 flex items-center justify-center flex-shrink-0 text-lg">
                  🛂
                </div>
                <h3 className="font-bold text-sb-navy-700 text-lg pt-1.5">{city.visa.headline}</h3>
              </div>
              <ul className="space-y-2.5 mb-6">
                {city.visa.details.map((d, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-sb-navy-600">
                    <span className="text-sb-teal-500 mt-0.5 flex-shrink-0 font-bold">✓</span>
                    {d}
                  </li>
                ))}
              </ul>
              <div className="border-t border-sb-beige-200 pt-5">
                <h4 className="font-semibold text-sb-navy-700 mb-2 text-sm flex items-center gap-2">
                  <span>📅</span> Staying longer
                </h4>
                <p className="text-sb-navy-600 text-sm leading-relaxed">{city.visa.longerStay}</p>
              </div>
            </div>

            {city.visa.flag && (
              <div className="flex items-start gap-3 bg-sb-orange-50 border border-sb-orange-200 rounded-xl p-4">
                <span className="text-sb-orange-500 flex-shrink-0 text-lg">⚠️</span>
                <p className="text-sb-orange-800 text-sm">{city.visa.flag}</p>
              </div>
            )}
          </FadeIn>
        </section>

        {/* ── Nomad Rating ── */}
        <section id="rating">
          <FadeIn>
            <SectionHeading>Nomad Rating</SectionHeading>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-sb-beige-200">
              {/* Overall score */}
              <div className="flex items-center gap-6 mb-8 pb-6 border-b border-sb-beige-200">
                <div className="text-center flex-shrink-0">
                  <div className="text-6xl font-bold text-sb-teal-600 leading-none">
                    {city.nomadRating.overall}
                  </div>
                  <div className="text-sm text-sb-navy-400 mt-1">out of 10</div>
                </div>
                <p className="text-sb-navy-600 text-sm leading-relaxed">{city.nomadRating.summary}</p>
              </div>

              {/* Score breakdown */}
              <div className="space-y-5">
                {city.nomadRating.scores.map((score, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-semibold text-sb-navy-700">{score.factor}</span>
                      <span className="text-sm font-bold text-sb-teal-600">{score.score}/10</span>
                    </div>
                    <ScoreBar score={score.score} />
                    <p className="text-xs text-sb-navy-400 mt-1">{score.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </section>

        {/* ── Best Time ── */}
        <section id="best-time">
          <FadeIn>
            <SectionHeading>Best Time to Visit</SectionHeading>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {[
                { icon: '🌤️', label: 'Ideal window', text: city.bestTime.ideal, style: 'bg-sb-teal-50 border-sb-teal-200', heading: 'text-sb-teal-700' },
                { icon: '🌥️', label: 'Shoulder season', text: city.bestTime.shoulder, style: 'bg-sb-beige-50 border-sb-beige-300', heading: 'text-sb-navy-600' },
                { icon: '🌧️', label: 'Worth knowing', text: city.bestTime.avoid, style: 'bg-red-50 border-red-200', heading: 'text-red-600' },
              ].map((item) => (
                <div key={item.label} className={`rounded-2xl p-5 border ${item.style}`}>
                  <div className="text-2xl mb-2">{item.icon}</div>
                  <h3 className={`font-bold mb-2 text-sm ${item.heading}`}>{item.label}</h3>
                  <p className="text-sb-navy-600 text-sm leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="bg-white border border-sb-teal-200 rounded-2xl p-5">
              <p className="text-sb-navy-600 text-sm leading-relaxed">
                <span className="font-semibold text-sb-teal-700">Bottom line:</span>{' '}
                {city.bestTime.recommendation}
              </p>
            </div>
          </FadeIn>
        </section>

        {/* ── Practical Tips ── */}
        <section>
          <FadeIn>
            <SectionHeading>Practical Tips</SectionHeading>
            <div className="space-y-4">
              {city.practicalTips.map((tip, i) => (
                <motion.div
                  key={i}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-sb-beige-200 flex gap-4"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}
                >
                  <div className="w-8 h-8 rounded-full bg-sb-teal-100 text-sb-teal-700 font-bold flex items-center justify-center flex-shrink-0 text-sm">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-sb-navy-700 mb-1 text-sm">{tip.title}</h3>
                    <p className="text-sb-navy-500 text-sm leading-relaxed">{tip.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </FadeIn>
        </section>

        {/* ── CTA ── */}
        <section>
          <FadeIn>
            <div className="relative rounded-3xl overflow-hidden">
              {/* Background image with strong overlay */}
              <div className="absolute inset-0">
                <Image
                  src={city.heroImage}
                  alt={city.altText}
                  fill
                  className="object-cover scale-105"
                  sizes="960px"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-sb-teal-800/95 to-sb-navy-900/95" />
              </div>

              <div className="relative z-10 p-10 md:p-14 text-center text-white">
                <h2
                  className="text-3xl md:text-4xl font-bold mb-4"
                  style={{ fontFamily: 'var(--font-plus-jakarta-sans)' }}
                >
                  Want to spend a month in {city.name}?
                </h2>
                <p className="text-sb-teal-100 text-lg mb-8 max-w-xl mx-auto">
                  South Bound handles the planning. We design your route, source the accommodation, and make sure everything works before you land.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/contact"
                    className="bg-sb-orange-500 hover:bg-sb-orange-600 text-white font-bold px-8 py-4 rounded-full transition-colors text-base"
                  >
                    Plan my trip
                  </Link>
                  <Link
                    href="/destinations"
                    className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-8 py-4 rounded-full transition-colors text-base"
                  >
                    See all destinations
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>
        </section>

      </div>
    </div>
  );
}
