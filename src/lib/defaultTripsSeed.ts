export type DefaultTripRegion = 'latin-america' | 'europe' | 'asia' | 'africa';
export type BudgetTier = 'nomad' | 'remote-worker' | 'professional';
export type MonthKey = 'month1' | 'month2' | 'month3';

export interface CityRef {
  city: string;
  country?: string;
}

/**
 * Clear mapping (region + budgetTier) -> { month1, month2, month3 }
 * Used for starter trips after the itinerary wizard.
 */
export type DefaultTripMonthsMap = Record<DefaultTripRegion, Record<BudgetTier, Record<MonthKey, CityRef>>>;

export const DEFAULT_TRIP_MONTHS_SEED: DefaultTripMonthsMap = {
  'latin-america': {
    nomad: {
      month1: { city: 'Mexico City', country: 'Mexico' },
      month2: { city: 'Medellín', country: 'Colombia' },
      month3: { city: 'Lima', country: 'Peru' },
    },
    'remote-worker': {
      month1: { city: 'São Paulo', country: 'Brazil' },
      month2: { city: 'Florianópolis', country: 'Brazil' },
      month3: { city: 'Buenos Aires', country: 'Argentina' },
    },
    professional: {
      month1: { city: 'Santiago', country: 'Chile' },
      month2: { city: 'Bogotá', country: 'Colombia' },
      month3: { city: 'Panama City', country: 'Panama' },
    },
  },
  europe: {
    nomad: {
      month1: { city: 'Lisbon', country: 'Portugal' },
      month2: { city: 'Valencia', country: 'Spain' },
      month3: { city: 'Split', country: 'Croatia' },
    },
    'remote-worker': {
      month1: { city: 'Berlin', country: 'Germany' },
      month2: { city: 'Prague', country: 'Czechia' },
      month3: { city: 'Budapest', country: 'Hungary' },
    },
    professional: {
      month1: { city: 'London', country: 'United Kingdom' },
      month2: { city: 'Amsterdam', country: 'Netherlands' },
      month3: { city: 'Copenhagen', country: 'Denmark' },
    },
  },
  asia: {
    nomad: {
      month1: { city: 'Chiang Mai', country: 'Thailand' },
      month2: { city: 'Da Nang', country: 'Vietnam' },
      // Match our Southeast Asia region city naming
      month3: { city: 'Bali (Canggu)', country: 'Indonesia' },
    },
    'remote-worker': {
      // Default "remote-worker" in our app maps to the Southeast Asia region.
      month1: { city: 'Bangkok', country: 'Thailand' },
      month2: { city: 'Kuala Lumpur', country: 'Malaysia' },
      month3: { city: 'Bali (Canggu)', country: 'Indonesia' },
    },
    professional: {
      month1: { city: 'Singapore', country: 'Singapore' },
      month2: { city: 'Bangkok', country: 'Thailand' },
      month3: { city: 'Kuala Lumpur', country: 'Malaysia' },
    },
  },
  africa: {
    nomad: {
      month1: { city: 'Cape Town', country: 'South Africa' },
      month2: { city: 'Marrakech', country: 'Morocco' },
      month3: { city: 'Stone Town (Zanzibar)', country: 'Tanzania' },
    },
    'remote-worker': {
      month1: { city: 'Nairobi', country: 'Kenya' },
      month2: { city: 'Kigali', country: 'Rwanda' },
      month3: { city: 'Accra', country: 'Ghana' },
    },
    professional: {
      month1: { city: 'Johannesburg', country: 'South Africa' },
      month2: { city: 'Casablanca', country: 'Morocco' },
      month3: { city: 'Cairo', country: 'Egypt' },
    },
  },
};

