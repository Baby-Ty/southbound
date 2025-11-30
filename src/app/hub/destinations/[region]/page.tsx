import { useState } from 'react';
import Link from 'next/link';
import { Heading } from '@/components/ui/Heading';
import { Card } from '@/components/ui/Card';
import { ArrowLeft, Wifi, Shield, Calendar, Clock, DollarSign, MessageCircle, Star, CheckCircle } from 'lucide-react';
import { CompareTool } from '../../components/CompareTool';
import { CityModal, CityDetail } from '../../components/CityModal';

interface Objection {
    question: string;
    answer: string;
}

interface RegionData {
    id: string;
    name: string;
    description: string;
    budget: string;
    timezone: string;
    bestMonths: string;
    wifiRating: string;
    safetyRating: string;
    cities: CityDetail[];
    sellingAngles: string[];
    objections: Objection[];
    whoItsFor: string[];
}

// Mock Data with Expanded City Details
const regionData: Record<string, RegionData> = {
    'southeast-asia': {
        id: 'southeast-asia',
        name: 'Southeast Asia',
        description: 'The #1 region for first-time nomads. Affordable luxury, incredible food, and a massive community.',
        budget: 'R20k - R30k',
        timezone: 'GMT+7 / GMT+8',
        bestMonths: 'Nov - Apr',
        wifiRating: 'Excellent',
        safetyRating: 'High',
        cities: [
            { 
                name: 'Bali (Canggu/Ubud)', 
                vibe: 'Spiritual meets digital nomad hub.', 
                wifi: 'Excellent', 
                safety: 'High', 
                lifestyle: 'Surf, Yoga, Cafes',
                description: 'Bali is the mecca of digital nomadism. Canggu is where the action, surf, and parties are. Ubud is for yoga, jungle views, and deep focus.',
                accommodation: {
                    description: 'Villas are the norm here. Most nomads rent a private room in a shared pool villa, or a guesthouse room.',
                    avgCost: 'R10,000',
                    options: [
                        { name: 'Private Villa Room', type: 'Shared Villa', cost: 'R8k - R12k' },
                        { name: 'Guesthouse (Kost)', type: 'Private Studio', cost: 'R5k - R8k' },
                        { name: 'Entire 1-Bed Villa', type: 'Private Villa', cost: 'R20k+' }
                    ]
                },
                nightlife: {
                    description: 'Canggu nightlife is world-class. Beach clubs, underground techno, and casual beer bars.',
                    topSpots: ['Old Man\'s', 'La Brisa', 'Sand Bar', 'The Lawn']
                },
                activities: {
                    description: 'You will never be bored. From surfing at sunrise to ecstatic dance at sunset.',
                    list: ['Surfing lessons in Batu Bolong', 'Sunrise trek up Mount Batur', 'Monkey Forest in Ubud', 'Kecak Fire Dance at Uluwatu']
                },
                culture: {
                    description: 'Balinese Hinduism is unique and beautiful. You will see offerings (Canang Sari) everywhere on the street.',
                    tips: ['Dress modestly when visiting temples.', 'Do not step on the offerings on the street.', 'Nyepi (Day of Silence) shuts down the entire island for 24h.']
                }
            },
            { 
                name: 'Chiang Mai, Thailand', 
                vibe: 'Mountain city, temple rich.', 
                wifi: 'Fastest in region', 
                safety: 'Very High', 
                lifestyle: 'Food, Temples, Nature',
                description: 'The northern capital of Thailand. Known for its slower pace, incredible coffee culture, and hundreds of temples.',
                accommodation: {
                    description: 'Modern condos are everywhere and very affordable. Most have gyms and pools.',
                    avgCost: 'R6,000',
                    options: [
                        { name: 'Modern Condo', type: 'Studio Apartment', cost: 'R5k - R8k' },
                        { name: 'Serviced Apartment', type: 'Weekly Cleaning', cost: 'R7k - R10k' }
                    ]
                },
                nightlife: {
                    description: 'More laid back than Bangkok. Live jazz, reggae bars, and night markets.',
                    topSpots: ['North Gate Jazz Co-Op', 'Zoe in Yellow', 'Warm Up Cafe']
                },
                activities: {
                    description: 'Nature and culture are the main draws. It is surrounded by mountains.',
                    list: ['Visit the Elephant Nature Park (Ethical)', 'Drive the Samoeng Loop on a scooter', 'Sunday Night Walking Street Market', 'Wat Phra That Doi Suthep']
                },
                culture: {
                    description: 'Thai people are incredibly friendly ("Land of Smiles"). Respect for the King and Buddhism is paramount.',
                    tips: ['Take off your shoes before entering homes or temples.', 'Do not touch people\'s heads.', 'The "Wai" (bow) is the standard greeting.']
                }
            },
             { 
                name: 'Da Nang, Vietnam', 
                vibe: 'Beach city with dragon bridge.', 
                wifi: 'Good', 
                safety: 'High', 
                lifestyle: 'Beach, Night markets',
                description: 'A modern coastal city that perfectly blends city conveniences with beach vibes. Less chaotic than Hanoi or Saigon.',
                accommodation: {
                    description: 'Beachside apartments are plentiful. You can get a sea view for a fraction of the price of Cape Town.',
                    avgCost: 'R7,000',
                    options: [
                        { name: 'Beachside Apt', type: '1 Bedroom', cost: 'R6k - R9k' },
                        { name: 'City Studio', type: 'Studio', cost: 'R4k - R6k' }
                    ]
                },
                nightlife: {
                    description: 'Growing scene. Rooftop bars, beach bars, and late-night street food.',
                    topSpots: ['Apocalypse Now', 'Sky 36', 'Local Bia Hoi spots']
                },
                activities: {
                    description: 'Great base for day trips to ancient towns and mountains.',
                    list: ['Day trip to Hoi An Ancient Town', 'Marble Mountains hike', 'Dragon Bridge fire show (weekends)', 'My Khe Beach']
                },
                culture: {
                    description: 'Vietnamese culture is deep and resilient. Coffee is a religion here.',
                    tips: ['Try the Egg Coffee.', 'Traffic is chaotic - cross the street with confidence and steady pace.', 'Bargaining in markets is expected.']
                }
            }
        ],
        sellingAngles: [
            'Lowest cost of living: Clients can save money while living better than at home.',
            'Safety: Incredible safety record, especially for solo female travelers.',
            'Community: They will never be lonely; it is the easiest place to meet people.'
        ],
        objections: [
            { question: "Is it safe?", answer: "Southeast Asia is statistically safer than most Western cities. Violent crime is extremely rare. The biggest danger is usually scooter accidents." },
            { question: "What about the internet?", answer: "It's faster than South Africa. Most cafes have fiber, and 5G is widely available." },
            { question: "Is it too humid?", answer: "It is tropical, so yes. But everywhere has AC, and you adjust quickly. The 'dry season' months are very comfortable." }
        ],
        whoItsFor: [
            'First time digital nomads',
            'Budget conscious travelers',
            'Foodies and wellness lovers'
        ]
    },
    'south-america': {
        id: 'south-america',
        name: 'South America',
        description: 'For the adventurous soul. Passionate culture, stunning landscapes, and a bit more grit.',
        budget: 'R25k - R35k',
        timezone: 'GMT-3 to GMT-5',
        bestMonths: 'Oct - Mar',
        wifiRating: 'Good',
        safetyRating: 'Medium',
        cities: [
            { 
                name: 'Medellin, Colombia', 
                vibe: 'Spring city, party & innovation.', 
                wifi: 'Strong', 
                safety: 'Medium', 
                lifestyle: 'Party, Culture, Tech',
                description: 'The City of Eternal Spring. Famous for its perfect weather, innovation districts, and vibrant social scene.',
                accommodation: {
                    description: 'Modern high-rise apartments in Poblado or Laureles are the go-to.',
                    avgCost: 'R12,000',
                    options: [
                        { name: 'Poblado Loft', type: 'Modern Studio', cost: 'R10k - R15k' },
                        { name: 'Laureles Apt', type: '1 Bedroom', cost: 'R8k - R12k' }
                    ]
                },
                nightlife: {
                    description: 'Legendary. Reggaeton, salsa, and rooftop parties.',
                    topSpots: ['Parque Lleras', 'Provenza Area', 'Salon Amador']
                },
                activities: {
                    description: 'A mix of urban exploration and nature day trips.',
                    list: ['Comuna 13 Graffiti Tour', 'Guatape Rock day trip', 'Metro Cable to Arvi Park', 'Salsa classes']
                },
                culture: {
                    description: 'Paisa culture is warm and proud. They have reinvented their city from a dark past.',
                    tips: ['Do not mention Pablo Escobar casually (it is offensive).', '"No dar papaya" (don\'t make yourself a target).', 'Greeting is a handshake or cheek kiss.']
                }
            },
            { 
                name: 'Buenos Aires, Argentina', 
                vibe: 'Paris of the south.', 
                wifi: 'Good', 
                safety: 'Medium-High', 
                lifestyle: 'Steak, Tango, Architecture',
                description: 'Elegant architecture, late-night dinners, and a passionate lifestyle. It feels very European but with Latin soul.',
                accommodation: {
                    description: 'Old-world apartments with high ceilings in Palermo or Recoleta.',
                    avgCost: 'R9,000',
                    options: [
                        { name: 'Palermo Soho Apt', type: 'Studio/Loft', cost: 'R8k - R12k' },
                        { name: 'Recoleta Classic', type: '1 Bedroom', cost: 'R7k - R10k' }
                    ]
                },
                nightlife: {
                    description: 'Starts very late. Dinner at 10pm, clubs at 2am.',
                    topSpots: ['Niceto Club', 'Frank\'s Bar', 'Plaza Serrano']
                },
                activities: {
                    description: 'Urban culture at its finest.',
                    list: ['Eat a steak at Don Julio', 'Visit La Boca neighborhood', 'Watch a football match (Boca/River)', 'Tango show']
                },
                culture: {
                    description: 'Passionate, political, and resilient. Inflation is a daily topic.',
                    tips: ['Bring USD cash ("Blue Dollar" rate).', 'Dinners are long social affairs.', 'Kiss on the cheek for greeting (even men).']
                }
            }
        ],
        sellingAngles: [
            'Timezone: Great for working with US or SA hours (only 5-6 hours behind).',
            'Culture: It is immersive. You are not just in a tourist bubble.',
            'Nature: From Patagonia to the Amazon, the weekends are unbeatable.'
        ],
        objections: [
            { question: "Is it dangerous?", answer: "It requires more street smarts than Asia, but millions of tourists visit safely. We only book stays in the safest neighborhoods (e.g., Poblado in Medellin)." },
            { question: "Do I need Spanish?", answer: "It helps a lot. You can survive with English in the nomad bubbles, but learning a few phrases goes a long way." }
        ],
        whoItsFor: [
            'Experienced travelers',
            'Nature and hiking lovers',
            'Nightlife enthusiasts'
        ]
    },
    'central-america': {
        id: 'central-america',
        name: 'Central America',
        description: 'Laid back, surf towns, ancient ruins, and perfect waves.',
        budget: 'R25k - R35k',
        timezone: 'GMT-6',
        bestMonths: 'Dec - Apr',
        wifiRating: 'Okay',
        safetyRating: 'Medium',
        cities: [
            { 
                name: 'Santa Teresa, Costa Rica', 
                vibe: 'Jungle meets ocean.', 
                wifi: 'Improving', 
                safety: 'High', 
                lifestyle: 'Surf, Yoga, Pura Vida',
                description: 'A dusty road lined with palm trees, surf shops, and incredible cafes. The ultimate barefoot luxury.',
                accommodation: {
                    description: 'Open-air bungalows or modern jungle lofts.',
                    avgCost: 'R15,000',
                    options: [
                        { name: 'Jungle Bungalow', type: 'Private Cabana', cost: 'R12k - R18k' },
                        { name: 'Shared Surf House', type: 'Private Room', cost: 'R8k - R12k' }
                    ]
                },
                nightlife: {
                    description: 'Beach bonfires and jungle raves.',
                    topSpots: ['La Lora Amarilla', 'Banana Beach', 'Thursday Night Bonfire']
                },
                activities: {
                    description: 'Surf, surf, and surf.',
                    list: ['Surf lessons at Playa Hermosa', 'ATV rental to Montezuma waterfalls', 'Sunset yoga', 'Tortuga Island snorkeling']
                },
                culture: {
                    description: '"Pura Vida" (Pure Life) is the national motto. It means slow down and enjoy.',
                    tips: ['Relax, service is slow ("Tico time").', 'Respect the ocean currents.', 'Don\'t feed the monkeys.']
                }
            },
            { 
                name: 'Antigua, Guatemala', 
                vibe: 'Colonial charm, volcanoes.', 
                wifi: 'Good', 
                safety: 'Medium', 
                lifestyle: 'Hiking, History, Coffee',
                description: 'A UNESCO World Heritage site surrounded by three volcanoes. Cobblestone streets and colorful buildings.',
                accommodation: {
                    description: 'Colonial houses converted into apartments or hotels.',
                    avgCost: 'R9,000',
                    options: [
                        { name: 'Colonial Apt', type: '1 Bedroom', cost: 'R8k - R12k' },
                        { name: 'Shared Casa', type: 'Private Room', cost: 'R6k - R9k' }
                    ]
                },
                nightlife: {
                    description: 'Mezcal bars and speakeasies.',
                    topSpots: ['Cafe No Se', 'The Snug', 'Lava Terrace']
                },
                activities: {
                    description: 'Volcano hiking is the main event.',
                    list: ['Acatenango Overnight Hike (Watch Fuego erupt)', 'Pacaya Volcano hike (Roast marshmallows)', 'Coffee farm tour', 'Lake Atitlan weekend trip']
                },
                culture: {
                    description: 'Strong Mayan heritage mixed with Spanish colonial history.',
                    tips: ['Haggle in the markets.', 'Dress respectfully in indigenous villages.', 'Learn about the Mayan textiles.']
                }
            }
        ],
        sellingAngles: [
            'Timezone: Ideal for US-based work.',
            'Nature: Incredible biodiversity and outdoor activities.',
            'Vibe: The ultimate "chill" destination.'
        ],
        objections: [
            { question: "Is the internet reliable?", answer: "It varies. Major hubs like Antigua are good, but beach towns can be spotty. We only book stays with verified Starlink or fiber." },
            { question: "Is it safe?", answer: "Generally yes for tourists, but standard precautions apply. Stick to the main towns." }
        ],
        whoItsFor: [
            'Surfers and beach lovers',
            'Nature enthusiasts',
            'Chill seekers'
        ]
    },
    'europe-central-asia': {
        id: 'europe-central-asia',
        name: 'Europe & Central Asia',
        description: 'Historic cities, scenic mountains, and a unique cultural blend.',
        budget: 'R30k - R45k',
        timezone: 'GMT+1 to GMT+4',
        bestMonths: 'May - Sep',
        wifiRating: 'Excellent',
        safetyRating: 'Very High',
        cities: [
            { 
                name: 'Lisbon, Portugal', 
                vibe: 'Sunny, historic, tech hub.', 
                wifi: 'Fast', 
                safety: 'Very High', 
                lifestyle: 'Food, Surf, History',
                description: 'One of the oldest cities in the world, now a major tech hub. Hills, trams, and tiles.',
                accommodation: {
                    description: 'Renovated historic apartments.',
                    avgCost: 'R18,000',
                    options: [
                        { name: 'Alfama Studio', type: 'Small Studio', cost: 'R15k - R20k' },
                        { name: 'Shared Nomad House', type: 'Private Room', cost: 'R10k - R14k' }
                    ]
                },
                nightlife: {
                    description: 'Pink Street and Bairro Alto. Street drinking is legal and popular.',
                    topSpots: ['Pink Street', 'Park Bar (Rooftop)', 'Pensao Amor']
                },
                activities: {
                    description: 'City exploration and coastal trips.',
                    list: ['Tram 28 ride', 'Day trip to Sintra palaces', 'Surf at Carcavelos', 'Pastel de Nata tasting']
                },
                culture: {
                    description: 'Fado music, tiles (azulejos), and a love for seafood.',
                    tips: ['Wear comfortable shoes (lots of hills).', 'Dinner is late (8-9pm).', 'Tipping is appreciated but not mandatory like the US.']
                }
            },
            { 
                name: 'Tbilisi, Georgia', 
                vibe: 'Bohemian, wine country, mountains.', 
                wifi: 'Good', 
                safety: 'High', 
                lifestyle: 'Wine, Hiking, Culture',
                description: 'A unique blend of Soviet, Persian, and European architecture. Famous for hospitality and wine.',
                accommodation: {
                    description: 'Old Tbilisi courtyards or modern high-rises.',
                    avgCost: 'R8,000',
                    options: [
                        { name: 'Old Tbilisi Apt', type: '1 Bedroom', cost: 'R7k - R10k' },
                        { name: 'Modern Vake Apt', type: 'Studio', cost: 'R6k - R9k' }
                    ]
                },
                nightlife: {
                    description: 'Underground techno scene (Bassiani) is world famous.',
                    topSpots: ['Bassiani', 'Fabrika', 'Wine bars in Sololaki']
                },
                activities: {
                    description: 'Sulfur baths and mountain getaways.',
                    list: ['Sulfur Baths in Abanotubani', 'Cable car to Narikala Fortress', 'Day trip to Kazbegi mountains', 'Wine tasting in Kakheti']
                },
                culture: {
                    description: 'Guests are "gifts from God". Georgian feasts (Supra) are legendary.',
                    tips: ['Try the Khinkali (dumplings) - eat with hands!', 'Expect to drink wine.', 'Church dress code is strict.']
                }
            }
        ],
        sellingAngles: [
            'Culture: Deep history and incredible architecture.',
            'Safety: Generally very safe with high standards of living.',
            'Connectivity: Excellent internet and transport infrastructure.'
        ],
        objections: [
            { question: "Isn't Europe expensive?", answer: "Western Europe can be, but places like Portugal (outside peak season) and Georgia are very affordable." },
            { question: "What about visas?", answer: "Georgia offers a 1-year visa-free stay for many nationalities. Portugal has a digital nomad visa." }
        ],
        whoItsFor: [
            'History buffs',
            'Those wanting "First World" comforts',
            'Wine lovers'
        ]
    }
};

