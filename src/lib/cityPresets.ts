export type CityPreset = {
  city: string;
  country: string;
  flag: string;
  budgetCoins: 1 | 2 | 3;
  tags: string[];
  highlights: {
    places: string[];
    accommodation: string;
    activities: string[];
    notesHint: string;
  };
};

export type RegionKey = 'europe' | 'latin-america' | 'southeast-asia';

export const REGION_HUBS: Record<RegionKey, string[]> = {
  europe: ['Lisbon', 'Barcelona', 'Split'],
  'latin-america': ['Mexico City', 'Medellín', 'Rio'],
  'southeast-asia': ['Bali (Canggu)', 'Chiang Mai', 'Da Nang'],
};

export const CITY_PRESETS: Record<RegionKey, CityPreset[]> = {
  europe: [
    {
      city: 'Lisbon',
      country: 'Portugal',
      flag: '🇵🇹',
      budgetCoins: 2,
      tags: ['coastal', 'culture'],
      highlights: {
        places: ['Alfama', 'LX Factory', 'Miradouros'],
        accommodation: 'Apartment near cafés and coworking',
        activities: ['city walks', 'sunset viewpoints', 'weekend trips'],
        notesHint: 'Desk and strong Wi‑Fi. Day trips: Cascais, Sintra.',
      },
    },
    {
      city: 'Barcelona',
      country: 'Spain',
      flag: '🇪🇸',
      budgetCoins: 3,
      tags: ['city', 'design'],
      highlights: {
        places: ['El Born', 'Eixample', 'Barceloneta'],
        accommodation: 'Apartment near metro',
        activities: ['tapas', 'Gaudí', 'beach runs', 'coworking'],
        notesHint: 'Near L4 or L3 lines.',
      },
    },
    {
      city: 'Split',
      country: 'Croatia',
      flag: '🇭🇷',
      budgetCoins: 2,
      tags: ['coast', 'islands'],
      highlights: {
        places: ['Old Town', 'Riva', 'Marjan'],
        accommodation: 'Apartment with AC',
        activities: ['island hops', 'swims', 'sunset hikes'],
        notesHint: 'Shoulder season is best.',
      },
    },
  ],
  'latin-america': [
    {
      city: 'Mexico City',
      country: 'Mexico',
      flag: '🇲🇽',
      budgetCoins: 2,
      tags: ['food', 'culture'],
      highlights: {
        places: ['Condesa', 'Roma', 'Coyoacán'],
        accommodation: 'Apartment with desk',
        activities: ['taco crawl', 'museums', 'street art', 'rooftop coworking'],
        notesHint: 'Aim for Day of the Dead if timing fits.',
      },
    },
    {
      city: 'Medellín',
      country: 'Colombia',
      flag: '🇨🇴',
      budgetCoins: 1,
      tags: ['mild climate', 'community'],
      highlights: {
        places: ['El Poblado', 'Laureles'],
        accommodation: 'Apartment near cafés',
        activities: ['language classes', 'coworking', 'coffee farms'],
        notesHint: 'Blackout curtains for early calls.',
      },
    },
    {
      city: 'Rio',
      country: 'Brazil',
      flag: '🇧🇷',
      budgetCoins: 2,
      tags: ['beach', 'festivals'],
      highlights: {
        places: ['Ipanema', 'Leblon', 'Botafogo'],
        accommodation: 'Near beach and metro',
        activities: ['beach mornings', 'hikes', 'samba nights'],
        notesHint: 'Book early for Carnival.',
      },
    },
  ],
  'southeast-asia': [
    {
      city: 'Bali (Canggu)',
      country: 'Indonesia',
      flag: '🇮🇩',
      budgetCoins: 1,
      tags: ['tropical', 'creative'],
      highlights: {
        places: ['Berawa', 'Batu Bolong', 'Pererenan'],
        accommodation: 'Villa or guesthouse with desk',
        activities: ['surf', 'cafés', 'yoga', 'scooter trips'],
        notesHint: 'Check generator and Wi‑Fi backup.',
      },
    },
    {
      city: 'Chiang Mai',
      country: 'Thailand',
      flag: '🇹🇭',
      budgetCoins: 1,
      tags: ['calm', 'walkable'],
      highlights: {
        places: ['Nimman', 'Old City'],
        accommodation: 'Condo near Nimman',
        activities: ['temples', 'coworking', 'night markets'],
        notesHint: 'Best Nov to Feb.',
      },
    },
    {
      city: 'Da Nang',
      country: 'Vietnam',
      flag: '🇻🇳',
      budgetCoins: 1,
      tags: ['beach', 'easy'],
      highlights: {
        places: ['My An', 'An Thuong'],
        accommodation: 'Apartment near beach',
        activities: ['beach runs', 'Hoi An weekends', 'coworking'],
        notesHint: 'Rainy Oct to Dec.',
      },
    },
  ],
};

export const WORK_NEEDS = [
  'Fast internet',
  'Quiet workspace',
  'Phone calls',
  'Second screen',
  'Co-working',
  'Private desk',
  'Flexible schedule',
  'Late meetings',
  'Backup power',
] as const;

export const VIBES = [
  'Food',
  'Nightlife',
  'Beach',
  'Hiking',
  'Surf',
  'Temples',
  'Photography',
  'Diving',
  'Wellness',
  'Festivals',
  'Culture',
  'Nature',
  'City walks',
  'Gym',
] as const;
