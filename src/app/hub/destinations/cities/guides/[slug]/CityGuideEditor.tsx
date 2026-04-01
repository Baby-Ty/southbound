'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, Check, AlertCircle, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import type { CityData, Activity, Neighbourhood, NomadScore } from '@/data/cities';

// ─── Types ────────────────────────────────────────────────────────────────────

type TabId = 'overview' | 'culture-food' | 'activities-sights' | 'neighbourhoods' | 'costs-work' | 'visa-timing' | 'week-tips';

const TABS: { id: TabId; label: string }[] = [
  { id: 'overview',           label: 'Overview' },
  { id: 'culture-food',       label: 'Culture & Food' },
  { id: 'activities-sights',  label: 'Activities & Sights' },
  { id: 'neighbourhoods',     label: 'Neighbourhoods' },
  { id: 'costs-work',         label: 'Costs & Remote Work' },
  { id: 'visa-timing',        label: 'Visa & Timing' },
  { id: 'week-tips',          label: 'Week & Tips' },
];

// ─── Shared field components ──────────────────────────────────────────────────

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-stone-700 mb-1">{label}</label>
      {hint && <p className="text-xs text-stone-400 mb-1.5">{hint}</p>}
      {children}
    </div>
  );
}

const inputCls = 'w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:ring-2 focus:ring-sb-orange-400 focus:border-transparent';
const textareaCls = `${inputCls} resize-y min-h-[80px]`;

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <input type="text" className={inputCls} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />;
}

function TextArea({ value, onChange, placeholder, rows = 3 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return <textarea className={textareaCls} rows={rows} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />;
}

function NumberInput({ value, onChange, min = 0, max = 10, step = 0.5 }: { value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number }) {
  return (
    <input
      type="number"
      className={`${inputCls} w-24`}
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
    />
  );
}

// Simple string list editor (mustTry, highlights, topAreas, visa.details, etc.)
function StringListEditor({ items, onChange, placeholder }: { items: string[]; onChange: (items: string[]) => void; placeholder?: string }) {
  const update = (i: number, val: string) => {
    const next = [...items];
    next[i] = val;
    onChange(next);
  };
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => onChange([...items, '']);

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            type="text"
            className={`${inputCls} flex-1`}
            value={item}
            onChange={(e) => update(i, e.target.value)}
            placeholder={placeholder}
          />
          <button onClick={() => remove(i)} className="p-2 text-stone-400 hover:text-red-500 transition-colors flex-shrink-0">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
      <button onClick={add} className="flex items-center gap-1.5 text-sm text-sb-orange-600 hover:text-sb-orange-700 font-medium">
        <Plus className="w-4 h-4" /> Add item
      </button>
    </div>
  );
}

// Name + note pair editor (mustSee, livedIn)
function NameNoteListEditor({ items, onChange }: { items: { name: string; note: string }[]; onChange: (items: { name: string; note: string }[]) => void }) {
  const update = (i: number, field: 'name' | 'note', val: string) => {
    const next = [...items];
    next[i] = { ...next[i], [field]: val };
    onChange(next);
  };
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => onChange([...items, { name: '', note: '' }]);

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="bg-stone-50 border border-stone-200 rounded-lg p-3 space-y-2">
          <div className="flex gap-2">
            <input type="text" className={`${inputCls} flex-1`} value={item.name} onChange={(e) => update(i, 'name', e.target.value)} placeholder="Name" />
            <button onClick={() => remove(i)} className="p-2 text-stone-400 hover:text-red-500 transition-colors flex-shrink-0">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <input type="text" className={inputCls} value={item.note} onChange={(e) => update(i, 'note', e.target.value)} placeholder="Note / description" />
        </div>
      ))}
      <button onClick={add} className="flex items-center gap-1.5 text-sm text-sb-orange-600 hover:text-sb-orange-700 font-medium">
        <Plus className="w-4 h-4" /> Add item
      </button>
    </div>
  );
}

// Section divider
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-bold text-stone-500 uppercase tracking-wider pt-2 border-t border-stone-100 mt-2">
      {children}
    </h3>
  );
}

// ─── Main Editor ──────────────────────────────────────────────────────────────

