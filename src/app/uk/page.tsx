import { Hero, PreFooterCTA } from '@/components';
import IntroSection from '@/components/sections/IntroSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import DestinationsGrid from '@/components/sections/DestinationsGrid';
import ExperienceSection from '@/components/sections/ExperienceSection';
import { FAQsSection } from '@/components/sections/FAQs';
import OurPromiseSection from '@/components/OurPromiseSection';
import { TornPaperDivider } from '@/components/ui/TornPaperDivider';

export default function UKHome() {
  return (
    <div className="min-h-screen bg-white text-stone-900 font-sans selection:bg-[#E86B32] selection:text-white">
      <main>
        <Hero 
          tagline="For Brits who want a change of scenery, more daylight, and a routine that does not feel like copy and paste."
          description="We handle the setup so you can get on with the good stuff."
          communityText="Join other British nomads"
          currencyCode="GBP"
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
                            "We started South Bound in South Africa to help people work from new places without getting buried in admin.",
                            "A few friends in the UK asked if they could use it too, so we are slowly opening things here and taking it one step at a time.",
                            "Nothing polished or corporate. Just a small team trying to make working abroad feel doable."
                          ]}
                          closing="Thanks for being here,"
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


