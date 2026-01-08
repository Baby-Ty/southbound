import { Hero, PreFooterCTA } from '@/components';
import IntroSection from '@/components/sections/IntroSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import DestinationsGrid from '@/components/sections/DestinationsGrid';
import ExperienceSection from '@/components/sections/ExperienceSection';
import { FAQsSection } from '@/components/sections/FAQs';
import OurPromiseSection from '@/components/OurPromiseSection';
import { TornPaperDivider } from '@/components/ui/TornPaperDivider';

export default function AustraliaHome() {
  return (
    <div className="min-h-screen bg-white text-stone-900 font-sans selection:bg-[#E86B32] selection:text-white">
      <main>
        <Hero 
          tagline="For Aussies who want a change of pace, a bit more adventure, and less hassle getting set up overseas."
          description="We take care of the tricky bits so you can land and get on with life."
          communityText="Join other Australian nomads"
          currencyCode="AUD"
        />
        <IntroSection />
        
        <HowItWorksSection />
        
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
                        <OurPromiseSection 
                          embedded 
                          greeting=""
                          bodyParagraphs={[
                            "We started South Bound in South Africa to help people live and work overseas without all the drama.",
                            "Some Aussies we met along the way were interested too, so we are slowly opening things here and keeping it simple while we learn what works best.",
                            "Just a small team taking this one step at a time."
                          ]}
                          closing="Thanks for checking us out,"
                        />
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


