'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { TRIP_TEMPLATES, TripTemplate } from '@/lib/tripTemplates';
import { CITY_PRESETS, CityPreset, RegionKey } from '@/lib/cityPresets';

// ─── Types ────────────────────────────────────────────────────────────────────
type Stop = { city: string; duration: number };

// ─── Flag emoji → CDN image ───────────────────────────────────────────────────
function flagUrl(emoji: string): string {
  try {
    const code = [...emoji]
      .map(c => (c.codePointAt(0)! - 0x1F1E6 + 65))
      .map(n => String.fromCharCode(n))
      .join('')
      .toLowerCase();
    return `https://flagcdn.com/w80/${code}.png`;
  } catch {
    return '';
  }
}

// ─── Currency helpers ─────────────────────────────────────────────────────────
const USD_TO_ZAR = 18.5;
const SB_FEE = 1.15;

function usdToZar(usdStr: string): string {
  if (!usdStr || usdStr === '—') return usdStr;
  const match = usdStr.match(/\$[\d,]+/);
  if (!match) return usdStr;
  const num = parseInt(match[0].replace(/[$,]/g, ''), 10);
  const zar = Math.round((num * USD_TO_ZAR) / 500) * 500;
  return `from R${zar.toLocaleString()}`;
}

function parseBounds(str: string): [number, number] {
  const nums = [...str.matchAll(/\$[\d,]+/g)].map(m => parseInt(m[0].replace(/[$,]/g, ''), 10));
  if (!nums.length) return [0, 0];
  return [nums[0], nums[nums.length - 1]];
}

function sbPackageZar(accommodation: string, coworking: string): string {
  const [aL] = parseBounds(accommodation);
  const [cL] = parseBounds(coworking);
  const low = Math.round(((aL + cL) * SB_FEE * USD_TO_ZAR) / 500) * 500;
  return `from R${low.toLocaleString()}`;
}

function sbPackageRaw(accommodation: string, coworking: string): number {
  const [aL] = parseBounds(accommodation);
  const [cL] = parseBounds(coworking);
  return Math.round(((aL + cL) * SB_FEE * USD_TO_ZAR) / 500) * 500;
}

function monthlyTotalRaw(monthlyTotal: string): number {
  const [low] = parseBounds(monthlyTotal);
  return Math.round((low * USD_TO_ZAR) / 500) * 500;
}

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

const DURATION_OPTIONS = [14, 21, 30, 45, 60];

// ─── Edit icon ────────────────────────────────────────────────────────────────
function PencilIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );
}

// ─── Destination panel ────────────────────────────────────────────────────────
interface DestinationPanelProps {
  open: boolean;
  isEditing: boolean;
  regionKey: RegionKey;
  pendingCity: string;
  pendingDuration: number;
  onSelectCity: (city: string) => void;
  onChangeDuration: (d: number) => void;
  onRemove: () => void;
  onClose: () => void;
}

