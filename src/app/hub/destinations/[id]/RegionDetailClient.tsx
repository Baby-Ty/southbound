'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Globe, DollarSign, Users, Wifi, Plane, Clock, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';

// Region data with cheat sheet info
const regionData: Record<string, {
  name: string;
  vibe: string;
  budget: string;
  bestFor: string;
  description: string;
  topCities: { name: string; country: string; highlights: string[] }[];
  visaInfo: string;
  timezone: string;
  wifiQuality: string;
  costOfLiving: { item: string; range: string }[];
  sellingPoints: string[];
  commonObjections: { objection: string; response: string }[];
}> = {
  'southeast-asia': {
    name: 'Southeast Asia',
    vibe: 'Tropical, bustling, affordable luxury.',
    budget: 'R20k - R30k / month',
    bestFor: 'First-Timers',
    description: 'The ultimate destination for digital nomads. Incredible food, low costs, fast WiFi, and a massive community of remote workers.',
    topCities: [
      { name: 'Bali', country: 'Indonesia', highlights: ['Coworking culture', 'Beaches', 'Yoga & wellness'] },
      { name: 'Bangkok', country: 'Thailand', highlights: ['City life', 'Street food', 'Nightlife'] },
      { name: 'Chiang Mai', country: 'Thailand', highlights: ['Mountain views', 'Low cost', 'Expat community'] },
      { name: 'Ho Chi Minh City', country: 'Vietnam', highlights: ['Bustling', 'Cheap', 'Amazing coffee'] },
    ],
    visaInfo: 'Most countries offer 30-60 day visa-free entry for SA passports. Thailand has DTV visa (5 years), Vietnam e-visa (90 days).',
    timezone: 'GMT+7 to GMT+9 (5-7 hours ahead of SA)',
    wifiQuality: 'Excellent - 50-200 Mbps common in cafes and coworking spaces',
    costOfLiving: [
      { item: 'Accommodation', range: 'R8,000 - R15,000/month' },
      { item: 'Food', range: 'R3,000 - R6,000/month' },
      { item: 'Coworking', range: 'R1,500 - R3,000/month' },
      { item: 'Transport', range: 'R1,000 - R2,500/month' },
    ],
    sellingPoints: [
      'Lowest cost of living with high quality of life',
      'Massive digital nomad community - never feel alone',
      'Fast, reliable WiFi everywhere',
      'Amazing food scene - street food to fine dining',
      'Easy visa options and extensions',
      'Tropical weather year-round',
    ],
    commonObjections: [
      { objection: "Isn't it too far?", response: "It's a 10-12 hour flight, but that distance means you're completely disconnected from SA stress. Plus flights are often R8-12k one way." },
      { objection: "Is it safe?", response: "Southeast Asia is incredibly safe for tourists and expats. Crime rates are low, and locals are welcoming." },
      { objection: "What about the language barrier?", response: "English is widely spoken in tourist areas. You'll pick up basics quickly, and translation apps bridge any gaps." },
    ],
  },
  'south-america': {
    name: 'South America',
    vibe: 'Passionate, diverse landscapes, cultural.',
    budget: 'R25k - R35k / month',
    bestFor: 'Explorers',
    description: 'Rich culture, passionate people, and landscapes from beaches to mountains. Perfect for those seeking adventure and authenticity.',
    topCities: [
      { name: 'Medellín', country: 'Colombia', highlights: ['Perfect weather', 'Modern city', 'Nightlife'] },
      { name: 'Buenos Aires', country: 'Argentina', highlights: ['European feel', 'Tango', 'Steak & wine'] },
      { name: 'Lima', country: 'Peru', highlights: ['Food capital', 'History', 'Coastal vibes'] },
      { name: 'Florianópolis', country: 'Brazil', highlights: ['Beach life', 'Surf', 'Party scene'] },
    ],
    visaInfo: 'Most countries offer 90-day visa-free entry. Colombia popular for 6-month stays. Argentina has favorable exchange rates.',
    timezone: 'GMT-3 to GMT-5 (1-3 hours behind SA)',
    wifiQuality: 'Good to Excellent - varies by country, best in Colombia and Argentina',
    costOfLiving: [
      { item: 'Accommodation', range: 'R10,000 - R18,000/month' },
      { item: 'Food', range: 'R4,000 - R8,000/month' },
      { item: 'Coworking', range: 'R2,000 - R4,000/month' },
      { item: 'Transport', range: 'R1,500 - R3,000/month' },
    ],
    sellingPoints: [
      'Similar timezone to SA - easy to work SA/EU hours',
      'Incredible natural diversity - beaches, mountains, jungles',
      'Rich culture and nightlife',
      'Affordable compared to Europe/USA',
      'Spanish is relatively easy to learn',
      'Warm, welcoming people',
    ],
    commonObjections: [
      { objection: "Is it dangerous?", response: "Like any big cities, you need street smarts. Tourist areas are safe, and millions of digital nomads thrive there." },
      { objection: "Do I need to speak Spanish?", response: "Basics help, but major cities have English speakers. It's a great opportunity to learn!" },
      { objection: "Isn't the WiFi unreliable?", response: "In major cities like Medellín, WiFi is excellent. Colombia in particular has invested heavily in infrastructure." },
    ],
  },
  'central-america': {
    name: 'Central America',
    vibe: 'Laid back, surf towns, ancient ruins.',
    budget: 'R25k - R35k / month',
    bestFor: 'Surfers',
    description: 'Pacific waves, Caribbean beaches, ancient Mayan ruins, and jungle adventures. The ultimate slow-paced nomad lifestyle.',
    topCities: [
      { name: 'Mexico City', country: 'Mexico', highlights: ['Culture hub', 'Food scene', 'Art & history'] },
      { name: 'Playa del Carmen', country: 'Mexico', highlights: ['Beach life', 'Cenotes', 'Nightlife'] },
      { name: 'Antigua', country: 'Guatemala', highlights: ['Colonial charm', 'Volcano views', 'Spanish schools'] },
      { name: 'San Juan del Sur', country: 'Nicaragua', highlights: ['Surf', 'Budget-friendly', 'Sunsets'] },
    ],
    visaInfo: 'Mexico offers 180-day tourist visas. CA-4 agreement covers Guatemala, Honduras, El Salvador, Nicaragua (90 days combined).',
    timezone: 'GMT-6 to GMT-5 (4-5 hours behind SA)',
    wifiQuality: 'Good - best in Mexico and established tourist areas',
    costOfLiving: [
      { item: 'Accommodation', range: 'R8,000 - R16,000/month' },
      { item: 'Food', range: 'R4,000 - R7,000/month' },
      { item: 'Coworking', range: 'R1,500 - R3,500/month' },
      { item: 'Transport', range: 'R1,000 - R2,500/month' },
    ],
    sellingPoints: [
      'World-class surf and beaches',
      'Rich Mayan history and ruins',
      'Close to US timezone for American clients',
      'Affordable beach lifestyle',
      'Warm year-round climate',
      'Easy US visa makes it accessible',
    ],
    commonObjections: [
      { objection: "Is Mexico safe?", response: "Tourist areas are very safe. Millions visit annually. Stick to known areas and you'll be fine." },
      { objection: "Is the WiFi good enough?", response: "In cities and developed beach towns, absolutely. Mexico City has world-class infrastructure." },
      { objection: "What about the US influence?", response: "It's actually a benefit - easy to find familiar brands, English is common, and it's a quick flight to the US if needed." },
    ],
  },
  'europe-central-asia': {
    name: 'Europe & Central Asia',
    vibe: 'Historic, scenic, unique mix of east/west.',
    budget: 'R30k - R45k / month',
    bestFor: 'Culture Buffs',
    description: 'Ancient history, stunning architecture, and a fascinating blend of Eastern and Western cultures. Perfect for those seeking depth.',
    topCities: [
      { name: 'Lisbon', country: 'Portugal', highlights: ['Perfect weather', 'Nomad visa', 'Coastal vibes'] },
      { name: 'Tbilisi', country: 'Georgia', highlights: ['Year-long visa', 'Cheap', 'Wine country'] },
      { name: 'Split', country: 'Croatia', highlights: ['Adriatic coast', 'History', 'Digital nomad visa'] },
      { name: 'Budapest', country: 'Hungary', highlights: ['Thermal baths', 'Architecture', 'Nightlife'] },
    ],
    visaInfo: 'Schengen 90/180 rule for EU. Georgia offers 1-year visa-free. Portugal/Croatia have specific nomad visas.',
    timezone: 'GMT+0 to GMT+4 (0-2 hours ahead of SA)',
    wifiQuality: 'Excellent - European infrastructure standards',
    costOfLiving: [
      { item: 'Accommodation', range: 'R12,000 - R25,000/month' },
      { item: 'Food', range: 'R5,000 - R10,000/month' },
      { item: 'Coworking', range: 'R2,500 - R5,000/month' },
      { item: 'Transport', range: 'R1,500 - R3,500/month' },
    ],
    sellingPoints: [
      'Same timezone as SA - perfect for SA/UK clients',
      'Rich history and culture everywhere',
      'Excellent healthcare and infrastructure',
      'Easy travel between countries (trains, cheap flights)',
      'Digital nomad visa options',
      'Four seasons for variety',
    ],
    commonObjections: [
      { objection: "Isn't Europe expensive?", response: "Eastern Europe and Portugal are very affordable. Tbilisi or Budapest cost less than living in Cape Town!" },
      { objection: "What about winter?", response: "Southern Europe (Portugal, Spain, Croatia) has mild winters. Or embrace the seasons - it's part of the experience!" },
      { objection: "Schengen limits to 90 days?", response: "True, but you can hop to non-Schengen (UK, Georgia, Albania) and return. Or get a digital nomad visa for longer stays." },
    ],
  },
};

