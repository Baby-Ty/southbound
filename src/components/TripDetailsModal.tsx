'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { X, Calendar, MapPin, Users, Wifi, Coffee, Plane } from 'lucide-react';

interface Trip {
  _id: string;
  title: string;
  destination: string;
  duration: string;
  description: string;
  price: number;
  currency: string;
  imageUrl: string;
  category: string;
  featured: boolean;
  publishedAt: string;
}

interface TripDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip?: Trip;
  destination?: string;
  imageUrl?: string;
}

const TripDetailsModal: React.FC<TripDetailsModalProps> = ({
	isOpen,
	onClose,
	trip,
	destination,
	imageUrl,
}) => {
  const [prelaunchOpen, setPrelaunchOpen] = useState(false);
  
  if (!isOpen) return null;

  // Map trip data to detailed information based on destination
  const getTripDetails = (trip: Trip) => {
    const baseDetails = {
      participants: '8-16 people',
      nextDate: trip.publishedAt,
    };

    switch (trip._id) {
      case 'mexico-playa-del-carmen':
        return {
          ...baseDetails,
          nextDate: '1 November 2025',
          highlights: [
            'Unlimited access to a central coworking hub (hot‑desk membership)',
            'Welcome taco crawl and Mezcal tasting with other South Bounders',
            'Day trip to the Tulum ruins and Cenote Azul',
            'Optional diving at Cozumel reef'
          ],
          includes: [
            'Coworking membership',
            'High‑speed fibre WiFi',
            'Comfortable accommodation',
            'Local SIM card with data',
            'Airport transfer',
            'Weekly social events',
            '24/7 on‑call support'
          ],
          description: 'Swap the office for a Caribbean beachfront town. Our base includes a comfy apartment within walking distance of coworking spaces and the turquoise sea. Expect authentic Mexican food, lively nightlife and weekend excursions to Mayan ruins or cenotes.',
          badge: 'Featured Beach Escape'
        };
      
      case 'argentina-buenos-aires':
        return {
          ...baseDetails,
          nextDate: '1 December 2025',
          highlights: [
            'Modern coworking pass in Palermo with meeting rooms',
            'Private tango class and live milonga night',
            'Guided bike tour of historic San Telmo & La Boca',
            'Weekend excursion to Tigre delta by boat'
          ],
          includes: [
            'Accommodation in a chic apartment',
            'Coworking membership',
            'Fibre internet',
            'Local SIM',
            'Airport transfer',
            'Weekly Spanish lesson',
            'Community events',
            '24/7 support'
          ],
          description: 'Base yourself in the heart of Buenos Aires\' Palermo neighbourhood. The city blends European‑style architecture with Latin passion, offering countless cafés, cultural events and vibrant nightlife.',
          badge: 'Cultural & Nightlife'
        };

      case 'ecuador-cuenca':
        return {
          ...baseDetails,
          nextDate: '1 January 2026',
          highlights: [
            'Dedicated desk in a boutique coworking space (good WiFi)',
            'Guided hike in Cajas National Park (altitude acclimatisation)',
            'Spanish cooking class & market tour',
            'Coffee tasting at a local roastery'
          ],
          includes: [
            'Private room in a colonial apartment',
            'Coworking membership',
            'Fibre internet',
            'Local SIM',
            'Airport pick‑up from Guayaquil',
            'Group welcome dinner',
            'Weekly Spanish class',
            '24/7 support'
          ],
          description: 'Escape to the Ecuadorian highlands where cobblestone streets meet chic cafés and mountain vistas. Cuenca is clean, safe and incredibly affordable, making it ideal for buckling down on deep work or language study.',
          badge: 'Cultural Heritage'
        };

      case 'indonesia-canggu-bali':
        return {
          ...baseDetails,
          nextDate: '1 February 2026',
          highlights: [
            'Unlimited access to a beachfront coworking space',
            'Surf lesson & board rental included',
            'Traditional Balinese purification ritual at Tirta Empul temple',
            'Day trip to Ubud\'s rice terraces and waterfall'
          ],
          includes: [
            'Private villa or guesthouse room with pool',
            'Coworking membership',
            'High‑speed WiFi',
            'Scooter hire with helmet',
            'Local SIM',
            'Airport transfer',
            'Weekly yoga class',
            '24/7 on‑call support'
          ],
          description: 'Wake up to surfable waves, cycle to a stylish coworking loft and end your day with sunset yoga. Canggu is a digital‑nomad hub with excellent coworking spaces, a large community of remote workers and decent internet speeds.',
          badge: 'Surf & Wellness'
        };

      case 'vietnam-da-nang':
        return {
          ...baseDetails,
          nextDate: '15 March 2026',
          highlights: [
            'Hot‑desk membership at a local coworking space',
            'Guided street‑food tour (banh mi, bun cha and Vietnamese coffee)',
            'Day trip to the Marble Mountains and ancient Hoi An',
            'Optional surf lesson with board rental'
          ],
          includes: [
            'Modern serviced apartment',
            'Coworking membership',
            'Fibre internet',
            'Local SIM card',
            'Airport pick‑up',
            'Scooter hire',
            'Weekly Vietnamese cooking class',
            '24/7 support'
          ],
          description: 'Settle into an airy apartment near My Khe Beach and enjoy a blend of ocean breezes, mountain views and Vietnamese cuisine. Da Nang is praised for its low living costs, tasty food and good internet.',
          badge: 'Beach & Mountain'
        };

      case 'georgia-tbilisi':
        return {
          ...baseDetails,
          nextDate: '1 April 2026',
          highlights: [
            'Premium desk at a central coworking space (fast fibre)',
            'Day trip to the Kakheti wine region with tastings',
            'Cable‑car ride to the Narikala Fortress & sulphur‑bath experience',
            'Weekend hike in the Caucasus mountains'
          ],
          includes: [
            'Stylish apartment in the historic centre',
            'Coworking membership',
            'Fibre internet',
            'Local SIM',
            'Airport transfer',
            'Monthly Georgian cooking class',
            'Weekly wine tasting',
            '24/7 on‑call support'
          ],
          description: 'Live in the Georgian capital, where cobblestone streets lead to sulphur baths, wine cellars and the foothills of the Caucasus. Georgia\'s visa allows a year‑long stay, mobile data is cheap, and outdoor lovers will appreciate the proximity to hikes.',
          badge: 'Adventure & History'
        };

      default:
        return {
          ...baseDetails,
          highlights: ['Modern coworking spaces', 'Cultural experiences', 'Local community', 'Adventure activities'],
          includes: ['Accommodation', 'Coworking access', 'High-speed internet', 'Local support'],
          description: trip.description,
          badge: 'Digital Nomad Experience'
        };
    }
  };

	// Build a resilient trip object when only destination/image are provided
	const resolvedTrip: Trip = trip ?? {
		_id: (destination || 'trip')
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, '')
			.replace(/\s+/g, '-')
			.substring(0, 60),
		title: destination || 'Trip',
		destination: destination || 'Unknown destination',
		duration: 'To be announced',
		description: 'Details coming soon. Check back for updated itinerary, inclusions and dates.',
		price: 0,
		currency: 'ZAR',
		category: 'popular',
		featured: false,
		publishedAt: new Date().toISOString().slice(0, 10),
		imageUrl: imageUrl || 'https://picsum.photos/800/400?random=100',
	};

	const tripDetails = getTripDetails(resolvedTrip);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg"
          >
            <X className="w-5 h-5 text-sb-navy-700" />
          </button>

          {/* Hero Image */}
          <div className="relative h-80 overflow-hidden">
				<Image
					src={resolvedTrip.imageUrl}
					alt={resolvedTrip.destination}
					fill
					className="object-cover"
				/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            
            {/* Destination Badge */}
            <div className="absolute bottom-6 left-6">
              <div className="bg-white/95 backdrop-blur-sm text-sb-navy-700 px-4 py-2 rounded-full font-bold text-lg shadow-lg">
					{resolvedTrip.destination}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-sb-navy-700 mb-2">
					{resolvedTrip.title}
              </h2>
              
              {/* Key Details */}
              <div className="flex flex-wrap gap-6 text-sm text-sb-navy-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
						<span>{resolvedTrip.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{tripDetails.participants}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>Next: {tripDetails.nextDate}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-xl font-semibold text-sb-navy-700 mb-3">About This Experience</h3>
                  <p className="text-sb-navy-600 leading-relaxed">
                    {tripDetails.description}
                  </p>
                </div>

                {/* Highlights */}
                <div>
                  <h3 className="text-xl font-semibold text-sb-navy-700 mb-3">Trip Highlights</h3>
                  <ul className="space-y-2">
                    {tripDetails.highlights.map((highlight: string, index: number) => (
                      <li key={index} className="flex items-start gap-3 text-sb-navy-600">
                        <div className="w-2 h-2 bg-sb-orange-500 rounded-full mt-2 flex-shrink-0" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* What's Included */}
                <div>
                  <h3 className="text-xl font-semibold text-sb-navy-700 mb-3">What's Included</h3>
                  <ul className="space-y-2">
                    {tripDetails.includes.map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-3 text-sb-navy-600">
                        <div className="w-5 h-5 bg-sb-mint-300 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 bg-sb-navy-700 rounded-full" />
                        </div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Work Features */}
                <div className="bg-sb-beige-100 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-sb-navy-700 mb-4">Remote Work Ready</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sb-navy-600">
                      <Wifi className="w-4 h-4 text-sb-teal-600" />
                      <span className="text-sm">High-Speed WiFi</span>
                    </div>
                    <div className="flex items-center gap-2 text-sb-navy-600">
                      <Coffee className="w-4 h-4 text-sb-orange-500" />
                      <span className="text-sm">Co-working Space</span>
                    </div>
                    <div className="flex items-center gap-2 text-sb-navy-600">
                      <Plane className="w-4 h-4 text-sb-mint-600" />
                      <span className="text-sm">Airport Transfers</span>
                    </div>
                    <div className="flex items-center gap-2 text-sb-navy-600">
                      <Users className="w-4 h-4 text-sb-navy-600" />
                      <span className="text-sm">24/7 Support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-8 pt-8 border-t border-sb-navy-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-3xl font-bold text-sb-navy-700">
						R{resolvedTrip.price.toLocaleString()}
                  </div>
                  <div className="text-sm text-sb-navy-600">
                    per month • all-inclusive
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button onClick={() => setPrelaunchOpen(true)} className="px-6 py-3 border-2 border-sb-orange-500 text-sb-orange-500 font-semibold rounded-full hover:bg-sb-orange-50 transition-colors">
                    Save for Later
                  </button>
                  <button onClick={() => setPrelaunchOpen(true)} className="px-8 py-3 bg-sb-orange-500 hover:bg-sb-orange-600 text-white font-semibold rounded-full transition-all hover:scale-105 shadow-medium">
                    Reserve Your Spot
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {prelaunchOpen && (
        // Inline import to avoid cyclic deps; this modal is light-weight
        (() => {
          const Prelaunch = require('./PrelaunchModal').default;
          return <Prelaunch isOpen={prelaunchOpen} onClose={() => setPrelaunchOpen(false)} />;
        })()
      )}
    </div>
  );
};

export default TripDetailsModal; 