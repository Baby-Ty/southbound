'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, X, ChevronRight } from 'lucide-react';
import type { BudgetTier, CityRef, DefaultTripMonthsMap, DefaultTripRegion, MonthKey } from '@/lib/defaultTripsSeed';
import {
  loadDefaultTripsState,
  makeDefaultTripsSeedState,
  saveDefaultTripsState,
  type DefaultTripTemplate,
  type DefaultTripsByRegion,
} from '@/lib/defaultTripsStorage';

/**
 * Default Trips (Admin Hub)
 *
 * This page is intentionally "mock + local state" only.
 * Later we can swap the state persistence to Cosmos/API without changing the UI shape.
 */

type RegionKeyForCities = 'latin-america' | 'europe' | 'southeast-asia';
type CityOption = { city: string; country?: string; region?: string };

const REGION_OPTIONS: { key: DefaultTripRegion; label: string }[] = [
  { key: 'latin-america', label: 'Latin America' },
  { key: 'europe', label: 'Europe' },
  { key: 'asia', label: 'Asia' },
  { key: 'africa', label: 'Africa' },
];

const BUDGET_OPTIONS: { key: BudgetTier; label: string }[] = [
  { key: 'nomad', label: 'Nomad' },
  { key: 'remote-worker', label: 'Remote Worker' },
  { key: 'professional', label: 'Professional' },
];

const MONTHS: { key: MonthKey; label: string }[] = [
  { key: 'month1', label: 'Month 1' },
  { key: 'month2', label: 'Month 2' },
  { key: 'month3', label: 'Month 3' },
];

function classNames(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(' ');
}

function BudgetPill({ tier }: { tier: BudgetTier }) {
  const label = BUDGET_OPTIONS.find((b) => b.key === tier)?.label ?? tier;
  const tone =
    tier === 'nomad'
      ? 'bg-stone-50 text-stone-700 border-stone-200'
      : tier === 'remote-worker'
        ? 'bg-orange-50 text-orange-800 border-orange-200'
        : 'bg-emerald-50 text-emerald-800 border-emerald-200';
  return <span className={classNames('inline-flex items-center px-2 py-1 rounded-full border text-xs font-bold', tone)}>{label}</span>;
}

function MonthRow({
  label,
  value,
  onChange,
  cityOptions,
  datalistId,
  onPickCity,
}: {
  label: string;
  value: CityRef;
  onChange: (next: CityRef) => void;
  cityOptions: CityOption[];
  datalistId: string;
  onPickCity: () => void;
}) {
  const hasCityList = cityOptions.length > 0;
  const isKnownCity =
    !hasCityList ||
    cityOptions.some((c) => c.city.toLowerCase() === (value.city || '').toLowerCase().trim());

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
      <div className="md:col-span-3">
        <div className="text-sm font-semibold text-stone-700">{label}</div>
      </div>
      <div className="md:col-span-5">
        {hasCityList ? (
          <button
            type="button"
            onClick={onPickCity}
            className={classNames(
              'w-full px-3 py-2 rounded-xl border bg-white text-left focus:outline-none focus:ring-2 focus:ring-[#E86B32]/25 flex items-center justify-between gap-2',
              isKnownCity ? 'border-stone-200' : 'border-red-300 ring-1 ring-red-200'
            )}
          >
            <span className={classNames('truncate', value.city ? 'text-stone-900' : 'text-stone-400')}>
              {value.city || 'Select a city…'}
            </span>
            <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
          </button>
        ) : (
          <input
            value={value.city}
            list={datalistId}
            onChange={(e) => {
              const nextCity = e.target.value;
              const match = cityOptions.find((c) => c.city.toLowerCase() === nextCity.toLowerCase());
              onChange({ ...value, city: nextCity, country: match?.country ?? value.country });
            }}
            className={classNames(
              'w-full px-3 py-2 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-[#E86B32]/25',
              isKnownCity ? 'border-stone-200' : 'border-red-300 ring-1 ring-red-200'
            )}
            placeholder="City (type any city)"
          />
        )}
        {!isKnownCity ? (
          <div className="mt-1 text-[11px] font-semibold text-red-600">
            This city isn’t in the region’s city list — the Trip Builder may not be able to seed it.
          </div>
        ) : null}
      </div>
      <div className="md:col-span-4">
        <input
          value={value.country ?? ''}
          onChange={(e) => onChange({ ...value, country: e.target.value || undefined })}
          className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#E86B32]/25"
          placeholder="Country (optional)"
        />
      </div>
    </div>
  );
}

