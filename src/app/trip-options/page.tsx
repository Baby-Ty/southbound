"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  CalendarClock,
  MapPin,
  Building2,
  Sparkles,
  X,
  Plus,
  Wallet,
  Filter,
  Search
} from "lucide-react";
import { CITY_PRESETS, REGION_HUBS, RegionKey, CityPreset } from "@/lib/cityPresets";
import EnhancedCityCard, { StopPlan } from "@/components/RouteBuilder/EnhancedCityCard";

const WHATSAPP_URL = "https://wa.me/27872500972?text=Hi%2C%20I%27m%20ready%20to%20plan%20my%20route%20with%20South%20Bound.";

type DurationOpt = "2-4" | "4-8" | "8-12" | "custom";

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

function makeStopFromPreset(p: CityPreset, idx: number, idSuffix?: string): StopPlan {
  return {
    id: `${p.city}-${idx}-${idSuffix || Math.random().toString(36).slice(2, 7)}`,
    city: p.city,
    country: p.country,
    weeks: 4,
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
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl overflow-hidden flex flex-col animate-slide-left">
        <div className="flex-shrink-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sb-teal-400 to-sb-teal-500 flex items-center justify-center shadow-md text-white">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-sb-navy-700">{title}</h3>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 rounded-lg hover:bg-gray-100 transition group"
            >
              <X className="h-5 w-5 text-gray-500 group-hover:text-gray-700 transition" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function TripOptionsPage() {
  const region = useInitialRegion();

  // Fix hydration mismatch by using deterministic initial state
  const [state, setState] = useState<PlannerState>(() => {
    // Pick first 3 presets deterministically for server/client match
    const presets = CITY_PRESETS[region].slice(0, 3);
    return {
      region,
      base: REGION_HUBS[region][0],
      workNeeds: [],
      vibes: [],
      duration: "2-4",
      stops: presets.map((p, i) => makeStopFromPreset(p, i, "init")),
    };
  });

  const [savedSnapshot, setSavedSnapshot] = useState<string>("");
  const [toasts, setToasts] = useState<string[]>([]);
  const [drawer, setDrawer] = useState<{ open: boolean; stopIndex: number | null }>({ open: false, stopIndex: null });
  const [editingStop, setEditingStop] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  // Handle mounting and initial shuffle/load
  useEffect(() => {
    setIsMounted(true);
    const raw = localStorage.getItem(STORAGE_KEY);
    
    if (raw) {
      try {
        const parsed: PlannerState = JSON.parse(raw);
        if (parsed.region === region) {
          setState(parsed);
          setSavedSnapshot(JSON.stringify(parsed));
          return;
        }
      } catch {}
    }

    // If no valid saved state, we can do a random shuffle now that we are client-side
    // This avoids hydration mismatch
    const allPresets = [...CITY_PRESETS[region]];
    // Simple deterministic shuffle for first render wasn't random, now we randomize
    const shuffled = allPresets.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);
    
    setState(prev => ({
      ...prev,
      stops: selected.map((p, i) => makeStopFromPreset(p, i))
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [region]);

  // autosave
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isMounted]);

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
    
    if (!savedSnapshot) { // Only apply if not loaded from save
      const vibes = Array.from(new Set(lifestyleParam.map((k) => vibeMap[k]).filter((v): v is string => !!v)));
      const workNeeds = Array.from(new Set(workParam.map((k) => workMap[k]).filter((v): v is string => !!v)));
      if (vibes.length || workNeeds.length) {
        setState((s) => ({ ...s, vibes, workNeeds }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedSnapshot]);

  function pushToast(msg: string) {
    setToasts((t) => [...t, msg]);
    setTimeout(() => setToasts((t) => t.slice(1)), 3000);
  }

  function replaceStopWithPreset(i: number, p: CityPreset) {
    setState((s) => {
      const current = s.stops[i];
      const next = makeStopFromPreset(p, i);
      next.highlights.notes = current.highlights.notes || "";
      next.weeks = current.weeksEdited ? current.weeks : 4;
      next.weeksEdited = current.weeksEdited;
      return { ...s, stops: s.stops.map((st, idx) => (idx === i ? next : st)) };
    });
    pushToast(`Updated to ${p.city}`);
  }

  function addStop(p: CityPreset) {
    setState((s) => ({
      ...s,
      stops: [...s.stops, makeStopFromPreset(p, s.stops.length)]
    }));
    pushToast(`Added ${p.city} to route`);
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

  // Calculate totals
  const totalWeeks = state.stops.reduce((acc, stop) => acc + stop.weeks, 0);
  const estimatedMonthlyCost = state.stops.reduce((acc, stop) => {
    const preset = CITY_PRESETS[region].find(c => c.city === stop.city);
    if (!preset) return acc;
    // Extract lower bound of monthly cost for estimation
    const costStr = preset.costs.monthlyTotal.replace(/[^0-9-]/g, '').split('-')[0];
    return acc + (parseInt(costStr) || 1500);
  }, 0) / (state.stops.length || 1);

  const filteredCityPresets = CITY_PRESETS[region].filter(p => 
    p.city.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Prevent hydration mismatch by rendering loading state or deterministic state first
  // But since we initialized state deterministically, we can render immediately.
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-sb-beige-50 to-sb-teal-50 pb-20">
      <Toasts toasts={toasts} onClose={(i) => setToasts((t) => t.filter((_, idx) => idx !== i))} />

      {/* Minimal Progress Bar */}
      <div className="bg-gradient-to-r from-sb-orange-400 to-sb-orange-500 h-1"></div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        
        {/* Header */}
        <div className="relative text-center space-y-3">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-gradient-to-br from-sb-orange-200/30 to-sb-teal-200/30 rounded-full blur-3xl -z-10"></div>
          <h1 className="text-3xl sm:text-4xl font-bold text-sb-navy-700">
            Your {regionName} Adventure
          </h1>
          <p className="text-base text-sb-navy-500 max-w-2xl mx-auto">
            Drag to reorder, customize your stay, or swap cities to build your perfect journey.
          </p>
        </div>

        {/* Quick Overview Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 relative overflow-hidden">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">
                <MapPin className="w-4 h-4" /> Region
              </div>
              <div className="text-lg font-bold text-sb-navy-700">{regionName}</div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">
                <CalendarClock className="w-4 h-4" /> Total Duration
              </div>
              <div className="text-lg font-bold text-sb-navy-700">{totalWeeks} weeks</div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">
                <Building2 className="w-4 h-4" /> Cities
              </div>
              <div className="text-lg font-bold text-sb-navy-700">{state.stops.length} stops</div>
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">
                <Wallet className="w-4 h-4" /> Est. Monthly
              </div>
              <div className="text-lg font-bold text-sb-navy-700">~${Math.round(estimatedMonthlyCost).toLocaleString()}</div>
            </div>
          </div>

          {state.vibes.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-sb-orange-500" />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Your Vibe Matches</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {state.vibes.map((v) => (
                  <span key={v} className="px-3 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-100">
                    {v}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Itinerary Stream */}
        <div className="space-y-8">
          <div className="relative flex items-center justify-between">
            <h2 className="text-2xl font-bold text-sb-navy-700 flex items-center gap-2">
              <span className="text-3xl">🗺️</span> Your Route
            </h2>
            <button
              onClick={() => setDrawer({ open: true, stopIndex: null })}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-sb-navy-700 text-white font-medium text-sm hover:bg-sb-navy-800 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              Add Stop
            </button>
          </div>

          {/* Vertical Connector Line */}
          <div className="relative">
            <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-sb-orange-300 via-sb-teal-300 to-gray-200 -z-10 md:left-10"></div>

            <div className="space-y-8">
              {state.stops.map((stop, i) => {
                const cityPreset = CITY_PRESETS[region].find(c => c.city === stop.city);
                return (
                  <div
                    key={stop.id}
                    draggable
                    onDragStart={() => (dragIndex.current = i)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (dragIndex.current !== null && dragIndex.current !== i) onDragSwap(dragIndex.current, i);
                      dragIndex.current = null;
                    }}
                  >
                    <EnhancedCityCard
                      stop={stop}
                      cityPreset={cityPreset}
                      index={i}
                      isEditing={editingStop === i}
                      onEdit={() => setEditingStop(i)}
                      onStopEdit={() => setEditingStop(null)}
                      onRemove={() => setState((s) => ({ ...s, stops: s.stops.filter((_, idx) => idx !== i) }))}
                      onSwap={() => setDrawer({ open: true, stopIndex: i })}
                      onUpdate={(patch) => updateStop(i, patch)}
                      dragHandleProps={{}}
                    />
                  </div>
                );
              })}

              {/* Add Button at bottom of list */}
              <button
                onClick={() => setDrawer({ open: true, stopIndex: null })}
                className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 font-medium hover:border-sb-teal-400 hover:text-sb-teal-600 hover:bg-white/50 transition-all flex items-center justify-center gap-2 group"
              >
                <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-sb-teal-100 flex items-center justify-center transition-colors">
                  <Plus className="w-5 h-5" />
                </div>
                Add another destination
              </button>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="relative bg-gradient-to-br from-sb-navy-800 to-sb-navy-900 rounded-3xl shadow-2xl p-8 overflow-hidden text-center text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sb-teal-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-sb-orange-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-4">Ready to start your journey?</h3>
            <p className="text-gray-300 mb-8 max-w-lg mx-auto">
              Save this itinerary or chat with our team to customize the details, book accommodations, and get ready for takeoff.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setSavedSnapshot(JSON.stringify(state));
                  pushToast('✅ Route saved successfully!');
                }}
                className="px-8 py-4 rounded-xl bg-white text-sb-navy-900 font-bold hover:bg-gray-100 transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                <span>💾</span> Save Route
              </button>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-xl bg-sb-teal-500 text-white font-bold hover:bg-sb-teal-600 transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                <span>💬</span> Chat on WhatsApp
              </a>
            </div>
            <div className="mt-6">
              <Link href="/route-builder" className="text-sm text-gray-400 hover:text-white transition-colors underline">
                Start over with a new region
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* City Selection Drawer */}
      <RightDrawer
        title={drawer.stopIndex !== null ? "Swap City" : "Add City"}
        open={drawer.open}
        onClose={() => setDrawer({ open: false, stopIndex: null })}
      >
        <div className="sticky top-0 bg-gray-50 pb-4 z-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search cities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-sb-teal-400 focus:border-transparent bg-white shadow-sm"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filteredCityPresets.map((preset) => (
            <button
              key={preset.city}
              onClick={() => {
                if (drawer.stopIndex !== null) {
                  replaceStopWithPreset(drawer.stopIndex, preset);
                } else {
                  addStop(preset);
                }
                setDrawer({ open: false, stopIndex: null });
              }}
              className="group w-full text-left bg-white border border-gray-200 rounded-xl p-4 hover:border-sb-teal-400 hover:shadow-md transition-all relative overflow-hidden"
            >
              <div className="flex items-start gap-3 relative z-10">
                <div 
                  className="w-16 h-16 rounded-lg bg-gray-100 bg-cover bg-center flex-shrink-0"
                  style={{ backgroundImage: `url(${preset.imageUrl})` }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-gray-900 flex items-center gap-2">
                        {preset.city} <span className="text-lg">{preset.flag}</span>
                      </div>
                      <div className="text-xs text-gray-500">{preset.country}</div>
                    </div>
                    <div className="text-xs font-bold text-sb-teal-600 bg-sb-teal-50 px-2 py-1 rounded-lg">
                      {preset.weather.avgTemp}
                    </div>
                  </div>
                  
                  <div className="mt-2 flex flex-wrap gap-1">
                    {preset.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded border border-gray-100 bg-gray-50 text-gray-600 uppercase tracking-wide">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                    <Wallet className="w-3 h-3" />
                    {preset.costs.monthlyTotal}
                  </div>
                </div>
              </div>
            </button>
          ))}
          
          {filteredCityPresets.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No cities found matching "{searchTerm}"
            </div>
          )}
        </div>
      </RightDrawer>
    </div>
  );
}
