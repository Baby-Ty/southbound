'use client';

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

// Export RegionData so it can be used in page.tsx
export interface RegionData {
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

export function RegionClientView({ region }: { region: RegionData }) {
    const [selectedCity, setSelectedCity] = useState<CityDetail | null>(null);

    return (
        <div className="space-y-8 pb-12">
             {selectedCity && (
                <CityModal 
                    city={selectedCity} 
                    isOpen={true} 
                    onClose={() => setSelectedCity(null)} 
                />
             )}

             {/* Breadcrumb / Back */}
            <div className="flex items-center gap-2 text-sm text-stone-500">
                <Link href="/hub/destinations" className="hover:text-[#E86B32] flex items-center gap-1">
                    <ArrowLeft className="w-4 h-4" /> Back to Destinations
                </Link>
            </div>

            {/* Header */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Heading level={1} className="!text-3xl md:!text-4xl">{region.name}</Heading>
                    <span className="hidden md:inline-block px-3 py-1 bg-orange-100 text-[#E86B32] rounded-full text-sm font-bold">
                        {region.id === 'southeast-asia' ? 'Most Popular' : 'Trending'}
                    </span>
                </div>
                <p className="text-xl text-stone-600 max-w-3xl">{region.description}</p>
            </div>

            {/* Quick Facts Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card className="p-4 bg-white border-stone-200 text-center">
                    <div className="flex justify-center text-green-600 mb-2"><DollarSign className="w-5 h-5" /></div>
                    <div className="text-xs text-stone-500 uppercase tracking-wider">Budget</div>
                    <div className="font-bold text-stone-800">{region.budget}</div>
                </Card>
                <Card className="p-4 bg-white border-stone-200 text-center">
                    <div className="flex justify-center text-blue-600 mb-2"><Wifi className="w-5 h-5" /></div>
                    <div className="text-xs text-stone-500 uppercase tracking-wider">WiFi</div>
                    <div className="font-bold text-stone-800">{region.wifiRating}</div>
                </Card>
                 <Card className="p-4 bg-white border-stone-200 text-center">
                    <div className="flex justify-center text-orange-600 mb-2"><Shield className="w-5 h-5" /></div>
                    <div className="text-xs text-stone-500 uppercase tracking-wider">Safety</div>
                    <div className="font-bold text-stone-800">{region.safetyRating}</div>
                </Card>
                 <Card className="p-4 bg-white border-stone-200 text-center">
                    <div className="flex justify-center text-purple-600 mb-2"><Clock className="w-5 h-5" /></div>
                    <div className="text-xs text-stone-500 uppercase tracking-wider">Timezone</div>
                    <div className="font-bold text-stone-800 text-sm">{region.timezone}</div>
                </Card>
                 <Card className="p-4 bg-white border-stone-200 text-center">
                    <div className="flex justify-center text-teal-600 mb-2"><Calendar className="w-5 h-5" /></div>
                    <div className="text-xs text-stone-500 uppercase tracking-wider">Best Months</div>
                    <div className="font-bold text-stone-800 text-sm">{region.bestMonths}</div>
                </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Column */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Selling Angles */}
                    <section>
                        <h2 className="text-2xl font-bold text-stone-800 mb-4 flex items-center gap-2">
                            <Star className="text-[#E86B32] w-6 h-6" /> Why Sell {region.name}?
                        </h2>
                        <Card className="p-6 bg-orange-50/50 border-orange-100">
                             <ul className="space-y-4">
                                {region.sellingAngles.map((point, i) => (
                                    <li key={i} className="flex items-start gap-3 text-stone-800 text-lg">
                                        <CheckCircle className="text-[#E86B32] w-6 h-6 flex-shrink-0 mt-0.5" />
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    </section>

                     {/* Top Cities */}
                     <section>
                         <h2 className="text-2xl font-bold text-stone-800 mb-4">Top Cities</h2>
                         <div className="grid md:grid-cols-2 gap-4">
                            {region.cities.map((city) => (
                                <div key={city.name} onClick={() => setSelectedCity(city)} className="cursor-pointer group">
                                    <Card className="p-5 bg-white border-stone-200 group-hover:border-orange-300 group-hover:shadow-md transition-all h-full flex flex-col">
                                        <div className="mb-3">
                                            <h3 className="text-lg font-bold text-stone-800 group-hover:text-[#E86B32] transition-colors">{city.name}</h3>
                                            <p className="text-stone-500 text-sm italic">{city.vibe}</p>
                                        </div>
                                        <div className="mt-auto pt-3 border-t border-stone-100 grid grid-cols-2 gap-2 text-xs text-stone-600">
                                            <span>📶 {city.wifi} Net</span>
                                            <span>🛡️ {city.safety} Safety</span>
                                        </div>
                                        <div className="mt-3 text-xs font-bold text-[#E86B32] uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                                            View Details &rarr;
                                        </div>
                                    </Card>
                                </div>
                            ))}
                         </div>
                    </section>

                    {/* Objections */}
                    <section>
                        <h2 className="text-2xl font-bold text-stone-800 mb-4 flex items-center gap-2">
                            <MessageCircle className="text-blue-600 w-6 h-6" /> Common Objections
                        </h2>
                        <div className="space-y-4">
                            {region.objections.map((obj, i) => (
                                <Card key={i} className="p-5 bg-white border-stone-200">
                                    <h3 className="font-bold text-stone-900 mb-2">"{obj.question}"</h3>
                                    <p className="text-stone-600">{obj.answer}</p>
                                </Card>
                            ))}
                        </div>
                    </section>
                    
                    {/* Compare Tool */}
                    <section>
                         <h2 className="text-2xl font-bold text-stone-800 mb-4">Comparison</h2>
                         <CompareTool currentRegionId={region.id} />
                    </section>

                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                     {/* Who it's for */}
                    <Card className="p-6 bg-white border-stone-200">
                        <h3 className="font-bold text-stone-800 mb-4 uppercase tracking-wider text-sm">Perfect For</h3>
                         <ul className="space-y-3">
                            {region.whoItsFor.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 text-stone-700">
                                    <span className="text-green-600">✓</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </Card>
                    
                    {/* Client Stories Placeholder */}
                    <Card className="p-6 bg-stone-800 text-white border-stone-800">
                        <h3 className="font-bold mb-2">Client Stories 💬</h3>
                        <p className="text-stone-300 text-sm mb-4">"I was worried about the internet in Bali, but it was faster than my fiber back in Cape Town!"</p>
                        <div className="flex items-center gap-2">
                             <div className="w-8 h-8 rounded-full bg-stone-600"></div>
                             <div className="text-xs">
                                <div className="font-bold">Sarah J.</div>
                                <div className="text-stone-400">Digital Marketer</div>
                             </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
