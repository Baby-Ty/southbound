'use client';

import { useState } from 'react';
import { X, Home, Moon, Activity, BookOpen, MapPin, Star, Coffee, Shield, CheckCircle } from 'lucide-react';
import Image from 'next/image';
import { Heading } from '@/components/ui/Heading';

// Shared types - we'll move these to a types file later if needed
export interface CityDetail {
  name: string;
  vibe: string;
  wifi: string;
  safety: string;
  lifestyle: string;
  description: string;
  image?: string; // Placeholder for now
  
  accommodation: {
    description: string;
    avgCost: string;
    options: { name: string; type: string; cost: string }[];
  };
  nightlife: {
    description: string;
    topSpots: string[];
  };
  activities: {
    description: string;
    list: string[];
  };
  culture: {
    description: string;
    tips: string[];
  };
}

interface CityModalProps {
  city: CityDetail;
  isOpen: boolean;
  onClose: () => void;
}

const tabs = [
  { id: 'overview', label: 'Overview', icon: MapPin },
  { id: 'accommodation', label: 'Accommodation', icon: Home },
  { id: 'lifestyle', label: 'Vibe & Nightlife', icon: Moon },
  { id: 'activities', label: 'Activities', icon: Activity },
  { id: 'culture', label: 'Culture', icon: BookOpen },
];

export function CityModal({ city, isOpen, onClose }: CityModalProps) {
  const [activeTab, setActiveTab] = useState('overview');

  // Safety check for city - if null, don't render anything
  if (!city || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden shadow-2xl relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white rounded-full text-stone-600 hover:text-[#E86B32] transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Hero Image Area (Placeholder) */}
        <div className="h-64 bg-stone-200 relative flex-shrink-0">
           <div className="absolute inset-0 flex items-center justify-center text-stone-400 bg-stone-100">
                <span className="flex items-center gap-2"><MapPin /> Image of {city.name}</span>
           </div>
           <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-8 pt-24">
                <Heading level={1} className="!text-4xl text-white mb-2">{city.name}</Heading>
                <p className="text-white/90 text-lg">{city.vibe}</p>
           </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-stone-200 px-4 flex-shrink-0 bg-white">
            {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                            activeTab === tab.id 
                                ? 'border-[#E86B32] text-[#E86B32]' 
                                : 'border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-200'
                        }`}
                    >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                )
            })}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-stone-50">
            
            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="space-y-8 max-w-2xl mx-auto">
                    <div className="prose prose-stone">
                        <p className="text-lg text-stone-700 leading-relaxed">{city.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm text-center">
                             <div className="text-xs uppercase tracking-wider text-stone-500 mb-1">WiFi Quality</div>
                             <div className="font-bold text-stone-800 flex items-center justify-center gap-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> {city.wifi}
                             </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm text-center">
                             <div className="text-xs uppercase tracking-wider text-stone-500 mb-1">Safety Score</div>
                             <div className="font-bold text-stone-800 flex items-center justify-center gap-1">
                                <Shield className="w-4 h-4 text-green-500" /> {city.safety}
                             </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm text-center">
                             <div className="text-xs uppercase tracking-wider text-stone-500 mb-1">Lifestyle</div>
                             <div className="font-bold text-stone-800 text-sm truncate" title={city.lifestyle}>{city.lifestyle}</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Accommodation Tab */}
            {activeTab === 'accommodation' && (
                <div className="space-y-6 max-w-2xl mx-auto">
                    <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                        <h3 className="font-bold text-lg text-stone-800 mb-3 flex items-center gap-2"><Home className="text-[#E86B32] w-5 h-5" /> Housing Landscape</h3>
                        <p className="text-stone-600 mb-4">{city.accommodation?.description}</p>
                        <div className="inline-block bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium border border-green-100">
                            Avg. Cost: {city.accommodation?.avgCost} / month
                        </div>
                    </div>

                    <h4 className="font-bold text-stone-800 mt-6 mb-3">Typical Options</h4>
                    <div className="grid gap-3">
                        {(city.accommodation?.options || []).map((opt, i) => (
                            <div key={i} className="flex justify-between items-center p-4 bg-white border border-stone-200 rounded-lg">
                                <div>
                                    <div className="font-bold text-stone-800">{opt.name}</div>
                                    <div className="text-sm text-stone-500">{opt.type}</div>
                                </div>
                                <div className="font-mono text-stone-600 text-sm">{opt.cost}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

             {/* Vibe & Nightlife Tab */}
             {activeTab === 'lifestyle' && (
                <div className="space-y-6 max-w-2xl mx-auto">
                     <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                        <h3 className="font-bold text-lg text-purple-900 mb-2 flex items-center gap-2"><Moon className="w-5 h-5" /> Nightlife & Social</h3>
                        <p className="text-purple-800/80">{city.nightlife?.description}</p>
                    </div>

                    <div>
                        <h4 className="font-bold text-stone-800 mb-3">Top Spots</h4>
                        <div className="grid sm:grid-cols-2 gap-3">
                             {(city.nightlife?.topSpots || []).map((spot, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-stone-200">
                                    <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-lg">🍸</div>
                                    <span className="font-medium text-stone-700">{spot}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Activities Tab */}
            {activeTab === 'activities' && (
                <div className="space-y-6 max-w-2xl mx-auto">
                    <p className="text-lg text-stone-700">{city.activities?.description}</p>
                     <div className="grid gap-3">
                        {(city.activities?.list || []).map((activity, i) => (
                            <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-stone-200 hover:border-orange-200 transition-colors">
                                <CheckCircle className="w-5 h-5 text-[#E86B32] flex-shrink-0 mt-0.5" />
                                <span className="text-stone-700 font-medium">{activity}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

             {/* Culture Tab */}
             {activeTab === 'culture' && (
                <div className="space-y-6 max-w-2xl mx-auto">
                     <div className="bg-amber-50 p-6 rounded-xl border border-amber-100">
                        <h3 className="font-bold text-lg text-amber-900 mb-2 flex items-center gap-2"><BookOpen className="w-5 h-5" /> Cultural Context</h3>
                        <p className="text-amber-800/80">{city.culture?.description}</p>
                    </div>

                    <div>
                        <h4 className="font-bold text-stone-800 mb-3">Good to Know / Etiquette</h4>
                        <ul className="space-y-3">
                            {(city.culture?.tips || []).map((tip, i) => (
                                <li key={i} className="flex items-start gap-3 text-stone-600">
                                    <span className="text-amber-500 font-bold">•</span>
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
}

