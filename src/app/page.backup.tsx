import { Hero } from '@/components';
import { ShortCopySection } from '@/components/sections/ShortCopy';
import { WhosThisForSection } from '@/components';
import { HowItWorksSection } from '@/components/sections/HowItWorks';
import { GlobeSection } from '@/components/sections/GlobeSection';
import { Next90DaysSection } from '@/components/sections/Next90Days';
import { WorkReadySection } from '@/components/sections/WorkReady';
import { OurPromiseSection } from '@/components';
import { FAQsSection } from '@/components/sections/FAQs';
import { TravelRouteLine } from '@/components/TravelRouteLine';
import { TornPaperDivider, WashiTapeDivider } from '@/components/ui/TornPaperDivider';

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50/30">
      {/* 1. Hero with video background and boarding pass */}
      <Hero />

      {/* 2. Short copy section - Value proposition */}
      <ShortCopySection />

      <WashiTapeDivider className="z-10 -mt-3" />

      {/* 3. Who's this for - Let users identify themselves */}
      <WhosThisForSection />

      {/* Divider to How It Works */}
      <div className="relative z-10 -mt-1">
        <TornPaperDivider fill="#ffffff" direction="up" />
      </div>

      {/* 4. How it works - Explain the process */}
      <HowItWorksSection />

      {/* Route line transition */}
      <div className="relative -mt-12 mb-0 z-20 pointer-events-none">
        <TravelRouteLine className="py-0" icons={['plane', 'pin', 'sun']} direction="vertical" />
      </div>

      {/* Divider to Globe Section */}
      <div className="relative z-10 -mt-8">
        <TornPaperDivider fill="#f0fdf4" direction="down" />
      </div>

      {/* 5. Globe section - Region picker */}
      <GlobeSection />

      {/* Route line transition */}
      <div className="relative -mt-10 mb-0 z-20 pointer-events-none">
        <TravelRouteLine className="py-0" icons={['sun', 'plane', 'pin']} direction="diagonal" />
      </div>

      {/* Divider to Next 90 Days */}
      <div className="relative z-10 -mt-6">
        <TornPaperDivider fill="#FFF5EA" direction="up" />
      </div>

      {/* 6. Your next 90 days - Show the experience */}
      <Next90DaysSection />

      <WashiTapeDivider className="z-10 -mt-3 opacity-50" />

      {/* 7. Work-ready from day one - Practical details */}
      <WorkReadySection />

      {/* Route line transition */}
      <div className="relative -mt-12 mb-0 z-20 pointer-events-none">
        <TravelRouteLine className="py-0" icons={['pin', 'sun', 'plane']} direction="curved" />
      </div>

      {/* Divider to Our Promise */}
      <div className="relative z-10 -mt-8">
        <TornPaperDivider fill="#FDF6EF" direction="down" />
      </div>

      {/* 8. Our promise - Trust builder */}
      <OurPromiseSection />

      {/* 9. FAQs - Final objections */}
      <FAQsSection />
    </div>
  );
}
