import { RegionKey } from './cityPresets';

export interface TripTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  imageUrl: string;
  presetCities: string[]; // City names that form the itinerary
  tags: string[]; // Mood/vibe tags
  region: RegionKey;
}

export const TRIP_TEMPLATES: Record<RegionKey, TripTemplate[]> = {
  europe: [
    {
      id: 'euro-rail-classic',
      name: 'Euro Rail Classic',
      description: 'Train-friendly cities perfect for weekend adventures',
      icon: '🚂',
      imageUrl: 'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?auto=format&fit=crop&w=1600&q=80',
      presetCities: ['Lisbon', 'Barcelona', 'Split'],
      tags: ['train travel', 'coastal', 'culture'],
      region: 'europe',
    },
    {
      id: 'beach-bum',
      name: 'Beach Bum',
      description: 'Coastal vibes, sunsets, and Mediterranean charm',
      icon: '🏖️',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
      presetCities: ['Valencia', 'Split', 'Athens'],
      tags: ['beach', 'coastal', 'relaxed'],
      region: 'europe',
    },
    {
      id: 'eastern-explorer',
      name: 'Eastern Explorer',
      description: 'Discover Central and Eastern Europe\'s hidden gems',
      icon: '🏰',
      imageUrl: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=1600&q=80', // Prague
      presetCities: ['Budapest', 'Prague', 'Berlin'],
      tags: ['history', 'architecture', 'nightlife'],
      region: 'europe',
    },
    {
      id: 'mediterranean-slow',
      name: 'Mediterranean Slow',
      description: 'Slow-paced living with rich culture and incredible food',
      icon: '🍷',
      imageUrl: 'https://images.unsplash.com/photo-1531968455001-5c5272a41129?auto=format&fit=crop&w=1600&q=80',
      presetCities: ['Florence', 'Seville', 'Athens'],
      tags: ['culture', 'food', 'art'],
      region: 'europe',
    },
    {
      id: 'iberian-adventure',
      name: 'Iberian Adventure',
      description: 'Explore Spain and Portugal\'s vibrant cities',
      icon: '🇪🇸',
      imageUrl: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?auto=format&fit=crop&w=1600&q=80',
      presetCities: ['Lisbon', 'Porto', 'Barcelona'],
      tags: ['food', 'nightlife', 'architecture'],
      region: 'europe',
    },
    {
      id: 'northern-lights',
      name: 'Northern Lights',
      description: 'Modern cities with excellent infrastructure and work culture',
      icon: '☕',
      imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80',
      presetCities: ['Amsterdam', 'Berlin', 'Prague'],
      tags: ['modern', 'coworking', 'startup'],
      region: 'europe',
    },
  ],
  'latin-america': [
    {
      id: 'mexico-colombia-classic',
      name: 'Mexico & Colombia Classic',
      description: 'The perfect introduction to Latin America',
      icon: '🌮',
      imageUrl: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=1600&auto=format&fit=crop',
      presetCities: ['Mexico City', 'Medellín', 'Bogotá'],
      tags: ['food', 'culture', 'community'],
      region: 'latin-america',
    },
    {
      id: 'beach-bum-latam',
      name: 'Beach Bum',
      description: 'Tropical beaches, surf, and laid-back vibes',
      icon: '🏄',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
      presetCities: ['Playa del Carmen', 'Rio', 'Cartagena'],
      tags: ['beach', 'surf', 'tropical'],
      region: 'latin-america',
    },
    {
      id: 'south-american-tour',
      name: 'South American Tour',
      description: 'Explore Argentina, Chile, and Uruguay',
      icon: '🇦🇷',
      imageUrl: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=1600&auto=format&fit=crop',
      presetCities: ['Buenos Aires', 'Santiago', 'Montevideo'],
      tags: ['food', 'wine', 'culture'],
      region: 'latin-america',
    },
    {
      id: 'mountain-cool',
      name: 'Mountain Cool',
      description: 'Mild climates and stunning mountain views',
      icon: '⛰️',
      imageUrl: 'https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?w=1600&auto=format&fit=crop',
      presetCities: ['Medellín', 'Bogotá', 'Santiago'],
      tags: ['mild climate', 'mountain', 'cool'],
      region: 'latin-america',
    },
    {
      id: 'foodie-paradise',
      name: 'Foodie Paradise',
      description: 'World-class cuisine from Mexico to Peru',
      icon: '🍜',
      imageUrl: 'https://images.unsplash.com/photo-1531968455001-5c5272a41129?w=1600&auto=format&fit=crop',
      presetCities: ['Mexico City', 'Lima', 'Buenos Aires'],
      tags: ['food', 'culinary', 'dining'],
      region: 'latin-america',
    },
    {
      id: 'coastal-explorer',
      name: 'Coastal Explorer',
      description: 'Pacific and Caribbean coastlines',
      icon: '🌊',
      imageUrl: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1600&auto=format&fit=crop',
      presetCities: ['Playa del Carmen', 'Lima', 'Cartagena'],
      tags: ['coastal', 'ocean', 'beach'],
      region: 'latin-america',
    },
  ],
  'southeast-asia': [
    {
      id: 'classic-nomad-circuit',
      name: 'Classic Nomad Circuit',
      description: 'The tried-and-true digital nomad favorites',
      icon: '🌴',
      imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1600&auto=format&fit=crop',
      presetCities: ['Bali (Canggu)', 'Chiang Mai', 'Da Nang'],
      tags: ['nomad', 'community', 'affordable'],
      region: 'southeast-asia',
    },
    {
      id: 'beach-island-hop',
      name: 'Beach Island Hop',
      description: 'Tropical islands and pristine beaches',
      icon: '🏝️',
      imageUrl: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1600&q=80',
      presetCities: ['Bali (Canggu)', 'Koh Lanta', 'Koh Samui'],
      tags: ['island', 'beach', 'tropical'],
      region: 'southeast-asia',
    },
    {
      id: 'urban-adventure',
      name: 'Urban Adventure',
      description: 'Bustling cities with incredible food scenes',
      icon: '🏙️',
      imageUrl: 'https://images.unsplash.com/photo-1535202468039-117770371865?auto=format&fit=crop&w=1600&q=80',
      presetCities: ['Bangkok', 'Ho Chi Minh City', 'Kuala Lumpur'],
      tags: ['urban', 'food', 'nightlife'],
      region: 'southeast-asia',
    },
    {
      id: 'culture-deep-dive',
      name: 'Culture Deep Dive',
      description: 'Immerse yourself in rich traditions and history',
      icon: '🏛️',
      imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1600&q=80',
      presetCities: ['Chiang Mai', 'Hanoi', 'Phnom Penh'],
      tags: ['culture', 'history', 'temples'],
      region: 'southeast-asia',
    },
    {
      id: 'wellness-retreat',
      name: 'Wellness Retreat',
      description: 'Yoga, meditation, and healthy living',
      icon: '🧘',
      imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1600&q=80',
      presetCities: ['Bali (Canggu)', 'Ubud', 'Chiang Mai'],
      tags: ['wellness', 'yoga', 'spiritual'],
      region: 'southeast-asia',
    },
    {
      id: 'modern-hubs',
      name: 'Modern Hubs',
      description: 'High-tech cities with premium infrastructure',
      icon: '💻',
      imageUrl: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1600&auto=format&fit=crop',
      presetCities: ['Singapore', 'Bangkok', 'Kuala Lumpur'],
      tags: ['modern', 'tech', 'premium'],
      region: 'southeast-asia',
    },
  ],
};

