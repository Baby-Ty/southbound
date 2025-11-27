export interface Destination {
  name: string;
  emoji: string;
}

export interface RegionData {
  id: string;
  name: string;
  destinations: Destination[];
  monthlyCost: string;
  vibeLine: string;
  centerLat: number;
  centerLng: number;
  color: string;
}

export const regions: RegionData[] = [
  {
    id: 'south-america',
    name: 'South America',
    destinations: [
      { name: 'Medellín', emoji: '🇨🇴' },
      { name: 'Buenos Aires', emoji: '🇦🇷' },
      { name: 'Lima', emoji: '🇵🇪' }
    ],
    monthlyCost: 'R18,000 – R30,000',
    vibeLine: 'Coffee culture, mountains, and electric nightlife',
    centerLat: -15,
    centerLng: -60,
    color: '#E77A42'
  },
  {
    id: 'southeast-asia',
    name: 'Southeast Asia',
    destinations: [
      { name: 'Bangkok', emoji: '🇹🇭' },
      { name: 'Canggu', emoji: '🇮🇩' },
      { name: 'Chiang Mai', emoji: '🇹🇭' }
    ],
    monthlyCost: 'R15,000 – R25,000',
    vibeLine: 'Surf, temples, and night markets',
    centerLat: 13,
    centerLng: 100,
    color: '#6EB5A2'
  },
  {
    id: 'central-east-europe',
    name: 'Central & East Europe',
    destinations: [
      { name: 'Tbilisi', emoji: '🇬🇪' },
      { name: 'Bucharest', emoji: '🇷🇴' },
      { name: 'Budapest', emoji: '🇭🇺' }
    ],
    monthlyCost: 'R20,000 – R32,000',
    vibeLine: 'Ancient charm meets modern creativity',
    centerLat: 45,
    centerLng: 25,
    color: '#C9A86A'
  },
  {
    id: 'south-europe',
    name: 'South Europe',
    destinations: [
      { name: 'Lisbon', emoji: '🇵🇹' },
      { name: 'Porto', emoji: '🇵🇹' },
      { name: 'Valencia', emoji: '🇪🇸' }
    ],
    monthlyCost: 'R25,000 – R40,000',
    vibeLine: 'Sun-soaked beaches, wine, and coastal living',
    centerLat: 40,
    centerLng: -5,
    color: '#E3A87A'
  }
];

