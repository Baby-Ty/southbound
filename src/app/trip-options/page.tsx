"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CalendarClock,
  Laptop,
  MapPin,
  Building2,
  Sparkles,
  GripVertical,
  ArrowLeftRight,
  Trash2,
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
  const params = useSearchParams();
  const r = (params.get("region") || "latin-america") as string;
  if (r === "europe" || r === "latin-america" || r === "southeast-asia") return r;
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
        <div key={i} className="bg-sb-navy-700 text-white text-sm px-3 py-2 rounded-lg shadow-medium flex items-center gap-2">
          <span>{t}</span>
          <button onClick={() => onClose(i)} className="ml-1 opacity-80 hover:opacity-100">✕</button>
        </div>
      ))}
    </div>
  );
}

function Chip({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 rounded-full text-xs border transition ${
        active ? "bg-sb-teal-100 border-sb-teal-300 text-sb-navy-800" : "bg-white border-gray-200 text-sb-navy-700 hover:bg-gray-50"
      }`}
    >
      {label}
    </button>
  );
}

function BaseSelector({ region, base, onChange }: { region: RegionKey; base: string; onChange: (v: string) => void }) {
  const [q, setQ] = useState("");
  const hubs = REGION_HUBS[region];
  const filtered = hubs.filter((h) => h.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="space-y-2">
      <div className="text-xs text-sb-navy-500">Pick your home base</div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search hubs"
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sb-orange-200"
      />
      <div className="flex flex-wrap gap-2">
        {(q ? filtered : hubs).map((h) => (
          <Chip key={h} label={h} active={base === h} onClick={() => onChange(h)} />
        ))}
      </div>
    </div>
  );
}

function MultiChips({ label, options, values, onToggle }: { label: string; options: readonly string[]; values: string[]; onToggle: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <div className="text-xs text-sb-navy-500">{label}</div>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <Chip key={o} label={o} active={values.includes(o)} onClick={() => onToggle(o)} />
        ))}
      </div>
    </div>
  );
}

function DurationPicker({ value, onChange }: { value: DurationOpt; onChange: (v: DurationOpt) => void }) {
  const opts: { v: DurationOpt; label: string }[] = [
    { v: "2-4", label: "2–4 months" },
    { v: "4-8", label: "4–8 months" },
    { v: "8-12", label: "8–12 months" },
    { v: "custom", label: "Custom dates" },
  ];
  return (
    <div className="space-y-2">
      <div className="text-xs text-sb-navy-500">Duration</div>
      <div className="flex flex-wrap gap-2">
        {opts.map((o) => (
          <button
            key={o.v}
            onClick={() => onChange(o.v)}
            className={`px-3 py-1.5 rounded-full text-xs border ${value === o.v ? "bg-sb-orange-100 border-sb-orange-300" : "bg-white border-gray-200"}`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function RightDrawer({ title, open, onClose, children }: { title: string; open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-large border-l border-gray-200 p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold text-sb-navy-700">{title}</div>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-50"><X className="h-4 w-4" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function SaveBar({ dirty, onSave, onContinue }: { dirty: boolean; onSave: () => void; onContinue: () => void }) {
  if (!dirty) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40">
      <div className="mx-auto max-w-5xl px-4 pb-4">
        <div className="rounded-2xl shadow-medium border border-gray-200 p-3 bg-white/90 backdrop-blur-sm flex items-center justify-between animate-slide-up">
          <div className="text-sb-navy-700 text-sm font-medium">💾 You have unsaved changes</div>
          <div className="flex gap-2">
            <button onClick={onSave} className="px-4 py-2 rounded-full bg-sb-orange-500 text-white text-sm font-semibold hover:bg-sb-orange-600">Save My Route</button>
            <button onClick={onContinue} className="px-4 py-2 rounded-full border-2 border-gray-300 text-sm text-sb-navy-700 hover:bg-gray-50">Continue</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SignInModal({ open, onClose, onDone }: { open: boolean; onClose: () => void; onDone: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-large w-full max-w-md p-5 space-y-3">
          <div className="text-lg font-semibold text-sb-navy-700">Sign in to keep your route</div>
          <button className="w-full px-4 py-2 rounded-lg bg-sb-navy-700 text-white">Continue with Google</button>
          <button className="w-full px-4 py-2 rounded-lg border border-gray-300">Email</button>
          <button className="w-full px-4 py-2 rounded-lg border border-gray-300">Phone (one-time code)</button>
          <div className="text-xs text-sb-navy-500">We’ll save changes to your account.</div>
          <div className="flex justify-end pt-1">
            <button onClick={() => { onDone(); onClose(); }} className="text-sm px-3 py-1.5 rounded-md bg-sb-orange-500 text-white">Done</button>
          </div>
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
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [signInOpen, setSignInOpen] = useState(false);
  const [editing, setEditing] = useState<{ base: boolean; work: boolean; vibe: boolean; duration: boolean }>({ base: false, work: false, vibe: false, duration: false });

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

  // Preselect from query (builder) once on first load if no saved state
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lifestyleParam = (params.get("lifestyle") || "").split(",").filter(Boolean);
    const workParam = (params.get("work") || "").split(",").filter(Boolean);
    // map to our chip labels
    const vibeMap: Record<string, string> = {
      foodie: "Food",
      beach: "Beach",
      culture: "Culture",
      nightlife: "Nightlife",
      nature: "Nature",
      fitness: "Wellness",
      quiet: "City walks",
      surf: "Surf",
    };
    const workMap: Record<string, string> = {
      "fast-internet": "Fast internet",
      "quiet-workspace": "Quiet workspace",
      "frequent-calls": "Phone calls",
      "second-screen": "Second screen",
      coworking: "Co-working",
      "private-office": "Private desk",
      "flexible-schedule": "Flexible schedule",
      community: "Co-working",
      "backup-power": "Backup power",
    };
    if (savedSnapshot === JSON.stringify(initialDefault)) {
      const vibes = Array.from(new Set(lifestyleParam.map((k) => vibeMap[k]).filter((v): v is string => !!v)));
      const workNeeds = Array.from(new Set(workParam.map((k) => workMap[k]).filter((v): v is string => !!v)));
      if (vibes.length || workNeeds.length) {
        setState((s) => ({ ...s, vibes: vibes, workNeeds: workNeeds }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dirty = JSON.stringify(state) !== savedSnapshot;
  const gradient = useMemo(() => {
    switch (region) {
      case "europe":
        return regionThemeClasses("europe");
      case "southeast-asia":
        return regionThemeClasses("asia");
      default:
        return regionThemeClasses("latin");
    }
  }, [region]);

  function pushToast(msg: string) {
    setToasts((t) => [...t, msg]);
    setTimeout(() => setToasts((t) => t.slice(1)), 2500);
  }

  function tagClass(tag: string) {
    const t = tag.toLowerCase();
    if (/(beach|coast|island|surf|tropical|nature|hiking)/.test(t)) return 'bg-sb-mint-100 text-sb-navy-700 border-sb-mint-200';
    if (/(food|tapas|wine|nightlife|festivals|design|culture|city)/.test(t)) return 'bg-sb-orange-100 text-sb-orange-800 border-sb-orange-200';
    return 'bg-white text-sb-navy-700 border-gray-200';
  }

  function accentTopBorder() {
    if (region === 'europe') return 'border-t-4 border-sb-navy-300';
    if (region === 'southeast-asia') return 'border-t-4 border-sb-mint-300';
    return 'border-t-4 border-sb-orange-300';
  }

  function toggleWorkNeed(v: string) {
    setState((s) => ({ ...s, workNeeds: s.workNeeds.includes(v) ? s.workNeeds.filter((x) => x !== v) : [...s.workNeeds, v] }));
  }
  function toggleVibe(v: string) {
    setState((s) => ({ ...s, vibes: s.vibes.includes(v) ? s.vibes.filter((x) => x !== v) : [...s.vibes, v] }));
  }

  function updateStop(i: number, patch: Partial<StopPlan>) {
    setState((s) => ({ ...s, stops: s.stops.map((st, idx) => (idx === i ? { ...st, ...patch } : st)) }));
  }

  function replaceStopWithPreset(i: number, p: CityPreset) {
    setState((s) => {
      const current = s.stops[i];
      const next = makeStopFromPreset(p, i);
      // keep notes
      next.highlights.notes = current.highlights.notes || "";
      // weeks: keep if edited, else default 6
      next.weeks = current.weeksEdited ? current.weeks : 6;
      next.weeksEdited = current.weeksEdited;
      const stops = s.stops.map((st, idx) => (idx === i ? next : st));
      return { ...s, stops };
    });
    pushToast(`Updated highlights for ${p.city}. Your notes were kept.`);
  }

  function onDragSwap(from: number, to: number) {
    setState((s) => {
      const arr = [...s.stops];
      const [m] = arr.splice(from, 1);
      arr.splice(to, 0, m);
      return { ...s, stops: arr };
    });
    pushToast("Reordered");
  }

  // Drag helpers
  const dragIndex = useRef<number | null>(null);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradient} pb-24`}>
      <Toasts toasts={toasts} onClose={(i) => setToasts((t) => t.filter((_, idx) => idx !== i))} />

      <div className="border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-sb-navy-700">You're all set — here’s your route preview</h1>
          <p className="text-sb-navy-600 text-sm">Friendly, editable plan. Keep it tight above the fold.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-5 grid grid-cols-1 gap-5">
        {/* Overview (readable) with per‑section edit toggles */}
        <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-lg font-bold text-sb-navy-700">Your Route Preview</div>
              <div className="text-sb-navy-600 text-sm">Built around your preferences: {region === 'latin-america' ? 'Latin America' : region === 'europe' ? 'Europe' : 'Southeast Asia'}, lifestyle picks, and a work‑ready setup.</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Left: Region, Base, Duration */}
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-sb-beige-50 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-sb-orange-600" /><div className="text-xs uppercase text-sb-navy-500">Region</div></div>
                </div>
                <div className="font-semibold text-sb-navy-700">{region === 'latin-america' ? 'Latin America' : region === 'europe' ? 'Europe' : 'Southeast Asia'}</div>
              </div>
              <div className="p-3 rounded-xl bg-sb-beige-50 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><Building2 className="h-4 w-4 text-sb-teal-700" /><div className="text-xs uppercase text-sb-navy-500">Base</div></div>
                  <button className="text-xs text-sb-navy-600 hover:underline" onClick={() => setEditing((e) => { const next = { ...e, base: !e.base }; if(e.base) pushToast('Saved'); return next; })}>{editing.base ? 'Done' : 'Edit'}</button>
                </div>
                <div className="font-semibold text-sb-navy-700 mb-2">{state.base}</div>
                {editing.base && (
                  <BaseSelector region={state.region} base={state.base} onChange={(v) => setState((s) => ({ ...s, base: v }))} />
                )}
              </div>
              <div className="p-3 rounded-xl bg-sb-beige-50 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><CalendarClock className="h-4 w-4 text-sb-orange-600" /><div className="text-xs uppercase text-sb-navy-500">Duration</div></div>
                  <button className="text-xs text-sb-navy-600 hover:underline" onClick={() => setEditing((e) => { const next = { ...e, duration: !e.duration }; if(e.duration) pushToast('Saved'); return next; })}>{editing.duration ? 'Done' : 'Edit'}</button>
                </div>
                <div className="font-semibold text-sb-navy-700 mt-1">
                  {state.duration === '2-4' && '2–4 months'}
                  {state.duration === '4-8' && '4–8 months'}
                  {state.duration === '8-12' && '8–12 months'}
                  {state.duration === 'custom' && `${state.customStart || 'Start'} → ${state.customEnd || 'End'}`}
                </div>
                {editing.duration && (
                  <div className="mt-2">
                    <DurationPicker value={state.duration} onChange={(v) => setState((s) => ({ ...s, duration: v }))} />
                    {state.duration === 'custom' && (
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        <input type="date" value={state.customStart || ''} onChange={(e) => setState((s) => ({ ...s, customStart: e.target.value }))} className="border border-gray-200 rounded-lg px-2 py-1 text-sm" />
                        <input type="date" value={state.customEnd || ''} onChange={(e) => setState((s) => ({ ...s, customEnd: e.target.value }))} className="border border-gray-200 rounded-lg px-2 py-1 text-sm" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Work setup, Vibe, Needs */}
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-sb-beige-50 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><Laptop className="h-4 w-4 text-sb-teal-700" /><div className="text-xs uppercase text-sb-navy-500">Work setup</div></div>
                  <button className="text-xs text-sb-navy-600 hover:underline" onClick={() => setEditing((e) => { const next = { ...e, work: !e.work }; if(e.work) pushToast('Saved'); return next; })}>{editing.work ? 'Done' : 'Edit'}</button>
                </div>
                <div className="text-sb-navy-700 text-sm">{ITINERARIES[region].workSetupSummary}</div>
                {editing.work && (
                  <div className="mt-2">
                    <MultiChips label="Choose what you need to work" options={WORK_NEEDS} values={state.workNeeds} onToggle={toggleWorkNeed} />
                  </div>
                )}
              </div>
              <div className="p-3 rounded-xl bg-sb-beige-50 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-sb-orange-600" /><div className="text-xs uppercase text-sb-navy-500">Vibe</div></div>
                  <button className="text-xs text-sb-navy-600 hover:underline" onClick={() => setEditing((e) => { const next = { ...e, vibe: !e.vibe }; if(e.vibe) pushToast('Saved'); return next; })}>{editing.vibe ? 'Done' : 'Edit'}</button>
                </div>
                <div className="text-sb-navy-700 text-sm">{state.vibes.slice(0,3).join(', ') || ITINERARIES[region].vibe}</div>
                {editing.vibe && (
                  <div className="mt-2">
                    <MultiChips label="What are you into" options={VIBES} values={state.vibes} onToggle={toggleVibe} />
                  </div>
                )}
                <div className="flex flex-wrap gap-1 mt-2">
                  {state.vibes.slice(0,6).map((v) => (
                    <span key={v} className={`px-2 py-0.5 rounded-full text-[11px] border ${tagClass(v)}`}>{v}</span>
                  ))}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-sb-beige-50 border border-gray-100">
                <div className="text-xs uppercase text-sb-navy-500 mb-1">Needs</div>
                <div className="flex flex-wrap gap-1">
                  {state.workNeeds.slice(0,6).map((w) => (
                    <span key={w} className={`px-2 py-0.5 rounded-full text-[11px] border ${tagClass(w)}`}>{w}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Buttons below overview */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button onClick={() => window.print()} className="px-4 py-2 rounded-full bg-sb-orange-500 text-white font-semibold hover:bg-sb-orange-600 transition">save to pdf</button>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-full bg-sb-teal-500 text-white font-semibold hover:bg-sb-teal-600 transition">chat on whatsapp</a>
            <button onClick={() => { localStorage.removeItem(STORAGE_KEY); setState(initialDefault); setSavedSnapshot(JSON.stringify(initialDefault)); }} className="px-4 py-2 rounded-full border-2 border-gray-300 text-sb-navy-700 hover:bg-gray-50 font-semibold">start over</button>
          </div>

        </div>

        {/* Itinerary Editor */}
        <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-4" id="itinerary">
          <div className="flex items-center justify-between mb-3">
            <div className="font-semibold text-sb-navy-700">Sample Itinerary</div>
            <div className="text-xs text-sb-navy-500">3–4 stops</div>
          </div>
          <ul className="space-y-3">
            {state.stops.map((st, i) => (
              <li
                key={st.id}
                className={`border border-gray-200 rounded-xl p-3 hover:shadow-medium transition ${accentTopBorder()}`}
                draggable
                onDragStart={() => (dragIndex.current = i)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragIndex.current !== null && dragIndex.current !== i) onDragSwap(dragIndex.current, i);
                  dragIndex.current = null;
                }}
              >
                <div className="flex items-start gap-3">
                  <GripVertical className="mt-1 h-4 w-4 text-sb-navy-400" />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="font-semibold text-sb-navy-700 text-sm"><span className="mr-1">{(CITY_PRESETS[region].find(c=>c.city===st.city)?.flag) || ''}</span>{st.city}, {st.country}</div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-sb-mint-100 border border-sb-mint-200">{st.weeks} weeks</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-sb-beige-50 border border-gray-200">{coins(st.budgetCoins)}</span>
                      <div className="flex flex-wrap gap-1">
                        {st.tags.slice(0, 3).map((t) => (
                          <span key={t} className={`text-[11px] px-2 py-0.5 rounded-full border ${tagClass(t)}`}>{t}</span>
                        ))}
                      </div>
                    </div>
                    {/* Highlights grouped with icons */}
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-4 gap-2">
                      <div className="md:col-span-1 p-2 rounded-lg bg-sb-beige-50 border border-gray-100">
                        <div className="text-[11px] text-sb-navy-500 mb-1 inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> Places</div>
                        <div className="text-sm text-sb-navy-700">{st.highlights.places.join(', ')}</div>
                      </div>
                      <div className="p-2 rounded-lg bg-sb-beige-50 border border-gray-100">
                        <div className="text-[11px] text-sb-navy-500 mb-1 inline-flex items-center gap-1"><Bed className="h-3 w-3" /> Accommodation</div>
                        <div className="text-sm text-sb-navy-700">{st.highlights.accommodation}</div>
                      </div>
                      <div className="p-2 rounded-lg bg-sb-beige-50 border border-gray-100">
                        <div className="text-[11px] text-sb-navy-500 mb-1 inline-flex items-center gap-1"><ListChecks className="h-3 w-3" /> Activities</div>
                        <div className="text-sm text-sb-navy-700">{st.highlights.activities.join(', ')}</div>
                      </div>
                      <div className="md:col-span-1 p-2 rounded-lg bg-sb-beige-50 border border-gray-100">
                        <div className="text-[11px] text-sb-navy-500 mb-1 inline-flex items-center gap-1"><StickyNote className="h-3 w-3" /> Notes</div>
                        <div className="text-sm text-sb-navy-700">{st.highlights.notes || st.highlights.notesHint || '—'}</div>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-3 justify-end text-xs">
                      <button onClick={() => setDrawer({ open: true, stopIndex: i })} className="px-2 py-1 rounded-md border border-gray-200 hover:bg-gray-50">Swap City</button>
                      <button onClick={() => setEditIndex(editIndex === i ? null : i)} className="px-2 py-1 rounded-md border border-gray-200 hover:bg-gray-50">{editIndex === i ? 'Done' : 'Edit Highlights'}</button>
                      <button onClick={() => { setState((s) => ({ ...s, stops: s.stops.filter((_, idx) => idx !== i) })); }} className="px-2 py-1 rounded-md border border-gray-200 hover:bg-gray-50 text-red-600">Remove Stop</button>
                    </div>
                    {editIndex === i && (
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-4 gap-2">
                        <div className="md:col-span-1">
                          <div className="text-[11px] text-sb-navy-500 mb-1">Weeks</div>
                          <input type="number" min={1} max={52} value={st.weeks}
                            onChange={(e) => updateStop(i, { weeks: Math.max(1, Math.min(52, Number(e.target.value)||1)), weeksEdited: true })}
                            className="w-24 border border-gray-200 rounded-lg px-2 py-1 text-sm" />
                        </div>
                        <div>
                          <div className="text-[11px] text-sb-navy-500 mb-1">Places</div>
                          <input
                            value={st.highlights.places.join(', ')}
                            onChange={(e) => updateStop(i, { highlights: { ...st.highlights, places: e.target.value.split(',').map((x) => x.trim()).filter(Boolean) } })}
                            className="w-full border border-gray-200 rounded-lg px-2 py-1 text-sm"
                            placeholder="Neighborhoods, areas"
                          />
                        </div>
                        <div>
                          <div className="text-[11px] text-sb-navy-500 mb-1">Accommodation</div>
                          <input
                            value={st.highlights.accommodation}
                            onChange={(e) => updateStop(i, { highlights: { ...st.highlights, accommodation: e.target.value } })}
                            className="w-full border border-gray-200 rounded-lg px-2 py-1 text-sm"
                            placeholder="Apartment, co-living, near cowork"
                          />
                        </div>
                        <div>
                          <div className="text-[11px] text-sb-navy-500 mb-1">Activities</div>
                          <input
                            value={st.highlights.activities.join(', ')}
                            onChange={(e) => updateStop(i, { highlights: { ...st.highlights, activities: e.target.value.split(',').map((x) => x.trim()).filter(Boolean) } })}
                            className="w-full border border-gray-200 rounded-lg px-2 py-1 text-sm"
                            placeholder="chips: surf, cowork, hikes"
                          />
                        </div>
                        <div className="md:col-span-4">
                          <div className="text-[11px] text-sb-navy-500 mb-1">Notes for our team</div>
                          <input
                            value={st.highlights.notes}
                            onChange={(e) => updateStop(i, { highlights: { ...st.highlights, notes: e.target.value } })}
                            className="w-full border border-gray-200 rounded-lg px-2 py-1 text-sm"
                            placeholder={st.highlights.notesHint || 'Any specifics for this stop'}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Friendly line */}
        <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-4">
          <p className="text-sb-navy-700 text-sm">We’ll make sure your stays are work‑ready, Wi‑Fi solid, and your days balanced between focus and fun.</p>
        </div>
      </div>

      <SaveBar dirty={dirty} onSave={() => setSignInOpen(true)} onContinue={() => setSignInOpen(true)} />
      <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} onDone={() => { setSavedSnapshot(JSON.stringify(state)); pushToast('Saved'); }} />

      {/* Swap Drawer */}
      <RightDrawer
        title="Switch this stop"
        open={drawer.open}
        onClose={() => setDrawer({ open: false, stopIndex: null })}
      >
        <div className="space-y-2">
          {CITY_PRESETS[region].map((p) => {
            const idx = drawer.stopIndex ?? 0;
            const prev = state.stops[idx - 1];
            const travelEase = prev && prev.country === p.country ? 'Short hop' : 'Direct flight likely';
            return (
              <button
                key={p.city}
                onClick={() => {
                  if (drawer.stopIndex !== null) replaceStopWithPreset(drawer.stopIndex, p);
                  setDrawer({ open: false, stopIndex: null });
                }}
                className="w-full text-left border border-gray-200 rounded-xl p-3 hover:bg-gray-50"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold text-sb-navy-700">{p.city} <span className="text-sb-navy-500">• {p.country}</span></div>
                    <div className="text-xs text-sb-navy-600">{p.tags.join(', ')}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white border">{coins(p.budgetCoins)}</span>
                      {p.highlights.activities.slice(0, 3).map((t) => (
                        <span key={t} className="text-[11px] px-2 py-0.5 rounded-full bg-sb-beige-50 border">{t}</span>
                      ))}
                      <span className="text-[11px] text-sb-navy-500">{travelEase}</span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-sb-navy-400" />
                </div>
              </button>
            );
          })}
        </div>
      </RightDrawer>
    </div>
  );
}
