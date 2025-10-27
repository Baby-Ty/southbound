type RouteBuilderData = { region: string; lifestyle: string[]; workSetup: string[]; travelStyle: string; };
import Image from 'next/image';
import { useState } from 'react';

interface RegionStepProps {
  data: RouteBuilderData;
  onUpdate: (data: Partial<RouteBuilderData>) => void;
  onNext: () => void;
}

const RegionStep = ({ data, onUpdate, onNext }: RegionStepProps) => {
  const [imgFallbackIndex, setImgFallbackIndex] = useState<Record<string, number>>({});

  const regions = [
    {
      id: 'latin-america',
      name: 'Latin America',
      description: 'Colourful culture, beaches, and fiesta energy',
      icon: '🌎',
      bgColor: 'from-white/0 to-white/0',
      borderColor: 'border-rose-200',
      selectedColor: 'border-sb-orange-400',
      bgImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80',
      fallbacks: [
        'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80'
      ],
      budgetCoins: '🪙🪙',
      vibe: 'Adventurous • Social',
      vibeIcon: '🎶',
      hoverRing: 'hover:ring-orange-300',
      overlayFrom: 'from-black/45',
      budgetLabel: 'Budget Friendly',
      vibeLine: 'Social & Active',
      overlapWindow: 'Morning overlap with South Africa (2 PM–10 PM)',
      summary: 'Affordable, Social & Adventurous',
      highlights: ['Coworking in CDMX & Medellín', 'Spanish immersion + beach escapes', 'Late sunsets, lively street culture'],
      overlap: 'Mornings overlap with South Africa',
      hoverCaption:
        'Time with SA: mornings overlap. Vibes: vibrant, social, adventurous.',
      details: {
        workLife: 'Vibrant coworking scenes in Mexico City, Buenos Aires, and Medellín. Perfect for creative work with inspiring street art and music.',
        timezone: 'UTC-3 to UTC-6 (2-5 hours behind SA)',
        vibeWords: ['Fiesta', 'Creative', 'Warm']
      }
    },
    {
      id: 'southeast-asia',
      name: 'Southeast Asia',
      description: 'Tropical, affordable, and food heaven',
      icon: '🌴',
      bgColor: 'from-white/0 to-white/0',
      borderColor: 'border-teal-200',
      selectedColor: 'border-sb-orange-400',
      bgImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80',
      fallbacks: [
        'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80'
      ],
      budgetCoins: '🪙',
      vibe: 'Relaxed • Connected',
      vibeIcon: '🌴',
      hoverRing: 'hover:ring-teal-300',
      overlayFrom: 'from-black/45',
      budgetLabel: 'Very Affordable',
      vibeLine: 'Calm & Creative',
      overlapWindow: 'Morning to midday overlap with South Africa (7 AM–3 PM)',
      summary: 'Low budget, Relaxed & Connected',
      highlights: ['Bali beaches + cafés', 'Great value, strong Wi‑Fi', 'Warm communities of nomads'],
      overlap: 'Afternoons/evenings overlap with South Africa',
      hoverCaption:
        'Time with SA: afternoons/evenings overlap. Vibes: easygoing, connected, creative.',
      details: {
        workLife: 'Thriving digital nomad hubs in Bali, Chiang Mai, and Ho Chi Minh. Amazing value with world-class internet and beachside coworking.',
        timezone: 'UTC+7 to UTC+8 (5-6 hours ahead of SA)',
        vibeWords: ['Tropical', 'Affordable', 'Adventure']
      }
    },
    {
      id: 'europe',
      name: 'Europe',
      description: 'Cafés, coworking, and culture around every corner',
      icon: '☕',
      bgColor: 'from-white/0 to-white/0',
      borderColor: 'border-slate-300',
      selectedColor: 'border-sb-orange-400',
      bgImage: 'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?auto=format&fit=crop&w=1600&q=80',
      fallbacks: [
        'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80',
        'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?auto=format&fit=crop&w=1600&q=80'
      ],
      budgetCoins: '🪙🪙🪙',
      vibe: 'Productive • Cultural',
      vibeIcon: '☕',
      hoverRing: 'hover:ring-blue-300',
      overlayFrom: 'from-black/45',
      budgetLabel: 'Premium',
      vibeLine: 'Balanced & Refined',
      overlapWindow: 'Full workday overlap with South Africa (7 AM–5 PM)',
      summary: 'Premium, Modern & Productive',
      highlights: ['Lisbon sun + trams', 'World‑class cafés & coworking', 'Weekend trips by train'],
      overlap: 'Full workday overlap with South Africa',
      hoverCaption:
        'Time with SA: full workday overlap. Vibes: productive, cultural, balanced.',
      details: {
        workLife: 'Sophisticated work culture in Berlin, Amsterdam, and Lisbon. Excellent infrastructure with historic charm and modern amenities.',
        timezone: 'UTC+1 to UTC+2 (1-2 hours ahead of SA)',
        vibeWords: ['Sophisticated', 'Cultural', 'Connected']
      }
    },
  ];

  const handleRegionSelect = (regionId: string) => {
    onUpdate({ region: regionId });
  };

  const handleNext = () => {
    if (data.region) {
      onNext();
    }
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="text-center space-y-1">
        <h2 className="text-xl sm:text-2xl font-bold text-sb-navy-700">
          Where do you want to base yourself next?
        </h2>
        <p className="text-sb-navy-500 text-xs sm:text-sm">
          Pick a region to get started. Compare at a glance.
        </p>
      </div>

      {/* Region Cards (3-up on desktop) — travel poster layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {regions.map((region) => {
          const selected = data.region === region.id;
          const currentIdx = imgFallbackIndex[region.id] ?? -1;
          const currentSrc = currentIdx >= 0 && Array.isArray((region as any).fallbacks)
            ? (region as any).fallbacks[Math.min(currentIdx, (region as any).fallbacks.length - 1)]
            : region.bgImage;

          return (
            <button
              key={region.id}
              type="button"
              onClick={() => onUpdate({ region: region.id })}
              className={`group relative w-full h-[360px] sm:h-[380px] lg:h-[400px] rounded-[20px] overflow-hidden border-2 ${selected ? region.selectedColor : region.borderColor} hover:-translate-y-1 hover:shadow-lg transition-all duration-300 ${region.hoverRing}`}
            >
              {/* Background image */}
              <Image
                src={currentSrc}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                onError={() => setImgFallbackIndex(prev => ({ ...prev, [region.id]: (prev[region.id] ?? -1) + 1 }))}
              />

              {/* Soft dim layer */}
              <div className="absolute inset-0 bg-black/15" />

              {/* Top: Region name */}
              <div className="absolute top-4 left-4 right-4 text-white drop-shadow-sm">
                <div className="inline-flex items-center gap-2 bg-black/25 backdrop-blur-[2px] px-2.5 py-1.5 rounded-full">
                  <span className="text-lg">{region.icon}</span>
                  <span className="font-bold text-base sm:text-lg">{region.name}</span>
                </div>
              </div>

              {/* Bottom info overlay (~30%) */}
              <div className="absolute inset-x-0 bottom-0">
                <div className={`h-32 sm:h-36 lg:h-40 bg-gradient-to-t from-black/35 via-black/10 to-transparent`} />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <div className="bg-black/30 backdrop-blur-[3px] rounded-xl p-3">
                    <p className="text-xs uppercase tracking-wide opacity-90">{region.summary}</p>
                    <p className="text-sm sm:text-base font-semibold mt-1 leading-snug line-clamp-1">{region.description}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm">
                      <span className="inline-flex items-center gap-1.5"><span>{region.budgetCoins}</span><span>{region.budgetLabel}</span></span>
                      <span className="opacity-50">|</span>
                      <span className="inline-flex items-center gap-1.5"><span>{region.vibeIcon}</span><span>{region.vibeLine}</span></span>
                    </div>
                    <p className="mt-1.5 text-[11px] sm:text-xs opacity-90">⏰ {region.overlapWindow}</p>
                  </div>
                </div>
              </div>

              {/* Selected tick */}
              {selected && (
                <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 text-sb-navy-700 text-xs font-semibold shadow">
                  ✅ Selected
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <div className="flex justify-center pt-3">
        <button
          onClick={handleNext}
          disabled={!data.region}
          className={`px-6 py-2.5 rounded-full font-semibold transition-all duration-200 ${
            data.region
              ? 'bg-sb-orange-500 text-white hover:bg-sb-orange-600 hover:scale-105 shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Next: Lifestyle
        </button>
      </div>
    </div>
  );
};

export default RegionStep;
