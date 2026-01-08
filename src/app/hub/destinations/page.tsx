import Link from 'next/link';
import { Heading } from '@/components/ui/Heading';
import { Card } from '@/components/ui/Card';
import { MapPin, ArrowRight } from 'lucide-react';

const regions = [
  {
    id: 'southeast-asia',
    name: 'Southeast Asia',
    vibe: 'Tropical, bustling, affordable luxury.',
    budget: 'R20k - R30k / month',
    tags: ['Nature', 'Food', 'Beaches'],
    bestFor: 'First-Timers'
  },
  {
    id: 'south-america',
    name: 'South America',
    vibe: 'Passionate, diverse landscapes, cultural.',
    budget: 'R25k - R35k / month',
    tags: ['Culture', 'Adventure', 'Nightlife'],
    bestFor: 'Explorers'
  },
  {
    id: 'central-america',
    name: 'Central America',
    vibe: 'Laid back, surf towns, ancient ruins.',
    budget: 'R25k - R35k / month',
    tags: ['Surf', 'History', 'Relaxation'],
    bestFor: 'Surfers'
  },
   {
    id: 'europe-central-asia',
    name: 'Europe & Central Asia',
    vibe: 'Historic, scenic, unique mix of east/west.',
    budget: 'R30k - R45k / month',
    tags: ['History', 'Mountains', 'City Life'],
    bestFor: 'Culture Buffs'
  }
];

export default function DestinationsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Heading level={1} className="!text-3xl md:!text-4xl">Destinations</Heading>
        <p className="text-lg text-stone-600">Cheat sheets, selling points, and comparisons.</p>
      </div>

      <div className="mb-6 flex gap-4">
        <Link
          href="/hub/destinations/countries"
          className="px-6 py-3 bg-sb-teal-500 text-white rounded-lg font-medium hover:bg-sb-teal-600 transition"
        >
          Manage Countries
        </Link>
        <Link
          href="/hub/destinations/cities"
          className="px-6 py-3 bg-sb-orange-500 text-white rounded-lg font-medium hover:bg-sb-orange-600 transition"
        >
          Manage Cities
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {regions.map((region) => (
            <Link key={region.id} href={`/hub/destinations/${region.id}`} className="block group">
                <Card className="h-full p-6 bg-white hover:shadow-lg transition-all border-stone-200 hover:border-orange-200 flex flex-col relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <MapPin className="w-24 h-24 text-[#E86B32]" />
                    </div>
                    
                    <div className="flex items-start justify-between mb-4 relative z-10">
                        <div className="w-12 h-12 rounded-full bg-orange-100 text-[#E86B32] flex items-center justify-center group-hover:scale-110 transition-transform">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold bg-stone-800 text-white px-2 py-1 rounded-full uppercase tracking-wider">{region.bestFor}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-stone-800 mb-2 relative z-10">{region.name}</h3>
                    <p className="text-stone-600 mb-4 flex-grow relative z-10">{region.vibe}</p>
                    
                    <div className="space-y-3 relative z-10">
                        <div className="text-sm font-medium text-stone-500 bg-stone-50 px-3 py-2 rounded-lg">
                            💰 {region.budget}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {region.tags.map(tag => (
                                <span key={tag} className="text-xs bg-white border border-stone-200 text-stone-600 px-2 py-1 rounded-md">{tag}</span>
                            ))}
                        </div>
                    </div>

                     <div className="mt-4 pt-4 border-t border-stone-100 flex items-center text-[#E86B32] font-semibold text-sm group-hover:translate-x-1 transition-transform">
                        View Cheat Sheet <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                </Card>
            </Link>
        ))}
      </div>
    </div>
  );
}
