"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CalendarClock,
  MapPin,
  Building2,
  Sparkles,
  X,
  Plus,
  Wallet,
  Filter,
  Search,
  Sun,
  Check,
  MoveRight,
  Coffee,
  Plane,
  Wifi,
  Home,
  Calendar,
  Map,
  Briefcase
} from "lucide-react";
import { REGION_HUBS, RegionKey, CityPreset } from "@/lib/cityPresets";
import { getCitiesForRegion, getCityIdByName } from "@/lib/cityData";
import { getAllCities, getCityByName, CityData } from "@/lib/cosmos-cities";
import { CITY_PRESETS } from "@/lib/cityPresets"; // Keep for fallback
import EnhancedCityCard, { StopPlan, HighlightItem } from "@/components/RouteBuilder/EnhancedCityCard";
import { EditStopModal } from "@/components/RouteBuilder/EditStopModal";
import SaveRouteModal from "@/components/RouteBuilder/SaveRouteModal";
import { getDefaultTripForSelection } from "@/lib/defaultTripsStorage";
import { getTemplateById, TripTemplate } from "@/lib/tripTemplates";
import { usdToZar } from "@/lib/currency";

const WHATSAPP_URL = "https://wa.me/27872500972?text=Hi%2C%20I%27m%20ready%20to%20plan%20my%20route%20with%20South%20Bound.";

type DurationOpt = "2-4" | "4-8" | "8-12" | "custom";

type PlannerState = {
  region: RegionKey;
  base: string;
  travelStyle?: string;
  workNeeds: string[];
  vibes: string[];
  duration: DurationOpt;
  customStart?: string;
  customEnd?: string;
  stops: StopPlan[];
  /**
   * Used to intentionally bust/ignore old saved routePlanner state when the
   * seeding logic or default trips mapping changes.
   */
  seedVersion?: string;
  /**
   * Signature of the default trip used to seed stops (when applicable).
   * If this changes, we should re-seed instead of reusing cached stops.
   */
  seedSignature?: string;
};

const STORAGE_KEY = "sb.routePlanner";

