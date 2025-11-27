"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  CalendarClock,
  Laptop,
  MapPin,
  Building2,
  Sparkles,
  GripVertical,
  ChevronRight,
  X,
  Bed,
  ListChecks,
  StickyNote,
} from "lucide-react";
import { ITINERARIES, regionThemeClasses } from "@/lib/itineraries";
import { CITY_PRESETS, REGION_HUBS, RegionKey, WORK_NEEDS, VIBES, CityPreset } from "@/lib/cityPresets";

const WHATSAPP_URL = "https://wa.me/27872500972?text=Hi%2C%20I%27m%20ready%20to%20plan%20my%20route%20with%20South%20Bound.";

type DurationOpt = "2-4" | "4-8" | "8-12" | "custom";

type StopPlan = {
  id: string;
  city: string;
  country: string;
  weeks: number;
  weeksEdited?: boolean;
  budgetCoins: 1 | 2 | 3;
  tags: string[];
  highlights: {
    places: string[];
    accommodation: string;
    activities: string[];
    notes: string;
    notesHint?: string;
  };
};

type PlannerState = {
  region: RegionKey;
  base: string;
  workNeeds: string[];
  vibes: string[];
  duration: DurationOpt;
  customStart?: string;
  customEnd?: string;
  stops: StopPlan[];
};

const STORAGE_KEY = "sb.routePlanner";

function useInitialRegion(): RegionKey {
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    const r = (params.get("region") || "latin-america") as string;
    if (r === "europe" || r === "latin-america" || r === "southeast-asia") return r;
  }
  return "latin-america";
}

function makeStopFromPreset(p: CityPreset, idx: number): StopPlan {
  return {
    id: `${p.city}-${idx}-${Math.random().toString(36).slice(2, 7)}`,
    city: p.city,
    country: p.country,
    weeks: 6,
    budgetCoins: p.budgetCoins,
    tags: p.tags,
    highlights: {
      places: p.highlights.places,
      accommodation: p.highlights.accommodation,
      activities: p.highlights.activities,
      notes: "",
      notesHint: p.highlights.notesHint,
    },
  };
}

function coins(n: number) {
  return "🪙".repeat(Math.max(1, Math.min(3, n)));
}

function Toasts({ toasts, onClose }: { toasts: string[]; onClose: (i: number) => void }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((t, i) => (
        <div key={i} className="bg-sb-navy-700 text-white text-sm px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 animate-slide-up">
          <span>{t}</span>
          <button onClick={() => onClose(i)} className="ml-1 opacity-80 hover:opacity-100">✕</button>
        </div>
      ))}
    </div>
  );
}

