'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { ArrowRightLeft } from 'lucide-react';

interface RegionCompareData {
    id: string;
    name: string;
    cost: string;
    internet: string;
    safety: string;
    vibe: string;
}

const compareData: Record<string, RegionCompareData> = {
    'southeast-asia': {
        id: 'southeast-asia',
        name: 'Southeast Asia',
        cost: 'Low (R20k-30k)',
        internet: 'Fast (50-100mbps)',
        safety: 'High',
        vibe: 'Tropical, Busy, Social'
    },
    'south-america': {
        id: 'south-america',
        name: 'South America',
        cost: 'Med (R25k-35k)',
        internet: 'Good (20-50mbps)',
        safety: 'Medium',
        vibe: 'Passionate, Raw, Cultural'
    },
    'central-america': {
         id: 'central-america',
        name: 'Central America',
        cost: 'Med (R25k-35k)',
        internet: 'Okay (10-30mbps)',
        safety: 'Medium',
        vibe: 'Chill, Surf, Nature'
    },
    'europe-central-asia': {
        id: 'europe-central-asia',
        name: 'Europe / Central Asia',
        cost: 'High (R30k-45k)',
        internet: 'Fast (50mbps+)',
        safety: 'Very High',
        vibe: 'Historic, Walkable, Seasons'
    }
};

export function CompareTool({ currentRegionId }: { currentRegionId: string }) {
    const [targetId, setTargetId] = useState<string>(
        Object.keys(compareData).find(k => k !== currentRegionId) || 'south-america'
    );

    const current = compareData[currentRegionId] || compareData['southeast-asia'];
    const target = compareData[targetId];

    return (
        <Card className="p-6 bg-white border-stone-200">
            <div className="flex items-center gap-2 mb-6">
                <ArrowRightLeft className="text-[#E86B32]" />
                <h3 className="text-xl font-bold text-stone-800">Compare Destinations</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 md:gap-8">
                {/* Current Region */}
                <div className="space-y-4">
                    <div className="font-bold text-lg text-stone-800 border-b border-stone-100 pb-2">
                        {current.name}
                    </div>
                    <div>
                        <div className="text-xs text-stone-500 uppercase tracking-wider">Monthly Cost</div>
                        <div className="font-medium text-stone-700">{current.cost}</div>
                    </div>
                     <div>
                        <div className="text-xs text-stone-500 uppercase tracking-wider">Internet</div>
                        <div className="font-medium text-stone-700">{current.internet}</div>
                    </div>
                     <div>
                        <div className="text-xs text-stone-500 uppercase tracking-wider">Safety</div>
                        <div className="font-medium text-stone-700">{current.safety}</div>
                    </div>
                     <div>
                        <div className="text-xs text-stone-500 uppercase tracking-wider">Vibe</div>
                        <div className="font-medium text-stone-700">{current.vibe}</div>
                    </div>
                </div>

                {/* Target Region */}
                <div className="space-y-4">
                     <select 
                        value={targetId} 
                        onChange={(e) => setTargetId(e.target.value)}
                        className="font-bold text-lg text-stone-800 border-b border-stone-200 pb-2 w-full bg-transparent focus:outline-none focus:border-[#E86B32]"
                    >
                        {Object.values(compareData)
                            .filter(r => r.id !== currentRegionId)
                            .map(r => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                            ))
                        }
                    </select>
                    <div>
                        <div className="text-xs text-stone-500 uppercase tracking-wider">Monthly Cost</div>
                        <div className="font-medium text-stone-700">{target.cost}</div>
                    </div>
                     <div>
                        <div className="text-xs text-stone-500 uppercase tracking-wider">Internet</div>
                        <div className="font-medium text-stone-700">{target.internet}</div>
                    </div>
                     <div>
                        <div className="text-xs text-stone-500 uppercase tracking-wider">Safety</div>
                        <div className="font-medium text-stone-700">{target.safety}</div>
                    </div>
                     <div>
                        <div className="text-xs text-stone-500 uppercase tracking-wider">Vibe</div>
                        <div className="font-medium text-stone-700">{target.vibe}</div>
                    </div>
                </div>
            </div>
        </Card>
    );
}