function TripCard({
  trip,
  onUpdate,
  cityOptions,
  cityDatalistId,
  onPickCity,
}: {
  trip: DefaultTripTemplate;
  onUpdate: (next: DefaultTripTemplate) => void;
  cityOptions: CityOption[];
  cityDatalistId: string;
  onPickCity: (month: MonthKey) => void;
}) {
  return (
    <div className={classNames('bg-white border border-stone-200 rounded-2xl p-4 md:p-5', !trip.enabled && 'opacity-60')}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <BudgetPill tier={trip.budgetTier} />
            {!trip.enabled ? (
              <span className="inline-flex items-center px-2 py-1 rounded-full border text-xs font-bold bg-stone-50 text-stone-600 border-stone-200">
                Disabled
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-1 rounded-full border text-xs font-bold bg-green-50 text-green-700 border-green-200">
                Enabled
              </span>
            )}
          </div>
          <div className="mt-2">
            <label className="text-xs font-bold text-stone-600">Trip name</label>
            <input
              value={trip.name}
              onChange={(e) => onUpdate({ ...trip, name: e.target.value })}
              className="mt-1 w-full px-3 py-2 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#E86B32]/25"
              placeholder="e.g. Remote Worker Starter (LATAM)"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => onUpdate({ ...trip, enabled: !trip.enabled })}
          className={classNames(
            'shrink-0 px-3 py-2 rounded-xl border text-sm font-bold transition-colors',
            trip.enabled
              ? 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
              : 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
          )}
        >
          {trip.enabled ? 'Disable' : 'Enable'}
        </button>
      </div>

      <div className="mt-3">
        <label className="text-xs font-bold text-stone-600">Short description (optional)</label>
        <input
          value={trip.description ?? ''}
          onChange={(e) => onUpdate({ ...trip, description: e.target.value || undefined })}
          className="mt-1 w-full px-3 py-2 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#E86B32]/25"
          placeholder="Shown internally in the admin hub"
        />
      </div>

      <div className="mt-4 border-t border-stone-100 pt-4 space-y-3">
        {MONTHS.map((m) => (
          <MonthRow
            key={m.key}
            label={m.label}
            value={trip.months[m.key]}
            onChange={(next) => onUpdate({ ...trip, months: { ...trip.months, [m.key]: next } })}
            cityOptions={cityOptions}
            datalistId={cityDatalistId}
            onPickCity={() => onPickCity(m.key)}
          />
        ))}
      </div>
    </div>
  );
}

function RightDrawer({
  title,
  open,
  onClose,
  children,
}: {
  title: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl overflow-hidden flex flex-col animate-slide-left">
        <div className="flex-shrink-0 bg-white border-b border-stone-200 p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-stone-900 truncate">{title}</h3>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-stone-100 transition"
              aria-label="Close"
            >
              <X className="h-5 w-5 text-stone-600" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-5 bg-stone-50">{children}</div>
      </div>
    </div>
  );
}