export default function CityGuideEditor({ initialData, slug }: { initialData: CityData; slug: string }) {
  const [form, setForm] = useState<CityData>(initialData);
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // Generic deep-set helpers
  const set = useCallback(<K extends keyof CityData>(key: K, value: CityData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaveStatus('idle');
  }, []);

  const setNested = useCallback(<P extends keyof CityData>(parent: P, child: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [parent]: { ...(prev[parent] as any), [child]: value },
    }));
    setSaveStatus('idle');
  }, []);

  const setDeep = useCallback(<P extends keyof CityData>(parent: P, child: string, grandchild: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as any),
        [child]: { ...((prev[parent] as any)[child] as any), [grandchild]: value },
      },
    }));
    setSaveStatus('idle');
  }, []);

  // Save handler
  const handleSave = async () => {
    setSaving(true);
    setErrorMsg('');
    try {
      const { apiUrl } = await import('@/lib/api');
      const res = await fetch(apiUrl(`city-guides/${slug}`), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `Save failed: ${res.status}`);
      }
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err: any) {
      setErrorMsg(err.message);
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  };

  // ── Tab: Overview ────────────────────────────────────────────────────────────
  const renderOverview = () => (
    <div className="space-y-5">
      <Field label="Tagline" hint="Short punchy line shown under the city name on the hero">
        <TextInput value={form.tagline} onChange={(v) => set('tagline', v)} placeholder="e.g. The nomad capital of Southeast Asia." />
      </Field>
      <Field label="Overview" hint="2–4 sentences. Lead with what makes this city work for remote workers.">
        <TextArea value={form.overview} onChange={(v) => set('overview', v)} rows={5} />
      </Field>

      <SectionTitle>Hero Image</SectionTitle>
      <Field label="Hero image URL" hint="Paste a full Unsplash URL. Append ?auto=format&fit=crop&w=1600&q=80 for best quality.">
        <TextInput value={form.heroImage} onChange={(v) => set('heroImage', v)} placeholder="https://images.unsplash.com/photo-..." />
      </Field>
      {form.heroImage && (
        <div className="relative h-28 rounded-xl overflow-hidden border border-stone-200">
          <img src={`${form.heroImage}&w=900&q=60`} alt={form.name} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900/60 to-transparent flex items-center px-5">
            <p className="text-white text-sm italic opacity-80">{form.tagline}</p>
          </div>
        </div>
      )}
      <Field label="Alt text" hint="Describes the image for accessibility and SEO.">
        <TextInput value={form.altText} onChange={(v) => set('altText', v)} placeholder="e.g. Wat Prathat Doi Suthep temple overlooking Chiang Mai valley" />
      </Field>

      <SectionTitle>Section Images</SectionTitle>
      <p className="text-xs text-stone-400 -mt-3">These images appear as banners in the Food, Activities, Sights, and Remote Work sections. Paste Unsplash URLs — append ?auto=format&fit=crop&w=1400&q=75.</p>
      {(['food', 'activities', 'sights', 'remoteWork'] as const).map((key) => {
        const labels: Record<string, string> = { food: 'Food section', activities: 'Activities section', sights: 'Sights section', remoteWork: 'Remote Work section' };
        const url = form.sectionImages[key];
        return (
          <div key={key} className="space-y-2">
            <Field label={labels[key]}>
              <TextInput value={url} onChange={(v) => setNested('sectionImages', key, v)} placeholder="https://images.unsplash.com/photo-..." />
            </Field>
            {url && (
              <div className="h-16 rounded-lg overflow-hidden border border-stone-200">
                <img src={`${url}&w=600&q=50`} alt={labels[key]} className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
              </div>
            )}
          </div>
        );
      })}

      <SectionTitle>Quick Stats</SectionTitle>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Monthly Budget Range">
          <TextInput value={form.quickStats.monthlyBudget} onChange={(v) => setNested('quickStats', 'monthlyBudget', v)} placeholder="e.g. R27,000 – R41,000" />
        </Field>
        <Field label="Nomad Rating (out of 10)">
          <NumberInput value={form.quickStats.nomadRating} onChange={(v) => setNested('quickStats', 'nomadRating', v)} />
        </Field>
        <Field label="Best Months">
          <TextInput value={form.quickStats.bestMonths} onChange={(v) => setNested('quickStats', 'bestMonths', v)} placeholder="e.g. Nov – Feb" />
        </Field>
        <Field label="Visa Status">
          <TextInput value={form.quickStats.visaFree} onChange={(v) => setNested('quickStats', 'visaFree', v)} placeholder="e.g. 60 days visa-free" />
        </Field>
      </div>
    </div>
  );

  // ── Tab: Culture & Food ──────────────────────────────────────────────────────
  const renderCultureFood = () => (
    <div className="space-y-5">
      <SectionTitle>Culture & Vibe</SectionTitle>
      <Field label="Culture description">
        <TextArea value={form.culture.description} onChange={(v) => setNested('culture', 'description', v)} rows={4} />
      </Field>
      <Field label="Highlights" hint="Short bullet points shown as tick cards">
        <StringListEditor items={form.culture.highlights} onChange={(v) => setNested('culture', 'highlights', v)} placeholder="e.g. Active Buddhist temples with monk chats" />
      </Field>

      <SectionTitle>Food</SectionTitle>
      <Field label="Food description">
        <TextArea value={form.food.description} onChange={(v) => setNested('food', 'description', v)} rows={4} />
      </Field>
      <Field label="Must-try dishes">
        <StringListEditor items={form.food.mustTry} onChange={(v) => setNested('food', 'mustTry', v)} placeholder="e.g. Khao soi (coconut curry noodle soup)" />
      </Field>

      <Field label="Price breakdown">
        <div className="space-y-2">
          {(['street', 'midRange', 'premium'] as const).map((tier) => (
            <div key={tier} className="flex items-center gap-3">
              <span className="text-xs font-semibold text-stone-500 w-20 capitalize">{tier === 'midRange' ? 'Mid-range' : tier}</span>
              <input
                type="text"
                className={`${inputCls} flex-1`}
                value={form.food.budgetBreakdown[tier]}
                onChange={(e) => setDeep('food', 'budgetBreakdown', tier, e.target.value)}
                placeholder="e.g. R27 – R36 per meal"
              />
            </div>
          ))}
        </div>
      </Field>

      <Field label="Best food areas">
        <StringListEditor items={form.food.topAreas} onChange={(v) => setNested('food', 'topAreas', v)} placeholder="e.g. Chang Phuak Gate night market" />
      </Field>
    </div>
  );

  // ── Tab: Activities & Sights ─────────────────────────────────────────────────
  const renderActivitiesSights = () => (
    <div className="space-y-5">
      <SectionTitle>Activities</SectionTitle>
      <div className="space-y-3">
        {form.activities.map((act, i) => (
          <div key={i} className="bg-stone-50 border border-stone-200 rounded-lg p-4 space-y-2">
            <div className="flex gap-2 items-center">
              <input
                type="text"
                className={`${inputCls} w-16 text-center`}
                value={act.emoji}
                onChange={(e) => {
                  const next = [...form.activities];
                  next[i] = { ...next[i], emoji: e.target.value };
                  set('activities', next);
                }}
                placeholder="🏄"
              />
              <input
                type="text"
                className={`${inputCls} flex-1`}
                value={act.name}
                onChange={(e) => {
                  const next = [...form.activities];
                  next[i] = { ...next[i], name: e.target.value };
                  set('activities', next);
                }}
                placeholder="Activity name"
              />
              <button
                onClick={() => set('activities', form.activities.filter((_, idx) => idx !== i))}
                className="p-2 text-stone-400 hover:text-red-500 transition-colors flex-shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <textarea
              className={`${textareaCls}`}
              rows={2}
              value={act.description}
              onChange={(e) => {
                const next = [...form.activities];
                next[i] = { ...next[i], description: e.target.value };
                set('activities', next);
              }}
              placeholder="What to know / expect"
            />
          </div>
        ))}
        <button
          onClick={() => set('activities', [...form.activities, { name: '', description: '', emoji: '📍' }])}
          className="flex items-center gap-1.5 text-sm text-sb-orange-600 hover:text-sb-orange-700 font-medium"
        >
          <Plus className="w-4 h-4" /> Add activity
        </button>
      </div>

      <SectionTitle>Sights — Worth Seeing</SectionTitle>
      <NameNoteListEditor
        items={form.sights.mustSee}
        onChange={(v) => setNested('sights', 'mustSee', v)}
      />

      <SectionTitle>Sights — Lived-in Experiences</SectionTitle>
      <NameNoteListEditor
        items={form.sights.livedIn}
        onChange={(v) => setNested('sights', 'livedIn', v)}
      />
    </div>
  );

  // ── Tab: Neighbourhoods ──────────────────────────────────────────────────────
  const renderNeighbourhoods = () => (
    <div className="space-y-4">
      {form.neighbourhoods.map((n, i) => (
        <div key={i} className="bg-stone-50 border border-stone-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-stone-700">{n.name || `Neighbourhood ${i + 1}`}</span>
            <button
              onClick={() => set('neighbourhoods', form.neighbourhoods.filter((_, idx) => idx !== i))}
              className="p-1.5 text-stone-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          <Field label="Name">
            <TextInput
              value={n.name}
              onChange={(v) => {
                const next = [...form.neighbourhoods];
                next[i] = { ...next[i], name: v };
                set('neighbourhoods', next);
              }}
            />
          </Field>
          <Field label="Description">
            <TextArea
              value={n.description}
              onChange={(v) => {
                const next = [...form.neighbourhoods];
                next[i] = { ...next[i], description: v };
                set('neighbourhoods', next);
              }}
              rows={3}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Best for">
              <TextInput
                value={n.bestFor}
                onChange={(v) => {
                  const next = [...form.neighbourhoods];
                  next[i] = { ...next[i], bestFor: v };
                  set('neighbourhoods', next);
                }}
                placeholder="e.g. First-timers, community"
              />
            </Field>
            <Field label="Monthly rent range">
              <TextInput
                value={n.monthlyRent}
                onChange={(v) => {
                  const next = [...form.neighbourhoods];
                  next[i] = { ...next[i], monthlyRent: v };
                  set('neighbourhoods', next);
                }}
                placeholder="e.g. R5,000 – R12,600"
              />
            </Field>
          </div>
        </div>
      ))}
      <button
        onClick={() => set('neighbourhoods', [...form.neighbourhoods, { name: '', description: '', bestFor: '', monthlyRent: '' }])}
        className="flex items-center gap-1.5 text-sm text-sb-orange-600 hover:text-sb-orange-700 font-medium"
      >
        <Plus className="w-4 h-4" /> Add neighbourhood
      </button>
    </div>
  );

  // ── Tab: Costs & Remote Work ─────────────────────────────────────────────────
  const renderCostsWork = () => {
    const col = form.costOfLiving;
    return (
      <div className="space-y-5">
        <SectionTitle>Cost of Living</SectionTitle>
        <Field label="Note (shown under section heading)">
          <TextInput value={col.note} onChange={(v) => setNested('costOfLiving', 'note', v)} />
        </Field>

        {/* Cost table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border border-stone-200 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-stone-50">
                <th className="px-3 py-2 text-left font-semibold text-stone-600">Category</th>
                <th className="px-3 py-2 text-left font-semibold text-stone-600">Budget</th>
                <th className="px-3 py-2 text-left font-semibold text-stone-600">Mid-range</th>
                <th className="px-3 py-2 text-left font-semibold text-stone-600">Premium</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {/* Accommodation */}
              <tr>
                <td className="px-3 py-2 font-medium text-stone-700">🏠 Accommodation</td>
                {(['budget', 'mid', 'premium'] as const).map((tier) => (
                  <td key={tier} className="px-3 py-2">
                    <input type="text" className={`${inputCls} w-full min-w-[120px]`} value={col.accommodation[tier]} onChange={(e) => setDeep('costOfLiving', 'accommodation', tier, e.target.value)} />
                  </td>
                ))}
              </tr>
              {/* Food */}
              <tr>
                <td className="px-3 py-2 font-medium text-stone-700">🍜 Food</td>
                {(['budget', 'mid', 'premium'] as const).map((tier) => (
                  <td key={tier} className="px-3 py-2">
                    <input type="text" className={`${inputCls} w-full min-w-[120px]`} value={col.food[tier]} onChange={(e) => setDeep('costOfLiving', 'food', tier, e.target.value)} />
                  </td>
                ))}
              </tr>
              {/* Transport */}
              <tr>
                <td className="px-3 py-2 font-medium text-stone-700">🛵 Transport</td>
                {(['budget', 'mid', 'premium'] as const).map((tier) => (
                  <td key={tier} className="px-3 py-2">
                    <input type="text" className={`${inputCls} w-full min-w-[120px]`} value={col.transport[tier]} onChange={(e) => setDeep('costOfLiving', 'transport', tier, e.target.value)} />
                  </td>
                ))}
              </tr>
              {/* Gym */}
              <tr>
                <td className="px-3 py-2 font-medium text-stone-700">🏋️ Gym</td>
                {(['budget', 'mid', 'premium'] as const).map((tier) => (
                  <td key={tier} className="px-3 py-2">
                    <input type="text" className={`${inputCls} w-full min-w-[120px]`} value={col.gym[tier]} onChange={(e) => setDeep('costOfLiving', 'gym', tier, e.target.value)} />
                  </td>
                ))}
              </tr>
              {/* Total */}
              <tr className="bg-stone-50">
                <td className="px-3 py-2 font-bold text-stone-700">Total / month</td>
                {(['budget', 'mid', 'premium'] as const).map((tier) => (
                  <td key={tier} className="px-3 py-2">
                    <input type="text" className={`${inputCls} w-full min-w-[120px] font-semibold`} value={col.total[tier]} onChange={(e) => setDeep('costOfLiving', 'total', tier, e.target.value)} />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Coworking */}
        <div className="grid grid-cols-2 gap-3">
          <Field label="💻 Coworking day pass">
            <TextInput value={col.coworking.dayPass} onChange={(v) => setDeep('costOfLiving', 'coworking', 'dayPass', v)} placeholder="e.g. R90 – R220/day" />
          </Field>
          <Field label="💻 Coworking monthly">
            <TextInput value={col.coworking.monthly} onChange={(v) => setDeep('costOfLiving', 'coworking', 'monthly', v)} placeholder="e.g. R1,500 – R4,500" />
          </Field>
        </div>

        <SectionTitle>Remote Work</SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Internet quality (description)">
            <TextArea value={form.remoteWork.internetQuality} onChange={(v) => setNested('remoteWork', 'internetQuality', v)} rows={3} />
          </Field>
          <Field label="Internet rating (0–10)">
            <NumberInput value={form.remoteWork.internetRating} onChange={(v) => setNested('remoteWork', 'internetRating', v)} />
          </Field>
        </div>
        <Field label="Working from cafes">
          <TextArea value={form.remoteWork.cafes} onChange={(v) => setNested('remoteWork', 'cafes', v)} rows={2} />
        </Field>

        <Field label="Coworking spaces">
          <div className="space-y-3">
            {form.remoteWork.coworkingSpaces.map((space, i) => (
              <div key={i} className="bg-stone-50 border border-stone-200 rounded-lg p-3 space-y-2">
                <div className="flex gap-2">
                  <input type="text" className={`${inputCls} flex-1`} value={space.name} placeholder="Name" onChange={(e) => {
                    const next = [...form.remoteWork.coworkingSpaces];
                    next[i] = { ...next[i], name: e.target.value };
                    setNested('remoteWork', 'coworkingSpaces', next);
                  }} />
                  <button onClick={() => {
                    const next = form.remoteWork.coworkingSpaces.filter((_, idx) => idx !== i);
                    setNested('remoteWork', 'coworkingSpaces', next);
                  }} className="p-2 text-stone-400 hover:text-red-500 transition-colors flex-shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <textarea className={textareaCls} rows={2} value={space.description} placeholder="Description" onChange={(e) => {
                  const next = [...form.remoteWork.coworkingSpaces];
                  next[i] = { ...next[i], description: e.target.value };
                  setNested('remoteWork', 'coworkingSpaces', next);
                }} />
                <input type="text" className={inputCls} value={space.price} placeholder="Price" onChange={(e) => {
                  const next = [...form.remoteWork.coworkingSpaces];
                  next[i] = { ...next[i], price: e.target.value };
                  setNested('remoteWork', 'coworkingSpaces', next);
                }} />
              </div>
            ))}
            <button
              onClick={() => setNested('remoteWork', 'coworkingSpaces', [...form.remoteWork.coworkingSpaces, { name: '', description: '', price: '' }])}
              className="flex items-center gap-1.5 text-sm text-sb-orange-600 hover:text-sb-orange-700 font-medium"
            >
              <Plus className="w-4 h-4" /> Add coworking space
            </button>
          </div>
        </Field>
      </div>
    );
  };

  // ── Tab: Visa & Timing ───────────────────────────────────────────────────────
  const renderVisaTiming = () => (
    <div className="space-y-5">
      <SectionTitle>Visa for South Africans</SectionTitle>
      <Field label="Headline">
        <TextInput value={form.visa.headline} onChange={(v) => setNested('visa', 'headline', v)} placeholder="e.g. South Africans get 60 days visa-free" />
      </Field>
      <Field label="Details (bullet points)">
        <StringListEditor items={form.visa.details} onChange={(v) => setNested('visa', 'details', v)} placeholder="e.g. No visa on arrival required — just land and go" />
      </Field>
      <Field label="Staying longer">
        <TextArea value={form.visa.longerStay} onChange={(v) => setNested('visa', 'longerStay', v)} rows={4} />
      </Field>
      <Field label="Warning / flag (optional — leave empty to hide)">
        <TextInput value={form.visa.flag || ''} onChange={(v) => setNested('visa', 'flag', v || null)} placeholder="e.g. Confirm current e-VOA requirements before travel" />
      </Field>

      <SectionTitle>Best Time to Visit</SectionTitle>
      <div className="space-y-3">
        {(['ideal', 'shoulder', 'avoid', 'recommendation'] as const).map((key) => (
          <Field key={key} label={key === 'ideal' ? '🌤️ Ideal window' : key === 'shoulder' ? '🌥️ Shoulder season' : key === 'avoid' ? '🌧️ Worth knowing (avoid)' : '💬 Bottom line recommendation'}>
            <TextArea value={form.bestTime[key]} onChange={(v) => setNested('bestTime', key, v)} rows={2} />
          </Field>
        ))}
      </div>
    </div>
  );

  // ── Tab: Week & Tips ─────────────────────────────────────────────────────────
  const renderWeekTips = () => (
    <div className="space-y-5">
      <SectionTitle>Week in the Life</SectionTitle>
      <div className="space-y-3">
        {form.weekInTheLife.map((entry, i) => (
          <div key={i} className="bg-stone-50 border border-stone-200 rounded-lg p-3 space-y-2">
            <div className="flex gap-2">
              <input type="text" className={`${inputCls} w-40`} value={entry.label} placeholder="Label (e.g. Monday morning)" onChange={(e) => {
                const next = [...form.weekInTheLife];
                next[i] = { ...next[i], label: e.target.value };
                set('weekInTheLife', next);
              }} />
              <button onClick={() => set('weekInTheLife', form.weekInTheLife.filter((_, idx) => idx !== i))} className="p-2 text-stone-400 hover:text-red-500 ml-auto flex-shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <textarea className={textareaCls} rows={2} value={entry.description} placeholder="What this part of the week actually looks like" onChange={(e) => {
              const next = [...form.weekInTheLife];
              next[i] = { ...next[i], description: e.target.value };
              set('weekInTheLife', next);
            }} />
          </div>
        ))}
        <button onClick={() => set('weekInTheLife', [...form.weekInTheLife, { label: '', description: '' }])} className="flex items-center gap-1.5 text-sm text-sb-orange-600 hover:text-sb-orange-700 font-medium">
          <Plus className="w-4 h-4" /> Add entry
        </button>
      </div>

      <SectionTitle>Practical Tips</SectionTitle>
      <div className="space-y-3">
        {form.practicalTips.map((tip, i) => (
          <div key={i} className="bg-stone-50 border border-stone-200 rounded-lg p-3 space-y-2">
            <div className="flex gap-2">
              <input type="text" className={`${inputCls} flex-1`} value={tip.title} placeholder="Tip title" onChange={(e) => {
                const next = [...form.practicalTips];
                next[i] = { ...next[i], title: e.target.value };
                set('practicalTips', next);
              }} />
              <button onClick={() => set('practicalTips', form.practicalTips.filter((_, idx) => idx !== i))} className="p-2 text-stone-400 hover:text-red-500 flex-shrink-0">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <textarea className={textareaCls} rows={2} value={tip.body} placeholder="Tip body" onChange={(e) => {
              const next = [...form.practicalTips];
              next[i] = { ...next[i], body: e.target.value };
              set('practicalTips', next);
            }} />
          </div>
        ))}
        <button onClick={() => set('practicalTips', [...form.practicalTips, { title: '', body: '' }])} className="flex items-center gap-1.5 text-sm text-sb-orange-600 hover:text-sb-orange-700 font-medium">
          <Plus className="w-4 h-4" /> Add tip
        </button>
      </div>

      <SectionTitle>Nomad Rating</SectionTitle>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Overall score (0–10)">
          <NumberInput value={form.nomadRating.overall} onChange={(v) => setNested('nomadRating', 'overall', v)} />
        </Field>
      </div>
      <Field label="Summary">
        <TextArea value={form.nomadRating.summary} onChange={(v) => setNested('nomadRating', 'summary', v)} rows={3} />
      </Field>
      <Field label="Score breakdown">
        <div className="space-y-3">
          {form.nomadRating.scores.map((score, i) => (
            <div key={i} className="bg-stone-50 border border-stone-200 rounded-lg p-3 grid grid-cols-3 gap-2 items-center">
              <input type="text" className={inputCls} value={score.factor} placeholder="Factor (e.g. Internet)" onChange={(e) => {
                const next = [...form.nomadRating.scores];
                next[i] = { ...next[i], factor: e.target.value };
                setNested('nomadRating', 'scores', next);
              }} />
              <NumberInput value={score.score} onChange={(v) => {
                const next = [...form.nomadRating.scores];
                next[i] = { ...next[i], score: v };
                setNested('nomadRating', 'scores', next);
              }} />
              <input type="text" className={inputCls} value={score.note} placeholder="Note" onChange={(e) => {
                const next = [...form.nomadRating.scores];
                next[i] = { ...next[i], note: e.target.value };
                setNested('nomadRating', 'scores', next);
              }} />
            </div>
          ))}
        </div>
      </Field>
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────────

  const tabContent: Record<TabId, () => React.ReactNode> = {
    'overview':           renderOverview,
    'culture-food':       renderCultureFood,
    'activities-sights':  renderActivitiesSights,
    'neighbourhoods':     renderNeighbourhoods,
    'costs-work':         renderCostsWork,
    'visa-timing':        renderVisaTiming,
    'week-tips':          renderWeekTips,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/hub/destinations/cities" className="p-2 rounded-lg hover:bg-stone-100 text-stone-500 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
              {form.flag} {form.name} — Guide Editor
            </h1>
            <p className="text-stone-500 text-sm">{form.country} · {form.region}</p>
          </div>
        </div>

        {/* Save button */}
        <div className="flex items-center gap-3">
          {saveStatus === 'saved' && (
            <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
              <Check className="w-4 h-4" /> Saved
            </span>
          )}
          {saveStatus === 'error' && (
            <span className="flex items-center gap-1.5 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" /> {errorMsg}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-sb-orange-500 hover:bg-sb-orange-600 disabled:opacity-60 text-white rounded-lg font-medium transition-colors"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>

      {/* Hero preview strip */}
      <div className="relative h-24 rounded-xl overflow-hidden">
        <img src={`${form.heroImage}&w=1200&q=60`} alt={form.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-900/60 to-transparent flex items-center px-6">
          <p className="text-white text-sm italic opacity-80">{form.tagline}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        {/* Tab bar */}
        <div className="flex overflow-x-auto border-b border-stone-200 bg-stone-50">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-sb-orange-500 text-sb-orange-600 bg-white'
                  : 'border-transparent text-stone-500 hover:text-stone-700 hover:bg-stone-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="p-6">
          {tabContent[activeTab]()}
        </div>
      </div>

      {/* Bottom save */}
      <div className="flex justify-end pb-8">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-sb-orange-500 hover:bg-sb-orange-600 disabled:opacity-60 text-white rounded-lg font-medium transition-colors"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </div>
  );
}