function RightDrawer({ title, open, onClose, children }: { title: string; open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-gradient-to-b from-white to-sb-beige-50/30 shadow-2xl overflow-y-auto animate-slide-left">
        <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-gray-200 p-6 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sb-teal-400 to-sb-teal-500 flex items-center justify-center shadow-md">
                <span className="text-xl">🌆</span>
              </div>
              <h3 className="text-xl font-bold text-sb-navy-700">{title}</h3>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 rounded-lg hover:bg-sb-orange-100 transition group"
            >
              <X className="h-5 w-5 text-gray-600 group-hover:text-sb-orange-600 transition" />
            </button>
          </div>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function TripOptionsPage() {
  const region = useInitialRegion();

  const initialDefault = useMemo<PlannerState>(() => {
    const presets = CITY_PRESETS[region].slice(0, 3);
    return {
      region,
      base: REGION_HUBS[region][0],
      workNeeds: [],
      vibes: [],
      duration: "2-4",
      stops: presets.map((p, i) => makeStopFromPreset(p, i)),
    };
  }, [region]);

  const [state, setState] = useState<PlannerState>(initialDefault);
  const [savedSnapshot, setSavedSnapshot] = useState<string>(JSON.stringify(initialDefault));
  const [toasts, setToasts] = useState<string[]>([]);
  const [drawer, setDrawer] = useState<{ open: boolean; stopIndex: number | null }>({ open: false, stopIndex: null });
  const [editingStop, setEditingStop] = useState<number | null>(null);

  // load from localStorage
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed: PlannerState = JSON.parse(raw);
        if (parsed.region === region) {
          setState(parsed);
          setSavedSnapshot(JSON.stringify(parsed));
        }
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [region]);

  // autosave
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Preselect from query
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lifestyleParam = (params.get("lifestyle") || "").split(",").filter(Boolean);
    const workParam = (params.get("work") || "").split(",").filter(Boolean);
    
    const vibeMap: Record<string, string> = {
      foodie: "Food",
      beach: "Beach",
      culture: "Culture",
      nightlife: "Nightlife",
      nature: "Nature",
      fitness: "Wellness",
      quiet: "City walks",
    };
    const workMap: Record<string, string> = {
      "fast-internet": "Fast internet",
      "quiet-workspace": "Quiet workspace",
      "frequent-calls": "Phone calls",
      coworking: "Co-working",
    };
    
    if (savedSnapshot === JSON.stringify(initialDefault)) {
      const vibes = Array.from(new Set(lifestyleParam.map((k) => vibeMap[k]).filter((v): v is string => !!v)));
      const workNeeds = Array.from(new Set(workParam.map((k) => workMap[k]).filter((v): v is string => !!v)));
      if (vibes.length || workNeeds.length) {
        setState((s) => ({ ...s, vibes, workNeeds }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dirty = JSON.stringify(state) !== savedSnapshot;

  function pushToast(msg: string) {
    setToasts((t) => [...t, msg]);
    setTimeout(() => setToasts((t) => t.slice(1)), 3000);
  }

  function tagClass(tag: string) {
    const t = tag.toLowerCase();
    if (/(beach|coast|island|surf|tropical|nature)/.test(t)) return 'bg-sb-teal-50 text-sb-teal-700 border-sb-teal-200';
    if (/(food|wine|nightlife|culture)/.test(t)) return 'bg-sb-orange-50 text-sb-orange-700 border-sb-orange-200';
    return 'bg-gray-50 text-gray-700 border-gray-200';
  }

  function replaceStopWithPreset(i: number, p: CityPreset) {
    setState((s) => {
      const current = s.stops[i];
      const next = makeStopFromPreset(p, i);
      next.highlights.notes = current.highlights.notes || "";
      next.weeks = current.weeksEdited ? current.weeks : 6;
      next.weeksEdited = current.weeksEdited;
      return { ...s, stops: s.stops.map((st, idx) => (idx === i ? next : st)) };
    });
    pushToast(`Updated to ${p.city}`);
  }

  function updateStop(i: number, patch: Partial<StopPlan>) {
    setState((s) => ({ ...s, stops: s.stops.map((st, idx) => (idx === i ? { ...st, ...patch } : st)) }));
  }

  function onDragSwap(from: number, to: number) {
    setState((s) => {
      const arr = [...s.stops];
      const [m] = arr.splice(from, 1);
      arr.splice(to, 0, m);
      return { ...s, stops: arr };
    });
    pushToast("Reordered stops");
  }

  const dragIndex = useRef<number | null>(null);
  const regionName = region === 'latin-america' ? 'Latin America' : region === 'europe' ? 'Europe' : 'Southeast Asia';

  return (
    <div className="min-h-screen bg-gradient-to-br from-sb-beige-50 to-sb-teal-50 pb-20">
      <Toasts toasts={toasts} onClose={(i) => setToasts((t) => t.filter((_, idx) => idx !== i))} />

      {/* Minimal Progress Bar */}
      <div className="bg-gradient-to-r from-sb-orange-400 to-sb-orange-500 h-1"></div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        
        {/* Header with Visual Elements */}
        <div className="relative text-center space-y-3">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-gradient-to-br from-sb-orange-200/30 to-sb-teal-200/30 rounded-full blur-3xl -z-10"></div>
          
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-sb-orange-400 to-sb-orange-500 rounded-2xl shadow-lg mb-2 transform -rotate-6">
            <span className="text-3xl transform rotate-6">✨</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-sb-navy-700">
            Your Route is Ready!
          </h1>
          <p className="text-base text-sb-navy-500 max-w-2xl mx-auto">
            Here's your personalized itinerary. Drag to reorder, edit details, or swap cities.
          </p>
        </div>

        {/* Quick Overview Card - Enhanced */}
        <div className="relative bg-gradient-to-br from-white via-sb-beige-50/30 to-sb-teal-50/30 rounded-2xl shadow-xl border-2 border-white p-6 sm:p-7 overflow-hidden">
          {/* Decorative corner accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-sb-orange-200/20 to-transparent rounded-bl-full"></div>
          
          <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
            {/* Destination */}
            <div className="group">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sb-teal-400 to-sb-teal-500 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Region</div>
              </div>
              <div className="font-bold text-xl text-sb-navy-700">{regionName}</div>
            </div>

            {/* Duration */}
            <div className="group">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sb-orange-400 to-sb-orange-500 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <CalendarClock className="h-4 w-4 text-white" />
                </div>
                <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Duration</div>
              </div>
              <div className="font-bold text-xl text-sb-navy-700">
                {state.duration === '2-4' && '2–4 months'}
                {state.duration === '4-8' && '4–8 months'}
                {state.duration === '8-12' && '8–12 months'}
              </div>
            </div>

            {/* Stops */}
            <div className="group">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sb-mint-300 to-sb-mint-400 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <Building2 className="h-4 w-4 text-white" />
                </div>
                <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Stops</div>
              </div>
              <div className="font-bold text-xl text-sb-navy-700">{state.stops.length} cities</div>
            </div>
          </div>

          {/* Vibe Tags - Enhanced */}
          {state.vibes.length > 0 && (
            <div className="relative pt-5 border-t border-gray-200/50">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-sb-orange-500" />
                <div className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Your Vibe</div>
              </div>
              <div className="flex flex-wrap gap-2">
                {state.vibes.map((v) => (
                  <span key={v} className="px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-sb-orange-50 to-sb-orange-100 text-sb-orange-700 border border-sb-orange-200 shadow-sm hover:shadow-md transition-shadow">
                    {v}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Itinerary - Enhanced */}
        <div className="relative bg-white rounded-2xl shadow-xl border-2 border-white p-6 sm:p-7 overflow-hidden">
          {/* Decorative background pattern */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full" style={{
              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(0,0,0,.1) 35px, rgba(0,0,0,.1) 70px)`
            }}></div>
          </div>

          <div className="relative flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sb-orange-400 to-sb-orange-500 flex items-center justify-center shadow-md">
                <span className="text-xl">🗺️</span>
              </div>
              <h2 className="text-2xl font-bold text-sb-navy-700">Your Itinerary</h2>
            </div>
            <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">Drag to reorder</span>
          </div>

          <div className="relative space-y-4">
            {state.stops.map((stop, i) => {
              const cityPreset = CITY_PRESETS[region].find(c => c.city === stop.city);
              return (
              <div
                key={stop.id}
                className="group relative border-2 border-gray-200 rounded-2xl hover:border-sb-orange-400 hover:shadow-2xl transition-all duration-300 overflow-hidden bg-white"
                draggable
                onDragStart={() => (dragIndex.current = i)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragIndex.current !== null && dragIndex.current !== i) onDragSwap(dragIndex.current, i);
                  dragIndex.current = null;
                }}
              >
                {/* City Image Background */}
                {cityPreset?.imageUrl && (
                  <div className="hidden md:block absolute right-0 top-0 bottom-0 w-[40%] overflow-hidden rounded-r-2xl">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transform group-hover:scale-105 transition-transform duration-500"
                      style={{ backgroundImage: `url(${cityPreset.imageUrl})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
                  </div>
                )}
                
                {/* Mobile Image - Top */}
                {cityPreset?.imageUrl && (
                  <div className="md:hidden relative w-full h-48 overflow-hidden rounded-t-2xl">
                    <div 
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${cityPreset.imageUrl})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/90"></div>
                  </div>
                )}

                {/* Step number badge */}
                <div className="absolute top-3 left-3 md:-top-2 md:-left-2 w-8 h-8 rounded-full bg-gradient-to-br from-sb-orange-500 to-sb-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-lg z-20">
                  {i + 1}
                </div>

                {/* Content Container with proper padding for image */}
                <div className="relative p-5 md:pr-[42%]">
                  {/* Header */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-white shadow-sm group-hover:shadow-md transition-shadow cursor-move">
                      <GripVertical className="h-5 w-5 text-gray-400 group-hover:text-sb-orange-500 transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-sb-navy-700 flex items-center gap-2">
                          <span className="text-2xl">{cityPreset?.flag}</span>
                          {stop.city}
                        </h3>
                        <span className="text-sm text-gray-500 font-medium">{stop.country}</span>
                      </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-sb-teal-400 to-sb-teal-500 text-white shadow-md">
                        {stop.weeks} weeks
                      </span>
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-white border-2 border-sb-orange-200 text-sb-orange-700 shadow-sm">
                        {coins(stop.budgetCoins)}
                      </span>
                    </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {stop.tags.map((tag) => (
                          <span key={tag} className={`px-2 py-0.5 text-xs rounded-full border ${tagClass(tag)}`}>
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Highlights - Cleaner Grid */}
                      {editingStop !== i && (
                        <div className="grid grid-cols-1 gap-3 text-sm">
                          <div>
                            <div className="text-xs font-semibold text-gray-500 mb-1">📍 Places</div>
                            <div className="text-sb-navy-700">{stop.highlights.places.join(' • ')}</div>
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-gray-500 mb-1">🏠 Accommodation</div>
                            <div className="text-sb-navy-700">{stop.highlights.accommodation}</div>
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-gray-500 mb-1">🎯 Activities</div>
                            <div className="text-sb-navy-700">{stop.highlights.activities.join(' • ')}</div>
                          </div>
                          {stop.highlights.notes && (
                            <div>
                              <div className="text-xs font-semibold text-gray-500 mb-1">📝 Notes</div>
                              <div className="text-sb-navy-700">{stop.highlights.notes}</div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Edit Form */}
                      {editingStop === i && (
                        <div className="space-y-3 pt-3 border-t border-gray-200">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs font-semibold text-gray-600 block mb-1">Weeks</label>
                              <input
                                type="number"
                                min={1}
                                max={52}
                                value={stop.weeks}
                                onChange={(e) => updateStop(i, { weeks: Math.max(1, Math.min(52, Number(e.target.value)||1)), weeksEdited: true })}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sb-orange-300 focus:border-transparent"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-600 block mb-1">Places (comma separated)</label>
                            <input
                              value={stop.highlights.places.join(', ')}
                              onChange={(e) => updateStop(i, { highlights: { ...stop.highlights, places: e.target.value.split(',').map(x => x.trim()).filter(Boolean) } })}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sb-orange-300 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-600 block mb-1">Accommodation</label>
                            <input
                              value={stop.highlights.accommodation}
                              onChange={(e) => updateStop(i, { highlights: { ...stop.highlights, accommodation: e.target.value } })}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sb-orange-300 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-600 block mb-1">Activities (comma separated)</label>
                            <input
                              value={stop.highlights.activities.join(', ')}
                              onChange={(e) => updateStop(i, { highlights: { ...stop.highlights, activities: e.target.value.split(',').map(x => x.trim()).filter(Boolean) } })}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sb-orange-300 focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-gray-600 block mb-1">Personal Notes</label>
                            <textarea
                              value={stop.highlights.notes}
                              onChange={(e) => updateStop(i, { highlights: { ...stop.highlights, notes: e.target.value } })}
                              placeholder={stop.highlights.notesHint}
                              rows={2}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-sb-orange-300 focus:border-transparent resize-none"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 justify-end pt-3 border-t border-gray-200">
                    <button
                      onClick={() => setDrawer({ open: true, stopIndex: i })}
                      className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 transition"
                    >
                      Change City
                    </button>
                    <button
                      onClick={() => setEditingStop(editingStop === i ? null : i)}
                      className="px-3 py-1.5 text-sm rounded-lg bg-sb-teal-500 text-white hover:bg-sb-teal-600 transition"
                    >
                      {editingStop === i ? 'Done' : 'Edit Details'}
                    </button>
                    <button
                      onClick={() => setState((s) => ({ ...s, stops: s.stops.filter((_, idx) => idx !== i) }))}
                      className="px-3 py-1.5 text-sm rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
            })}
          </div>
        </div>

        {/* Action Buttons - Enhanced */}
        <div className="relative bg-gradient-to-br from-white via-sb-beige-50/30 to-sb-orange-50/30 rounded-2xl shadow-xl border-2 border-white p-6 sm:p-8 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-sb-orange-200/30 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-sb-teal-200/30 to-transparent rounded-full blur-2xl"></div>
          
          <div className="relative text-center space-y-5">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-sb-teal-400 to-sb-teal-500 rounded-xl shadow-lg mb-2">
              <span className="text-2xl">🚀</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-sb-navy-700 mb-2">Ready to Make it Happen?</h3>
              <p className="text-sm text-sb-navy-600 max-w-md mx-auto">
                Save your route, chat with us to finalize details, or start fresh.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={() => {
                  setSavedSnapshot(JSON.stringify(state));
                  pushToast('✅ Route saved successfully!');
                }}
                className="group px-8 py-4 rounded-xl bg-gradient-to-r from-sb-orange-500 to-sb-orange-600 text-white font-bold text-base hover:from-sb-orange-600 hover:to-sb-orange-700 transition-all shadow-lg hover:shadow-2xl hover:scale-105 transform relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <span className="text-lg">💾</span>
                  Save My Route
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
              </button>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group px-8 py-4 rounded-xl bg-gradient-to-r from-sb-teal-500 to-sb-teal-600 text-white font-bold text-base hover:from-sb-teal-600 hover:to-sb-teal-700 transition-all shadow-lg hover:shadow-2xl hover:scale-105 transform text-center relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <span className="text-lg">💬</span>
                  Chat on WhatsApp
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
              </a>
              <Link
                href="/route-builder"
                className="px-8 py-4 rounded-xl border-2 border-gray-300 text-sb-navy-700 font-bold text-base hover:border-sb-orange-400 hover:bg-white transition-all text-center hover:scale-105 transform bg-white/50 backdrop-blur-sm"
              >
                <span className="flex items-center justify-center gap-2">
                  <span className="text-lg">🔄</span>
                  Start Over
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Swap City Drawer */}
      <RightDrawer
        title="Choose a Different City"
        open={drawer.open}
        onClose={() => setDrawer({ open: false, stopIndex: null })}
      >
        <div className="space-y-3">
          {CITY_PRESETS[region].map((preset) => (
            <button
              key={preset.city}
              onClick={() => {
                if (drawer.stopIndex !== null) replaceStopWithPreset(drawer.stopIndex, preset);
                setDrawer({ open: false, stopIndex: null });
              }}
              className="group w-full text-left border-2 border-gray-200 rounded-xl p-4 hover:border-sb-orange-400 hover:shadow-xl transition-all duration-300 bg-white hover:bg-gradient-to-br hover:from-white hover:to-sb-orange-50/20 relative overflow-hidden"
            >
              {/* Decorative element */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-sb-teal-100/0 to-sb-teal-100/30 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{preset.flag}</span>
                    <div>
                      <div className="font-bold text-lg text-sb-navy-700 group-hover:text-sb-orange-700 transition">
                        {preset.city}
                      </div>
                      <div className="text-xs text-gray-500">{preset.country}</div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {preset.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className={`px-2 py-1 text-xs font-medium rounded-full border ${tagClass(tag)} shadow-sm`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="px-2 py-0.5 bg-sb-orange-50 rounded-full border border-sb-orange-200 font-semibold">
                      {coins(preset.budgetCoins)}
                    </span>
                    <span>•</span>
                    <span>{preset.highlights.activities.slice(0, 2).join(' • ')}</span>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-sb-orange-500 flex items-center justify-center transition-colors shadow-sm">
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-white transition" />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </RightDrawer>
    </div>
  );
}
