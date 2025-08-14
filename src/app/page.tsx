import { 
  Hero, 
  AboutSection, 
  WhosThisForSection, 
  DestinationsSection, 
  HowItWorksSection, 
  OurPromiseSection, 
  LetsChatForm,
  FeaturesSection,
  FAQSection
} from '@/components';
import { client, queries } from '@/lib/sanity'
import { TripCard, FAQ } from '@/types/sanity'
import { mockTrips } from '@/lib/mockData'

// This function runs at build time for static generation
async function getTrips(): Promise<TripCard[]> {
  try {
    const trips = await client.fetch(queries.allTrips)
    // Return mock data if no trips found or if Sanity is not configured
    return trips.length > 0 ? trips : mockTrips
  } catch (error) {
    console.error('Error fetching trips from Sanity, using mock data:', error)
    return mockTrips
  }
}

// This function runs at build time for static generation
async function getFaqs(): Promise<FAQ[]> {
  try {
    const faqs = await client.fetch(queries.allFaqs)
    return faqs
  } catch (error) {
    console.error('Error fetching FAQs:', error)
    return []
  }
}

export default async function Home() {
  const trips = await getTrips()
  const faqs = await getFaqs()

  return (
    <div className="bg-sb-beige-100">
      {/* New Hero Section */}
      <Hero />

      {/* About Section */}
      <AboutSection />

      {/* Who's This For Section */}
      <WhosThisForSection />

      {/* Destinations Section */}
      <DestinationsSection trips={trips} />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Our Promise Section */}
      <OurPromiseSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Let's Chat Form */}
      <LetsChatForm />

      {/* FAQ Section */}
      <FAQSection faqs={faqs} title="FAQs" />
    </div>
  );
}