export default function DefaultTripsPage() {
  const [selectedRegion, setSelectedRegion] = useState<DefaultTripRegion>('latin-america');
  const [tripsByRegion, setTripsByRegion] = useState<DefaultTripsByRegion>(() => loadDefaultTripsState());
  const [showMapping, setShowMapping] = useState(false);
  const [cityOptions, setCityOptions] = useState<CityOption[]>([]);
  const [picker, setPicker] = useState<{ open: boolean; tier: BudgetTier | null; month: MonthKey | null }>({
    open: false,
    tier: null,
    month: null,
  });
  const [pickerSearch, setPickerSearch] = useState('');
  const [customCity, setCustomCity] = useState('');
  const [customCountry, setCustomCountry] = useState('');

  // Persist admin edits locally so the user-facing flow can read them.
  useEffect(() => {
    saveDefaultTripsState(tripsByRegion);
  }, [tripsByRegion]);

  const cityDatalistId = useMemo(() => `sb-default-trip-cities-${selectedRegion}`, [selectedRegion]);

  useEffect(() => {
    let cancelled = false;

    const regionKey: RegionKeyForCities | null =
      selectedRegion === 'asia' ? 'southeast-asia' : selectedRegion === 'africa' ? null : selectedRegion;

    async function loadCities() {
      // Clear stale list immediately so we never show the wrong region while loading.
      if (!cancelled) setCityOptions([]);
      if (!regionKey) {
        return;
      }

      try {
        const res = await fetch(`/api/cities?region=${encodeURIComponent(regionKey)}`, {
          headers: { 'Content-Type': 'application/json' },
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        const cities = Array.isArray(data?.cities) ? (data.cities as any[]) : [];

        // Safety net: even if the API returns mixed regions, filter here.
        const regionFiltered = cities.filter((c) => {
          const r = c?.region ? String(c.region).trim() : '';
          // If region is missing (older data), don't hard-fail; include it.
          return !r || r === regionKey;
        });

        const src = regionFiltered.length ? regionFiltered : cities;
        const opts: CityOption[] = src
          .map((c) => ({
            city: String(c.city || '').trim(),
            country: c.country ? String(c.country).trim() : undefined,
            region: c.region ? String(c.region).trim() : undefined,
          }))
          .filter((c) => !!c.city);

        opts.sort((a, b) => a.city.localeCompare(b.city));
        if (!cancelled) setCityOptions(opts);
      } catch {
        if (!cancelled) setCityOptions([]);
      }
    }

    loadCities();
    return () => {
      cancelled = true;
    };
  }, [selectedRegion]);

  const regionLabel = useMemo(
    () => REGION_OPTIONS.find((r) => r.key === selectedRegion)?.label ?? selectedRegion,
    [selectedRegion]
  );

  const selectedTrips = tripsByRegion[selectedRegion];

  function updateTrip(tier: BudgetTier, next: DefaultTripTemplate) {
    setTripsByRegion((prev) => ({
      ...prev,
      [selectedRegion]: {
        ...prev[selectedRegion],
        [tier]: next,
      },
    }));
  }

  function openCityPicker(tier: BudgetTier, month: MonthKey) {
    const current = tripsByRegion[selectedRegion]?.[tier]?.months?.[month];
    setPicker({ open: true, tier, month });
    setPickerSearch('');
    setCustomCity(current?.city || '');
    setCustomCountry(current?.country || '');
  }

  function applyCitySelection(next: CityRef) {
    if (!picker.tier || !picker.month) return;
    const tier = picker.tier;
    const month = picker.month;
    const currentTrip = tripsByRegion[selectedRegion]?.[tier];
    if (!currentTrip) return;
    updateTrip(tier, { ...currentTrip, months: { ...currentTrip.months, [month]: next } });
    setPicker({ open: false, tier: null, month: null });
  }

  function resetRegion() {
    const seed = makeDefaultTripsSeedState();
    setTripsByRegion((prev) => ({ ...prev, [selectedRegion]: seed[selectedRegion] }));
  }

  function resetAll() {
    setTripsByRegion(makeDefaultTripsSeedState());
  }

  const currentMapping: DefaultTripMonthsMap = useMemo(() => {
    const out = {} as DefaultTripMonthsMap;
    (Object.keys(tripsByRegion) as DefaultTripRegion[]).forEach((region) => {
      out[region] = {
        nomad: tripsByRegion[region].nomad.months,
        'remote-worker': tripsByRegion[region]['remote-worker'].months,
        professional: tripsByRegion[region].professional.months,
      };
    });
    return out;
  }, [tripsByRegion]);

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <datalist id={cityDatalistId}>
        {cityOptions.map((c) => (
          <option key={`${c.city}-${c.country || ''}`} value={c.city}>
            {c.country ? `${c.city} — ${c.country}` : c.city}
          </option>
        ))}
      </datalist>

      <RightDrawer
        title={
          picker.open && picker.month
            ? `Select a city (${picker.month.replace('month', 'Month ')})`
            : 'Select a city'
        }
        open={picker.open}
        onClose={() => setPicker({ open: false, tier: null, month: null })}
      >
        <div className="sticky top-0 bg-stone-50 pb-4 z-10 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search cities..."
              value={pickerSearch}
              onChange={(e) => setPickerSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-[#E86B32]/25 focus:border-transparent bg-white shadow-sm"
            />
          </div>

          <div className="bg-white border border-stone-200 rounded-xl p-3">
            <div className="text-xs font-bold text-stone-600 uppercase tracking-wider mb-2">Custom city (optional)</div>
            <div className="grid grid-cols-1 gap-2">
              <input
                value={customCity}
                onChange={(e) => setCustomCity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#E86B32]/25"
                placeholder="City"
              />
              <input
                value={customCountry}
                onChange={(e) => setCustomCountry(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#E86B32]/25"
                placeholder="Country (optional)"
              />
              <button
                type="button"
                onClick={() => {
                  const city = customCity.trim();
                  if (!city) return;
                  const match = cityOptions.find((c) => c.city.toLowerCase() === city.toLowerCase());
                  applyCitySelection({ city, country: (match?.country || customCountry || '').trim() || undefined });
                }}
                className="w-full px-3 py-2 rounded-xl bg-[#E86B32] text-white font-bold hover:bg-[#d85f2b] transition-colors"
              >
                Apply custom city
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {cityOptions
            .filter((c) => {
              const q = pickerSearch.trim().toLowerCase();
              if (!q) return true;
              return (
                c.city.toLowerCase().includes(q) ||
                (c.country ? c.country.toLowerCase().includes(q) : false)
              );
            })
            .map((c) => (
              <button
                key={`${c.city}-${c.country || ''}`}
                type="button"
                onClick={() => applyCitySelection({ city: c.city, country: c.country })}
                className="w-full text-left bg-white border border-stone-200 rounded-xl p-4 hover:border-[#E86B32]/40 hover:shadow-sm transition-all"
              >
                <div className="font-bold text-stone-900">{c.city}</div>
                {c.country ? <div className="text-xs text-stone-500 mt-1">{c.country}</div> : null}
              </button>
            ))}
          {cityOptions.length === 0 ? (
            <div className="text-sm text-stone-600 bg-white border border-stone-200 rounded-xl p-4">
              No city list available for this region in this environment.
            </div>
          ) : null}
        </div>
      </RightDrawer>

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <div className="text-sm text-stone-500">Admin Hub</div>
          <h1 className="text-3xl font-bold text-stone-900">Default Trips</h1>
          <p className="text-stone-600 mt-1">
            Manage the starter trips generated after the itinerary wizard (90-day template: Month 1 → Month 3).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetRegion}
            className="px-3 py-2 rounded-xl border border-stone-200 bg-white text-sm font-bold text-stone-700 hover:bg-stone-50"
          >
            Reset {regionLabel}
          </button>
          <button
            type="button"
            onClick={resetAll}
            className="px-3 py-2 rounded-xl border border-stone-200 bg-white text-sm font-bold text-stone-700 hover:bg-stone-50"
          >
            Reset all
          </button>
          <button
            type="button"
            onClick={() => setShowMapping((v) => !v)}
            className={classNames(
              'px-3 py-2 rounded-xl border text-sm font-bold',
              showMapping
                ? 'border-orange-200 bg-orange-50 text-orange-800'
                : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
            )}
          >
            {showMapping ? 'Hide mapping' : 'Show mapping'}
          </button>
        </div>
      </div>

      <div className="bg-white border border-stone-200 rounded-2xl p-3 md:p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="text-sm font-semibold text-stone-700">Region</div>
          <div className="flex flex-wrap gap-2">
            {REGION_OPTIONS.map((r) => {
              const active = r.key === selectedRegion;
              return (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => setSelectedRegion(r.key)}
                  className={classNames(
                    'px-3 py-2 rounded-xl border text-sm font-bold transition-colors',
                    active
                      ? 'bg-orange-100 border-orange-200 text-[#E86B32]'
                      : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                  )}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        </div>
        {cityOptions.length === 0 ? (
          <div className="mt-2 text-xs text-stone-500">
            City list unavailable for this region in this environment — you can still type any city name.
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {BUDGET_OPTIONS.map((b) => (
          <TripCard
            key={b.key}
            trip={selectedTrips[b.key]}
            onUpdate={(next) => updateTrip(b.key, next)}
            cityOptions={cityOptions}
            cityDatalistId={cityDatalistId}
            onPickCity={(month) => openCityPicker(b.key, month)}
          />
        ))}
      </div>

      {showMapping ? (
        <div className="mt-6 bg-white border border-stone-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between">
            <div className="text-sm font-bold text-stone-800">
              Mock mapping: (region + budgetTier) → month1/month2/month3
            </div>
            <div className="text-xs text-stone-500">Use this shape in the wizard when ready.</div>
          </div>
          <pre className="p-5 text-xs overflow-auto bg-stone-50 text-stone-800">{JSON.stringify(currentMapping, null, 2)}</pre>
        </div>
      ) : null}
    </div>
  );
}