/**
 * Fetch templates from API with fallback to static data
 */
export async function getTemplatesForRegion(region: RegionKey): Promise<TripTemplate[]> {
  // Try to fetch from API first
  try {
    if (typeof window !== 'undefined') {
      const { apiUrl } = await import('./api');
      const url = apiUrl(`trip-templates?region=${region}&enabled=true`);
      const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.templates && Array.isArray(data.templates) && data.templates.length > 0) {
          return data.templates;
        }
      }
    }
  } catch (error) {
    console.warn('[TripTemplates] Failed to fetch from API, using fallback:', error);
  }
  
  // Fallback to static data
  return TRIP_TEMPLATES[region] || [];
}

/**
 * Get templates synchronously (for SSR or when API is not available)
 */
export function getTemplatesForRegionSync(region: RegionKey): TripTemplate[] {
  return TRIP_TEMPLATES[region] || [];
}

/**
 * Fetch a single template by ID from API with fallback to static data
 */
export async function getTemplateById(region: RegionKey, templateId: string): Promise<TripTemplate | undefined> {
  // Try to fetch from API first
  try {
    if (typeof window !== 'undefined') {
      const { apiUrl } = await import('./api');
      const url = apiUrl(`trip-templates/${templateId}?region=${region}`);
      const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.template) {
          return data.template;
        }
      }
    }
  } catch (error) {
    console.warn('[TripTemplates] Failed to fetch template from API, using fallback:', error);
  }
  
  // Fallback to static data
  return TRIP_TEMPLATES[region]?.find(t => t.id === templateId);
}

/**
 * Get template by ID synchronously (for SSR or when API is not available)
 */
export function getTemplateByIdSync(region: RegionKey, templateId: string): TripTemplate | undefined {
  return TRIP_TEMPLATES[region]?.find(t => t.id === templateId);
}

