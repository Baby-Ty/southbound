import { DestinationPin } from '@/components/Globe3D';

// Popular digital nomad hubs with coordinates
export const digitalNomadHubs: DestinationPin[] = [
  {
    id: 'lisbon',
    name: 'Lisbon',
    country: 'Portugal',
    lat: 38.7223,
    lng: -9.1393,
    color: '#FFB3A7', // Soft coral
  },
  {
    id: 'medellin',
    name: 'Medellín',
    country: 'Colombia',
    lat: 6.2442,
    lng: -75.5812,
    color: '#4FC3C8', // Mint green
  },
  {
    id: 'bangkok',
    name: 'Bangkok',
    country: 'Thailand',
    lat: 13.7563,
    lng: 100.5018,
    color: '#FF6B35', // Sunset orange
  },
  {
    id: 'canggu',
    name: 'Canggu',
    country: 'Bali, Indonesia',
    lat: -8.6481,
    lng: 115.1376,
    color: '#4FC3C8', // Soft teal
  },
  {
    id: 'cape-town',
    name: 'Cape Town',
    country: 'South Africa',
    lat: -33.9249,
    lng: 18.4241,
    color: '#C77DFF', // Light purple
  },
  {
    id: 'mexico-city',
    name: 'Mexico City',
    country: 'Mexico',
    lat: 19.4326,
    lng: -99.1332,
    color: '#FFEC5C', // Light yellow
  },
  {
    id: 'playa-del-carmen',
    name: 'Playa del Carmen',
    country: 'Mexico',
    lat: 20.6296,
    lng: -87.0739,
    color: '#FFB3A7', // Soft coral
  },
  {
    id: 'chiang-mai',
    name: 'Chiang Mai',
    country: 'Thailand',
    lat: 18.7883,
    lng: 98.9853,
    color: '#4FC3C8', // Mint green
  },
  {
    id: 'tbilisi',
    name: 'Tbilisi',
    country: 'Georgia',
    lat: 41.7151,
    lng: 44.8271,
    color: '#FF6B35', // Sunset orange
  },
  {
    id: 'buenos-aires',
    name: 'Buenos Aires',
    country: 'Argentina',
    lat: -34.6037,
    lng: -58.3816,
    color: '#C77DFF', // Light purple
  },
];

// Featured journey details for each hub
export interface FeaturedJourney {
  id: string;
  destination: string;
  title: string;
  description: string;
  imageUrl: string;
  highlights: string[];
}