export default function RegionDetailClient() {
  const params = useParams();
  const regionId = params?.id as string;
  const region = regionData[regionId];

  if (!region) {
    return (
      <div className="space-y-4">
        <Link
          href="/hub/destinations/"
          className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Destinations
        </Link>
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <MapPin className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <p className="text-lg font-medium text-red-900 mb-2">Region not found</p>
          <p className="text-sm text-red-700">The region you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/hub/destinations/"
          className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Destinations
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-bold bg-stone-800 text-white px-2 py-1 rounded-full uppercase tracking-wider">
            {region.bestFor}
          </span>
          <span className="text-sm text-stone-500">{region.budget}</span>
        </div>
        <h1 className="text-3xl font-bold text-stone-900 mb-2">{region.name}</h1>
        <p className="text-lg text-stone-600">{region.description}</p>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-white">
          <div className="flex items-center gap-2 text-stone-500 mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-medium uppercase">Timezone</span>
          </div>
          <p className="text-sm text-stone-800">{region.timezone}</p>
        </Card>
        <Card className="p-4 bg-white">
          <div className="flex items-center gap-2 text-stone-500 mb-1">
            <Wifi className="w-4 h-4" />
            <span className="text-xs font-medium uppercase">WiFi</span>
          </div>
          <p className="text-sm text-stone-800">{region.wifiQuality}</p>
        </Card>
        <Card className="p-4 bg-white">
          <div className="flex items-center gap-2 text-stone-500 mb-1">
            <Plane className="w-4 h-4" />
            <span className="text-xs font-medium uppercase">Visa</span>
          </div>
          <p className="text-sm text-stone-800 line-clamp-2">{region.visaInfo.split('.')[0]}.</p>
        </Card>
        <Card className="p-4 bg-white">
          <div className="flex items-center gap-2 text-stone-500 mb-1">
            <DollarSign className="w-4 h-4" />
            <span className="text-xs font-medium uppercase">Budget</span>
          </div>
          <p className="text-sm text-stone-800">{region.budget}</p>
        </Card>
      </div>

      {/* Top Cities */}
      <Card className="p-6 bg-white">
        <h2 className="text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#E86B32]" />
          Top Cities
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {region.topCities.map((city) => (
            <div key={city.name} className="border border-stone-200 rounded-lg p-4 hover:bg-stone-50 transition-colors">
              <h3 className="font-semibold text-stone-900">{city.name}, {city.country}</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {city.highlights.map((highlight) => (
                  <span key={highlight} className="text-xs bg-orange-100 text-[#E86B32] px-2 py-1 rounded-md">
                    {highlight}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Cost of Living */}
      <Card className="p-6 bg-white">
        <h2 className="text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-[#E86B32]" />
          Cost of Living
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {region.costOfLiving.map((item) => (
            <div key={item.item} className="flex justify-between items-center py-2 border-b border-stone-100 last:border-0">
              <span className="text-stone-600">{item.item}</span>
              <span className="font-medium text-stone-900">{item.range}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Selling Points */}
      <Card className="p-6 bg-gradient-to-br from-orange-50 to-white border-orange-200">
        <h2 className="text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          Selling Points (Use These!)
        </h2>
        <ul className="space-y-3">
          {region.sellingPoints.map((point, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-stone-700">{point}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Common Objections */}
      <Card className="p-6 bg-white">
        <h2 className="text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-[#E86B32]" />
          Handling Common Objections
        </h2>
        <div className="space-y-4">
          {region.commonObjections.map((item, idx) => (
            <div key={idx} className="border border-stone-200 rounded-lg p-4">
              <p className="font-medium text-red-700 mb-2">&ldquo;{item.objection}&rdquo;</p>
              <p className="text-stone-600 bg-green-50 p-3 rounded-md border-l-4 border-green-500">
                {item.response}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Visa Info */}
      <Card className="p-6 bg-white">
        <h2 className="text-xl font-bold text-stone-900 mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-[#E86B32]" />
          Visa Information
        </h2>
        <p className="text-stone-700">{region.visaInfo}</p>
      </Card>
    </div>
  );
}

