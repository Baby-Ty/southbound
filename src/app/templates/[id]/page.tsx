'use client';

import React, { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, MessageCircle, Wifi, Thermometer, Shield, Star, Clock, MapPin, ChevronRight } from 'lucide-react';
import { TRIP_TEMPLATES, TripTemplate } from '@/lib/tripTemplates';
import { CITY_PRESETS, CityPreset, RegionKey } from '@/lib/cityPresets';
import { notFound } from 'next/navigation';

// ─── Visa info for SA passport holders ───────────────────────────────────────
const VISA_INFO: Record<string, { days: string; type: string; notes: string }> = {
  Thailand:        { days: '30 days',  type: 'Visa-free',         notes: 'Extendable to 60 days at immigration office. Easy border run for resets.' },
  Indonesia:       { days: '30 days',  type: 'Visa on arrival',   notes: 'Visa on arrival ~$35 USD. Extendable once for another 30 days.' },
  Vietnam:         { days: '45 days',  type: 'Visa-free',         notes: '90-day e-visa available for ~$25 USD. Best option for longer stays.' },
  Malaysia:        { days: '90 days',  type: 'Visa-free',         notes: 'Very generous. Easy to stay for 3 months without any extension.' },
  Singapore:       { days: '30 days',  type: 'Visa-free',         notes: 'Clean, easy entry. Not ideal for long stays due to cost.' },
  Mexico:          { days: '180 days', type: 'Visa-free',         notes: 'Extremely generous. Ask for 180 days at the border.' },
  Colombia:        { days: '90 days',  type: 'Visa-free',         notes: 'Extendable to 180 days total per year.' },
  Argentina:       { days: '90 days',  type: 'Visa-free',         notes: 'Extendable once. Strong expat community.' },
  Brazil:          { days: '90 days',  type: 'Visa-free',         notes: 'Extensions available. Rio and Florianópolis are popular bases.' },
  Peru:            { days: '183 days', type: 'Visa-free',         notes: 'One of the most generous visa-free allowances for SA passport holders.' },
  Chile:           { days: '90 days',  type: 'Visa-free',         notes: 'Reliable, straightforward entry.' },
  Uruguay:         { days: '90 days',  type: 'Visa-free',         notes: 'Low-key entry. Calm lifestyle, strong internet.' },
  Portugal:        { days: '90 days',  type: 'Schengen',          notes: 'Part of the Schengen zone. 90 days in any 180-day period across all Schengen countries.' },
  Spain:           { days: '90 days',  type: 'Schengen',          notes: 'Schengen zone. Plan your 90 days carefully across countries.' },
  Croatia:         { days: '90 days',  type: 'Visa-free',         notes: 'Croatia is EU but not Schengen. Separate 90-day allowance from Schengen.' },
  Greece:          { days: '90 days',  type: 'Schengen',          notes: 'Schengen zone. Combine with other Schengen countries within your 90-day window.' },
  Hungary:         { days: '90 days',  type: 'Schengen',          notes: 'Schengen zone.' },
  Germany:         { days: '90 days',  type: 'Schengen',          notes: 'Schengen zone.' },
  Netherlands:     { days: '90 days',  type: 'Schengen',          notes: 'Schengen zone.' },
  Italy:           { days: '90 days',  type: 'Schengen',          notes: 'Schengen zone.' },
  'Czech Republic':{ days: '90 days',  type: 'Schengen',          notes: 'Schengen zone.' },
  Georgia:         { days: '365 days', type: 'Visa-free',         notes: 'A full year visa-free. One of the best in the world for SA passport holders.' },
  Turkey:          { days: '90 days',  type: 'Visa-free',         notes: 'Extendable. Istanbul and Antalya are popular nomad bases.' },
  Cambodia:        { days: '30 days',  type: 'Visa on arrival',   notes: 'E-visa available. Inexpensive and easy to extend.' },
};

// ─── Helper: find city preset by name ────────────────────────────────────────
function findCityPreset(cityName: string): CityPreset | undefined {
  const normalised = cityName.toLowerCase().replace(/[^a-z]/g, '');
  for (const region of Object.values(CITY_PRESETS)) {
    const match = region.find((c) => {
      const cn = c.city.toLowerCase().replace(/[^a-z]/g, '');
      return cn === normalised || normalised.includes(cn) || cn.includes(normalised);
    });
    if (match) return match;
  }
  return undefined;
}

// ─── Helper: find template across all regions ────────────────────────────────
function findTemplate(id: string): (TripTemplate & { regionKey: RegionKey }) | null {
  for (const [regionKey, templates] of Object.entries(TRIP_TEMPLATES)) {
    const t = templates.find((t) => t.id === id);
    if (t) return { ...t, regionKey: regionKey as RegionKey };
  }
  return null;
}

