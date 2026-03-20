'use client';

import React, { use } from 'react';
import Image from 'next/image';
import { TRIP_TEMPLATES, TripTemplate } from '@/lib/tripTemplates';
import { CITY_PRESETS, CityPreset, RegionKey } from '@/lib/cityPresets';
import { notFound } from 'next/navigation';

// ─── Visa info for SA passport holders ───────────────────────────────────────
const VISA_INFO: Record<string, { days: string; type: string; notes: string }> = {
  Thailand:        { days: '30 days',  type: 'Visa-free',         notes: 'Extendable to 60 days at immigration.' },
  Indonesia:       { days: '30 days',  type: 'Visa on arrival',   notes: '~$35 USD. Extendable once.' },
  Vietnam:         { days: '45 days',  type: 'Visa-free',         notes: '90-day e-visa available (~$25 USD).' },
  Malaysia:        { days: '90 days',  type: 'Visa-free',         notes: 'Very generous allowance.' },
  Singapore:       { days: '30 days',  type: 'Visa-free',         notes: 'Straightforward entry.' },
  Mexico:          { days: '180 days', type: 'Visa-free',         notes: 'Ask for 180 days at the border.' },
  Colombia:        { days: '90 days',  type: 'Visa-free',         notes: 'Extendable to 180 days total.' },
  Argentina:       { days: '90 days',  type: 'Visa-free',         notes: 'Extendable once.' },
  Brazil:          { days: '90 days',  type: 'Visa-free',         notes: 'Extensions available.' },
  Peru:            { days: '183 days', type: 'Visa-free',         notes: 'One of the most generous.' },
  Chile:           { days: '90 days',  type: 'Visa-free',         notes: 'Straightforward entry.' },
  Uruguay:         { days: '90 days',  type: 'Visa-free',         notes: 'Easy entry.' },
  Portugal:        { days: '90 days',  type: 'Schengen',          notes: '90 days in any 180-day period across Schengen.' },
  Spain:           { days: '90 days',  type: 'Schengen',          notes: 'Plan your Schengen days carefully.' },
  Croatia:         { days: '90 days',  type: 'Visa-free',         notes: 'EU but not Schengen. Separate allowance.' },
  Greece:          { days: '90 days',  type: 'Schengen',          notes: 'Schengen zone.' },
  Hungary:         { days: '90 days',  type: 'Schengen',          notes: 'Schengen zone.' },
  Germany:         { days: '90 days',  type: 'Schengen',          notes: 'Schengen zone.' },
  Netherlands:     { days: '90 days',  type: 'Schengen',          notes: 'Schengen zone.' },
  Italy:           { days: '90 days',  type: 'Schengen',          notes: 'Schengen zone.' },
  'Czech Republic':{ days: '90 days',  type: 'Schengen',          notes: 'Schengen zone.' },
  Georgia:         { days: '365 days', type: 'Visa-free',         notes: 'Full year visa-free — exceptional for SA passport holders.' },
  Turkey:          { days: '90 days',  type: 'Visa-free',         notes: 'Extendable.' },
  Cambodia:        { days: '30 days',  type: 'Visa on arrival',   notes: 'E-visa available, easy to extend.' },
};

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

function findTemplate(id: string): (TripTemplate & { regionKey: RegionKey }) | null {
  for (const [regionKey, templates] of Object.entries(TRIP_TEMPLATES)) {
    const t = templates.find((t) => t.id === id);
    if (t) return { ...t, regionKey: regionKey as RegionKey };
  }
  return null;
}

const REGION_LABELS: Record<RegionKey, string> = {
  'southeast-asia': 'Southeast Asia',
  'latin-america':  'Latin America',
  'europe':         'Europe',
};