function TripOptionsContent() {
  const searchParams = useSearchParams();
  const regionParam = searchParams.get("region");
  const styleParam = searchParams.get("style") || "nomad";
  const seedVersion = searchParams.get("v") || "1";
  const templateParam = searchParams.get("template");
  
  const region: RegionKey = useMemo(() => {
    if (regionParam === "europe" || regionParam === "southeast-asia") return regionParam;
    return "latin-america";
  }, [regionParam]);

  // Fix hydration mismatch by using deterministic initial state
  const [state, setState] = useState<PlannerState>(() => {
    // Pick first 3 presets deterministically for server/client match
    // Use static data for initial render, will update from CosmosDB on mount
    const presets = (CITY_PRESETS[region] || []).slice(0, 3);
    return {
      region,
      base: (REGION_HUBS[region] || [])[0] || "Mexico City",
      travelStyle: styleParam,
      workNeeds: [],
      vibes: [],
      duration: "2-4",
      stops: presets.map((p, i) => makeStopFromPreset(p, i, "init")),
      seedVersion,
    };
  });

  const [savedSnapshot, setSavedSnapshot] = useState<string>("");
  const [toasts, setToasts] = useState<string[]>([]);
  const [drawer, setDrawer] = useState<{ open: boolean; stopIndex: number | null }>({ open: false, stopIndex: null });
  const [drawerMode, setDrawerMode] = useState<'add' | 'swap' | 'extend-country' | 'detours'>('add');
  const [drawerCountryFilter, setDrawerCountryFilter] = useState<string | null>(null);
  const [editingStop, setEditingStop] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [activeStopId, setActiveStopId] = useState<string>("");
  const [saveModalOpen, setSaveModalOpen] = useState(false);

  // Scroll spy for active stop
  useEffect(() => {
    if (!isMounted) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveStopId(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: "-10% 0px -10% 0px" }
    );

    state.stops.forEach((stop) => {
      if (!stop) return;
      const el = document.getElementById(stop.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [state.stops, isMounted]);

  // Handle mounting and initial shuffle/load
  useEffect(() => {
    let cancelled = false;

    async function init() {
      setIsMounted(true);
      const raw = localStorage.getItem(STORAGE_KEY);

      // Compute the current "default trip signature" (if any) so we can invalidate
      // stale cached planner state when admins change Default Trips.
      const adminTrip = getDefaultTripForSelection(region, styleParam);
      const adminTripSignature = adminTrip
        ? JSON.stringify({
            region: adminTrip.region,
            tier: adminTrip.budgetTier,
            enabled: adminTrip.enabled !== false,
            months: adminTrip.months,
          })
        : "";

      if (raw) {
        try {
          const parsed: PlannerState = JSON.parse(raw);

          // Migration for highlights.places being string[] (legacy support)
          if (parsed.stops) {
            parsed.stops.forEach((stop: any) => {
              if (stop.highlights && Array.isArray(stop.highlights.places)) {
                stop.highlights.places = stop.highlights.places.map((p: any) => {
                  if (typeof p === 'string') {
                    return { title: p, isCustom: false };
                  }
                  return p;
                });
              }
            });
          }

          // Only reuse saved state if region + style match (otherwise re-seed from defaults).
          const matchesSeedVersion = (parsed.seedVersion || "1") === seedVersion;
          const matchesAdminTrip =
            !adminTripSignature || (parsed.seedSignature || "") === adminTripSignature;

          if (
            parsed.region === region &&
            (parsed.travelStyle || "nomad") === styleParam &&
            matchesSeedVersion &&
            matchesAdminTrip
          ) {
            if (!cancelled) {
              setState(parsed);
              setSavedSnapshot(JSON.stringify(parsed));
            }
            return;
          }
        } catch {}
      }

      // NEW: If template param exists (v3+), seed from template preset cities
      if (templateParam && seedVersion === "3") {
        const template = await getTemplateById(region, templateParam).catch(() => {
          // Fallback to sync version if async fails
          const { getTemplateByIdSync } = require('@/lib/tripTemplates');
          return getTemplateByIdSync(region, templateParam);
        });
        if (template) {
          const regionPresets =
            (await getCitiesForRegion(region).catch(() => null)) || (CITY_PRESETS[region] || []);
          
          const selectedStops = template.presetCities
            .map((cityName, i) => {
              const preset =
                regionPresets.find((p) => p.city.toLowerCase() === cityName.toLowerCase()) ||
                regionPresets.find((p) => p.city.toLowerCase().includes(cityName.toLowerCase()));
              if (!preset) return null;
              const stop = makeStopFromPreset(preset, i);
              stop.weeks = 4; // 1 month per city
              stop.weeksEdited = true;
              return stop;
            })
            .filter(Boolean);

          if (selectedStops.length) {
            if (!cancelled) {
              setState((prev) => ({
                ...prev,
                travelStyle: styleParam,
                base: selectedStops[0]?.city || prev.base,
                stops: selectedStops as any,
                seedVersion,
                seedSignature: JSON.stringify({ template: template.id, version: seedVersion }),
              }));
            }
            return;
          }
        }
      }

      // If no valid saved state, seed the route from the admin-configured Default Trip for (region + style).
      // Source of truth is localStorage set by /hub/default-trips (with seed fallback).
      if (adminTrip) {
        // Use live city list (Cosmos-backed) for matching, not the static presets.
        // This makes admin-selected cities actually seed correctly even if they
        // weren't part of the original hardcoded CITY_PRESETS list.
        const regionPresets =
          (await getCitiesForRegion(region).catch(() => null)) || (CITY_PRESETS[region] || []);
        const months = adminTrip.months;
        const orderedCities = [months.month1, months.month2, months.month3];

        const selectedStops = orderedCities
          .map((m, i) => {
            const cityName = (m?.city || "").trim();
            if (!cityName) return null;
            const preset =
              regionPresets.find((p) => p.city.toLowerCase() === cityName.toLowerCase()) ||
              regionPresets.find((p) => p.city.toLowerCase().includes(cityName.toLowerCase()));
            if (!preset) return null;
            const stop = makeStopFromPreset(preset, i);
            stop.weeks = 4;
            stop.weeksEdited = true;
            return stop;
          })
          .filter(Boolean);

        if (selectedStops.length) {
          if (!cancelled) {
            setState((prev) => ({
              ...prev,
              travelStyle: styleParam,
              base: selectedStops[0]?.city || prev.base,
              stops: selectedStops as any,
              seedVersion,
              seedSignature: adminTripSignature,
            }));
          }
          return;
        }
      }

      // Fallback (older server-managed default trips): keep this as a backup.
      try {
        const { apiUrl } = await import('@/lib/api');
        const res = await fetch(apiUrl(`default-trips?region=${encodeURIComponent(region)}&enabled=true`));
        if (res.ok) {
          const data = await res.json();
          const trips = Array.isArray(data.trips) ? (data.trips as any[]) : [];
          if (trips.length) {
            const trip = trips[0];
            const regionPresets = CITY_PRESETS[region] || [];
            const selectedStops = (trip.stops || [])
              .map((st: any, i: number) => {
                const preset = regionPresets.find((p) => p.city === st.city);
                if (!preset) return null;
                const stop = makeStopFromPreset(preset, i);
                if (typeof st.weeks === 'number' && st.weeks > 0) {
                  stop.weeks = st.weeks;
                  stop.weeksEdited = true;
                }
                return stop;
              })
              .filter(Boolean);

            if (selectedStops.length) {
              if (!cancelled) {
                setState((prev) => ({
                  ...prev,
                  travelStyle: styleParam,
                  stops: selectedStops as any,
                  seedVersion,
                  seedSignature: "", // seeded from server fallback, not admin mapping
                }));
              }
              return;
            }
          }
        }
      } catch {
        // ignore and fall back to random seed
      }

      // Fallback: random shuffle now that we are client-side (avoids hydration mismatch)
      const allPresets = [...(CITY_PRESETS[region] || [])];
      const shuffled = allPresets.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 3);

      if (!cancelled) {
        setState((prev) => ({
          ...prev,
          travelStyle: styleParam,
          stops: selected.map((p, i) => makeStopFromPreset(p, i)),
          seedVersion,
          seedSignature: "", // random seed
        }));
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, [region, styleParam, seedVersion, templateParam]);

  // autosave
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isMounted]);

  // Preselect from query
  useEffect(() => {
    const lifestyleParam = (searchParams.get("lifestyle") || "").split(",").filter(Boolean);
    const workParam = (searchParams.get("work") || "").split(",").filter(Boolean);
    
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
      next.highlights.notes = current?.highlights?.notes || "";
      next.weeks = current?.weeksEdited ? current.weeks : 4;
      next.weeksEdited = current?.weeksEdited;
      return { ...s, stops: s.stops.map((st, idx) => (idx === i ? next : st)) };
    });
    pushToast(`Updated to ${p.city}`);
  }

  function addStop(p: CityPreset, insertAfterIndex?: number) {
    setState((s) => {
      if (insertAfterIndex !== undefined && insertAfterIndex >= 0) {
        // Insert right after the specified index
        const newStops = [...s.stops];
        const newIndex = insertAfterIndex + 1;
        newStops.splice(newIndex, 0, makeStopFromPreset(p, newIndex));
        return { ...s, stops: newStops };
      } else {
        // Add to end (default behavior)
        return {
          ...s,
          stops: [...s.stops, makeStopFromPreset(p, s.stops.length)]
        };
      }
    });
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

  const [allCityPresets, setAllCityPresets] = useState<CityPreset[]>(CITY_PRESETS[region] || []);
  const [cityIdMap, setCityIdMap] = useState<Record<string, string>>({});
  const [cityDataMap, setCityDataMap] = useState<Record<string, CityData>>({});

  // Load cities from CosmosDB when component mounts or region changes
  useEffect(() => {
    async function loadCities() {
      try {
        const cities = await getCitiesForRegion(region);
        setAllCityPresets(cities);
        
        // Also load full city data for accommodation types, common prices, etc.
        const fullCities = await getAllCities(region);
        const dataMap: Record<string, CityData> = {};
        const idMap: Record<string, string> = {};
        
        for (const city of fullCities) {
          dataMap[city.city] = city;
          idMap[city.city] = city.id;
        }
        
        // Fallback: try to get IDs from cityData if not found
        for (const city of cities) {
          if (!idMap[city.city]) {
            const cityId = await getCityIdByName(city.city, region);
            if (cityId) {
              idMap[city.city] = cityId;
            }
          }
        }
        
        setCityDataMap(dataMap);
        setCityIdMap(idMap);
      } catch (error) {
        console.error('Failed to load cities:', error);
        // Keep using static presets as fallback
      }
    }
    loadCities();
    
    // Refresh cities periodically to pick up updates (every 30 seconds)
    const refreshInterval = setInterval(() => {
      loadCities();
    }, 30000);
    
    return () => clearInterval(refreshInterval);
  }, [region]);

  // Calculate totals
  const totalWeeks = (state.stops || []).reduce((acc, stop) => acc + (stop?.weeks || 0), 0);
  const estimatedMonthlyCost = (state.stops || []).reduce((acc, stop) => {
    if (!stop) return acc;
    const preset = allCityPresets.find(c => c.city === stop.city);
    if (!preset) return acc;
    // Extract lower bound of monthly cost for estimation
    const costStr = preset.costs.monthlyTotal.replace(/[^0-9-]/g, '').split('-')[0];
    return acc + (parseInt(costStr) || 1500);
  }, 0) / ((state.stops || []).length || 1);

  // Convert to RAND (18.5 ZAR = 1 USD for estimation)
  const EXCHANGE_RATE = 18.5;
  const estMonthlyRand = Math.round(estimatedMonthlyCost * EXCHANGE_RATE);

  const filteredCityPresets = allCityPresets.filter(p => {
    // Search filter
    const matchesSearch = p.city.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (!matchesSearch) return false;

    // Country filter (for extend-country mode)
    if (drawerMode === 'extend-country' && drawerCountryFilter) {
      if (p.country !== drawerCountryFilter) return false;
      // Only show main cities, not detours
      return !p.isDetour;
    }

    // Detours filter
    if (drawerMode === 'detours' && drawerCountryFilter) {
      if (!p.isDetour) return false;
      // Show detours in same country or nearby
      return p.country === drawerCountryFilter || p.nearbyCity?.includes(drawerCountryFilter);
    }

    return true;
  });

  // Prevent hydration mismatch by rendering loading state or deterministic state first
  // But since we initialized state deterministically, we can render immediately.
  
  return (
    <div className="min-h-screen bg-[#f6f3eb] pb-20 texture-paper relative overflow-x-hidden">
      <Toasts toasts={toasts} onClose={(i) => setToasts((t) => t.filter((_, idx) => idx !== i))} />
      
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-orange-50/80 to-transparent pointer-events-none z-0" />
      <div className="fixed top-40 -right-20 w-96 h-96 bg-sb-teal-200/20 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed bottom-20 -left-20 w-96 h-96 bg-sb-orange-200/20 rounded-full blur-3xl pointer-events-none z-0" />

      {/* Minimal Progress Bar */}
      <div className="bg-gradient-to-r from-sb-orange-400 to-sb-orange-500 h-1 relative z-20"></div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-12 space-y-10 relative z-10">
        
        {/* Header */}
        <div className="relative text-center space-y-6 mb-16">
          <div className="inline-block rotate-[-2deg] mb-2">
            <div className="bg-sb-orange-100 text-sb-orange-700 px-4 py-1 rounded-sm shadow-sm border border-sb-orange-200 font-handwritten text-xl transform hover:scale-105 transition-transform cursor-default">
              Customized just for you ✦
            </div>
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-bold text-sb-navy-700 tracking-tight leading-tight">
            Your <span className="relative inline-block">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-sb-teal-600 to-sb-orange-500">{regionName}</span>
              <span className="absolute -bottom-2 left-0 w-full h-3 bg-sb-orange-200/40 -skew-x-6 -z-10 rounded-sm"></span>
            </span> Adventure
          </h1>
          
          <p className="text-xl sm:text-2xl text-sb-navy-600/80 max-w-2xl mx-auto font-medium leading-relaxed font-serif">
            Morning coffees, afternoon work sprints, weekend waterfalls: here is your next 90 days.
          </p>
        </div>

        {/* Trip at a Glance - Scrapbook Style */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
            {/* Weather Stamp */}
            <div className="relative group rotate-[-2deg] hover:rotate-0 transition-all duration-300">
               <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 h-full flex flex-col items-center justify-center text-center texture-paper">
                 <div className="w-12 h-12 rounded-full border-2 border-orange-200 bg-orange-50 text-orange-500 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                   <Sun className="w-6 h-6" />
                 </div>
                 <div className="font-handwritten text-lg text-gray-500 mb-1">Forecast</div>
                 <div className="font-bold text-sb-navy-700 text-lg leading-none">Warm &<br/>Tropical</div>
                 {/* Tape effect */}
                 <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-yellow-100/80 rotate-1 shadow-sm"></div>
               </div>
            </div>

            {/* Internet Tag */}
            <div className="relative group rotate-[1deg] hover:rotate-0 transition-all duration-300 mt-4 md:mt-0">
               <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-l-sb-teal-400 border-y border-r border-gray-200 h-full flex flex-col items-center justify-center text-center">
                 <div className="w-12 h-12 rounded-xl bg-sb-teal-50 text-sb-teal-600 flex items-center justify-center mb-3 group-hover:rotate-12 transition-transform">
                   <Wifi className="w-6 h-6" />
                 </div>
                 <div className="font-handwritten text-lg text-gray-500 mb-1">Connectivity</div>
                 <div className="font-bold text-sb-navy-700 text-lg">Coworking<br/>Ready</div>
               </div>
            </div>

            {/* Vibe Polaroid */}
            <div className="relative group rotate-[-1deg] hover:rotate-0 transition-all duration-300">
               <div className="bg-white p-3 pb-8 shadow-md border border-gray-100 h-full flex flex-col items-center transform transition-transform">
                 <div className="w-full aspect-video bg-sb-teal-50 rounded-sm mb-3 flex items-center justify-center overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-sb-teal-100 to-sb-orange-50 opacity-50"></div>
                    <Sparkles className="w-8 h-8 text-sb-teal-400 relative z-10" />
                 </div>
                 <div className="font-handwritten text-xl text-sb-navy-700 rotate-[-1deg]">
                   {state.vibes.length > 0 ? state.vibes[0] : "Pure Vibes"}
                 </div>
               </div>
            </div>

            {/* Budget Note */}
            <div className="relative group rotate-[2deg] hover:rotate-0 transition-all duration-300 mt-4 md:mt-0">
               <div className="bg-[#fff9c4] p-4 rounded-sm shadow-sm h-full flex flex-col items-center justify-center text-center texture-paper">
                 <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-400/30 flex items-center justify-center mb-2 text-gray-600">
                   <Wallet className="w-5 h-5" />
                 </div>
                 <div className="font-handwritten text-lg text-gray-600 mb-1">Est. Monthly</div>
                 <div className="font-bold text-sb-navy-800 text-xl">~R{estMonthlyRand.toLocaleString()}</div>
                 {/* Pin */}
                 <div className="absolute -top-3 right-1/2 translate-x-1/2 w-4 h-4 rounded-full bg-red-400 shadow-sm border border-red-500/20"></div>
               </div>
            </div>
        </div>

        {/* Timeline Visualization - Organic Path */}
        <div className="mb-16 sticky top-4 z-30">
          <div className="bg-white/90 backdrop-blur-md border border-gray-200/50 shadow-xl shadow-sb-navy-700/5 rounded-full px-8 py-4 overflow-x-auto mx-auto max-w-4xl w-full scrollbar-hide ring-4 ring-white/50">
             <div className="flex items-center justify-center min-w-max gap-4">
               
               {/* Planning Node */}
               <div className="flex flex-col items-center gap-2 group cursor-default">
                  <div className="w-10 h-10 rounded-full bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 transition-colors group-hover:border-gray-400 group-hover:text-gray-500">
                     <Map className="w-5 h-5" />
                  </div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Planning</div>
               </div>

               {/* Organic Connector */}
               <div className="w-12 h-0.5 border-t-2 border-dashed border-gray-300" />

               {/* Start Date */}
               <div className="flex flex-col items-center gap-2">
                  <label className="relative cursor-pointer group">
                       <input 
                          type="date" 
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                          onChange={(e) => setState(s => ({...s, customStart: e.target.value}))}
                          value={state.customStart || ''}
                       />
                       <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all shadow-sm ${state.customStart ? 'bg-sb-teal-50 border-sb-teal-200 text-sb-teal-600' : 'bg-white border-gray-200 text-gray-400 group-hover:border-sb-teal-400 group-hover:text-sb-teal-500'}`}>
                          <Calendar className="w-5 h-5" />
                       </div>
                  </label>
                  <div className={`text-[11px] font-bold uppercase tracking-wider truncate max-w-[80px] transition-colors ${state.customStart ? 'text-sb-teal-700' : 'text-gray-400'}`}>
                      {state.customStart ? new Date(state.customStart).toLocaleDateString('en-US', {month: 'short', day: 'numeric'}) : 'Start Date'}
                  </div>
               </div>
               
               {/* Connector */}
               <div className="w-12 h-0.5 bg-gray-200 rounded-full" />

              {(state.stops || []).map((stop, i) => {
                if (!stop) return null;
                const isActive = stop.id === activeStopId || (i === 0 && !activeStopId);
                return (
                <div key={stop.id} className="flex items-center">
                  <button  
                    onClick={() => document.getElementById(stop.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                    className="flex flex-col items-center gap-2 cursor-pointer group relative"
                  >
                    <div className={`w-4 h-4 rounded-full border-2 transition-all duration-500 ${
                       isActive ? 'bg-sb-teal-500 border-sb-teal-500 scale-150 shadow-[0_0_0_4px_rgba(44,181,192,0.2)]' : 'bg-white border-gray-300 group-hover:border-sb-teal-400'
                    }`} />
                    <div className={`text-[11px] font-bold uppercase tracking-wider transition-colors ${
                      isActive ? 'text-sb-teal-700' : 'text-gray-400 group-hover:text-sb-teal-600'
                    }`}>
                      {stop.city}
                    </div>
                  </button>
                  
                  {/* Connector */}
                  <div className="w-14 h-0.5 bg-gray-200 mx-3 relative rounded-full overflow-hidden">
                     <div className={`absolute inset-0 bg-sb-teal-300 origin-left transition-transform duration-500 ${
                       isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`} />
                  </div>
                </div>
              )})}

               {/* Add Dest Button */}
               <button 
                  onClick={() => {
                    setDrawerMode('add');
                    setDrawerCountryFilter(null);
                    setDrawer({ open: true, stopIndex: null }); // null means add to end
                  }}
                  className="w-9 h-9 rounded-full bg-white border border-dashed border-gray-300 flex items-center justify-center hover:border-sb-teal-400 hover:text-sb-teal-600 hover:bg-sb-teal-50 transition-all group shadow-sm -ml-1"
                  title="Add Destination"
               >
                  <Plus className="w-5 h-5 text-gray-400 group-hover:text-sb-teal-600" />
               </button>

                {/* Connector */}
               <div className="w-12 h-0.5 bg-gray-200 mx-3 rounded-full" />

               {/* Home Node */}
               <div className="flex flex-col items-center gap-2 cursor-default opacity-60 hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center">
                      <Home className="w-5 h-5 text-gray-400" />
                  </div>
                   <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 truncate max-w-[60px]">
                     {state.customStart ? (() => {
                        const d = new Date(state.customStart);
                        d.setDate(d.getDate() + (totalWeeks * 7));
                        return d.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
                     })() : 'Home'}
                   </div>
               </div>

            </div>
          </div>
        </div>

        {/* Daily Rhythm Widget - Planner Style */}
        <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-gray-200 shadow-xl shadow-sb-navy-700/5 mb-16 texture-paper relative overflow-hidden">
          {/* Notebook spiral decoration could go here */}
          
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4 relative z-10">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-sb-navy-700 mb-3 font-serif">Your daily rhythm</h3>
              <p className="text-gray-500 text-lg">Optimized for <span className="font-bold text-sb-orange-600 font-handwritten text-xl">Adventure</span> & <span className="font-bold text-sb-teal-600 font-handwritten text-xl">Productivity</span></p>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide bg-sb-navy-50 text-sb-navy-600 px-4 py-2 rounded-full border border-sb-navy-100">
               <CalendarClock className="w-4 h-4" /> Timezone optimized
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {/* Morning */}
            <div className="group relative">
              <div className="absolute -left-4 top-0 bottom-0 w-0.5 bg-gray-100 hidden md:block"></div>
              <div className="mb-4 flex items-center gap-3">
                <div className="font-handwritten text-2xl text-sb-orange-500 font-bold">Mornings</div>
                <div className="h-px flex-1 bg-gray-200"></div>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm group-hover:shadow-md transition-all group-hover:-rotate-1">
                 <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-4">
                    <Coffee className="w-5 h-5" />
                 </div>
                 <p className="text-gray-600 leading-relaxed">Free time for gym sessions, exploring local cafes, or chasing waterfalls before the heat sets in.</p>
              </div>
            </div>
            
            {/* Work Block */}
            <div className="group relative">
               <div className="absolute -left-4 top-0 bottom-0 w-0.5 bg-gray-100 hidden md:block"></div>
               <div className="mb-4 flex items-center gap-3">
                <div className="font-handwritten text-2xl text-sb-navy-600 font-bold">13:00 - 21:00</div>
                <div className="h-px flex-1 bg-gray-200"></div>
              </div>
              <div className="bg-sb-navy-800 rounded-xl p-6 border border-sb-navy-700 shadow-lg relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                {/* Abstract tech pattern */}
                <div className="absolute inset-0 opacity-10 pattern-map-lines"></div>
                
                <div className="flex items-center justify-between mb-4 relative z-10">
                   <div className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2 text-xs font-bold text-white border border-white/10">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      DEEP WORK
                   </div>
                   <Wifi className="w-5 h-5 text-white/50" />
                </div>
                <p className="text-gray-300 leading-relaxed relative z-10 text-sm">Deep work block synced with your team. Productive, focused, and reliable internet.</p>
              </div>
            </div>

            {/* Evening */}
            <div className="group relative">
              <div className="absolute -left-4 top-0 bottom-0 w-0.5 bg-gray-100 hidden md:block"></div>
              <div className="mb-4 flex items-center gap-3">
                <div className="font-handwritten text-2xl text-sb-teal-600 font-bold">Evenings</div>
                <div className="h-px flex-1 bg-gray-200"></div>
              </div>
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm group-hover:shadow-md transition-all group-hover:rotate-1">
                 <div className="w-10 h-10 bg-sb-teal-50 rounded-full flex items-center justify-center text-sb-teal-600 mb-4">
                    <Sparkles className="w-5 h-5" />
                 </div>
                 <p className="text-gray-600 leading-relaxed">Sunsets on the beach, street food markets, and connecting with the nomad community.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Itinerary Stream */}
        <div className="space-y-16">
          <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div>
              <h2 className="text-4xl font-bold text-sb-navy-700 flex items-center justify-center sm:justify-start gap-4 font-serif">
                <span className="relative">
                  <span className="relative z-10">Your Route</span>
                  <svg className="absolute -bottom-2 -left-2 w-full h-3 text-sb-teal-300/50 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                  </svg>
                </span>
              </h2>
              <p className="text-gray-500 mt-2 font-handwritten text-lg rotate-[-1deg]">Drag and drop to reorder stops ✦</p>
            </div>
              <button
                onClick={() => {
                  setDrawerMode('add');
                  setDrawerCountryFilter(null);
                  setDrawer({ open: true, stopIndex: null }); // null means add to end
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-sb-navy-800 text-white font-bold text-sm hover:bg-sb-navy-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ring-4 ring-white/50"
              >
                <Plus className="w-4 h-4" />
                Add Destination
              </button>
          </div>

          <div className="relative">
            {/* Dotted path connecting everything */}
            <div className="absolute left-[50%] top-0 bottom-0 w-0.5 border-l-2 border-dashed border-gray-300 -translate-x-1/2 -z-10 hidden lg:block"></div>

            <div className="space-y-8">
              {(state.stops || []).map((stop, i) => {
                if (!stop) return null;
                // Find city preset - prioritize blob URLs if available
                const cityPreset = allCityPresets.find(c => c.city === stop.city);
                // If no preset found, try to get it from CosmosDB
                if (!cityPreset) {
                  console.warn(`City preset not found for: ${stop.city}`);
                }
                return (
                  <div key={stop.id}>
                    {i > 0 && (
                      <div className="py-6 flex flex-col items-center justify-center text-center">
                         {/* Dotted path animation could go here */}
                        <div className="h-10 w-0.5 border-l-2 border-dashed border-gray-300 mb-3"></div>
                        <div className="bg-white px-4 py-2 rounded-full border border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wide flex items-center gap-2 shadow-sm">
                          <Plane className="w-3 h-3 text-sb-teal-500" />
                          Flight to {stop.city}
                        </div>
                        <div className="h-10 w-0.5 border-l-2 border-dashed border-gray-300 mt-3"></div>
                      </div>
                    )}
                    <div
                      id={stop.id}
                      draggable
                      onDragStart={() => (dragIndex.current = i)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => {
                        if (dragIndex.current !== null && dragIndex.current !== i) onDragSwap(dragIndex.current, i);
                        dragIndex.current = null;
                      }}
                    >
                      <EnhancedCityCard
                        stop={{
                          ...stop,
                          highlights: {
                            ...stop.highlights,
                            places: (() => {
                              const places = stop.highlights.places;
                              // Type guard: check if first element is a string
                              if (Array.isArray(places) && places.length > 0) {
                                const first = places[0];
                                if (typeof first === 'string') {
                                  // Safe to cast after type guard - use unknown intermediate
                                  return (places as unknown as string[]).map((p: string): HighlightItem => ({ title: p }));
                                }
                              }
                              // Already HighlightItem[] or empty array
                              return places as HighlightItem[];
                            })()
                          }
                        }}
                        cityPreset={cityPreset}
                        cityData={cityDataMap[stop.city]}
                        cityId={cityIdMap[stop.city]}
                        index={i}
                        isEditing={editingStop === i}
                        onEdit={() => setEditingStop(i)}
                        onStopEdit={() => setEditingStop(null)}
                        onRemove={() => setState((s) => ({ ...s, stops: s.stops.filter((_, idx) => idx !== i) }))}
                        onSwap={() => {
                          setDrawerMode('swap');
                          setDrawerCountryFilter(null);
                          setDrawer({ open: true, stopIndex: i });
                        }}
                        onUpdate={(patch) => updateStop(i, patch)}
                        dragHandleProps={{}}
                      />
                    </div>

                    {/* Extend Country & Detours Buttons - Below card, above flight icon */}
                    {!stop.isDetour && (
                      <div className="pt-4 pb-2 px-5 flex gap-2 max-w-2xl mx-auto">
                        <button
                          onClick={() => {
                            setDrawerMode('extend-country');
                            setDrawerCountryFilter(stop.country);
                            setDrawer({ open: true, stopIndex: i }); // Pass current index so we can insert after it
                          }}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-sb-teal-50 border border-sb-teal-200 rounded-xl hover:bg-sb-teal-100 transition-all text-sm font-bold text-sb-teal-700 shadow-sm"
                        >
                          <Plus className="w-4 h-4" />
                          Extend {stop.country} +1 Month
                        </button>
                        
                        <button
                          onClick={() => {
                            setDrawerMode('detours');
                            setDrawerCountryFilter(stop.country);
                            setDrawer({ open: true, stopIndex: i }); // Pass current index so we can insert after it
                          }}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-sb-orange-50 border border-sb-orange-200 rounded-xl hover:bg-sb-orange-100 transition-all text-sm font-bold text-sb-orange-700 shadow-sm"
                        >
                          <MapPin className="w-4 h-4" />
                          Add Detour
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Edit Modal */}
              {editingStop !== null && state.stops[editingStop] && (
                <EditStopModal
                  stop={state.stops[editingStop]}
                  cityPreset={allCityPresets.find(c => c.city === state.stops[editingStop].city)}
                  onClose={() => setEditingStop(null)}
                  onUpdate={(patch) => updateStop(editingStop, patch)}
                />
              )}

              {/* Add Button at bottom of list */}
              <button
                onClick={() => {
                  setDrawerMode('add');
                  setDrawerCountryFilter(null);
                  setDrawer({ open: true, stopIndex: null }); // null means add to end
                }}
                className="w-full py-6 border-2 border-dashed border-gray-200 rounded-3xl text-gray-400 font-medium hover:border-sb-teal-400 hover:text-sb-teal-600 hover:bg-sb-teal-50/30 transition-all flex flex-col items-center justify-center gap-2 group mt-8"
              >
                <div className="w-12 h-12 rounded-full bg-gray-50 group-hover:bg-sb-teal-100 flex items-center justify-center transition-colors">
                  <Plus className="w-6 h-6" />
                </div>
                <span>Add another destination to your route</span>
              </button>
            </div>
          </div>
        </div>

        {/* Route Checklist Widget */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-sb-navy-700/5">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-sb-teal-100 text-sb-teal-600 flex items-center justify-center">
              <Check className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-sb-navy-700">Trip Ready Checklist</h3>
              <p className="text-gray-500">We handle the boring stuff so you don't have to.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { text: "SIM cards & Data", icon: Wifi },
              { text: "Accommodation Booked", icon: Home },
              { text: "Coworking Passes", icon: Building2 },
              { text: "Budget Estimate", icon: Wallet },
              { text: "Visa Requirements", icon: Map },
              { text: "Airport Transfers", icon: Plane }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:border-sb-teal-200 hover:shadow-md transition-all group cursor-default">
                <div className="w-6 h-6 rounded-full border-2 border-gray-300 group-hover:border-sb-teal-500 flex items-center justify-center text-transparent group-hover:text-sb-teal-500 transition-all bg-white">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="font-medium text-gray-600 group-hover:text-sb-navy-700">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="relative bg-sb-navy-900 rounded-[2.5rem] shadow-2xl p-8 sm:p-16 overflow-hidden text-center text-white">
          {/* Background Effects */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-b from-sb-teal-500/20 to-transparent rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-t from-sb-orange-500/20 to-transparent rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3"></div>
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h3 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight">Ready to turn this route into <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-sb-teal-400 to-sb-orange-400">real memories?</span></h3>
            <p className="text-gray-300 mb-12 text-xl leading-relaxed">
              We help you pick actual apartments or villas, set up coworking and SIMs, guide visa questions, and send a full budget estimate.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-sb-teal-500 text-white font-bold hover:bg-sb-teal-400 transition-all shadow-lg hover:shadow-sb-teal-500/50 hover:-translate-y-1 flex items-center justify-center gap-3 text-lg"
              >
                <span>💬</span> Chat on WhatsApp
              </a>
              <button
                onClick={() => setSaveModalOpen(true)}
                className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white/5 backdrop-blur-sm text-white font-bold hover:bg-white/10 transition-all border border-white/10 flex items-center justify-center gap-3 text-lg hover:-translate-y-1"
              >
                <span>💾</span> Save Route
              </button>
            </div>
            
            <div className="mt-12 pt-8 border-t border-white/10">
              <Link href="/route-builder" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors hover:underline">
                 <MoveRight className="w-4 h-4 rotate-180" /> Start again with another region
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* City Selection Drawer */}
      <RightDrawer
        title={
          drawerMode === 'extend-country' ? `Extend ${drawerCountryFilter}` :
          drawerMode === 'detours' ? `Detours near ${drawerCountryFilter}` :
          drawer.stopIndex !== null ? "Swap City" : "Add City"
        }
        open={drawer.open}
        onClose={() => {
          setDrawer({ open: false, stopIndex: null });
          setDrawerMode('add');
          setDrawerCountryFilter(null);
          setSearchTerm('');
        }}
      >
        <div className="sticky top-0 bg-gray-50 pb-4 z-10 space-y-3">
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
          {(drawerMode === 'extend-country' || drawerMode === 'detours') && (
            <div className="text-xs text-gray-600 bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
              {drawerMode === 'extend-country' 
                ? `Showing cities in ${drawerCountryFilter}`
                : `Showing detours near ${drawerCountryFilter}`
              }
            </div>
          )}
        </div>

        <div className="space-y-3">
          {filteredCityPresets.map((preset) => (
            <button
              key={preset.city}
              onClick={() => {
                if (drawer.stopIndex !== null) {
                  // If drawer.stopIndex is set, it means we're either swapping or inserting after
                  if (drawerMode === 'swap') {
                    // Swap mode: replace the city at this index
                    replaceStopWithPreset(drawer.stopIndex, preset);
                  } else if (drawerMode === 'extend-country' || drawerMode === 'detours') {
                    // Extend/detour mode: insert right after the city at this index
                    addStop(preset, drawer.stopIndex);
                  } else {
                    // Fallback: add to end
                    addStop(preset);
                  }
                } else {
                  // Add to end (default)
                  addStop(preset);
                }
                setDrawer({ open: false, stopIndex: null });
                setDrawerMode('add');
                setDrawerCountryFilter(null);
                setSearchTerm('');
              }}
              className="group w-full text-left bg-white border border-gray-200 rounded-xl p-4 hover:border-sb-teal-400 hover:shadow-md transition-all relative overflow-hidden"
            >
              {preset.isDetour && (
                <div className="absolute top-2 right-2 bg-sb-teal-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-sm z-10">
                  <MapPin className="w-3 h-3" />
                  Detour
                </div>
              )}
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
                      <div className="text-xs text-gray-500">
                        {preset.country}
                        {preset.nearbyCity && (
                          <span className="ml-1 text-sb-teal-600">• near {preset.nearbyCity}</span>
                        )}
                      </div>
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
                    {usdToZar(preset.costs.monthlyTotal)}
                    {preset.suggestedDuration && (
                      <span className="ml-2 text-sb-orange-600">
                        • {preset.suggestedDuration} weeks suggested
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
          
          {filteredCityPresets.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {drawerMode === 'extend-country' 
                ? `No cities found in ${drawerCountryFilter}`
                : drawerMode === 'detours'
                ? `No detours found near ${drawerCountryFilter}`
                : `No cities found matching "${searchTerm}"`
              }
            </div>
          )}
        </div>
      </RightDrawer>

      {/* Save Route Modal */}
      <SaveRouteModal
        open={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        onSuccess={(routeId) => {
          pushToast('✅ Route saved successfully! Check your email for the link.');
          // Optionally redirect to the saved route
          // window.location.href = `/route/${routeId}`;
        }}
        routeData={{
          region: state.region,
          stops: state.stops,
          preferences: {
            lifestyle: state.vibes,
            workSetup: state.workNeeds,
            travelStyle: searchParams.get('style') || 'nomad', // Get from URL params or default
          },
        }}
      />
    </div>
  );
}

function makeStopFromPreset(p: CityPreset, idx: number, idSuffix?: string): StopPlan {
  // Use suggestedDuration from city data, or default based on detour status
  const defaultWeeks = p.isDetour ? 1.5 : 4;
  const weeks = p.suggestedDuration || defaultWeeks;
  
  return {
    id: `${p.city}-${idx}-${idSuffix || Math.random().toString(36).slice(2, 7)}`,
    city: p.city,
    country: p.country,
    weeks: weeks,
    isDetour: p.isDetour || false,
    nearbyCity: p.nearbyCity,
    budgetCoins: p.budgetCoins,
    tags: p.tags,
    highlights: {
      places: (p.highlights.places || []).map(place => ({
        title: place,
        isCustom: false
      })),
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
  return (
    <Suspense fallback={<div className="min-h-screen bg-sb-beige-50" />}>
      <TripOptionsContent />
    </Suspense>
  );
}
