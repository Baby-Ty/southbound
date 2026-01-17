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
  story: string; // Narrative overview of the route
}

export const TRIP_TEMPLATES: Record<RegionKey, TripTemplate[]> = {
  europe: [
    {
      id: 'euro-rail-classic',
      name: 'Euro Rail Classic',
      description: 'Train-friendly cities perfect for weekend adventures',
      icon: '🚂',
      imageUrl: '/euro rail.png',
      presetCities: ['Lisbon', 'Barcelona', 'Split'],
      tags: ['train travel', 'coastal', 'culture'],
      region: 'europe',
      story: 'Start in Lisbon where pastel buildings cascade down to the Tagus, then hop the rails to Barcelona for Gaudí architecture and beach sunsets. Wind down in Split, where ancient Roman walls meet crystal Adriatic waters and island-hopping awaits.',
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
      story: 'Begin in Valencia where paella was born and beaches stretch endlessly along the Costa del Azahar. Move to Split for Dalmatian sun and island adventures, then finish in Athens where rooftop bars overlook the Acropolis and weekend ferries escape to the Greek islands.',
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
      story: 'Discover Budapest where thermal baths and ruin bars define the rhythm of life, then wander Prague\'s fairy-tale streets and beer gardens. End in Berlin, where raw creativity meets world-class nightlife and every neighborhood tells a different story.',
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
      story: 'Start in Florence where Renaissance masterpieces line every piazza and Tuscan wine flows freely. Move south to Seville for flamenco nights and endless tapas crawls, then finish in Athens where ancient history meets Mediterranean living at its most vibrant.',
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
      story: 'Experience Lisbon\'s hilltop miradouros and seafood-laden tables, then head north to Porto where port wine cellars line the Douro and azulejo tiles cover every surface. Cross into Spain for Barcelona\'s Modernista magic, where beach and city life collide perfectly.',
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
      story: 'Begin in Amsterdam where canal-side offices and cycling culture define the day, then move to Berlin for its thriving startup scene and legendary work-play balance. Finish in Prague where Gothic spires meet modern coworking spaces and craft beer costs less than coffee.',
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
      story: 'Dive into Mexico City where street tacos and world-class museums define daily life in the massive metropolis. Fly south to Medellín, the city of eternal spring where digital nomads gather in El Poblado\'s cafés. Finish in Bogotá for high-altitude cool weather, emerging food scenes, and weekend mountain escapes.',
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
      story: 'Start in Playa del Carmen where Caribbean turquoise meets cenote diving and Tulum day trips. Head to Rio for Ipanema sunsets, samba nights, and Sugarloaf hikes. End in Cartagena where colonial walls enclose salsa-filled streets and island-hopping adventures.',
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
      story: 'Embrace Buenos Aires where tango echoes through Palermo\'s streets and steak dinners stretch into dawn. Cross the Andes to Santiago for Maipo Valley wine tours and mountain views from every corner. Finish in laid-back Montevideo where the Rambla coastline defines the city\'s calm, beachy vibe.',
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
      story: 'Start in Medellín where perfect weather year-round earned it the nickname "City of Eternal Spring," and cable cars transport you above the valley. Move to Bogotá\'s high-altitude energy and growing tech scene, then finish in Santiago where the snow-capped Andes tower over Chile\'s wine-loving capital.',
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
      story: 'Begin in Mexico City where mole and mezcal reign supreme in neighborhoods filled with street food legends. Fly to Lima, the culinary capital of South America, for ceviche and pisco sours in Miraflores. End in Buenos Aires where Italian-influenced asados and Malbec close every perfect evening.',
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
      story: 'Experience the Caribbean in Playa del Carmen with easy beach access and underground cenotes. Switch coasts to Lima where Pacific cliffs meet world-class surf and paragliding. Finish in Cartagena where the walled city meets the Caribbean and island adventures are just a boat ride away.',
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
      story: 'Start in Bali where rice paddies meet surf breaks and the digital nomad community thrives in Canggu\'s beachside cafés. Head north to Chiang Mai for temple-dotted streets and the best coworking scene in Asia. Finish in Da Nang where the beach is your backyard and Vietnam\'s food scene keeps you well-fed.',
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
      story: 'Begin in Bali\'s Canggu where black sand beaches meet yoga studios and sunset sessions. Island-hop to Koh Lanta for quiet beaches and limestone cliffs perfect for long boarding sessions. Finish in Koh Samui where night markets, wellness retreats, and pristine waters create the ultimate tropical work-life balance.',
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
      story: 'Dive into Bangkok\'s organized chaos where street food stalls and rooftop bars define the skyline. Move to Ho Chi Minh City for motorbike madness and Vietnam\'s best coffee culture in Thao Dien. Finish in Kuala Lumpur where hawker centers serve multicultural cuisine and modern infrastructure makes life effortless.',
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
      story: 'Begin in Chiang Mai where ancient temples dot every corner and monk chants echo at dawn. Travel to Hanoi for egg coffee by Hoan Kiem Lake and the organized chaos of the Old Quarter. End in Phnom Penh where French colonial architecture meets Khmer history along the riverside promenade.',
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
      story: 'Start in Canggu where morning surf sessions flow into afternoon yoga and açai bowls fuel your day. Move inland to Ubud for jungle villas, rice terrace walks, and spiritual ceremonies. Finish in Chiang Mai where meditation retreats, digital detoxes, and Thai massage become part of your daily routine.',
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
      story: 'Base yourself in Singapore where Gardens by the Bay and hawker centers blend nature and efficiency in Asia\'s most modern city. Head to Bangkok for lightning-fast internet and the energy of Thailand\'s booming tech scene. End in Kuala Lumpur where luxury condos with infinity pools come at a fraction of Western prices.',
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