// ─── Region labels ────────────────────────────────────────────────────────────
const REGION_LABELS: Record<RegionKey, string> = {
  'southeast-asia': 'Southeast Asia',
  'latin-america':  'Latin America',
  'europe':         'Europe',
};

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl bg-white border border-gray-100 shadow-sm px-5 py-4 min-w-[120px]">
      <div className="text-sb-orange-500">{icon}</div>
      <div className="text-lg font-black text-sb-navy-800">{value}</div>
      <div className="text-xs text-sb-navy-500 font-medium uppercase tracking-wide">{label}</div>
    </div>
  );
}

// ─── City card ────────────────────────────────────────────────────────────────
function CityCard({ city, index, total }: { city: string; index: number; total: number }) {
  const preset = findCityPreset(city);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="rounded-3xl bg-white shadow-md ring-1 ring-gray-100 overflow-hidden"
    >
      {/* Image */}
      <div className="relative h-48">
        <Image
          src={preset?.imageUrl || `https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop`}
          alt={city}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 text-white flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/70 mb-1">
              <span>{preset?.flag}</span>
              <span>{preset?.country || ''}</span>
            </div>
            <h3 className="text-xl font-black">{city}</h3>
          </div>
          <div className="text-right text-xs font-semibold text-white/80">
            <Clock className="w-3.5 h-3.5 inline-block mr-1" />
            ~30 days
          </div>
        </div>
        {/* Step indicator */}
        <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-sb-orange-500 text-white flex items-center justify-center text-sm font-black shadow-lg">
          {index + 1}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 space-y-4">
        {preset ? (
          <>
            {/* Key stats row */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-sb-beige-100 p-2">
                <div className="text-sm font-black text-sb-navy-800">{preset.weather.avgTemp}</div>
                <div className="text-xs text-sb-navy-500">Avg temp</div>
              </div>
              <div className="rounded-xl bg-sb-teal-50 p-2">
                <div className="text-sm font-black text-sb-navy-800">{preset.internetSpeed.replace(' avg', '')}</div>
                <div className="text-xs text-sb-navy-500">Internet</div>
              </div>
              <div className="rounded-xl bg-sb-mint-100 p-2">
                <div className="text-sm font-black text-sb-navy-800">{preset.nomadScore}/10</div>
                <div className="text-xs text-sb-navy-500">Nomad score</div>
              </div>
            </div>

            {/* Neighbourhoods */}
            {preset.highlights.places.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-sb-navy-500 mb-1.5">Stay in</p>
                <div className="flex flex-wrap gap-1.5">
                  {preset.highlights.places.map((p) => (
                    <span key={p} className="rounded-full bg-sb-beige-100 px-3 py-1 text-xs font-semibold text-sb-navy-700">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Activities */}
            {preset.highlights.activities.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-sb-navy-500 mb-1.5">Things to do</p>
                <ul className="space-y-1">
                  {preset.highlights.activities.map((a) => (
                    <li key={a} className="flex items-center gap-2 text-sm text-sb-navy-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-sb-orange-400 flex-shrink-0" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Monthly cost */}
            <div className="rounded-xl bg-gradient-to-r from-sb-navy-700 to-sb-navy-800 text-white p-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-white/70">Monthly budget</span>
              <span className="font-black text-sm">{preset.costs.monthlyTotal}</span>
            </div>

            {/* Best months */}
            <p className="text-xs text-sb-navy-500">
              <span className="font-bold text-sb-navy-700">Best months: </span>
              {preset.weather.bestMonths}
            </p>
          </>
        ) : (
          <p className="text-sm text-sb-navy-600">Details coming soon for this destination.</p>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function TemplateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const template = findTemplate(id);

  if (!template) {
    notFound();
  }

  // Collect unique countries from city presets
  const countries = Array.from(
    new Set(
      template.presetCities
        .map((c) => findCityPreset(c)?.country)
        .filter(Boolean) as string[]
    )
  );

  const whatsappMsg = encodeURIComponent(
    `Hi, I'm interested in the "${template.name}" route. Can you tell me more?`
  );
  const whatsappUrl = `https://wa.me/27872500972?text=${whatsappMsg}`;

  const duration = `${template.presetCities.length * 30} days · ${template.presetCities.length} cities`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sb-beige-100 via-white to-sb-teal-50">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative h-[70vh] min-h-[500px] max-h-[750px] overflow-hidden">
        <Image
          src={template.imageUrl}
          alt={template.name}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

        {/* Back button */}
        <div className="absolute top-8 left-6 md:left-10 z-10">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 px-4 py-2 text-sm font-semibold text-white hover:bg-white/30 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-14 max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="rounded-full bg-white/20 backdrop-blur-sm border border-white/30 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                {REGION_LABELS[template.regionKey]}
              </span>
              <span className="rounded-full bg-white/20 backdrop-blur-sm border border-white/30 px-3 py-1 text-xs font-bold text-white/80">
                {duration}
              </span>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-5xl">{template.icon}</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
                {template.name}
              </h1>
            </div>
            <p className="text-white/80 text-lg md:text-xl max-w-2xl mt-2">
              {template.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── CTAs ─────────────────────────────────────────────────────────── */}
      <section className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-sm text-sb-navy-600 font-medium">
            <span className="font-black text-sb-navy-800">{template.name}</span>
            {template.price && (
              <span className="ml-2 text-sb-orange-500 font-bold">from {template.price}</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/templates/${id}/itinerary`}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-full border-2 border-sb-navy-700 px-5 py-2 text-sm font-bold text-sb-navy-700 hover:bg-sb-navy-700 hover:text-white transition"
            >
              <Download className="w-4 h-4" />
              Download Itinerary
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-sb-orange-500 px-5 py-2 text-sm font-bold text-white hover:bg-sb-orange-600 shadow-md hover:shadow-lg transition hover:scale-105"
            >
              <MessageCircle className="w-4 h-4" />
              I want this trip
            </a>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-14 space-y-20">

        {/* ── Route visualization ───────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-bold uppercase tracking-wider text-sb-navy-500 mb-6">Your route</p>
          <div className="flex items-center flex-wrap gap-3">
            {template.presetCities.map((city, idx) => {
              const preset = findCityPreset(city);
              return (
                <React.Fragment key={city}>
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-white shadow-md relative">
                      <Image
                        src={preset?.imageUrl || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=200'}
                        alt={city}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-black text-sb-navy-800">{city}</div>
                      {preset && (
                        <div className="text-xs text-sb-navy-500">{preset.flag} 30 days</div>
                      )}
                    </div>
                  </div>
                  {idx < template.presetCities.length - 1 && (
                    <div className="flex items-center gap-1 text-sb-orange-400 pb-5">
                      <div className="w-6 h-0.5 bg-sb-orange-300" />
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
            <div className="ml-2 flex flex-col items-center gap-1.5 pb-5">
              <div className="text-3xl">🏠</div>
              <div className="text-xs font-semibold text-sb-navy-500">Home</div>
            </div>
          </div>
        </motion.section>

        {/* ── Stats row ────────────────────────────────────────────────── */}
        {(template.price || template.avgWeather || template.internetSpeed || template.safetyRating || template.bestFor) && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap gap-3"
          >
            {template.price && (
              <StatCard icon={<Star className="w-5 h-5" />} label="From" value={template.price} />
            )}
            {template.avgWeather && (
              <StatCard icon={<Thermometer className="w-5 h-5" />} label="Avg weather" value={template.avgWeather} />
            )}
            {template.internetSpeed && (
              <StatCard icon={<Wifi className="w-5 h-5" />} label="Internet" value={template.internetSpeed} />
            )}
            {template.safetyRating && (
              <StatCard icon={<Shield className="w-5 h-5" />} label="Safety" value={template.safetyRating} />
            )}
            {template.bestFor && (
              <StatCard icon={<MapPin className="w-5 h-5" />} label="Best for" value={template.bestFor} />
            )}
          </motion.section>
        )}

        {/* ── The Journey ──────────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl bg-sb-navy-800 text-white p-10 md:p-14"
        >
          <p className="text-xs font-bold uppercase tracking-wider text-sb-orange-400 mb-4">The Journey</p>
          <p className="text-xl md:text-2xl leading-relaxed text-white/90 font-medium">
            {template.story}
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {template.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-white/10 border border-white/20 px-3 py-1 text-xs font-semibold text-white/80">
                {tag}
              </span>
            ))}
          </div>
        </motion.section>

        {/* ── Per-city breakdown ───────────────────────────────────────── */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-xs font-bold uppercase tracking-wider text-sb-navy-500 mb-2">City by city</p>
            <h2 className="text-3xl md:text-4xl font-black text-sb-navy-800 mb-8">
              What each stop looks like
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {template.presetCities.map((city, idx) => (
              <CityCard
                key={city}
                city={city}
                index={idx}
                total={template.presetCities.length}
              />
            ))}
          </div>
        </section>

        {/* ── Visa snapshot ────────────────────────────────────────────── */}
        {countries.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-xs font-bold uppercase tracking-wider text-sb-navy-500 mb-2">SA Passport</p>
            <h2 className="text-3xl md:text-4xl font-black text-sb-navy-800 mb-6">
              Visa snapshot
            </h2>
            <div className="rounded-3xl bg-white shadow-md ring-1 ring-gray-100 overflow-hidden">
              <div className="grid grid-cols-3 bg-sb-navy-800 text-white text-xs font-bold uppercase tracking-wider p-4 gap-4">
                <div>Country</div>
                <div>Days allowed</div>
                <div>Notes</div>
              </div>
              {countries.map((country, idx) => {
                const visa = VISA_INFO[country];
                const preset = Object.values(CITY_PRESETS).flat().find(c => c.country === country);
                return (
                  <div
                    key={country}
                    className={`grid grid-cols-3 gap-4 p-4 text-sm items-start ${idx % 2 === 0 ? 'bg-white' : 'bg-sb-beige-50'}`}
                  >
                    <div className="flex items-center gap-2 font-semibold text-sb-navy-800">
                      {preset?.flag && <span>{preset.flag}</span>}
                      {country}
                    </div>
                    <div>
                      {visa ? (
                        <>
                          <div className="font-black text-sb-navy-800">{visa.days}</div>
                          <div className="text-xs text-sb-teal-600 font-semibold">{visa.type}</div>
                        </>
                      ) : (
                        <span className="text-sb-navy-500">Check current rules</span>
                      )}
                    </div>
                    <div className="text-sb-navy-600 text-xs leading-relaxed">
                      {visa?.notes || 'Verify on the official South African government travel portal.'}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-sb-navy-400">
              Visa information is a guide only. Always verify entry requirements before travel as rules change frequently.
            </p>
          </motion.section>
        )}

        {/* ── Budget breakdown ─────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-xs font-bold uppercase tracking-wider text-sb-navy-500 mb-2">Costs</p>
          <h2 className="text-3xl md:text-4xl font-black text-sb-navy-800 mb-6">
            Monthly budget by city
          </h2>
          <div className="rounded-3xl bg-white shadow-md ring-1 ring-gray-100 overflow-hidden">
            <div className="grid grid-cols-5 bg-sb-navy-800 text-white text-xs font-bold uppercase tracking-wider p-4 gap-3">
              <div>City</div>
              <div>Accommodation</div>
              <div>Coworking</div>
              <div>Food & life</div>
              <div>Total est.</div>
            </div>
            {template.presetCities.map((city, idx) => {
              const preset = findCityPreset(city);
              return (
                <div
                  key={city}
                  className={`grid grid-cols-5 gap-3 p-4 text-sm items-center ${idx % 2 === 0 ? 'bg-white' : 'bg-sb-beige-50'}`}
                >
                  <div className="font-semibold text-sb-navy-800 flex items-center gap-1.5">
                    {preset?.flag && <span>{preset.flag}</span>}
                    {city}
                  </div>
                  <div className="text-sb-navy-600 text-xs">{preset?.costs.accommodation || '—'}</div>
                  <div className="text-sb-navy-600 text-xs">{preset?.costs.coworking || '—'}</div>
                  <div className="text-sb-navy-600 text-xs">{preset?.costs.meals || '—'}</div>
                  <div className="font-black text-sb-navy-800 text-xs">{preset?.costs.monthlyTotal || '—'}</div>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-sb-navy-400">
            Costs are mid-range estimates in USD. Exchange rates vary — compare against your rand budget at the time of booking.
          </p>
        </motion.section>

        {/* ── Bottom CTA ───────────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl bg-gradient-to-br from-sb-orange-500 via-sb-orange-500 to-sb-orange-600 text-white text-center p-12 md:p-20"
        >
          <div className="text-5xl mb-4">{template.icon}</div>
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            This trip is ready. Let&apos;s make it yours.
          </h2>
          <p className="text-white/85 text-lg max-w-xl mx-auto mb-10">
            South Bound handles the research, booking, and logistics. You just show up.
            Message Tyler directly to get started.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-base font-black text-sb-orange-500 shadow-lg hover:shadow-xl hover:scale-105 transition"
            >
              <MessageCircle className="w-5 h-5" />
              Message Tyler on WhatsApp
            </a>
            <Link
              href={`/templates/${id}/itinerary`}
              target="_blank"
              className="inline-flex items-center gap-3 rounded-full border-2 border-white px-8 py-4 text-base font-bold text-white hover:bg-white/10 transition"
            >
              <Download className="w-5 h-5" />
              Download itinerary PDF
            </Link>
          </div>

          <div className="mt-10 pt-8 border-t border-white/25 flex flex-wrap items-center justify-center gap-8 text-sm text-white/75">
            <span>✓ Visa-aware routes</span>
            <span>✓ SA passport friendly</span>
            <span>✓ Work-ready accommodation</span>
            <span>✓ No surprises</span>
          </div>
        </motion.section>

        {/* ── Browse more ──────────────────────────────────────────────── */}
        <div className="text-center">
          <Link
            href="/templates"
            className="inline-flex items-center gap-2 text-sm font-semibold text-sb-navy-600 hover:text-sb-orange-500 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse all routes
          </Link>
        </div>

      </div>
    </div>
  );
}
