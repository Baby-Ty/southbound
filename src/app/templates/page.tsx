'use client';

import React, { useMemo, useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { RegionKey } from '@/lib/cityPresets';
import { TRIP_TEMPLATES, TripTemplate } from '@/lib/tripTemplates';
import { VibeKey } from '@/components/discover/VibeSelector';

// Force dynamic rendering since we use searchParams
export const dynamic = 'force-dynamic';

const REGION_ORDER: RegionKey[] = ['southeast-asia', 'latin-america', 'europe'];

const REGION_DETAILS: Record<RegionKey, { label: string; emoji: string; accent: string }> = {
  'southeast-asia': {
    label: 'Southeast Asia',
    emoji: '🌴',
    accent: 'from-sb-teal-500 to-sb-teal-600',
  },
  'latin-america': {
    label: 'Latin America',
    emoji: '🌶️',
    accent: 'from-sb-orange-500 to-sb-orange-600',
  },
  europe: {
    label: 'Europe',
    emoji: '🗺️',
    accent: 'from-sb-navy-600 to-sb-navy-700',
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

function TemplatesPageContent() {
  const [selectedRegion, setSelectedRegion] = useState<RegionKey>('southeast-asia');
  const [apiTemplates, setApiTemplates] = useState<Record<RegionKey, TripTemplate[]>>({} as Record<RegionKey, TripTemplate[]>);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Fetch templates from API
  useEffect(() => {
    async function fetchTemplates() {
      try {
        const { apiUrl } = await import('@/lib/api');
        const templatesData: Record<RegionKey, TripTemplate[]> = {
          'europe': [],
          'latin-america': [],
          'southeast-asia': [],
        };
        
        // Fetch templates for each region
        for (const region of REGION_ORDER) {
          const response = await fetch(apiUrl(`trip-templates?region=${region}&enabled=true`));
          if (response.ok) {
            const data = await response.json();
            templatesData[region] = data.templates || [];
          }
        }
        
        setApiTemplates(templatesData);
      } catch (error) {
        console.error('Error fetching templates:', error);
        // Fallback to static templates
        setApiTemplates(TRIP_TEMPLATES);
      } finally {
        setLoadingTemplates(false);
      }
    }
    
    fetchTemplates();
  }, []);

  // Handle deep linking - scroll to template from URL parameter
  useEffect(() => {
    if (loadingTemplates) return;

    const expandedParam = searchParams.get('expanded');
    if (expandedParam) {
      let foundRegion: RegionKey | null = null;
      for (const region of REGION_ORDER) {
        const templates = apiTemplates[region] || [];
        const template = templates.find(t => t.id === expandedParam);
        if (template) {
          foundRegion = region;
          break;
        }
      }
      if (foundRegion) setSelectedRegion(foundRegion);
      setTimeout(() => {
        const element = document.getElementById(`template-${expandedParam}`);
        if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    }
  }, [searchParams, apiTemplates, loadingTemplates]);

  const templates = useMemo(
    () => apiTemplates[selectedRegion] || [],
    [selectedRegion, apiTemplates]
  );

  // Auto-map template tags to vibes
  const determineVibes = (tags: string[]): VibeKey[] => {
    const beachTags = ['beach', 'coastal', 'surf', 'tropical', 'island', 'relaxed'];
    const cityTags = ['urban', 'culture', 'city', 'food', 'nightlife', 'history', 'art', 'nomad', 'community', 'coworking', 'startup'];
    const adventureTags = ['mountain', 'wellness', 'yoga', 'spiritual', 'nature', 'hiking', 'adventure'];

    const vibeScores: Record<VibeKey, number> = {
      'beach': 0,
      'city-culture': 0,
      'adventure-wellness': 0,
    };

    tags.forEach(tag => {
      if (beachTags.includes(tag)) vibeScores['beach']++;
      if (cityTags.includes(tag)) vibeScores['city-culture']++;
      if (adventureTags.includes(tag)) vibeScores['adventure-wellness']++;
    });

    // Return top 2 vibes sorted by score
    return (Object.entries(vibeScores) as [VibeKey, number][])
      .filter(([_, score]) => score > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2)
      .map(([vibe]) => vibe);
  };

  const handleBuildRoute = (template: TripTemplate) => {
    const matchedVibes = determineVibes(template.tags);
    const params = new URLSearchParams({
      region: template.region,
      vibes: matchedVibes.join(','),
      template: template.id,
    });
    router.push(`/discover?${params.toString()}`);
  };


  if (loadingTemplates) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sb-beige-100 via-white to-sb-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#E86B32] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-stone-600 font-medium">Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sb-beige-100 via-white to-sb-teal-50">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.9),transparent_60%)]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-5 py-2 text-sm font-semibold text-sb-navy-700 shadow-sm">
              <span className="text-base">✨</span>
              Curated trip templates with popular routes
            </div>
            <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-black text-sb-navy-900">
              Find your next <span className="text-sb-orange-500">route</span>
            </h1>
            <p className="mt-4 text-base md:text-lg text-sb-navy-600 max-w-2xl mx-auto">
              Browse ready-made itineraries across the world’s top remote work regions.
              Each template includes a popular city route you can build on.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="sticky top-0 z-10 bg-white/80 backdrop-blur border-y border-white/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-sb-navy-700">Region</span>
              <div className="flex flex-wrap gap-2">
                {REGION_ORDER.map((region) => {
                  const isActive = selectedRegion === region;
                  return (
                    <button
                      key={region}
                      onClick={() => setSelectedRegion(region)}
                      className={`relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                        isActive
                          ? 'text-white shadow-md'
                          : 'text-sb-navy-700 bg-sb-beige-100 hover:bg-sb-beige-200'
                      }`}
                    >
                      <span>{REGION_DETAILS[region].emoji}</span>
                      {REGION_DETAILS[region].label}
                      {isActive && (
                        <motion.span
                          layoutId="region-pill"
                          className={`absolute inset-0 -z-10 rounded-full bg-gradient-to-r ${REGION_DETAILS[region].accent}`}
                          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="text-sm text-sb-navy-600">
              {templates.length} {templates.length === 1 ? 'template' : 'templates'} in{' '}
              <span className="font-semibold text-sb-navy-800">{REGION_DETAILS[selectedRegion].label}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-auto"
            style={{ gridAutoFlow: 'dense' }}
          >
            {templates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isExpanded={false}
                onClick={() => {}}
                onBuildRoute={() => handleBuildRoute(template)}
              />
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function TemplateCard({
  template,
}: {
  template: TripTemplate;
  isExpanded: boolean;
  onClick: (el: HTMLElement | null) => void;
  onBuildRoute: () => void;
}) {
  const duration = `${template.presetCities.length * 30} days`;

  return (
    <motion.article
      id={`template-${template.id}`}
      layout
      variants={itemVariants}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 250, damping: 22 }}
      className="group relative overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-gray-100 hover:shadow-xl flex flex-col"
    >
      {/* Image */}
      <Link href={`/templates/${template.id}`} className="block relative aspect-[4/3] flex-shrink-0">
        <Image
          src={template.imageUrl}
          alt={template.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

        {/* Duration badge */}
        <div className="absolute top-3 right-3 rounded-full bg-black/40 backdrop-blur-sm text-white text-xs font-bold px-3 py-1">
          {duration}
        </div>

        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <span className="text-xl">{template.icon}</span>
            <span>{template.name}</span>
          </div>
          <p className="mt-1 text-xs text-white/85 line-clamp-2">
            {template.description}
          </p>
        </div>
      </Link>

      {/* Body */}
      <div className="p-5 space-y-3 flex flex-col flex-1">
        {/* Route */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-sb-navy-500 mb-1.5">
            Popular route
          </p>
          <div className="flex flex-wrap items-center gap-1.5 text-sm text-sb-navy-800">
            {template.presetCities.map((city, idx) => (
              <span key={city} className="inline-flex items-center gap-1.5">
                <span className="rounded-full bg-sb-beige-100 px-3 py-1 font-medium text-xs">
                  {city}
                </span>
                {idx < template.presetCities.length - 1 && (
                  <span className="text-sb-navy-300 text-xs">→</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Tags + price row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {template.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-sb-teal-50 px-2.5 py-0.5 text-xs font-semibold text-sb-teal-700"
              >
                {tag}
              </span>
            ))}
          </div>
          {template.price && (
            <span className="text-xs font-black text-sb-orange-500 whitespace-nowrap">{template.price}</span>
          )}
        </div>

        {/* CTA */}
        <div className="pt-1 mt-auto">
          <Link
            href={`/templates/${template.id}`}
            className="block w-full text-center py-2.5 px-4 bg-gradient-to-r from-sb-orange-500 to-sb-orange-600 hover:from-sb-orange-600 hover:to-sb-orange-700 text-white text-sm font-bold rounded-full transition-all shadow hover:shadow-lg"
          >
            View itinerary →
          </Link>
        </div>
      </div>
    </motion.article>
  );
}


export default function TemplatesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading templates...</div>}>
      <TemplatesPageContent />
    </Suspense>
  );
}
