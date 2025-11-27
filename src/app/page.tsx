import { Hero } from '@/components';
import IntroSection from '@/components/sections/IntroSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import DestinationsGrid from '@/components/sections/DestinationsGrid';
import ExperienceSection from '@/components/sections/ExperienceSection';
import { FAQsSection } from '@/components/sections/FAQs';
import OurPromiseSection from '@/components/OurPromiseSection';
import Link from 'next/link';
import { TornPaperDivider } from '@/components/ui/TornPaperDivider';

const PreFooterCTA = () => (
  <section className="py-24 bg-[#E86B32] text-white text-center relative overflow-hidden">
    {/* Background decoration */}
    <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
    <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-600/20 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>
    
    <div className="relative z-10 max-w-3xl mx-auto px-4">
      <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">
        Stop dreaming. <br/> Start packing.
      </h2>
      <p className="text-xl text-orange-100 mb-10 max-w-2xl mx-auto">
        Your desk is ready in Bali. Your community is waiting in Cape Town. 
        All you have to do is click.
      </p>
      <Link 
        href="/route-builder"
        className="inline-flex items-center justify-center px-10 py-5 bg-white text-[#E86B32] font-bold rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:bg-stone-50 hover:scale-105"
      >
        Build your itinerary now
      </Link>
      <p className="mt-6 text-sm text-orange-200 opacity-80">
        No credit card required to start planning.
      </p>
    </div>
  </section>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-stone-900 font-sans selection:bg-[#E86B32] selection:text-white">
      
      <main>
        <Hero />
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