export default function ItineraryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const template = findTemplate(id);

  if (!template) {
    notFound();
  }

  const countries = Array.from(
    new Set(
      template.presetCities
        .map((c) => findCityPreset(c)?.country)
        .filter(Boolean) as string[]
    )
  );

  const duration = `${template.presetCities.length * 30} days across ${template.presetCities.length} cities`;

  return (
    <>
      {/* Print styles injected via style tag */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .page-break { page-break-before: always; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
        @page {
          margin: 1.5cm;
          size: A4;
        }
      `}</style>

      {/* Print / Download button bar */}
      <div className="no-print fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="text-sm font-semibold text-gray-700">
            {template.name} — Itinerary
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`/templates/${id}`}
              className="text-sm font-semibold text-gray-600 hover:text-gray-900 transition"
            >
              ← Back to trip
            </a>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-full bg-[#1C2D3A] px-5 py-2 text-sm font-bold text-white hover:bg-[#162028] transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Save as PDF
            </button>
          </div>
        </div>
      </div>

      {/* ── Itinerary document ───────────────────────────────────────────── */}
      <div className="bg-white min-h-screen pt-16 print:pt-0">
        <div className="max-w-4xl mx-auto px-8 py-10 space-y-10">

          {/* ── Cover ──────────────────────────────────────────────────── */}
          <div
            className="relative rounded-2xl overflow-hidden print:rounded-none"
            style={{ height: '240px' }}
          >
            <Image
              src={template.imageUrl}
              alt={template.name}
              fill
              className="object-cover"
              sizes="800px"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/30" />
            <div className="absolute inset-0 flex flex-col justify-end p-8">
              <div className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">
                South Bound · Trip Itinerary
              </div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-4xl">{template.icon}</span>
                <h1 className="text-4xl font-black text-white">{template.name}</h1>
              </div>
              <p className="text-white/80 text-base">{duration} · {REGION_LABELS[template.regionKey]}</p>
            </div>
            {/* SB branding corner */}
            <div className="absolute top-6 right-6 text-white text-xs font-bold uppercase tracking-widest opacity-60">
              southbnd.co.za
            </div>
          </div>

          {/* ── Summary block ──────────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overview */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Overview</h2>
              <p className="text-gray-700 leading-relaxed text-sm">{template.story}</p>
            </div>

            {/* At a glance */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">At a glance</h2>
              <table className="w-full text-sm">
                <tbody className="divide-y divide-gray-100">
                  {[
                    ['Duration', duration],
                    ['Region', REGION_LABELS[template.regionKey]],
                    ...(template.price ? [['Est. monthly cost', template.price]] : []),
                    ...(template.avgWeather ? [['Avg weather', template.avgWeather]] : []),
                    ...(template.internetSpeed ? [['Internet speed', template.internetSpeed]] : []),
                    ...(template.bestFor ? [['Best for', template.bestFor]] : []),
                  ].map(([label, value]) => (
                    <tr key={label}>
                      <td className="py-2 pr-4 text-gray-500 font-medium w-40">{label}</td>
                      <td className="py-2 font-semibold text-gray-800">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Route ──────────────────────────────────────────────────── */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Your route</h2>
            <div className="flex items-center gap-3 flex-wrap">
              {template.presetCities.map((city, idx) => {
                const preset = findCityPreset(city);
                return (
                  <React.Fragment key={city}>
                    <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2 border border-gray-200">
                      {preset?.flag && <span>{preset.flag}</span>}
                      <div>
                        <div className="font-bold text-gray-800 text-sm">{city}</div>
                        <div className="text-xs text-gray-500">~30 days</div>
                      </div>
                    </div>
                    {idx < template.presetCities.length - 1 && (
                      <span className="text-gray-300 font-bold text-lg">→</span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* ── City-by-city ───────────────────────────────────────────── */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">City by city</h2>
            <div className="space-y-8">
              {template.presetCities.map((city, idx) => {
                const preset = findCityPreset(city);
                return (
                  <div key={city} className="border border-gray-200 rounded-2xl overflow-hidden print:break-inside-avoid">
                    {/* City header */}
                    <div className="bg-[#1C2D3A] text-white px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-[#FFA069] text-white flex items-center justify-center text-sm font-black">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="font-black text-lg">{city}</div>
                          {preset && (
                            <div className="text-white/60 text-xs">{preset.flag} {preset.country} · ~30 days</div>
                          )}
                        </div>
                      </div>
                      {preset && (
                        <div className="text-right text-xs text-white/60">
                          <div className="font-bold text-white">{preset.costs.monthlyTotal}</div>
                          <div>monthly est.</div>
                        </div>
                      )}
                    </div>

                    {/* City body */}
                    {preset ? (
                      <div className="p-6 grid grid-cols-2 gap-6 text-sm">
                        {/* Left */}
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Best neighbourhoods</h4>
                            <div className="flex flex-wrap gap-1.5">
                              {preset.highlights.places.map((p) => (
                                <span key={p} className="bg-orange-50 text-orange-700 border border-orange-200 rounded-full px-3 py-0.5 text-xs font-semibold">{p}</span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Things to do</h4>
                            <ul className="space-y-1 text-gray-600">
                              {preset.highlights.activities.map((a) => (
                                <li key={a} className="flex items-start gap-2">
                                  <span className="text-orange-400 mt-0.5">•</span>
                                  {a}
                                </li>
                              ))}
                            </ul>
                          </div>
                          {preset.highlights.notesHint && (
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-700">
                              <span className="font-bold">Note: </span>{preset.highlights.notesHint}
                            </div>
                          )}
                        </div>

                        {/* Right */}
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Work setup</h4>
                            <table className="w-full text-xs">
                              <tbody>
                                {[
                                  ['Internet', preset.internetSpeed],
                                  ['Nomad score', `${preset.nomadScore}/10`],
                                  ['Best months', preset.weather.bestMonths],
                                  ['Avg temp', preset.weather.avgTemp],
                                ].map(([label, value]) => (
                                  <tr key={label} className="border-b border-gray-100">
                                    <td className="py-1.5 pr-3 text-gray-500 font-medium">{label}</td>
                                    <td className="py-1.5 font-semibold text-gray-800">{value}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          <div>
                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Monthly costs</h4>
                            <table className="w-full text-xs">
                              <tbody>
                                {[
                                  ['Accommodation', preset.costs.accommodation],
                                  ['Coworking', preset.costs.coworking],
                                  ['Food & life', preset.costs.meals],
                                ].map(([label, value]) => (
                                  <tr key={label} className="border-b border-gray-100">
                                    <td className="py-1.5 pr-3 text-gray-500 font-medium">{label}</td>
                                    <td className="py-1.5 text-gray-800">{value}</td>
                                  </tr>
                                ))}
                                <tr className="bg-gray-50">
                                  <td className="py-2 pr-3 font-bold text-gray-800">Total est.</td>
                                  <td className="py-2 font-black text-gray-900">{preset.costs.monthlyTotal}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 text-sm text-gray-500">
                        Detailed information for this city coming soon.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* ── Visa snapshot ──────────────────────────────────────────── */}
          {countries.length > 0 && (
            <div className="print:break-inside-avoid">
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                SA Passport — Visa snapshot
              </h2>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#1C2D3A] text-white text-xs font-bold uppercase tracking-wider">
                    <th className="text-left py-3 px-4 rounded-tl-xl">Country</th>
                    <th className="text-left py-3 px-4">Days allowed</th>
                    <th className="text-left py-3 px-4">Type</th>
                    <th className="text-left py-3 px-4 rounded-tr-xl">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {countries.map((country, idx) => {
                    const visa = VISA_INFO[country];
                    const preset = Object.values(CITY_PRESETS).flat().find(c => c.country === country);
                    return (
                      <tr key={country} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="py-3 px-4 font-semibold text-gray-800">
                          {preset?.flag && <span className="mr-1.5">{preset.flag}</span>}
                          {country}
                        </td>
                        <td className="py-3 px-4 font-black text-gray-900">{visa?.days || '—'}</td>
                        <td className="py-3 px-4 text-gray-600">{visa?.type || 'Verify'}</td>
                        <td className="py-3 px-4 text-gray-500 text-xs">{visa?.notes || 'Check official sources.'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p className="mt-2 text-xs text-gray-400">
                Always verify current visa requirements before travel. Rules change — check the SA government travel portal or the embassy website of each destination.
              </p>
            </div>
          )}

          <hr className="border-gray-200" />

          {/* ── Footer / CTA ───────────────────────────────────────────── */}
          <div className="bg-[#1C2D3A] rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 print:break-inside-avoid">
            <div>
              <div className="font-black text-xl mb-1">Ready to book this trip?</div>
              <div className="text-white/70 text-sm">
                South Bound handles the planning, booking, and logistics.
              </div>
              <div className="text-white/70 text-sm mt-1">
                Message Tyler to get started.
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-white/60 mb-1">WhatsApp</div>
              <div className="font-black text-xl text-[#FFA069]">+27 87 250 0972</div>
              <div className="text-white/60 text-xs mt-1">southbnd.co.za</div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {template.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                {tag}
              </span>
            ))}
          </div>

          {/* Fine print */}
          <p className="text-xs text-gray-400 text-center pb-6">
            Prepared by South Bound · southbnd.co.za · hello@southbnd.co.za
            {' · '}
            Information correct at time of preparation. Always verify visa, safety, and travel requirements before booking.
          </p>

        </div>
      </div>
    </>
  );
}
