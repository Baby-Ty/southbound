export type Stop = {
  countryFlag: string;
  title: string;
  duration: string;
  summary: string;
  places: string[];
  highlights: {
    accommodation: string;
    workspace: string;
    lifestyle: string;
    community: string;
  };
};

export type ItineraryPreset = {
  regionLabel: string;
  base: string;
  workSetupSummary: string;
  duration: string;
  vibe: string;
  stops: Stop[];
  narrative: string;
  theme: 'latin' | 'europe' | 'asia';
};

export const ITINERARIES: Record<string, ItineraryPreset> = {
  'latin-america': {
    regionLabel: 'Latin America',
    base: 'Mexico City',
    workSetupSummary: 'Remote‑friendly apartments + local coworking',
    duration: '3–4 months',
    vibe: 'Social, sunny, and full of culture',
    theme: 'latin',
    stops: [
      {
        countryFlag: '🇲🇽',
        title: 'Mexico – CDMX & Playa del Carmen',
        duration: '6–8 weeks',
        summary:
          'Taco crawls, rooftop coworking, beach sunsets, and festivals like Día de los Muertos.',
        places: ['Roma Norte', 'Condesa', 'Playa Centro'],
        highlights: {
          accommodation: 'Private studios + co‑living near cafés',
          workspace: 'Cowork near La Condesa + beach cafés in Playa',
          lifestyle: 'Street food, mercados, Spanish classes, weekend cenote trips',
          community: 'Weekly meetups, Lucha Libre nights, taco tours',
        },
      },
      {
        countryFlag: '🇦🇷',
        title: 'Argentina – Buenos Aires & Patagonia',
        duration: '6–8 weeks',
        summary:
          'Wine tastings, open‑air tango, and summer weekends hiking and exploring nature.',
        places: ['Palermo Soho', 'Recoleta', 'Bariloche (optional)'],
        highlights: {
          accommodation: 'Bright apartments near parks',
          workspace: 'Modern cowork in Palermo + quiet cafés',
          lifestyle: 'Malbec tastings, parrillas, tango shows, day trips to Tigre',
          community: 'Language exchange nights, weekend wine country escapes',
        },
      },
      {
        countryFlag: '🇧🇷',
        title: 'Brazil – Rio & São Paulo',
        duration: '6–8 weeks',
        summary:
          'Beach life meets samba nights, great food, and Carnival energy when in season.',
        places: ['Ipanema', 'Botafogo', 'Vila Madalena'],
        highlights: {
          accommodation: 'Work‑ready stays near the beach or parks',
          workspace: 'Cowork hubs in Sampa + seaside Wi‑Fi cafés',
          lifestyle: 'Beach runs, samba, hiking Dois Irmãos, local food tours',
          community: 'Group hikes, football matches, weekend island trips',
        },
      },
    ],
    narrative:
      "You’ll start in vibrant Mexico City, spend weekends exploring beaches and food markets, hop down to Buenos Aires for summer wine nights, then finish with samba beats in Rio. We’ll handle remote‑ready stays, solid Wi‑Fi, and a balance of work and adventure.",
  },
  europe: {
    regionLabel: 'Europe',
    base: 'Lisbon',
    workSetupSummary: 'Apartments near cowork hubs + cafés',
    duration: '2–3 months',
    vibe: 'Coastal, creative, café‑friendly',
    theme: 'europe',
    stops: [
      {
        countryFlag: '🇵🇹',
        title: 'Portugal – Lisbon & Lagos',
        duration: '4–6 weeks',
        summary:
          'Tile‑lined streets, pastel de nata breaks, and sunset viewpoints after cowork.',
        places: ['Príncipe Real', 'Alfama', 'Lagos Marina'],
        highlights: {
          accommodation: 'Sunlit apartments with desks + AC',
          workspace: 'Cowork in Cais do Sodré + seaside cafés',
          lifestyle: 'Surf days, tram rides, wine bars, music nights',
          community: 'Welcome dinners, weekend coastal trips',
        },
      },
      {
        countryFlag: '🇪🇸',
        title: 'Spain – Barcelona & Valencia',
        duration: '4–6 weeks',
        summary:
          'Beach mornings, Gaudí afternoons, and tapas with new friends.',
        places: ['Gràcia', 'El Born', 'Ruzafa'],
        highlights: {
          accommodation: 'Walkable studios near metro',
          workspace: 'City‑center cowork + quiet corners',
          lifestyle: 'Tapas tours, paella classes, beach volleyball',
          community: 'Evening cowork sprints, weekend day trips',
        },
      },
      {
        countryFlag: '🇭🇷',
        title: 'Croatia – Split & Dubrovnik',
        duration: '3–4 weeks',
        summary:
          'Old‑town sunsets, island hops, and crystal‑blue swims between calls.',
        places: ['Split Old Town', 'Lapad', 'Hvar (optional)'],
        highlights: {
          accommodation: 'Historic apartments with strong Wi‑Fi',
          workspace: 'Seafront cowork + terrace setups',
          lifestyle: 'Island day trips, snorkeling, waterfront dinners',
          community: 'Boat days, hiking Marjan Hill',
        },
      },
    ],
    narrative:
      'Start in Lisbon for creative coastal energy, continue to Barcelona for design and tapas, then slow the pace on Croatia’s coast. Reliable work setups, easy transport, and plenty of golden hour views.',
  },
  'southeast-asia': {
    regionLabel: 'Southeast Asia',
    base: 'Bali',
    workSetupSummary: 'Villas with desks + resort‑style coworking',
    duration: '2–3 months',
    vibe: 'Tropical, mindful, and social',
    theme: 'asia',
    stops: [
      {
        countryFlag: '🇮🇩',
        title: 'Indonesia – Bali (Canggu & Ubud)',
        duration: '4–6 weeks',
        summary:
          'Smoothie bowls, surf mornings, and rainforest sunsets after cowork.',
        places: ['Canggu', 'Pererenan', 'Ubud'],
        highlights: {
          accommodation: 'Private rooms & villas with pools',
          workspace: 'Resort‑style cowork + cafés',
          lifestyle: 'Yoga passes, scooter days, waterfalls',
          community: 'Weekly dinners, island trips',
        },
      },
      {
        countryFlag: '🇻🇳',
        title: 'Vietnam – Da Nang & Hoi An',
        duration: '3–4 weeks',
        summary:
          'Coastal calm, coffee culture, and lantern‑lit evenings.',
        places: ['An Thuong', 'My Khe', 'Hoi An Old Town'],
        highlights: {
          accommodation: 'Modern studios near the beach',
          workspace: 'Beach‑adjacent cowork + cafés',
          lifestyle: 'Banh mi, motorbike coast rides, cooking classes',
          community: 'Group café crawls, weekend excursions',
        },
      },
      {
        countryFlag: '🇹🇭',
        title: 'Thailand – Chiang Mai & Koh Lanta',
        duration: '3–4 weeks',
        summary:
          'Temple mornings, night markets, and island sunsets.',
        places: ['Nimman', 'Old City', 'Long Beach'],
        highlights: {
          accommodation: 'Quiet condos + island bungalows',
          workspace: 'Cowork in Nimman + sea‑view cafés',
          lifestyle: 'Thai cooking, massages, national parks',
          community: 'Market meetups, island hop weekends',
        },
      },
    ],
    narrative:
      'Bali sets an easy, wellness‑oriented rhythm; Vietnam brings café culture; Thailand blends mindful mornings with island evenings. We’ll line up great Wi‑Fi and community moments along the way.',
  },
};

export function regionThemeClasses(theme: ItineraryPreset['theme']) {
  switch (theme) {
    case 'latin':
      return 'from-sb-orange-50 to-sb-beige-50';
    case 'europe':
      return 'from-sb-navy-100 to-sb-beige-50';
    case 'asia':
      return 'from-sb-mint-100 to-sb-teal-50';
  }
}