export const featuredJourneys: Record<string, FeaturedJourney> = {
  'lisbon': {
    id: 'lisbon',
    destination: 'Lisbon, Portugal',
    title: 'Lisbon: Where History Meets Innovation',
    description: 'Discover the charm of Europe\'s sunniest capital, where cobblestone streets lead to cutting-edge coworking spaces. Enjoy world-class coffee culture, historic tram rides, and a thriving creative community.',
    imageUrl: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1200&q=80',
    highlights: ['🏛️ Historic neighborhoods & modern cafes', '☕ Vibrant coffee culture', '🌊 Coastal views & beach escapes']
  },
  'medellin': {
    id: 'medellin',
    destination: 'Medellín, Colombia',
    title: 'Medellín: City of Eternal Spring',
    description: 'Experience Latin America\'s most innovative city with perfect year-round weather. Work from mountain-view coworking spaces, explore colorful neighborhoods, and immerse yourself in a welcoming local culture.',
    imageUrl: 'https://images.unsplash.com/photo-1568742647318-6b508a7b22c6?auto=format&fit=crop&w=1200&q=80',
    highlights: ['🌡️ Perfect climate year-round', '💡 Thriving innovation scene', '🎨 Rich culture & friendly locals']
  },
  'bangkok': {
    id: 'bangkok',
    destination: 'Bangkok, Thailand',
    title: 'Bangkok: Where Ancient Meets Modern',
    description: 'Balance productivity with adventure in Thailand\'s vibrant capital. From golden temples to sleek coworking spaces, rooftop bars to street food markets, Bangkok offers endless inspiration.',
    imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    highlights: ['🛕 Ancient temples & modern life', '🍜 World-class street food', '🏙️ Affordable luxury living']
  },
  'canggu': {
    id: 'canggu',
    destination: 'Canggu, Bali',
    title: 'Canggu: Surf, Work, Connect',
    description: 'Start your day with sunrise surf sessions, work from beachfront cafes, and end with sunset drinks overlooking rice paddies. Canggu is the ultimate digital nomad paradise.',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    highlights: ['🏄‍♀️ Morning surf sessions', '☕ Beachfront coworking cafes', '🌅 Vibrant expat community']
  },
  'cape-town': {
    id: 'cape-town',
    destination: 'Cape Town, South Africa',
    title: 'Cape Town: Between Mountain and Ocean',
    description: 'Work with Table Mountain as your backdrop and two oceans at your doorstep. Explore wine lands, penguin colonies, and one of the world\'s most stunning coastal cities.',
    imageUrl: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&w=1200&q=80',
    highlights: ['⛰️ Iconic Table Mountain views', '🍷 World-class wine regions', '🐧 Unique wildlife encounters']
  },
  'mexico-city': {
    id: 'mexico-city',
    destination: 'Mexico City, Mexico',
    title: 'Mexico City: Creative Capital of Latin America',
    description: 'Immerse yourself in one of the world\'s largest cities, bursting with art, culture, and culinary excellence. From trendy Roma cafes to ancient Aztec ruins, CDMX never stops inspiring.',
    imageUrl: 'https://images.unsplash.com/photo-1568402102990-bc541580b59f?auto=format&fit=crop&w=1200&q=80',
    highlights: ['🎨 World-class art & museums', '🌮 Incredible food scene', '🏛️ Rich history & culture']
  },
  'playa-del-carmen': {
    id: 'playa-del-carmen',
    destination: 'Playa del Carmen, Mexico',
    title: 'Playa del Carmen: Caribbean Work Paradise',
    description: 'Trade your office view for Caribbean turquoise waters. Work from beachfront cafes, explore cenotes and Mayan ruins, and enjoy Mexico\'s most relaxed beach town vibe.',
    imageUrl: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80',
    highlights: ['🏖️ Pristine Caribbean beaches', '💎 Hidden cenotes nearby', '🌴 Laid-back beach lifestyle']
  },
  'chiang-mai': {
    id: 'chiang-mai',
    destination: 'Chiang Mai, Thailand',
    title: 'Chiang Mai: Mountain Serenity',
    description: 'Find your focus in the mountains of northern Thailand. Ancient temples, affordable living, and a peaceful atmosphere make Chiang Mai perfect for deep work and cultural exploration.',
    imageUrl: 'https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?auto=format&fit=crop&w=1200&q=80',
    highlights: ['⛰️ Peaceful mountain setting', '🛕 Ancient temple culture', '💰 Incredibly affordable']
  },
  'tbilisi': {
    id: 'tbilisi',
    destination: 'Tbilisi, Georgia',
    title: 'Tbilisi: Hidden Gem of the Caucasus',
    description: 'Discover Europe\'s best-kept secret with a unique blend of ancient tradition and modern startup culture. Incredible cuisine, warm hospitality, and affordable living await.',
    imageUrl: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=1200&q=80',
    highlights: ['🍷 Ancient wine culture', '🏛️ Unique architecture', '💻 Growing tech scene']
  },
  'buenos-aires': {
    id: 'buenos-aires',
    destination: 'Buenos Aires, Argentina',
    title: 'Buenos Aires: The Paris of South America',
    description: 'Experience European elegance with Latin passion. From tango in San Telmo to coworking in Palermo, Buenos Aires combines sophistication with affordability.',
    imageUrl: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&w=1200&q=80',
    highlights: ['💃 Tango & vibrant nightlife', '🥩 World-famous steakhouses', '🎭 Rich cultural scene']
  },
};

// Default/fallback featured journey
export const defaultFeaturedJourney: FeaturedJourney = {
  id: 'default',
  destination: 'Global Adventures',
  title: 'Your Next Adventure Awaits',
  description: 'Click on any pin to discover incredible digital nomad destinations around the world. Each location is carefully selected for its community, connectivity, and culture.',
  imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
  highlights: ['🌍 10+ Countries', '✨ Curated experiences', '👥 Global community']
};


