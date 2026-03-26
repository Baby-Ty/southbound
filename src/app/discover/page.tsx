'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { RegionKey } from '@/lib/cityPresets';
import { VibeKey } from '@/components/discover/VibeSelector';
import RegionSelector from '@/components/discover/RegionSelector';
import VibeSelector from '@/components/discover/VibeSelector';
import TripResults from '@/components/discover/TripResults';
import LeadCaptureForm from '@/components/discover/LeadCaptureForm';

// Force dynamic rendering since we use searchParams
export const dynamic = 'force-dynamic';

function DiscoverPageContent() {
  const searchParams = useSearchParams();
  const [selectedRegions, setSelectedRegions] = useState<RegionKey[]>([]);
  const [selectedVibes, setSelectedVibes] = useState<VibeKey[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [preselectedTemplateId, setPreselectedTemplateId] = useState<string | null>(null);
  const [hasScrolledToVibe, setHasScrolledToVibe] = useState(false);
  const [hasScrolledToResults, setHasScrolledToResults] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  const vibeRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Initialize from URL params on mount
  useEffect(() => {
    if (hasInitialized) return;

    const region = searchParams.get('region') as RegionKey | null;
    const vibeParam = searchParams.get('vibe') as VibeKey | null;
    const templateId = searchParams.get('template');

    if (region && ['europe', 'latin-america', 'southeast-asia'].includes(region)) {
      setSelectedRegions([region]);
      setHasScrolledToVibe(true);
    }

    if (vibeParam && ['beach', 'city-culture', 'adventure-wellness'].includes(vibeParam)) {
      setSelectedVibes([vibeParam]);
      setHasScrolledToResults(true);
    }

    if (templateId) {
      setPreselectedTemplateId(templateId);
    }

    setHasInitialized(true);
  }, [searchParams, hasInitialized]);

  // Auto-scroll to vibe section when region selected
  useEffect(() => {
    if (selectedRegions.length > 0 && vibeRef.current && !hasScrolledToVibe) {
      setHasScrolledToVibe(true);
      setTimeout(() => {
        const isMobile = window.innerWidth < 768;
        vibeRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: isMobile ? 'start' : 'center'
        });
      }, 600);
    }

    if (selectedRegions.length === 0) {
      setHasScrolledToVibe(false);
    }
  }, [selectedRegions.length, hasScrolledToVibe]);

  // Auto-scroll to results when vibe selected
  useEffect(() => {
    if (selectedVibes.length > 0 && resultsRef.current && !hasScrolledToResults) {
      setHasScrolledToResults(true);
      setTimeout(() => {
        if (vibeRef.current) {
          const vibeRect = vibeRef.current.getBoundingClientRect();
          const vibeTop = vibeRect.top + window.scrollY;
          window.scrollTo({
            top: vibeTop - 20,
            behavior: 'smooth'
          });
        }
      }, 600);
    }

    if (selectedVibes.length === 0) {
      setHasScrolledToResults(false);
    }
  }, [selectedVibes.length, hasScrolledToResults]);

  const handleRegionToggle = (region: RegionKey) => {
    setSelectedRegions((prev) =>
      prev.includes(region) ? prev.filter((r) => r !== region) : [...prev, region]
    );
  };

  const handleVibeToggle = (vibe: VibeKey) => {
    setSelectedVibes((prev) =>
      prev.includes(vibe) ? prev.filter((v) => v !== vibe) : [...prev, vibe]
    );
  };

  const sectionRevealVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      height: 'auto',
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
        opacity: { duration: 0.3, delay: 0.1 },
        height: { duration: 0.4 },
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-2 sm:pt-6 pb-24 sm:pb-32">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 space-y-8 sm:space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 pt-2">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-sb-navy-900 tracking-tight mb-4">
              Let&apos;s discover your
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sb-orange-500 to-sb-orange-600">
                next adventure
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-sb-navy-600 max-w-2xl mx-auto">
              Answer a couple of quick questions and we&apos;ll match you with the right remote work destinations
            </p>
          </motion.div>
        </div>

        {/* Step 1: Region Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <RegionSelector selectedRegions={selectedRegions} onRegionToggle={handleRegionToggle} />
        </motion.div>

        {/* Divider */}
        {selectedRegions.length > 0 && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5 }}
            className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent origin-center"
          />
        )}

        {/* Step 2: Vibe Selection */}
        <AnimatePresence mode="wait">
          {selectedRegions.length > 0 && (
            <motion.div
              ref={vibeRef}
              key="vibe"
              variants={sectionRevealVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={selectedVibes.length > 0 ? 'sticky top-0 z-30 bg-[#FDFDFD] pt-2 sm:pt-4 pb-2 sm:pb-4 -mt-2 sm:-mt-4' : ''}
            >
              <VibeSelector
                selectedVibes={selectedVibes}
                onVibeToggle={handleVibeToggle}
                isCompact={selectedVibes.length > 0}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Divider */}
        {selectedVibes.length > 0 && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5 }}
            className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent origin-center"
          />
        )}

        {/* Step 3: Trip Results & Lead Capture */}
        <AnimatePresence mode="wait">
          {selectedVibes.length > 0 && (
            <motion.div
              ref={resultsRef}
              key="results"
              variants={sectionRevealVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-12"
            >
              <TripResults
                selectedRegions={selectedRegions}
                selectedVibes={selectedVibes}
                preselectedTemplateId={preselectedTemplateId}
                onTripSelect={setSelectedRouteId}
              />

              {/* Divider before form */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent origin-center"
              />

              <div id="lead-capture-form">
                <LeadCaptureForm
                  selectedRegions={selectedRegions}
                  selectedVibes={selectedVibes}
                  selectedRouteId={selectedRouteId}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <DiscoverPageContent />
    </Suspense>
  );
}