function DestinationPanel({
  open,
  isEditing,
  regionKey,
  pendingCity,
  pendingDuration,
  onSelectCity,
  onChangeDuration,
  onRemove,
  onClose,
}: DestinationPanelProps) {
  const cities = CITY_PRESETS[regionKey] ?? [];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 no-print ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-[420px] max-w-full bg-white shadow-2xl z-50 flex flex-col no-print transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <div>
            <h2 className="text-base font-black text-gray-900">
              {isEditing ? 'Edit stop' : 'Add stop'}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Pick a destination from {REGION_LABELS[regionKey]}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition"
          >
            <XIcon />
          </button>
        </div>

        {/* Duration picker */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
            Duration
          </div>
          <div className="flex gap-2 flex-wrap">
            {DURATION_OPTIONS.map(d => (
              <button
                key={d}
                onClick={() => onChangeDuration(d)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition border ${
                  pendingDuration === d
                    ? 'bg-[#1C2D3A] text-white border-[#1C2D3A]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }`}
              >
                {d} days
              </button>
            ))}
          </div>
        </div>

        {/* City grid */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
            Choose destination
          </div>
          <div className="grid grid-cols-2 gap-3">
            {cities.map(city => {
              const isSelected = city.city === pendingCity;
              return (
                <button
                  key={city.city}
                  onClick={() => onSelectCity(city.city)}
                  className={`relative rounded-xl overflow-hidden text-left group transition border-2 ${
                    isSelected
                      ? 'border-[#FFA069] ring-2 ring-[#FFA069]/40'
                      : 'border-transparent hover:border-gray-300'
                  }`}
                >
                  {/* Image */}
                  <div className="relative h-24 w-full bg-gray-200">
                    <img
                      src={city.imageUrl}
                      alt={city.city}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#FFA069] flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {/* Label */}
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <div className="text-white font-bold text-xs leading-tight drop-shadow">{city.city}</div>
                    <div className="text-white/70 text-xs">{city.country}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        {isEditing && (
          <div className="px-6 py-4 border-t border-gray-100">
            <button
              onClick={onRemove}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 py-2.5 text-sm font-semibold transition"
            >
              <TrashIcon />
              Remove this stop
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ItineraryClient({ id }: { id: string }) {
  const template = findTemplate(id);
  if (!template) return null;

  // ── State ──────────────────────────────────────────────────────────────────
  const [stops, setStops] = useState<Stop[]>(
    template.presetCities.map(c => ({ city: c, duration: 30 }))
  );
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [pendingCity, setPendingCity] = useState('');
  const [pendingDuration, setPendingDuration] = useState(30);

  // ── Panel handlers ─────────────────────────────────────────────────────────
  const openEdit = (idx: number) => {
    setEditingIndex(idx);
    setPendingCity(stops[idx].city);
    setPendingDuration(stops[idx].duration);
    setPanelOpen(true);
  };

  const openAdd = () => {
    setEditingIndex(null);
    setPendingCity('');
    setPendingDuration(30);
    setPanelOpen(true);
  };

  const closePanel = () => {
    setPanelOpen(false);
    setEditingIndex(null);
  };

  // Selecting a city applies it immediately and closes
  const handleSelectCity = (city: string) => {
    if (editingIndex !== null) {
      const updated = [...stops];
      updated[editingIndex] = { city, duration: pendingDuration };
      setStops(updated);
    } else {
      setStops(prev => [...prev, { city, duration: pendingDuration }]);
    }
    closePanel();
  };

  const handleChangeDuration = (d: number) => {
    setPendingDuration(d);
    // If editing, apply duration change immediately (city stays the same until a new city is picked)
    if (editingIndex !== null) {
      const updated = [...stops];
      updated[editingIndex] = { ...updated[editingIndex], duration: d };
      setStops(updated);
    }
  };

  const removeStop = () => {
    if (editingIndex !== null) {
      setStops(prev => prev.filter((_, i) => i !== editingIndex));
    }
    closePanel();
  };

  // ── Derived data (reactive to stops) ──────────────────────────────────────
  const countries = Array.from(
    new Set(
      stops
        .map(s => findCityPreset(s.city)?.country)
        .filter(Boolean) as string[]
    )
  );

  const totalDays = stops.reduce((sum, s) => sum + s.duration, 0);
  const duration = `${totalDays} days across ${stops.length} ${stops.length === 1 ? 'city' : 'cities'}`;

  // Budget totals
  const budgetTotals = stops.reduce(
    (acc, stop) => {
      const preset = findCityPreset(stop.city);
      if (!preset) return acc;
      const factor = stop.duration / 30;
      const pkg = sbPackageRaw(preset.costs.accommodation, preset.costs.coworking) * factor;
      const total = monthlyTotalRaw(preset.costs.monthlyTotal) * factor;
      return {
        sbPackage: acc.sbPackage + pkg,
        totalEstimate: acc.totalEstimate + total,
      };
    },
    { sbPackage: 0, totalEstimate: 0 }
  );

  const fmtZar = (n: number) => `R${Math.round(n / 500) * 500 > 0 ? (Math.round(n / 500) * 500).toLocaleString() : '—'}`;

  return (
    <>
      {/* Print styles */}
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

      {/* Destination panel (portal-like, renders at end of body via z-index) */}
      <DestinationPanel
        open={panelOpen}
        isEditing={editingIndex !== null}
        regionKey={template.regionKey}
        pendingCity={pendingCity}
        pendingDuration={pendingDuration}
        onSelectCity={handleSelectCity}
        onChangeDuration={handleChangeDuration}
        onRemove={removeStop}
        onClose={closePanel}
      />

      {/* Top bar */}
      <div className="no-print fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 shadow-sm">
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

      {/* ── Itinerary document ─────────────────────────────────────────────── */}
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
            <div className="absolute top-6 right-6 text-white text-xs font-bold uppercase tracking-widest opacity-60">
              southbnd.co.za
            </div>
          </div>

          {/* ── Summary block ───────────────────────────────────────────── */}
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
                    ['Trip budget (SB pkg)', `from ${fmtZar(budgetTotals.sbPackage)}`],
                    ['Total trip est.', `from ${fmtZar(budgetTotals.totalEstimate)}`],
                    ...(template.avgWeather ? [['Avg weather', template.avgWeather]] : []),
                    ...(template.internetSpeed ? [['Internet speed', template.internetSpeed]] : []),
                    ...(template.bestFor ? [['Best for', template.bestFor]] : []),
                  ].map(([label, value]) => (
                    <tr key={label}>
                      <td className="py-2 pr-4 text-gray-500 font-medium w-44">{label}</td>
                      <td className="py-2 font-semibold text-gray-800">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Route ───────────────────────────────────────────────────── */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Your route</h2>
            <div className="rounded-2xl bg-[#1C2D3A] p-5 overflow-x-auto print:overflow-visible">
              <div className="flex items-center gap-1 min-w-max print:flex-wrap print:gap-2">
                {/* SA origin */}
                <div className="flex flex-col items-center gap-1.5 w-16">
                  <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-2xl">🇿🇦</div>
                  <div className="text-center">
                    <div className="text-xs font-bold text-white leading-tight">S. Africa</div>
                    <div className="text-xs text-white/40">Depart</div>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 pb-5 mx-1">
                  <div className="w-3 h-px bg-[#FFA069]/60" />
                  <span className="text-[#FFA069] text-xs">✈</span>
                  <div className="w-3 h-px bg-[#FFA069]/60" />
                </div>

                {stops.map((stop, idx) => {
                  const preset = findCityPreset(stop.city);
                  return (
                    <React.Fragment key={`${stop.city}-${idx}`}>
                      <div className="flex flex-col items-center gap-1.5 w-20 relative group/routenode">
                        <div className="relative w-16 h-16 rounded-full bg-white/10 border-2 border-[#FFA069]/50 overflow-hidden shadow flex items-center justify-center">
                          {preset?.flag ? (
                            <img
                              src={flagUrl(preset.flag)}
                              alt={preset.country}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-2xl">🌍</span>
                          )}
                          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#FFA069] text-white font-black flex items-center justify-center" style={{ fontSize: '10px' }}>
                            {idx + 1}
                          </div>
                          {/* Edit overlay on route node */}
                          <button
                            onClick={() => openEdit(idx)}
                            className="no-print absolute inset-0 rounded-full bg-black/0 group-hover/routenode:bg-black/40 flex items-center justify-center opacity-0 group-hover/routenode:opacity-100 transition-all"
                            title="Edit stop"
                          >
                            <PencilIcon />
                          </button>
                        </div>
                        <div className="text-center">
                          <div className="text-white font-black leading-tight" style={{ fontSize: '10px' }}>{stop.city}</div>
                          <div className="text-white/50" style={{ fontSize: '10px' }}>{preset?.country}</div>
                          <div className="text-white/30" style={{ fontSize: '10px' }}>{stop.duration} days</div>
                        </div>
                      </div>
                      {idx < stops.length - 1 && (
                        <div className="flex items-center gap-0.5 pb-6 mx-0.5">
                          <div className="w-3 h-px bg-white/20" />
                          <span className="text-white/30 text-xs">›</span>
                          <div className="w-3 h-px bg-white/20" />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}

                {/* Add stop node */}
                <div className="flex items-center gap-0.5 pb-5 mx-1 no-print">
                  <div className="w-3 h-px bg-white/10" />
                </div>
                <button
                  onClick={openAdd}
                  className="no-print flex flex-col items-center gap-1.5 w-16 group/addnode"
                  title="Add stop"
                >
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-white/30 group-hover/addnode:border-[#FFA069]/70 flex items-center justify-center text-white/40 group-hover/addnode:text-[#FFA069] transition-colors">
                    <PlusIcon />
                  </div>
                  <div className="text-center">
                    <div className="text-white/30 group-hover/addnode:text-[#FFA069]/80 font-bold leading-tight transition-colors" style={{ fontSize: '10px' }}>Add stop</div>
                  </div>
                </button>
                <div className="flex items-center gap-0.5 pb-5 mx-1 no-print">
                  <div className="w-3 h-px bg-white/10" />
                </div>

                <div className="flex items-center gap-0.5 pb-5 mx-1">
                  <div className="w-3 h-px bg-[#FFA069]/60" />
                  <span className="text-[#FFA069] text-xs" style={{ transform: 'scaleX(-1)', display: 'inline-block' }}>✈</span>
                  <div className="w-3 h-px bg-[#FFA069]/60" />
                </div>
                {/* Home */}
                <div className="flex flex-col items-center gap-1.5 w-16">
                  <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-2xl">🏠</div>
                  <div className="text-center">
                    <div className="text-xs font-bold text-white leading-tight">Home</div>
                    <div className="text-xs text-white/40">Return</div>
                  </div>
                </div>
              </div>

              {/* Route summary */}
              <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap gap-4 text-xs">
                <span className="text-white/50">
                  <span className="text-white/80 font-semibold">{totalDays} days</span> total
                </span>
                <span className="text-white/50">
                  <span className="text-white/80 font-semibold">{stops.length} {stops.length === 1 ? 'city' : 'cities'}</span>
                </span>
                {countries.length > 0 && (
                  <span className="text-white/50">
                    {countries.join(' → ')}
                  </span>
                )}
                {budgetTotals.sbPackage > 0 && (
                  <span className="text-white/50">
                    SB package <span className="text-white/80 font-semibold">from {fmtZar(budgetTotals.sbPackage)}</span> total
                  </span>
                )}
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* ── City-by-city ─────────────────────────────────────────────── */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">City by city</h2>
            <div className="space-y-8">
              {stops.map((stop, idx) => {
                const preset = findCityPreset(stop.city);
                return (
                  <div key={`${stop.city}-${idx}`} className="border border-gray-200 rounded-2xl overflow-hidden print:break-inside-avoid">
                    {/* City header */}
                    <div className="bg-[#1C2D3A] text-white px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-[#FFA069] text-white flex items-center justify-center text-sm font-black">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="font-black text-lg">{stop.city}</div>
                          {preset && (
                            <div className="text-white/60 text-xs">{preset.flag} {preset.country} · {stop.duration} days</div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {/* Edit button */}
                        <button
                          onClick={() => openEdit(idx)}
                          className="no-print w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition"
                          title="Edit this stop"
                        >
                          <PencilIcon />
                        </button>
                        {/* Price */}
                        {preset && (
                          <div className="text-right text-xs text-white/60">
                            <div className="font-bold text-white">{sbPackageZar(preset.costs.accommodation, preset.costs.coworking)}</div>
                            <div>SB package/mo</div>
                          </div>
                        )}
                      </div>
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
                                <tr className="border-b border-gray-100">
                                  <td className="py-1.5 pr-3 font-semibold text-gray-700">SB Package</td>
                                  <td className="py-1.5 font-bold text-gray-900">{sbPackageZar(preset.costs.accommodation, preset.costs.coworking)}<span className="text-gray-400 font-normal text-xs">/mo</span></td>
                                </tr>
                                <tr className="border-b border-gray-100">
                                  <td className="py-1.5 pr-3 text-gray-500">Your lifestyle spend</td>
                                  <td className="py-1.5 text-gray-700">{usdToZar(preset.costs.meals)}<span className="text-gray-400 text-xs">/mo</span></td>
                                </tr>
                                <tr className="bg-gray-50">
                                  <td className="py-2 pr-3 font-bold text-gray-800">Monthly total est.</td>
                                  <td className="py-2 font-black text-gray-900">{usdToZar(preset.costs.monthlyTotal)}</td>
                                </tr>
                                {stop.duration !== 30 && (
                                  <tr className="bg-orange-50">
                                    <td className="py-2 pr-3 font-bold text-orange-700">{stop.duration}-day est.</td>
                                    <td className="py-2 font-black text-orange-800">
                                      {fmtZar(Math.round((monthlyTotalRaw(preset.costs.monthlyTotal) * stop.duration) / 30 / 500) * 500)}
                                    </td>
                                  </tr>
                                )}
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

              {/* ── Add stop card ─────────────────────────────────────────── */}
              <button
                onClick={openAdd}
                className="no-print w-full border-2 border-dashed border-gray-200 hover:border-[#FFA069]/60 hover:bg-orange-50/30 rounded-2xl py-8 flex flex-col items-center gap-2 text-gray-400 hover:text-[#FFA069] transition-all group"
              >
                <div className="w-10 h-10 rounded-full border-2 border-dashed border-gray-300 group-hover:border-[#FFA069]/60 flex items-center justify-center transition-colors">
                  <PlusIcon />
                </div>
                <span className="text-sm font-semibold">Add stop</span>
                <span className="text-xs text-gray-400">Choose another city from {REGION_LABELS[template.regionKey]}</span>
              </button>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* ── Monthly budget summary ───────────────────────────────────── */}
          {stops.length > 0 && (
            <div className="print:break-inside-avoid">
              <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                Budget summary
              </h2>
              <div className="rounded-2xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">City</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">Duration</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">SB package est.</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600">Total est.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stops.map((stop, idx) => {
                      const preset = findCityPreset(stop.city);
                      const factor = stop.duration / 30;
                      const pkg = preset ? fmtZar(Math.round(sbPackageRaw(preset.costs.accommodation, preset.costs.coworking) * factor / 500) * 500) : '—';
                      const total = preset ? fmtZar(Math.round(monthlyTotalRaw(preset.costs.monthlyTotal) * factor / 500) * 500) : '—';
                      return (
                        <tr key={`budget-${stop.city}-${idx}`} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                          <td className="py-3 px-4 font-semibold text-gray-800">
                            {preset?.flag && <span className="mr-1.5">{preset.flag}</span>}
                            {stop.city}
                          </td>
                          <td className="py-3 px-4 text-gray-600">{stop.duration} days</td>
                          <td className="py-3 px-4 text-gray-700">{pkg}</td>
                          <td className="py-3 px-4 font-bold text-gray-900">{total}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-[#1C2D3A] text-white">
                      <td className="py-3 px-4 font-bold">Total ({totalDays} days)</td>
                      <td className="py-3 px-4 text-white/60">{stops.length} cities</td>
                      <td className="py-3 px-4 font-bold">from {fmtZar(Math.round(budgetTotals.sbPackage / 500) * 500)}</td>
                      <td className="py-3 px-4 font-black text-[#FFA069]">from {fmtZar(Math.round(budgetTotals.totalEstimate / 500) * 500)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              <p className="mt-2 text-xs text-gray-400">
                Estimates based on ~R18.50/USD. SB package includes accommodation + coworking (15% service fee baked in). Total includes lifestyle spend estimate.
              </p>
            </div>
          )}

          <hr className="border-gray-200" />

          {/* ── Visa snapshot ────────────────────────────────────────────── */}
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

          {/* ── Footer / CTA ─────────────────────────────────────────────── */}
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
            Costs shown in ZAR at ~R18.50/USD. Always verify visa, safety, and current costs before booking.
          </p>

        </div>
      </div>
    </>
  );
}