interface RegionPageProps {
  params: Promise<{
    region: string
  }>
}

export async function generateStaticParams() {
    return Object.keys(regionData).map((region) => ({
        region,
    }));
}

export default function RegionPage({ params }: any) {
    // Unwrap params with React.use() if available, or just await it in a server component context if handled by Next.js 15
    // Since this is an async component, we can await params directly
    return <RegionPageContent params={params} />;
}

// Split content into a client component for state management, or handle Modal state here if we make this a client component.
// Actually, to use state for the modal, we should make this a Client Component or have a Client Wrapper.
// Let's make the whole page content a Client Component wrapper to handle the modal state easily without complex prop drilling.
// Wait, generateStaticParams needs to be exported from a Server Component/Module. 
// So I will keep this file as Server Component and create a Client Component for the interactive part.

import { RegionClientView, RegionData as SharedRegionData } from './RegionClientView';

async function RegionPageContent({ params }: RegionPageProps) {
    const { region: regionSlug } = await params;
    const region = regionData[regionSlug] || regionData['southeast-asia'];

    // Type assertion to align the local RegionData with the SharedRegionData
    // This is safe because we are populating it from the same structure, but TS in this file doesn't know about the expanded CityDetail
    return <RegionClientView region={region as unknown as SharedRegionData} />;
}
