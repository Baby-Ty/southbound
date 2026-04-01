import { Hero, PreFooterCTA } from '@/components';
import IntroSection from '@/components/sections/IntroSection';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Lazy load below-the-fold sections for better performance
const DestinationsGrid = dynamic(() => import('@/components/sections/DestinationsGrid'), {
  loading: () => <div className="py-24 bg-white" />,
});

const ExperienceSection = dynamic(() => import('@/components/sections/ExperienceSection'), {
  loading: () => <div className="py-24 bg-stone-900" />,
});

const WorkReadySection = dynamic(() => import('@/components/sections/WorkReady').then(mod => ({ default: mod.WorkReadySection })), {
  loading: () => <div className="py-24 bg-[#FDF6EF]" />,
});

const OurPromiseSection = dynamic(() => import('@/components/OurPromiseSection'), {
  loading: () => <div className="min-h-[200px]" />,
});

const FAQsSection = dynamic(() => import('@/components/sections/FAQs').then(mod => ({ default: mod.FAQsSection })), {
  loading: () => <div className="min-h-[200px]" />,
});

const TornPaperDivider = dynamic(() => import('@/components/ui/TornPaperDivider').then(mod => ({ default: mod.TornPaperDivider })), {
  loading: () => null,
});

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-stone-900 font-sans selection:bg-[#E86B32] selection:text-white">
      <main>
        <Hero />
        <IntroSection />
        
        <WorkReadySection />

        <div className="relative">
          <div className="absolute top-0 left-0 right-0 z-10 -translate-y-1/2">
             {/* Optional Divider spot if needed later */}
          </div>
          <DestinationsGrid />
        </div>

        <ExperienceSection />
        
        {/* Combined Promise & FAQ Section */}
        <div className="bg-stone-50 py-24 border-t border-stone-200 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    <div className="sticky top-8">
                        <OurPromiseSection embedded />
                    </div>
                    <div>
                        <FAQsSection embedded />
                    </div>
                </div>
            </div>
        </div>

        <PreFooterCTA />
      </main>
    </div>
  );
}
