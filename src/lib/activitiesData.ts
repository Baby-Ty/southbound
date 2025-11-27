export interface Activity {
  id: string;
  title: string;
  emoji: string;
  description: string;
  longDescription: string;
  image: string;
  gridSize: 'small' | 'medium' | 'large' | 'wide' | 'tall';
  animationType: 'ripple' | 'parallax' | 'shimmer' | 'float' | 'nature' | 'glow' | 'pulse';
  destinations: string[];
  vibe: {
    adventure: number; // 1-5
    relaxation: number; // 1-5
    cultural: number; // 1-5
  };
  difficulty?: 'Easy' | 'Moderate' | 'Challenging';
  bestTime?: string;
  gradient: string;
}

export const activities: Activity[] = [
  {
    id: 'surfing',
    title: 'Surf World-Class Waves',
    emoji: '🏄',
    description: 'Ride perfect waves in tropical paradise',
    longDescription: 'From beginner-friendly beach breaks to challenging reef breaks, experience some of the world\'s best surf spots while working remotely from beach towns.',
    image: 'https://images.unsplash.com/photo-1502933691298-84fc14542831?w=800&q=80',
    gridSize: 'large',
    animationType: 'ripple',
    destinations: ['Canggu, Bali', 'Lisbon, Portugal', 'Medellín (nearby coast)'],
    vibe: {
      adventure: 5,
      relaxation: 3,
      cultural: 2,
    },
    difficulty: 'Moderate',
    bestTime: 'Year-round (varies by location)',
    gradient: 'from-blue-400 to-cyan-600',
  },
  {
    id: 'hiking',
    title: 'Epic Mountain Treks',
    emoji: '🥾',
    description: 'Conquer peaks and trails',
    longDescription: 'Explore stunning mountain ranges, from gentle day hikes to multi-day treks. Disconnect from work and reconnect with nature on weekends.',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80',
    gridSize: 'tall',
    animationType: 'parallax',
    destinations: ['Cape Town, South Africa', 'Medellín, Colombia', 'Chiang Mai, Thailand'],
    vibe: {
      adventure: 5,
      relaxation: 2,
      cultural: 3,
    },
    difficulty: 'Challenging',
    bestTime: 'Dry season recommended',
    gradient: 'from-green-600 to-emerald-800',
  },
  {
    id: 'temples',
    title: 'Ancient Temples',
    emoji: '🛕',
    description: 'Discover spiritual sanctuaries',
    longDescription: 'Immerse yourself in ancient cultures and spiritual traditions. Visit breathtaking temples, from jungle-covered ruins to golden stupas.',
    image: 'https://images.unsplash.com/photo-1563544441-2b8f76bddcfe?w=800&q=80',
    gridSize: 'medium',
    animationType: 'shimmer',
    destinations: ['Bangkok, Thailand', 'Canggu, Bali', 'Chiang Mai, Thailand'],
    vibe: {
      adventure: 3,
      relaxation: 4,
      cultural: 5,
    },
    difficulty: 'Easy',
    bestTime: 'Early morning for best light',
    gradient: 'from-amber-400 to-orange-600',
  },
  {
    id: 'markets',
    title: 'Vibrant Night Markets',
    emoji: '🏮',
    description: 'Explore bustling local markets',
    longDescription: 'Experience the energy of night markets filled with street food, crafts, and local culture. A feast for all your senses.',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
    gridSize: 'wide',
    animationType: 'float',
    destinations: ['Bangkok, Thailand', 'Chiang Mai, Thailand', 'Hanoi, Vietnam'],
    vibe: {
      adventure: 3,
      relaxation: 2,
      cultural: 5,
    },
    difficulty: 'Easy',
    bestTime: 'Evening (6pm-11pm)',
    gradient: 'from-pink-500 to-rose-600',
  },
  {
    id: 'amazon',
    title: 'Amazon Adventure',
    emoji: '🌿',
    description: 'Deep jungle expeditions',
    longDescription: 'Navigate the mighty Amazon River, spot exotic wildlife, and experience one of the most biodiverse places on Earth. A true bucket-list adventure.',
    image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80',
    gridSize: 'large',
    animationType: 'nature',
    destinations: ['Medellín, Colombia (gateway)', 'Iquitos, Peru', 'Manaus, Brazil'],
    vibe: {
      adventure: 5,
      relaxation: 2,
      cultural: 4,
    },
    difficulty: 'Challenging',
    bestTime: 'Dry season (June-November)',
    gradient: 'from-green-700 to-teal-900',
  },
  {
    id: 'street-food',
    title: 'Street Food Safari',
    emoji: '🍜',
    description: 'Taste authentic local cuisine',
    longDescription: 'From pad thai on Bangkok streets to Colombian arepas, discover incredible flavors that will change how you think about food.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80',
    gridSize: 'medium',
    animationType: 'glow',
    destinations: ['Bangkok, Thailand', 'Medellín, Colombia', 'Lisbon, Portugal'],
    vibe: {
      adventure: 4,
      relaxation: 3,
      cultural: 5,
    },
    difficulty: 'Easy',
    bestTime: 'Lunch & dinner hours',
    gradient: 'from-orange-400 to-red-500',
  },
  {
    id: 'wildlife',
    title: 'Wildlife Encounters',
    emoji: '🦁',
    description: 'Safari & nature experiences',
    longDescription: 'Get up close with incredible wildlife, from African safaris to tropical jungle creatures. Unforgettable encounters await.',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80',
    gridSize: 'medium',
    animationType: 'pulse',
    destinations: ['Cape Town, South Africa', 'Johannesburg, South Africa', 'Chiang Mai, Thailand'],
    vibe: {
      adventure: 5,
      relaxation: 3,
      cultural: 3,
    },
    difficulty: 'Moderate',
    bestTime: 'Early morning or late afternoon',
    gradient: 'from-yellow-600 to-amber-800',
  },
  {
    id: 'beaches',
    title: 'Paradise Beaches',
    emoji: '🏖️',
    description: 'Work with sand between your toes',
    longDescription: 'Find your perfect beach—whether it\'s a quiet cove for focused work or a lively beach club for networking with other nomads.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    gridSize: 'wide',
    animationType: 'ripple',
    destinations: ['Canggu, Bali', 'Cape Town, South Africa', 'Lisbon, Portugal'],
    vibe: {
      adventure: 2,
      relaxation: 5,
      cultural: 2,
    },
    difficulty: 'Easy',
    bestTime: 'Sunrise or sunset',
    gradient: 'from-sky-400 to-blue-500',
  },
  {
    id: 'coffee',
    title: 'Coffee Culture',
    emoji: '☕',
    description: 'World-class cafes & co-working',
    longDescription: 'Work from incredible cafes with fast wifi, great coffee, and a thriving digital nomad community. Your new office has a much better view.',
    image: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=800&q=80',
    gridSize: 'small',
    animationType: 'glow',
    destinations: ['Lisbon, Portugal', 'Medellín, Colombia', 'Cape Town, South Africa'],
    vibe: {
      adventure: 1,
      relaxation: 4,
      cultural: 4,
    },
    difficulty: 'Easy',
    bestTime: 'Morning work sessions',
    gradient: 'from-amber-700 to-brown-600',
  },
];


