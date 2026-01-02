import {
  DEFAULT_TRIP_MONTHS_SEED,
  type BudgetTier,
  type CityRef,
  type DefaultTripRegion,
  type MonthKey,
} from '@/lib/defaultTripsSeed';

/**
 * Local-only storage for Default Trips (admin hub).
 * This is intentionally no-auth + client-side only.
 *
 * Users will read this mapping when starting the wizard/trip-options.
 * (If nothing is stored, we fall back to DEFAULT_TRIP_MONTHS_SEED.)
 */
export const DEFAULT_TRIPS_STORAGE_KEY = 'sb.defaultTrips.v1';

export interface DefaultTripTemplate {
  region: DefaultTripRegion;
  budgetTier: BudgetTier;
  enabled: boolean; // soft disable
  name: string;
  description?: string;
  months: Record<MonthKey, CityRef>;
}

export type DefaultTripsByRegion = Record<DefaultTripRegion, Record<BudgetTier, DefaultTripTemplate>>;

export function makeDefaultTripsSeedState(): DefaultTripsByRegion {
  const mk = (region: DefaultTripRegion, tier: BudgetTier, name: string, description?: string): DefaultTripTemplate => ({
    region,
    budgetTier: tier,
    enabled: true,
    name,
    description,
    months: DEFAULT_TRIP_MONTHS_SEED[region][tier],
  });

  return {
    'latin-america': {
      nomad: mk('latin-america', 'nomad', 'Nomad Starter (LATAM)', 'Lower-cost cities to ease into the region.'),
      'remote-worker': mk('latin-america', 'remote-worker', 'Remote Worker Starter (LATAM)', 'Great Wi‑Fi + coworking + variety.'),
      professional: mk('latin-america', 'professional', 'Professional Starter (LATAM)', 'Business-friendly hubs and smooth logistics.'),
    },
    europe: {
      nomad: mk('europe', 'nomad', 'Nomad Starter (Europe)', 'Affordable, walkable cities with good transit.'),
      'remote-worker': mk('europe', 'remote-worker', 'Remote Worker Starter (Europe)', 'Balanced hubs with strong work setup.'),
      professional: mk('europe', 'professional', 'Professional Starter (Europe)', 'Top-tier cities with premium infrastructure.'),
    },
    asia: {
      nomad: mk('asia', 'nomad', 'Nomad Starter (Asia)', 'Classic DN circuit with great value.'),
      'remote-worker': mk('asia', 'remote-worker', 'Remote Worker Starter (Asia)', 'Reliable transit + excellent connectivity.'),
      professional: mk('asia', 'professional', 'Professional Starter (Asia)', 'High-comfort, high-efficiency city picks.'),
    },
    africa: {
      nomad: mk('africa', 'nomad', 'Nomad Starter (Africa)', 'Warm-weather bases with a relaxed pace.'),
      'remote-worker': mk('africa', 'remote-worker', 'Remote Worker Starter (Africa)', 'Growing tech hubs and coworking scenes.'),
      professional: mk('africa', 'professional', 'Professional Starter (Africa)', 'Major centers with strong amenities.'),
    },
  };
}

export function loadDefaultTripsState(): DefaultTripsByRegion {
  const seed = makeDefaultTripsSeedState();
  if (typeof window === 'undefined') return seed;

  try {
    const raw = window.localStorage.getItem(DEFAULT_TRIPS_STORAGE_KEY);
    if (!raw) return seed;
    const parsed = JSON.parse(raw) as DefaultTripsByRegion;

    // Minimal shape validation: required regions + tiers exist.
    for (const region of Object.keys(seed) as DefaultTripRegion[]) {
      if (!parsed?.[region]) return seed;
      for (const tier of Object.keys(seed[region]) as BudgetTier[]) {
        const t = parsed[region]?.[tier];
        if (!t || !t.months) return seed;
      }
    }

    return parsed;
  } catch {
    return seed;
  }
}

export function saveDefaultTripsState(state: DefaultTripsByRegion): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(DEFAULT_TRIPS_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage failures
  }
}

export function normalizeDefaultTripRegionFromApp(region: string): DefaultTripRegion {
  // App uses RegionKey values like "southeast-asia" in some places.
  if (region === 'southeast-asia') return 'asia';
  if (region === 'latin-america' || region === 'europe' || region === 'asia' || region === 'africa') return region;
  // Unknown → default to latin-america
  return 'latin-america';
}

export function normalizeBudgetTierFromStyle(style: string): BudgetTier {
  if (style === 'nomad') return 'nomad';
  if (style === 'remote-worker') return 'remote-worker';
  // Wizard uses "professional-traveler"
  if (style === 'professional-traveler' || style === 'professional') return 'professional';
  return 'nomad';
}

export function getDefaultTripForSelection(region: string, style: string): DefaultTripTemplate | null {
  const state = loadDefaultTripsState();
  const r = normalizeDefaultTripRegionFromApp(region);
  const tier = normalizeBudgetTierFromStyle(style);
  const trip = state[r]?.[tier];
  if (!trip || trip.enabled === false) return null;
  return trip;
}

