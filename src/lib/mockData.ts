import { TripCard, FAQ } from '@/types/sanity';

// Mock trip data for when Sanity CMS is not available
export const mockTrips: TripCard[] = [
  {
    _id: 'thailand-bangkok',
    title: 'Bangkok Digital Nomad Experience',
    slug: { current: 'bangkok-digital-nomad', _type: 'slug' },
    heroImage: null,
    imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=60',
    destination: 'Bangkok, Thailand',
    duration: '30 Days',
    description: 'Experience the perfect blend of ancient culture and modern convenience in Thailand\'s bustling capital. Co-work from trendy cafes, explore golden temples, and enjoy world-class street food.',
    price: 850,
    currency: 'USD',
    category: 'popular',
    featured: true,
    publishedAt: '2024-01-15',
  },
  {
    _id: 'portugal-lisbon',
    title: 'Lisbon Creative Hub',
    slug: { current: 'lisbon-creative-hub', _type: 'slug' },
    heroImage: null,
    imageUrl: 'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1200&q=60',
    destination: 'Lisbon, Portugal',
    duration: '45 Days',
    description: 'Join a thriving creative community in Europe\'s most charming capital. Enjoy excellent coffee culture, historic neighborhoods, and stunning coastal views just a tram ride away.',
    price: 1200,
    currency: 'USD',
    category: 'popular',
    featured: true,
    publishedAt: '2024-01-20',
  },
  {
    _id: 'colombia-medellin',
    title: 'Medellín Innovation District',
    slug: { current: 'medellin-innovation', _type: 'slug' },
    heroImage: null,
    imageUrl: 'https://images.unsplash.com/photo-1568742647318-6b508a7b22c6?auto=format&fit=crop&w=1200&q=60',
    destination: 'Medellín, Colombia',
    duration: '60 Days',
    description: 'Discover Latin America\'s most innovative city. Perfect climate year-round, affordable living, and a growing tech scene make this the ideal base for digital nomads.',
    price: 750,
    currency: 'USD',
    category: 'popular',
    featured: false,
    publishedAt: '2024-01-25',
  },
  {
    _id: 'bali-canggu',
    title: 'Canggu Surf & Work',
    slug: { current: 'canggu-surf-work', _type: 'slug' },
    heroImage: null,
    imageUrl: 'https://images.unsplash.com/photo-1526779259212-939e64788e3c?auto=format&fit=crop&w=1200&q=60',
    destination: 'Canggu, Bali',
    duration: '30 Days',
    description: 'Balance work and play in Bali\'s hippest beach town. Morning surf sessions, afternoon co-working, and sunset beers with a global community of creators and entrepreneurs.',
    price: 900,
    currency: 'USD',
    category: 'popular',
    featured: true,
    publishedAt: '2024-02-01',
  },
  {
    _id: 'cape-town-local',
    title: 'Cape Town Mountain & Ocean',
    slug: { current: 'cape-town-mountain-ocean', _type: 'slug' },
    heroImage: null,
    imageUrl: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1200&q=60',
    destination: 'Cape Town, South Africa',
    duration: '14-30 Days',
    description: 'Work between mountain and ocean in one of the world\'s most beautiful cities. Explore wine lands, penguin colonies, and a vibrant local culture.',
    price: 600,
    currency: 'USD',
    category: 'local',
    featured: true,
    publishedAt: '2024-02-05',
  },
  {
    _id: 'joburg-local',
    title: 'Johannesburg Innovation Hub',
    slug: { current: 'johannesburg-innovation-hub', _type: 'slug' },
    heroImage: null,
    imageUrl: 'https://images.unsplash.com/photo-1589449029304-97f8ff2b8611?auto=format&fit=crop&w=1200&q=60',
    destination: 'Johannesburg, South Africa',
    duration: '7-21 Days',
    description: 'Tap into Africa\'s financial capital and growing tech scene. Network with entrepreneurs, explore cultural townships, and experience the continent\'s most dynamic city.',
    price: 450,
    currency: 'USD',
    category: 'local',
    featured: false,
    publishedAt: '2024-02-10',
  }
];

// Mock FAQ data for when Sanity CMS is not available
export const mockFaqs: FAQ[] = [
  {
    _id: 'faq-booking',
    question: 'How far in advance should I book my trip?',
    answer: 'We recommend booking 2-8 weeks in advance for the best selection and pricing. However, we often have last-minute availability for spontaneous adventurers! Some popular destinations during peak seasons may require earlier booking.',
    category: 'booking',
    order: 1,
    isActive: true,
  },
  {
    _id: 'faq-included',
    question: 'What\'s included in the trip price?',
    answer: 'Each trip includes accommodation, co-working spaces, welcome orientation, and community events. Most trips also include airport transfers and some meals. Flights, visa fees, and personal expenses are typically not included. Check each trip\'s detailed itinerary for specifics.',
    category: 'trip-details',
    order: 2,
    isActive: true,
  },
  {
    _id: 'faq-solo',
    question: 'Can I travel solo?',
    answer: 'Absolutely! About 70% of our travelers are solo adventurers. Our trips are designed to help you connect with like-minded people. You\'ll never feel alone - our community managers ensure everyone feels welcome and included.',
    category: 'community',
    order: 3,
    isActive: true,
  },
  {
    _id: 'faq-cancellation',
    question: 'What\'s your cancellation policy?',
    answer: 'We offer flexible cancellation policies to give you peace of mind. Most trips can be cancelled up to 14 days before departure for a full refund (minus processing fees). Earlier cancellations may be eligible for partial refunds or trip credits.',
    category: 'booking',
    order: 4,
    isActive: true,
  },
  {
    _id: 'faq-wifi',
    question: 'How reliable is the internet for remote work?',
    answer: 'All our accommodations and co-working spaces are tested for reliable high-speed internet (minimum 25+ Mbps). We also provide backup solutions and local SIM cards. Our community managers can recommend the best spots for important calls or deadlines.',
    category: 'practical',
    order: 5,
    isActive: true,
  },
  {
    _id: 'faq-age',
    question: 'Is there an age limit for trips?',
    answer: 'Our trips are designed for adults 18+, with most travelers being between 25-45. We welcome anyone with a spirit of adventure and openness to new experiences! Our diverse community includes students, professionals, entrepreneurs, and remote workers.',
    category: 'community',
    order: 6,
    isActive: true,
  }
];

// Helper function to get random sample of trips
export const getRandomTrips = (count: number = 4): TripCard[] => {
  const shuffled = [...mockTrips].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Helper function to get trips by category
export const getTripsByCategory = (category: 'popular' | 'local'): TripCard[] => {
  return mockTrips.filter(trip => trip.category === category);
};

// Helper function to get featured trips
export const getFeaturedTrips = (): TripCard[] => {
  return mockTrips.filter(trip => trip.featured);
};