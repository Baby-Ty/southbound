export interface CoworkingSpace {
  name: string;
  description: string;
  price: string;
}

export interface Neighbourhood {
  name: string;
  description: string;
  bestFor: string;
  monthlyRent: string;
}

export interface NomadScore {
  factor: string;
  score: number;
  note: string;
}

export interface Activity {
  name: string;
  description: string;
  emoji: string;
}

export interface SectionImages {
  food: string;
  activities: string;
  sights: string;
  remoteWork: string;
}

export interface CityData {
  slug: string;
  name: string;
  country: string;
  region: string;
  flag: string;
  tagline: string;
  heroImage: string;
  altText: string;
  sectionImages: SectionImages;
  overview: string;
  quickStats: {
    monthlyBudget: string;
    nomadRating: number;
    bestMonths: string;
    visaFree: string;
  };
  culture: {
    description: string;
    highlights: string[];
  };
  food: {
    description: string;
    mustTry: string[];
    budgetBreakdown: {
      street: string;
      midRange: string;
      premium: string;
    };
    topAreas: string[];
  };
  activities: Activity[];
  sights: {
    mustSee: { name: string; note: string }[];
    livedIn: { name: string; note: string }[];
  };
  neighbourhoods: Neighbourhood[];
  costOfLiving: {
    accommodation: { budget: string; mid: string; premium: string };
    coworking: { dayPass: string; monthly: string };
    food: { budget: string; mid: string; premium: string };
    transport: { budget: string; mid: string; premium: string };
    gym: { budget: string; mid: string; premium: string };
    total: { budget: string; mid: string; premium: string };
    note: string;
  };
  weekInTheLife: { label: string; description: string }[];
  theCatch: string;
  remoteWork: {
    internetQuality: string;
    internetRating: number;
    coworkingSpaces: CoworkingSpace[];
    cafes: string;
  };
  visa: {
    headline: string;
    details: string[];
    longerStay: string;
    flag: string | null;
  };
  nomadRating: {
    overall: number;
    scores: NomadScore[];
    summary: string;
  };
  bestTime: {
    ideal: string;
    shoulder: string;
    avoid: string;
    recommendation: string;
  };
  practicalTips: { title: string; body: string }[];
}

const cities: CityData[] = [
  {
    slug: 'chiang-mai',
    name: 'Chiang Mai',
    country: 'Thailand',
    region: 'Southeast Asia',
    flag: '🇹🇭',
    tagline: "The nomad capital of Southeast Asia. Temples, jungle, and a community that's got it figured out.",
    heroImage: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1600&q=80',
    altText: 'Wat Prathat Doi Suthep temple overlooking Chiang Mai valley, Thailand',
    sectionImages: {
      food: 'https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?auto=format&fit=crop&w=1400&q=75',
      activities: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?auto=format&fit=crop&w=1400&q=75',
      sights: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=1400&q=75',
      remoteWork: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=75',
    },
    overview:
      'Chiang Mai is the city people come to for a month and stay for a year. It sits in a valley surrounded by jungle and mountains in northern Thailand, and it has quietly built one of the most functional remote-work ecosystems anywhere on the planet. The infrastructure is excellent, the cost of living is low, and the community of people doing exactly what you are doing is bigger here than almost anywhere else. It is the best starting point in Southeast Asia.',
    quickStats: {
      monthlyBudget: 'R27,000 – R41,000',
      nomadRating: 8.5,
      bestMonths: 'Nov – Feb',
      visaFree: '60 days',
    },
    culture: {
      description:
        'Daily life in Chiang Mai blends deep Buddhist culture with a modern, globally connected community. The Old City is genuinely lived-in, not a tourist set piece. Monks do morning alms rounds, locals shop at traditional markets, and temples are places of actual devotion. Outside the walls, the Nimman neighbourhood hums with cafes, coworking spaces, galleries, and a social scene built entirely around people who work remotely. It is easy to go as deep into local culture as you want, or to stay in the nomad bubble, and neither is wrong.',
      highlights: [
        'Active Buddhist temples with monk chats open to visitors',
        'Night markets and walking streets every weekend',
        'Huge crossfit and fitness community',
        'Regular nomad meetups and events',
        'Genuine Thai neighbourhoods alongside expat areas',
      ],
    },
    food: {
      description:
        'Northern Thailand has its own distinct food culture and Chiang Mai is the best place to experience it. Khao soi, the coconut curry noodle soup, is the dish you will eat weekly. Street food is excellent and costs almost nothing. Nimman has upscale options and trendy cafes for when you want something different. You can eat extremely well here on any budget.',
      mustTry: [
        'Khao soi (coconut curry noodle soup)',
        'Sai oua (northern Thai sausage)',
        'Larb (spiced meat salad)',
        'Mango sticky rice from street carts',
        'Khao niao mamuang (coconut rice)',
      ],
      budgetBreakdown: {
        street: 'R27 – R36 per meal at night markets and street stalls',
        midRange: 'R90 – R200 at local restaurants and Nimman cafes',
        premium: 'R270+ at upscale Nimman restaurants',
      },
      topAreas: ['Chang Phuak Gate night market', 'Nimman for cafes and fusion', 'Night Bazaar for variety'],
    },
    activities: [
      {
        name: 'Doi Suthep Temple',
        description: "Take the cable car or hike the Monk's Trail to the golden temple overlooking the entire valley. One of the most iconic views in Thailand.",
        emoji: '⛩️',
      },
      {
        name: 'Thai Cooking Class',
        description: 'Full-day classes where you visit a market, learn 6+ dishes, and eat everything you make. Budget R360 to R540. You will cook better Thai food than most restaurants serve.',
        emoji: '🍜',
      },
      {
        name: 'Elephant Nature Park',
        description: 'Ethical elephant sanctuary with no riding. Spend a day feeding and walking with rescued elephants. Book well in advance.',
        emoji: '🐘',
      },
      {
        name: 'Monk Chat at Wat Suan Dok',
        description: 'Free conversations with student monks about Buddhism, daily life, and philosophy. Genuinely interesting and easy to arrange.',
        emoji: '🧘',
      },
      {
        name: 'Saturday and Sunday Walking Streets',
        description: 'The Old City transforms into a giant night market on weekends. Street food, crafts, live music, and local life all in one place.',
        emoji: '🌙',
      },
      {
        name: 'Doi Inthanon National Park',
        description: "Thailand's highest peak with hiking trails, waterfalls, and royal pagodas. A half-day trip that feels completely removed from the city.",
        emoji: '🌿',
      },
      {
        name: 'Day Trip to Pai',
        description: 'Three-hour drive into the mountains to a small town with waterfalls, hot springs, and a relaxed hippie vibe. Good for a long weekend.',
        emoji: '🏞️',
      },
      {
        name: 'Chiang Rai and the White Temple',
        description: 'A long day trip to see Wat Rong Khun, the most visually striking temple in Thailand, and the Black House nearby.',
        emoji: '🏛️',
      },
      {
        name: 'Traditional Thai Massage',
        description: 'Drop-in foot or full-body massage from R72 to R130. Good schools and independent therapists are everywhere.',
        emoji: '💆',
      },
    ],
    sights: {
      mustSee: [
        { name: 'Wat Prathat Doi Suthep', note: 'Iconic golden temple on the mountain. Worth the trip.' },
        { name: 'Wat Chedi Luang', note: 'Ruined 15th-century stupa in the heart of the Old City.' },
        { name: 'Night Bazaar', note: 'Chaotic and touristy, but it is a real part of the city.' },
      ],
      livedIn: [
        { name: 'Tha Phae Gate at sunset', note: 'The old city wall entrance where locals gather every evening.' },
        { name: 'Chang Phuak Gate night market', note: 'Street food run by the same families for decades. Queue for the lady with the cowboy hat.' },
        { name: 'Nimman morning walk', note: 'Grab coffee and walk the main strip. This is where the nomad community lives.' },
        { name: 'Santitham local market', note: 'Real neighbourhood market. No tourists. Just cheap produce and local life.' },
      ],
    },
    neighbourhoods: [
      {
        name: 'Nimman (Nimmanhaemin)',
        description:
          'The nomad neighbourhood. Modern, walkable, packed with coworking spaces, cafes, and boutique shops. The most connected and convenient area to be based in, with the easiest social access.',
        bestFor: 'First-timers, those who want built-in community and convenience',
        monthlyRent: 'R5,000 – R12,600 for a studio or 1-bed',
      },
      {
        name: 'Old City',
        description:
          'The walled centre of Chiang Mai. Temples on every corner, local markets, traditional guesthouses and newer apartments. More cultural depth than Nimman, slightly cheaper, and a great base if you want to feel more connected to the actual city.',
        bestFor: 'Culture seekers, longer stays, people who prefer local over expat',
        monthlyRent: 'R4,000 – R7,600 for a studio or 1-bed',
      },
      {
        name: 'Santitham',
        description:
          'Just north of the Old City. A genuinely local Thai neighbourhood that happens to be close enough to everything. Cheaper than both Nimman and the Old City, with good food options, minimal tourists, and a real neighbourhood feel.',
        bestFor: 'Budget-conscious remote workers who still want access to nomad infrastructure',
        monthlyRent: 'R3,000 – R6,000 for a studio or 1-bed',
      },
    ],
    costOfLiving: {
      accommodation: { budget: 'R2,700 – R4,000', mid: 'R5,000 – R7,600', premium: 'R9,000+' },
      coworking: { dayPass: 'R90 – R220/day', monthly: 'R1,500 – R4,500' },
      food: { budget: 'R2,700 – R3,600', mid: 'R3,600 – R5,400', premium: 'R5,400 – R9,000' },
      transport: { budget: 'R180 – R270', mid: 'R270 – R450', premium: 'R450 – R900' },
      gym: { budget: 'R360 – R540', mid: 'R540 – R720', premium: 'R900+' },
      total: { budget: 'R22,000 – R27,000', mid: 'R31,000 – R41,000', premium: 'R45,000+' },
      note: 'Chiang Mai is consistently one of the cheapest places to live well in Southeast Asia. R27,000/month gets you a comfortable, full life here. That is less than the average Cape Town rent alone.',
    },
    remoteWork: {
      internetQuality:
        'Excellent. Fibre-optic is standard in coworking spaces and modern condos. 100 Mbps+ is the norm. Backup mobile data from AIS or TrueMove is cheap and widely available.',
      internetRating: 9,
      coworkingSpaces: [
        {
          name: 'Punspace',
          description: 'Two locations in Nimman and the Old City. The anchor of the Chiang Mai nomad community. Great community events, meeting rooms, fast internet.',
          price: '190 THB/day (≈R100) · 5,500 THB/month (≈R2,800)',
        },
        {
          name: 'MANA Co-working',
          description: 'Old City location with regular workshops and events. Open-plan with a cafe built in. Good for meeting people.',
          price: '4,500 – 5,500 THB/month (≈R2,300 – R2,800)',
        },
        {
          name: 'Yellow Coworking',
          description: '24/7 access, ergonomic desks, AC, coffee, and a quiet working culture. Good for focus.',
          price: '190 THB/day · 5,000 THB/month (≈R2,500)',
        },
      ],
      cafes:
        'Nimman and the Old City have hundreds of cafes that work like informal coworking spaces. Coffee costs 50 to 100 THB (R26 – R52). Sitting for hours is normal and expected. Power outlets everywhere.',
    },
    visa: {
      headline: 'South Africans get 60 days visa-free',
      details: [
        '60 days visa-free entry for SA passport holders',
        'No visa on arrival required — just land and go',
        'A single 30-day stay is fully covered',
      ],
      longerStay:
        'The Thailand Digital Nomad Visa (DTV) allows 5-year multiple-entry with up to 180 days per visit. Requirements: 500,000 THB (≈R255,000) in bank statements for the last 3 months, proof of income, valid passport. Fee is approximately 10,000 THB (≈R5,100) at a Thai Embassy.',
      flag: null,
    },
    nomadRating: {
      overall: 8.5,
      scores: [
        { factor: 'Internet', score: 9, note: 'Fast, reliable fibre standard. Backup mobile data widely available.' },
        { factor: 'Affordability', score: 9.5, note: 'R27,000/month gets you a genuinely comfortable life.' },
        { factor: 'Lifestyle', score: 9, note: 'Perfect balance of work culture, activities, and social life.' },
        { factor: 'Safety', score: 8.5, note: 'Very safe. Main concern is air quality during burning season (Feb–Apr).' },
        { factor: 'Community', score: 9, note: 'The most established nomad community in Southeast Asia.' },
      ],
      summary:
        'Chiang Mai is the most proven digital nomad destination in Southeast Asia. It delivers on every metric: low cost, fast internet, strong community, and genuine quality of life. The only real weakness is the burning season from February to April when air quality deteriorates. Plan around it.',
    },
    bestTime: {
      ideal: 'November to February: cool, dry, perfect weather (15–28°C). Festivals include Loy Krathong and Yi Peng.',
      shoulder: 'October: pleasant weather before the dry season peak, lower prices, fewer crowds.',
      avoid: 'February to April: burning season. Agricultural fires push air quality into dangerous territory.',
      recommendation: 'November to January is the sweet spot. October is good if you want lower prices. Avoid February to April if you have any respiratory sensitivity.',
    },
    weekInTheLife: [
      { label: 'Monday morning', description: 'Wake up at 7am, grab coffee and pad kra pao from the street stall downstairs for R27. Walk ten minutes to Punspace Nimman. Check Slack, clear emails. The day is already better than it was in Joburg.' },
      { label: 'Lunchtime', description: 'Most people eat at the market beside Nimman One. Full meal with a drink for under R45. Spending R100 on lunch means you tried somewhere fancy.' },
      { label: 'Afternoon reset', description: 'At 4pm, half the coworking empties out. Some go to the gym. Some do a late-afternoon scooter ride up toward Doi Suthep. You can be back by 6pm.' },
      { label: 'Evening routine', description: 'The Nimman strip comes alive after 6pm. Dinner with other nomads or alone at whatever spot you are working through. Cold Chang beer costs R36. You are spending almost nothing.' },
      { label: 'Weekend', description: 'Saturday is the Old City walking street. Sunday means Doi Suthep, Doi Inthanon, a cooking class, or a half-day trip to Pai. You will not run out of things to do for months.' },
      { label: 'The rhythm', description: 'After two weeks, Chiang Mai stops feeling like travel and starts feeling like your life. That is the point of slow travel — and why people come for a month and stay for a year.' },
    ],
    theCatch:
      'The burning season runs from February to April and it is serious. Farmers in northern Thailand burn fields and hillside scrub, and PM2.5 levels in Chiang Mai can spike to genuinely dangerous levels for weeks at a time. If you have asthma, allergies, or any respiratory sensitivity, plan around it — this is not a minor inconvenience. The other honest reality is that Chiang Mai is a small city. After two or three months, the same coworking spaces and the same nomad faces start to feel repetitive. It is best as part of a longer multi-destination route rather than a permanent base.',
    practicalTips: [
      {
        title: 'Get a local SIM immediately',
        body: 'Buy an AIS or TrueMove SIM at any 7-Eleven or the airport. A monthly data package costs 500 to 800 THB (R260 – R410). Use it as backup to your apartment or coworking wifi.',
      },
      {
        title: 'Scooters vs Grab',
        body: 'Many nomads rent a scooter for 150 to 200 THB (R77 – R102) per day. Helmet is essential and traffic can be unpredictable. Grab is 30 to 50 THB for short trips and a safer option if you are not comfortable riding.',
      },
      {
        title: 'Burning season is a real thing',
        body: 'February to April, farmers in northern Thailand burn fields and forest. PM2.5 levels can spike to dangerous levels. Check the AQI app daily.',
      },
      {
        title: 'Ask about fibre before booking',
        body: 'Modern condos in Nimman and the Old City typically have good fibre. Always confirm with the landlord before committing.',
      },
      {
        title: 'Learn a few words of Thai',
        body: '"Sawadee krap" (hello), "Khob khun krap" (thank you), "Mai pet" (not spicy). Locals genuinely appreciate the effort and it opens doors to better food and friendlier service.',
      },
    ],
  },

  {
    slug: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    region: 'Southeast Asia',
    flag: '🇮🇩',
    tagline: 'Rice paddies, ocean breaks, and a nomad community that never really leaves.',
    heroImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=80',
    altText: 'Tegallalang rice terraces in Ubud, Bali with lush green landscape',
    sectionImages: {
      food: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1400&q=75',
      activities: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=1400&q=75',
      sights: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1400&q=75',
      remoteWork: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=75',
    },
    overview:
      'Bali is the city South African remote workers picture first. And the reality, at least in Canggu, largely holds up. The infrastructure works: coworking spaces have generators, cafes have reliable wifi, and there are enough people doing exactly what you are doing that you will have friends within a week. Ubud is the counter-balance — quieter, greener, with rice fields instead of roads and yoga studios instead of beach clubs. Most people end up wanting both within a month. The question is how to split your time.',
    quickStats: {
      monthlyBudget: 'R25,000 – R32,000',
      nomadRating: 8.5,
      bestMonths: 'May – Oct',
      visaFree: 'Visa on arrival',
    },
    culture: {
      description:
        'Bali has a culture unlike anywhere else in Southeast Asia. Balinese Hinduism shapes daily life in ways that are visible everywhere: temple ceremonies, flower offerings on the street, and the sound of gamelan at festivals. In Canggu, this sits alongside a massive international nomad community, boutique cafes, beach clubs, and a social scene that runs from morning yoga to late-night cocktails. In Ubud, the pace is slower and the culture is more prominent.',
      highlights: [
        'Balinese Hindu ceremonies and temple festivals year-round',
        'One of the strongest digital nomad communities in the world',
        'Active yoga, wellness, and fitness scene',
        'Beach clubs and vibrant nightlife in Canggu',
        'Traditional crafts, art, and dance in Ubud',
      ],
    },
    food: {
      description:
        'The food scene in Bali spans from street warungs serving nasi campur for under R18 to acclaimed restaurants with tasting menus. Canggu has the most variety: Indonesian, Western, Japanese, vegan, raw food. Ubud leans more local and wellness-focused. Eat at warungs whenever possible — the food is excellent, the prices are almost nothing, and you will eat the same as the locals.',
      mustTry: [
        'Babi guling (roasted suckling pig)',
        'Nasi campur (mixed rice plate with various sides)',
        'Satay with peanut sauce from street stalls',
        'Fresh tropical fruit juices',
        'Tipat cantok (vegetables in peanut sauce)',
      ],
      budgetBreakdown: {
        street: 'R18 – R36 at local warungs',
        midRange: 'R90 – R216 at cafes and mid-range restaurants',
        premium: 'R360+ at beach clubs and fine dining',
      },
      topAreas: ['Batu Bolong Road in Canggu for variety', 'Ubud central market area for local food', 'Berawa for upscale dining'],
    },
    activities: [
      {
        name: 'Tegallalang Rice Terraces',
        description: 'The iconic layered rice fields north of Ubud. Walk through them early morning before the tour groups arrive.',
        emoji: '🌾',
      },
      {
        name: 'Surfing at Canggu',
        description: 'Echo Beach for more experienced surfers, Batu Bolong for beginners. Lessons are cheap and instructors are everywhere.',
        emoji: '🏄',
      },
      {
        name: 'Sacred Monkey Forest',
        description: 'Ancient temple complex in Ubud home to over 1,000 macaques. Three 14th-century temple buildings sit inside the forest. Arrive before 8am and the tour groups are not there yet.',
        emoji: '🐒',
      },
      {
        name: 'Tanah Lot at Sunset',
        description: 'Hindu sea temple perched on a black rock offshore. At sunset the rock turns gold and the sky does things that are hard to describe. Go once. Bring a sarong — entry requires one.',
        emoji: '🌅',
      },
      {
        name: 'Uluwatu Temple and Kecak Dance',
        description: 'Clifftop temple in the south with ocean views and a sunset Kecak fire dance performance you will not forget.',
        emoji: '🔥',
      },
      {
        name: 'Waterfalls near Ubud',
        description: 'Suwat Waterfall, Kanto Lampo, and Taman Sari are all within 30 minutes of Ubud. Best in the morning before it gets crowded.',
        emoji: '💧',
      },
      {
        name: 'Yoga and Wellness',
        description: 'Ubud has some of the best yoga studios in Asia. Drop-in classes from R180. Month-long programs and retreats are widely available.',
        emoji: '🧘',
      },
      {
        name: 'Day Trip to the Bukit Peninsula',
        description: 'Limestone cliffs, white sand beaches, and calm turquoise water in the south of the island. Completely different vibe from Canggu.',
        emoji: '🏖️',
      },
      {
        name: 'Ubud Cooking Class',
        description: 'Morning market visit followed by preparing traditional Balinese dishes. One of the best food experiences on the island.',
        emoji: '🍳',
      },
    ],
    sights: {
      mustSee: [
        { name: 'Tanah Lot', note: 'The iconic sea temple. Go at sunset.' },
        { name: 'Tegallalang Rice Terraces', note: 'UNESCO-listed landscape. Arrive early.' },
        { name: 'Uluwatu Temple', note: 'Clifftop temple with ocean views and Kecak performance.' },
      ],
      livedIn: [
        { name: 'Batu Bolong Beach in the morning', note: 'Local surfers, breakfast cafes, low-key energy before the crowds.' },
        { name: 'Ubud central market', note: 'Local shopping early in the morning. Produce, crafts, and genuine market life.' },
        { name: 'Canggu backstreets at sunset', note: 'Rice paddy walks through Berawa and Pererenan. Still there between the cafes.' },
        { name: 'Pura Dalem Agung inside Monkey Forest', note: '14th-century temple complex. Easy to miss if you are just watching the monkeys.' },
      ],
    },
    neighbourhoods: [
      {
        name: 'Canggu (Batu Bolong & Berawa)',
        description:
          'The core of the Bali nomad scene. Walkable, coastal, dense with coworking spaces, cafes, gyms, and beach clubs. Batu Bolong has the most density. Berawa is slightly quieter and more residential.',
        bestFor: 'Community, social life, beach access, coworking infrastructure',
        monthlyRent: 'R9,000 – R14,400 for a 1-bed mid-range apartment',
      },
      {
        name: 'Pererenan (North Canggu)',
        description:
          'Just north of the main Canggu strip. More residential, fewer tourists, same access to cafes and coworking but quieter at night. A good choice for a longer stay when you want to settle in rather than party.',
        bestFor: 'Longer stays, those who want Canggu access without the noise',
        monthlyRent: 'R7,200 – R12,600 for a 1-bed',
      },
      {
        name: 'Ubud (Central and Sayan)',
        description:
          'The cultural heart of Bali. Rice fields, temples, traditional markets, yoga studios, and a slower pace. Central Ubud is most convenient for everything. Sayan and north Ubud offer villa stays with rice field views.',
        bestFor: 'Focus, cultural immersion, wellness, longer-term stays',
        monthlyRent: 'R7,200 – R13,500 for a 1-bed or villa',
      },
    ],
    costOfLiving: {
      accommodation: { budget: 'R7,200 – R9,000', mid: 'R10,800 – R16,200', premium: 'R18,000 – R27,000' },
      coworking: { dayPass: 'R90 – R216/day', monthly: 'R1,440 – R3,240' },
      food: { budget: 'R2,160 – R3,600', mid: 'R3,600 – R5,400', premium: 'R5,400 – R9,000' },
      transport: { budget: 'R720 – R1,080', mid: 'R1,080 – R1,800', premium: 'R1,800+' },
      gym: { budget: 'R540 – R900', mid: 'R900 – R1,800', premium: 'R1,800 – R3,600' },
      total: { budget: 'R22,000 – R25,000', mid: 'R29,000 – R32,000', premium: 'R36,000 – R45,000' },
      note: 'Bali offers exceptional value. A R29,000/month lifestyle here gets you beach access, reliable coworking, great food, and a social scene that would cost three times more almost anywhere in Europe.',
    },
    remoteWork: {
      internetQuality:
        'Good and improving. Average speeds of 48 Mbps with fibre available in better apartments and villas. Occasional power cuts but coworking spaces have backup generators. For video calls, use coworking rather than relying solely on home internet.',
      internetRating: 8,
      coworkingSpaces: [
        {
          name: 'Dojo Bali',
          description: 'One of the originals. Reliable internet, backup generators, strong community. Right in the heart of Canggu.',
          price: 'R144 – R216/day · R1,440 – R2,160/month',
        },
        {
          name: 'Hubud (Ubud)',
          description: 'The community-focused coworking in Ubud with rice field views. Good for networking and events.',
          price: 'From R180/day · R2,160/month',
        },
        {
          name: 'Outpost Ubud',
          description: 'Strong community focus, good internet, coliving option available. Popular with longer-stay remote workers.',
          price: 'From R216/day · R2,700/month',
        },
      ],
      cafes:
        'Canggu has more laptop-friendly cafes per square kilometre than almost anywhere on earth. Most have strong wifi, power outlets, and no expectation to move. Coffee costs R54 to R90. Ubud has a growing scene too, slightly quieter.',
    },
    visa: {
      headline: 'South Africans need a Visa on Arrival (VOA)',
      details: [
        'Indonesia does not offer visa-free entry for South African passport holders',
        'Visa on Arrival (VOA) available for 30 days, extendable once for another 30 days',
        'Total maximum stay on VOA: 60 days',
        'Cost: IDR 500,000 (≈R630)',
        'Apply online via e-VOA before travel or on arrival at the airport',
      ],
      longerStay:
        'For stays beyond 60 days, a B211A visa extension is available up to 180 days total. As of 2026, extensions require an in-person visit to an immigration office with biometric capture. Budget 2 to 3 hours for the visit.',
      flag: 'Confirm current e-VOA requirements before travel as Indonesian visa regulations change periodically.',
    },
    nomadRating: {
      overall: 8.5,
      scores: [
        { factor: 'Internet', score: 8, note: 'Reliable in nomad areas, occasional outages. Coworking is more reliable than home.' },
        { factor: 'Affordability', score: 9, note: 'R29,000/month gives you a beach lifestyle that would cost triple in Europe.' },
        { factor: 'Lifestyle', score: 9.5, note: 'The full package: beach, food, culture, nightlife, wellness, activities.' },
        { factor: 'Safety', score: 7.5, note: 'Generally safe. Main risks are petty theft in busy areas and scooter accidents.' },
        { factor: 'Community', score: 9, note: 'One of the strongest nomad communities anywhere. Easy to meet people.' },
      ],
      summary:
        'Bali is the full lifestyle package. The combination of beach access, culture, food, community, and affordability is hard to beat. The internet is the weakest link but coworking spaces solve that. Canggu suits people who want energy and community. Ubud suits people who want focus and cultural depth.',
    },
    bestTime: {
      ideal: 'May to October: dry season with low humidity and consistent sunshine. May, June, September, and October have the best balance of good weather and fewer tourists.',
      shoulder: 'April and November: transitional months with mixed weather but lower prices and fewer crowds.',
      avoid: 'December to February: wettest months. Heavy afternoon downpours and higher humidity.',
      recommendation: 'May to October for your 30-day stay. September and October give you great weather with slightly fewer tourists than peak June-August.',
    },
    weekInTheLife: [
      { label: 'Morning', description: 'Up at 7am for a surf at Batu Bolong or a yoga class before the heat kicks in. Breakfast at your regular cafe. A coffee and avocado toast runs R126. After three days, it starts to feel like your local spot.' },
      { label: 'Work day', description: 'Dojo Bali or your apartment if you confirmed the fibre speed before booking. Video calls before noon, deep work in the afternoon. When it rains, you are glad to have a real desk and backup generator.' },
      { label: 'Golden hour', description: 'Golden hour in Canggu runs from 5:30 to 6:30pm. Most people are at a beach bar or walking Batu Bolong. Beers cost R54 to R90. The sunsets are actually that good.' },
      { label: 'Weekends from Canggu', description: 'Saturday: Pasar Kumbasari market early, then beach club in the afternoon. Sunday: Uluwatu, Ubud, or a long ride down to the Bukit Peninsula. A full Balinese weekend costs less than a night out in Sandton.' },
      { label: 'Weekends from Ubud', description: 'Morning walk on the Campuhan Ridge. Cooking class at a rice paddy kitchen. Warung dinner for R54. The Ubud weekend rhythm is unhurried in a way that resets something.' },
      { label: 'Reality check', description: 'Canggu in 2026 is busier than it used to be. Jalan Raya Canggu at peak hours is real traffic. Build your Grab and Gojek apps before you arrive and factor in scooter time for everything.' },
    ],
    theCatch:
      'Canggu has become a victim of its own success. Traffic on the main roads is bad enough that long-term Bali nomads have shifted to Pererenan or Berawa to escape it. Internet quality at home is inconsistent — some apartments are excellent, others are not, and you will not know until you arrive. Confirm speeds before you book. The Visa on Arrival adds friction: apply for the e-VOA online, pay the fee, and manage a renewal visit at 30 days if you are staying 60. And Bali in June, July, and August is peak tourist season — prices are higher, popular spots are packed, and the version of the island that makes people fall in love with it is less accessible.',
    practicalTips: [
      {
        title: 'Scooter safety is not optional',
        body: 'Renting a scooter is the main way to get around Canggu. Wear your helmet. Do not ride after drinking. Use Grab or Gojek at night or if uncertain.',
      },
      {
        title: 'Confirm fibre before you book accommodation',
        body: 'Home internet quality varies a lot in Bali. Ask specifically about the ISP and speeds before committing to an apartment. Coworking spaces all have reliable backup systems.',
      },
      {
        title: 'Canggu vs Ubud is a real choice',
        body: 'Canggu: beach, social, cafes, nightlife, more expensive, noisier. Ubud: culture, focus, nature, quieter, cheaper. Most people who stay longer end up spending time in both.',
      },
      {
        title: 'Apply for your VOA online before you fly',
        body: 'The e-VOA process is straightforward and avoids the on-arrival queue. Apply at evisa.imigrasi.go.id at least 3 days before departure.',
      },
      {
        title: 'Secure your valuables on a scooter',
        body: 'Bag snatching from moving scooters happens in busy areas. Keep bags in front of you or in a backpack.',
      },
    ],
  },

  {
    slug: 'bangkok',
    name: 'Bangkok',
    country: 'Thailand',
    region: 'Southeast Asia',
    flag: '🇹🇭',
    tagline: 'The city that never winds down. World-class infrastructure and a professional nomad community unlike anywhere else in Asia.',
    heroImage: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=1600&q=80',
    altText: 'Bangkok skyline with Chao Phraya river and temple spires at sunset',
    sectionImages: {
      food: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=1400&q=75',
      activities: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1400&q=75',
      sights: 'https://images.unsplash.com/photo-1548940740-204726a19be3?auto=format&fit=crop&w=1400&q=75',
      remoteWork: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=75',
    },
    overview:
      'Bangkok is a different category to the rest of Southeast Asia. It is a genuine metropolis with first-world infrastructure, a vast professional remote worker community, and access to everything at any hour. The coworking spaces are excellent, the food is extraordinary, the transit is fast, and the lifestyle options are limitless. It costs more than Chiang Mai or Da Nang but still offers exceptional value compared to South Africa. If you want city energy with serious productivity infrastructure, Bangkok is the answer.',
    quickStats: {
      monthlyBudget: 'R36,000 – R63,000',
      nomadRating: 8.5,
      bestMonths: 'Nov – Feb',
      visaFree: '60 days',
    },
    culture: {
      description:
        'Bangkok operates at a pace and scale that takes a few days to calibrate to. It is a city that takes remote work seriously: coworking spaces host founders and senior employees of international companies, and the professional community is dense and segmented by neighbourhood. Sukhumvit for expat convenience, Ari for the local creative crowd, Thonglor for nightlife, and Sathorn for business — you will find your pocket of the city and it will feel like your own.',
      highlights: [
        'World-class nightlife, rooftop bars, and restaurant scene',
        'Huge digital nomad and expat professional community',
        'Lumphini Park and Muay Thai as social anchors',
        'Chatuchak Weekend Market and Yaowarat (Chinatown) for weekend culture',
        'BTS Skytrain connecting everything efficiently',
      ],
    },
    food: {
      description:
        'Bangkok has one of the best food cities on earth at every price point. Street food from 40 THB (R21) a dish sits alongside Michelin-starred restaurants. Yaowarat (Chinatown) is the best night market experience. You can eat world-class food every day and still spend less on food monthly than you would in Cape Town.',
      mustTry: [
        'Pad Thai from a street vendor in the Old Town',
        'Seafood at Yaowarat Chinatown night market',
        'Mango sticky rice from street carts',
        'Boat noodles (order several small bowls)',
        'Fresh sugarcane juice from corner carts',
      ],
      budgetBreakdown: {
        street: 'R21 – R45 at markets and street stalls',
        midRange: 'R90 – R200 at local and fusion restaurants',
        premium: 'R360+ at Thonglor fine dining and rooftop restaurants',
      },
      topAreas: ['Yaowarat (Chinatown) for night markets', 'Thonglor for upscale dining', 'Ari for value cafe dining'],
    },
    activities: [
      {
        name: 'Wat Pho',
        description: 'The Reclining Buddha. One of the largest and most detailed temple complexes in Thailand, and the home of traditional Thai massage.',
        emoji: '⛩️',
      },
      {
        name: 'Muay Thai at Rajadamnern Stadium',
        description: 'World-class fighters in one of the oldest stadiums in Bangkok. Book ringside or stadium seats in advance.',
        emoji: '🥊',
      },
      {
        name: 'Chatuchak Weekend Market',
        description: 'Enormous weekend market with thousands of stalls. Arrive early in the morning before the heat and the crowds.',
        emoji: '🛍️',
      },
      {
        name: 'Chao Phraya River at Dusk',
        description: 'Take a ferry or long-tail boat along the river as the temples light up. One of the most atmospheric things you can do in Bangkok for almost no money.',
        emoji: '🚤',
      },
      {
        name: 'Grand Palace and Emerald Buddha',
        description: "Thailand's most important royal and religious site. Dress modestly and arrive early.",
        emoji: '👑',
      },
      {
        name: 'Lumphini Park Morning Run',
        description: 'Large urban park where locals do tai chi, feed the monitor lizards, and run before the heat hits.',
        emoji: '🌳',
      },
      {
        name: 'Day Trip to Ayutthaya',
        description: 'UNESCO Heritage former capital 85 km north. Ancient temple ruins and serious history. 1.5 hours by train.',
        emoji: '🏛️',
      },
      {
        name: 'Maeklong Railway Market',
        description: 'Market stalls that fold back every time a train passes through the middle of them. Absurd and worth seeing.',
        emoji: '🚂',
      },
      {
        name: 'Rooftop Bar at Sunset',
        description: 'Vertigo at Banyan Tree or Octave at Marriott Thonglor. Bangkok skyline at dusk is one of the best urban views in Asia.',
        emoji: '🌆',
      },
    ],
    sights: {
      mustSee: [
        { name: 'Grand Palace', note: "Thailand's most important royal site. Dress modestly. Arrive before 10am." },
        { name: 'Wat Pho (Reclining Buddha)', note: 'Next to the Grand Palace. Budget 90 minutes.' },
        { name: 'Wat Arun (Temple of Dawn)', note: 'Cross the river from the Grand Palace. Best seen at dawn or lit up at night.' },
      ],
      livedIn: [
        { name: 'Yaowarat at night', note: 'The Chinatown night market. No performance, all real. Go hungry.' },
        { name: 'Lumphini Park at 6am', note: 'Locals exercising, monitor lizards in the lake, and no tourists.' },
        { name: 'Ari neighbourhood on a weekday', note: "Where Bangkok's creative and tech community actually spends their time." },
        { name: 'BTS platform in Thonglor at midnight', note: 'The city still running at full energy. Bangkok never stops.' },
      ],
    },
    neighbourhoods: [
      {
        name: 'Sukhumvit (Phrom Phong / Thong Lor)',
        description:
          'The most convenient area for first-time Bangkok visitors. BTS access to everything, highest density of coworking spaces and cafes, great restaurants at all price points. On Nut (further down the line) gives you the same BTS access at significantly lower prices.',
        bestFor: 'First-time visitors, those who want maximum convenience and infrastructure',
        monthlyRent: 'R7,600 – R20,000 for a 1-bed (On Nut from R4,000)',
      },
      {
        name: 'Ari (Phaya Thai)',
        description:
          'The neighbourhood that Bangkok insiders prefer. Modern apartments, excellent cafes with real work culture, a mix of young Thai professionals and long-stay expats. Less touristy than Sukhumvit, equally connected via BTS, and cheaper for equivalent quality.',
        bestFor: 'People who want work-first infrastructure without the Sukhumvit premium',
        monthlyRent: 'R5,000 – R12,600 for a 1-bed',
      },
      {
        name: 'Sathorn / Silom',
        description:
          'The business district. Modern high-rise condos, rooftop pools, Lumphini Park nearby, and excellent coworking spaces. More polished and quieter than Thong Lor. Good for senior remote workers who want comfort and professionalism.',
        bestFor: 'Professionals, consultants, longer-stay clients who want a polished base',
        monthlyRent: 'R7,600 – R20,000 for a 1-bed',
      },
    ],
    costOfLiving: {
      accommodation: { budget: 'R4,000 – R6,300', mid: 'R7,600 – R12,600', premium: 'R18,000+' },
      coworking: { dayPass: 'R144 – R250/day', monthly: 'R2,250 – R3,600' },
      food: { budget: 'R2,700 – R3,600', mid: 'R3,600 – R5,400', premium: 'R5,400 – R10,800' },
      transport: { budget: 'R360 – R540', mid: 'R540 – R1,080', premium: 'R1,080+' },
      gym: { budget: 'R720 – R1,080', mid: 'R1,080 – R1,800', premium: 'R1,800+' },
      total: { budget: 'R32,000 – R43,000', mid: 'R47,000 – R63,000', premium: 'R72,000+' },
      note: 'Bangkok is around 40% more expensive than Chiang Mai but still exceptional value. R47,000/month here gets you a city lifestyle — central apartment, daily coworking, good restaurants — that would cost R80,000+ in Cape Town.',
    },
    remoteWork: {
      internetQuality:
        'Excellent. Fibre is standard in central Bangkok condos and all coworking spaces. Speeds of 100 to 500 Mbps are normal. The fastest and most reliable internet infrastructure in Southeast Asia.',
      internetRating: 9.5,
      coworkingSpaces: [
        {
          name: 'The Hive (Thonglor)',
          description: 'Popular with creative freelancers and designers. Rooftop terrace with skyline views. Strong community events.',
          price: '400 THB/day (≈R205) · 4,500 THB/month (≈R2,300)',
        },
        {
          name: 'JustCo (Multiple Locations)',
          description: "Bangkok's largest premium coworking chain. Locations in Sukhumvit, Thonglor, and Sathorn. High-quality facilities and a serious professional community.",
          price: '5,000 – 6,000 THB/month (≈R2,550 – R3,060)',
        },
        {
          name: 'Glowfish (Sathorn)',
          description: 'Spacious, startup-focused, with integrated event venues. Walking distance from Chong Nonsi BTS.',
          price: '400 THB/day (≈R205) · 5,500 THB/month (≈R2,800)',
        },
      ],
      cafes:
        'Ari has the best value work-friendly cafes in Bangkok. Sukhumvit and Thonglor are saturated with options. Coffee runs 80 to 150 THB (R41 – R77) and extended stays are standard. Reliable power outlets throughout.',
    },
    visa: {
      headline: 'South Africans get 60 days visa-free',
      details: [
        '60 days visa-free entry for SA passport holders',
        'No visa on arrival required — just land and go',
        'A single 30-day stay is fully covered',
      ],
      longerStay:
        'The Thailand Digital Nomad Visa (DTV) gives you 5-year multiple-entry with up to 180 days per visit. Requirements: 500,000 THB (≈R255,000) in bank statements for the last 3 months, salary slips, valid passport. Fee approximately 10,000 THB (≈R5,100) at a Thai Embassy.',
      flag: null,
    },
    nomadRating: {
      overall: 8.5,
      scores: [
        { factor: 'Internet', score: 9.5, note: 'The fastest and most reliable in Southeast Asia. Fibre everywhere.' },
        { factor: 'Affordability', score: 8, note: 'More expensive than Chiang Mai but still exceptional value vs SA.' },
        { factor: 'Lifestyle', score: 8, note: 'World-class city with unlimited options. Requires more intentionality to navigate.' },
        { factor: 'Safety', score: 8, note: 'Very safe by any global standard. Standard urban awareness is sufficient.' },
        { factor: 'Community', score: 9, note: 'Massive, professional, diverse. Easy to find your niche.' },
      ],
      summary:
        'Bangkok is for people who want a proper city alongside their remote work. It delivers on infrastructure, nightlife, food, and professional networking better than anywhere else in Southeast Asia. The tradeoff is cost and scale. It rewards people who invest in getting to know it.',
    },
    bestTime: {
      ideal: 'November to February: cool and dry, 25 to 34°C. The most comfortable months with festivals like Loy Krathong in November.',
      shoulder: 'October: start of cool season, lower prices, still pleasant.',
      avoid: 'April and May: extreme heat up to 40°C. Manageable if you stay air-conditioned but brutal outside.',
      recommendation: 'November to January is ideal. October is a solid shoulder option. The rainy season from June to September brings afternoon downpours but excellent prices and great air quality.',
    },
    weekInTheLife: [
      { label: 'Monday morning', description: 'BTS from your condo to the coworking space. 12 minutes door to door. JustCo in Sukhumvit has standing desks, fast fibre, and a good coffee machine. You are at your desk by 8:30am.' },
      { label: 'Lunch', description: 'Street food from the vendor outside the MRT station costs R27. Or the basement food court at EmQuartier for R72. Bangkok feeds you better for less than any city you have lived in.' },
      { label: 'After work', description: 'Muay Thai class in Sukhumvit, or a run through Lumphini Park before dark. Dinner with people from the coworking in Thonglor. The city always has something running at any hour.' },
      { label: 'Weekend culture', description: 'Chatuchak Market on Saturday morning — go by 9am. Grand Palace complex on Sunday if you have been putting it off. A long-tail boat down the Chao Phraya to Wat Arun at dusk costs R45.' },
      { label: 'Night city', description: 'Bangkok nightlife is genuinely good. Rooftop bar on Friday. A jazz bar in Ari on Saturday. The city runs until 4am if you want it to — and most people find they do, occasionally.' },
      { label: 'The rhythm', description: 'Bangkok rewards investment. Week one is overwhelming. Week two you find your neighbourhood. Week three you have regulars — a coffee shop, a gym, a noodle spot. By month one you understand why people stay.' },
    ],
    theCatch:
      'Bangkok is the most expensive city on this list. A mid-range lifestyle costs R47,000 to R63,000 a month, which is more than Chiang Mai or Da Nang. The heat in March, April, and May is serious — 38 to 40°C, and the only real escape is air conditioning. The city is genuinely enormous and without the BTS, getting between neighbourhoods takes real time. Choose the wrong base and daily logistics become a grind. Air quality has improved but still has bad days in the dry season. And for all its energy, Bangkok can feel anonymous — it is easy to have a productive month here and leave without meeting another nomad if you do not make the effort.',
    practicalTips: [
      {
        title: 'Get a Rabbit Card for the BTS',
        body: 'A reloadable BTS transit card costs 50 THB (≈R26) deposit plus 100 THB credit. Most neighbourhoods worth being in are BTS-adjacent. Grab fills the gaps.',
      },
      {
        title: 'Monthly coworking over day passes',
        body: 'If you are staying 30 days, a monthly coworking membership will be significantly cheaper than daily rates and gives you a consistent home base from day one.',
      },
      {
        title: 'Watch for tuk-tuk scams in tourist areas',
        body: 'The classic scam: a friendly tuk-tuk driver takes you to gem shops that pay him commission. Use Grab for any unfamiliar journey. It is cheaper and transparent.',
      },
      {
        title: 'Bangkok is bigger than it looks',
        body: 'The city sprawls. Choose your neighbourhood based on where you will actually spend your time and commit to it. Trying to live in one area and commute to another daily is exhausting.',
      },
      {
        title: 'Dress for the heat',
        body: 'Even in the cool season Bangkok is warm. But air conditioning in malls, restaurants, and coworking spaces is often set to Arctic. Carry a light layer if you run cold.',
      },
    ],
  },

  {
    slug: 'da-nang',
    name: 'Da Nang',
    country: 'Vietnam',
    region: 'Southeast Asia',
    flag: '🇻🇳',
    tagline: "Clean streets, fast internet, and a beach two minutes from your desk. Vietnam's most practical nomad city.",
    heroImage: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1600&q=80',
    altText: 'Da Nang Dragon Bridge over the Han River at night with city lights reflecting on the water',
    sectionImages: {
      food: 'https://images.unsplash.com/photo-1582878826629-33b17f92e2a4?auto=format&fit=crop&w=1400&q=75',
      activities: 'https://images.unsplash.com/photo-1557800636-894a64c1696f?auto=format&fit=crop&w=1400&q=75',
      sights: 'https://images.unsplash.com/photo-1600264978898-a67a6f641680?auto=format&fit=crop&w=1400&q=75',
      remoteWork: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1400&q=75',
    },
    overview:
      'Da Nang is the city that gets undersold. It sits on the coast of central Vietnam, has genuinely fast internet, is among the safest cities in Southeast Asia, and costs 30 to 50 percent less than Bali for equivalent quality of life. My Khe Beach is a 10-minute walk from most apartments in the nomad area. Hoi An is 30 minutes away. The food is excellent and cheap. The nomad community is smaller than Bali but it is growing fast, and the people who know about Da Nang tend to come back.',
    quickStats: {
      monthlyBudget: 'R18,000 – R23,000',
      nomadRating: 8.5,
      bestMonths: 'Mar – May',
      visaFree: 'e-Visa required',
    },
    culture: {
      description:
        'Da Nang is a modern Vietnamese city, not a tourist destination that has grown up around foreigners. The streets are clean, the infrastructure works, and daily life runs at a Vietnamese pace. The expat community is centred around An Thuong near the beach, but outside that strip you are in a Vietnamese city — local markets, local restaurants, locals who are friendly but not catering to you. It is a different experience to Canggu or Nimman, and for a lot of people, a better one.',
      highlights: [
        'One of the safest cities in Southeast Asia',
        'Genuine Vietnamese culture outside the nomad area',
        'Growing digital nomad community with weekly meetups',
        'Easy day trips to Hoi An and Hue',
        'Marble Mountains, Dragon Bridge, and Ba Na Hills as local highlights',
      ],
    },
    food: {
      description:
        'Da Nang has its own distinct food culture. Mi Quang, the turmeric noodle dish with pork and peanuts, is the city signature. The seafood is excellent and inexpensive. Local restaurants serve full meals for under R36. The An Thuong area has cafes and Western options for when you want them, but the best food is in the local spots that have been there for decades.',
      mustTry: [
        'Mi Quang (turmeric rice noodles with pork and peanuts)',
        'Banh xeo (Vietnamese sizzling crepe)',
        'Bun cha ca (fishcake noodle soup)',
        'Banh mi from a street cart',
        'Fresh spring rolls with dipping sauce',
      ],
      budgetBreakdown: {
        street: 'R32 – R72 at local restaurants and street stalls',
        midRange: 'R72 – R180 at cafes and mid-range restaurants',
        premium: 'R270 – R720 at upscale restaurants',
      },
      topAreas: ['An Thuong for cafes and Western food', 'My Khe seafood restaurants for fresh fish', 'Local alley restaurants near Son Tra for real Vietnamese food'],
    },
    activities: [
      {
        name: 'My Khe Beach',
        description: 'Long, clean beach a few minutes walk from the An Thuong nomad area. Surfing, SUP, swimming, or just breakfast at a beach cafe.',
        emoji: '🏖️',
      },
      {
        name: 'Marble Mountains',
        description: '10 minutes south of the city by scooter. Limestone karst peaks with caves, pagodas, and views over the coast. Entry costs R36. Arrive before 7am and you have it mostly to yourself.',
        emoji: '⛰️',
      },
      {
        name: 'Day Trip to Hoi An',
        description: 'UNESCO Heritage ancient town 30 minutes away. Lantern-lit streets, tailors, excellent food, and a completely different vibe. Worth multiple visits.',
        emoji: '🏮',
      },
      {
        name: 'Ba Na Hills',
        description: 'Mountain resort with a French village theme, the famous Golden Hands Bridge, a cable car, and cool temperatures even in summer.',
        emoji: '🌉',
      },
      {
        name: 'Dragon Bridge at Night',
        description: 'The city landmark. On weekends it breathes fire and spouts water. Worth seeing once, even if just for the spectacle.',
        emoji: '🐉',
      },
      {
        name: 'Hai Van Pass Drive',
        description: 'The winding coastal mountain road between Da Nang and Hue. One of the most scenic drives in Vietnam. Hire a motorbike or book a tour.',
        emoji: '🛵',
      },
      {
        name: 'Day Trip to Hue',
        description: "Vietnam's imperial capital 100 km north. Ancient citadel, royal tombs, and the Perfume River. Take the train.",
        emoji: '🏯',
      },
      {
        name: 'Coconut Basket Boat and Cooking Class',
        description: 'Market tour, traditional cooking class, and a ride through the coconut palm forest in a round wicker boat. Based near Hoi An.',
        emoji: '🍳',
      },
      {
        name: 'Han River Waterfront',
        description: 'Evening walk along the Han River with food carts, local life, and good views of the Dragon Bridge and Love Bridge.',
        emoji: '🌊',
      },
    ],
    sights: {
      mustSee: [
        { name: 'Marble Mountains', note: 'Unique landscape, caves, and pagodas. Best in the early morning.' },
        { name: 'Ba Na Hills and Golden Hands Bridge', note: 'The surreal bridge held up by giant stone hands. Worth the trip up the mountain.' },
        { name: 'Dragon Bridge', note: 'The city icon. Spits fire on weekend evenings.' },
      ],
      livedIn: [
        { name: 'My Khe Beach at 6am', note: 'Local fishermen returning, early swimmers, no tourists.' },
        { name: 'Local market near Son Tra', note: 'The actual neighbourhood market where people buy groceries. Cheap produce, real life, no English menus.' },
        { name: 'Han River promenade at dusk', note: 'Local families walking, kids cycling, food carts doing business.' },
        { name: 'Hoi An old town on a weekday morning', note: 'Before the day tours arrive. The ancient streets and morning light are genuinely beautiful.' },
      ],
    },
    neighbourhoods: [
      {
        name: 'My Khe / An Thuong',
        description:
          'The digital nomad area of Da Nang. Walkable, beach-adjacent, with the most coworking spaces, cafes, gyms, and restaurants within easy reach. An Thuong is the main strip. Noisy in places but by far the most practical base for a 30-day stay.',
        bestFor: 'Community access, beach proximity, coworking infrastructure',
        monthlyRent: 'R6,300 – R9,000 for a modern 1-bed, R10,800 – R14,400 for ocean view',
      },
      {
        name: 'Son Tra Peninsula',
        description:
          'Quieter and more residential. Traditional Vietnamese neighbourhood with local markets and fewer tourists. Less expensive than An Thuong. Still accessible to the beach and city but requires transport to reach most nomad infrastructure.',
        bestFor: 'Longer stays, those who want quiet and local immersion over social access',
        monthlyRent: 'R4,500 – R6,300 for a 1-bed',
      },
      {
        name: 'Pham Van Dong Corridor',
        description:
          'Newer apartment buildings along a main beachfront road. Lower prices than An Thuong, less busy, with easy beach access. A practical middle ground.',
        bestFor: 'Budget-conscious stays with beach access',
        monthlyRent: 'R5,000 – R7,200 for a 1-bed',
      },
    ],
    costOfLiving: {
      accommodation: { budget: 'R4,500 – R5,800', mid: 'R7,200 – R9,000', premium: 'R10,800 – R14,400' },
      coworking: { dayPass: 'R72 – R144/day', monthly: 'R900 – R2,160' },
      food: { budget: 'R1,800 – R2,700', mid: 'R2,700 – R4,500', premium: 'R4,500 – R7,200' },
      transport: { budget: 'R720 – R1,080', mid: 'R1,080 – R1,440', premium: 'R1,440+' },
      gym: { budget: 'R144 – R360', mid: 'R360 – R720', premium: 'R720 – R1,440' },
      total: { budget: 'R18,000 – R22,000', mid: 'R20,000 – R23,000', premium: 'R25,000 – R29,000' },
      note: 'Da Nang is the most affordable beach city on this list. R20,000/month is a comfortable life here — beach access, fast internet, good food, and a functional workspace. That is less than a shared house in Sea Point.',
    },
    remoteWork: {
      internetQuality:
        'Excellent. Vietnam has invested heavily in digital infrastructure. Speeds of up to 500 Mbps have been recorded in some Da Nang apartments. Fibre is widely available and standard in newer buildings. One of the most reliable internet environments in Southeast Asia.',
      internetRating: 9,
      coworkingSpaces: [
        {
          name: 'Enouvo Space',
          description: 'Two locations in Da Nang. Rooftop with panoramic views, free coffee and tea, meeting rooms, and external monitors. The community anchor.',
          price: '100,000 VND/day (≈R72) · 3,000,000 VND/month (≈R2,070)',
        },
        {
          name: 'IoT Coworking',
          description: 'Solid option with reliable internet and a focus on tech and startup community.',
          price: 'From R90/day · R1,440/month',
        },
        {
          name: 'DNES Hub',
          description: 'Established space with strong local network. Good for meeting Vietnamese entrepreneurs and tech workers.',
          price: 'From R72/day · R1,260/month',
        },
      ],
      cafes:
        'Kim Coffee Garden and Nia Coffee are both reliable work-from-cafe options in An Thuong. Dozens of laptop-friendly cafes throughout the city. Coffee costs R27 to R54. Da Nang cafe culture is less performative than Canggu but the wifi is often faster.',
    },
    visa: {
      headline: 'South Africans need an e-Visa (easy to apply online)',
      details: [
        'South African passport holders are not eligible for visa-free entry to Vietnam',
        'e-Visa is available online, valid for up to 90 days single or multiple entry',
        'Processing takes 3 to 7 working days',
        'Cost from R450',
        'Valid entry points include Da Nang International Airport',
        'Passport must have at least 6 months validity and 2 blank pages',
      ],
      longerStay:
        'For stays beyond 90 days, the simplest strategy is a short trip to a neighbouring country (Cambodia, Thailand) and re-entry on a new 90-day e-Visa. This is more straightforward than the equivalent in Bali.',
      flag: 'Apply at least 5 days before travel to allow for processing time.',
    },
    nomadRating: {
      overall: 8.5,
      scores: [
        { factor: 'Internet', score: 9, note: 'Very fast and reliable. Up to 500 Mbps in modern apartments.' },
        { factor: 'Affordability', score: 10, note: 'The most affordable major beach city in Southeast Asia. R18,000/month is a comfortable life.' },
        { factor: 'Lifestyle', score: 8.5, note: 'Beach, food, activities, day trips — everything is there and none of it is overpriced.' },
        { factor: 'Safety', score: 9, note: 'One of the safest cities in Southeast Asia. Low crime, good healthcare nearby.' },
        { factor: 'Community', score: 7.5, note: 'Growing and active nomad scene, smaller than Bali but intentional and welcoming.' },
      ],
      summary:
        'Da Nang is the best value city on this list. It delivers beach lifestyle, fast internet, excellent food, and genuine safety at a price point that is hard to argue with. If you want to maximise your monthly budget, this is where to go.',
    },
    bestTime: {
      ideal: 'February to May: warm, dry, sunny with low humidity. March and April are ideal for beach days and outdoor activities.',
      shoulder: 'June to August: hottest months but very little rain. Excellent beach conditions if you can handle the heat.',
      avoid: 'September to December: monsoon season with significant rainfall and occasional typhoons.',
      recommendation: 'March to May is the sweet spot for a 30-day stay. Great weather, lower prices than peak June-August, and the beach is at its best.',
    },
    weekInTheLife: [
      { label: 'Morning routine', description: 'An 8-minute walk to My Khe Beach. Fishermen are still pulling nets in. Back for a shower, then Mi Quang from the street stall on the corner for R36. This is breakfast in Da Nang.' },
      { label: 'Work day', description: 'Enouvo Space opens at 8am. Rooftop desk, mountain view, free drip coffee, reliable fibre. Monthly membership costs R2,070 — less than a single day pass at some London coworking spaces.' },
      { label: 'Lunch', description: 'The alley restaurants behind An Thuong serve full meals for R36 to R54. The banh mi cart charges R18. You will eat better for less in Da Nang than anywhere else on this list.' },
      { label: 'Weekday trips', description: 'Hoi An is 30 minutes by Grab. Go on a Tuesday morning when the tour groups are not there. Eat cao lau for R54, walk the old town, and be back for afternoon calls.' },
      { label: 'Weekend', description: 'Hai Van Pass by motorbike takes half a day. Marble Mountains are 10 minutes south. Ba Na Hills is a full day. There is more to do around Da Nang than most first-timers expect.' },
      { label: 'The honest picture', description: 'Da Nang is a working city with a beach. It is not a party destination. The social scene is smaller than Canggu. But for a focused 30-day work month with fast internet, great food, and a beach five minutes away, nothing competes at this price.' },
    ],
    theCatch:
      'The nomad community in Da Nang is noticeably smaller than in Bali or Chiang Mai. If you are coming primarily for social connection with other remote workers, you will find people here but it takes more effort — there is no Dojo Bali-style scene. The typhoon season runs from September to December and when a typhoon hits the central coast, it is serious. The city shuts down and conditions can be dangerous. Timing your 30-day stay outside this window is not optional. The e-Visa requirement is manageable but adds a step that requires planning at least a week before departure — do not leave it last minute.',
    practicalTips: [
      {
        title: 'An Thuong is the base',
        body: 'Most coworking spaces, cafes, gyms, and restaurants are within walking distance in An Thuong. Start here for your first stay.',
      },
      {
        title: 'Apply for your e-Visa at least a week before you fly',
        body: 'The online application is straightforward at evisa.xuatnhapcanh.gov.vn. Processing takes 3 to 7 working days. Do not leave it last minute.',
      },
      {
        title: 'Do not drink tap water',
        body: 'Order large refill water jugs for your apartment, the same way locals do. Most accommodation landlords can arrange this. Water is cheap and the system works.',
      },
      {
        title: 'Learn the basics of Vietnamese',
        body: '"Xin chao" (hello), "cam on" (thank you), "bao nhieu" (how much?). Older locals especially do not speak English. Effort is appreciated and makes everyday interactions much smoother.',
      },
      {
        title: 'Hoi An is a quick trip, not a day off',
        body: 'Da Nang to Hoi An is 30 to 45 minutes. Go on a weekday morning to avoid tour groups. Get a tailored item made, eat the cao lau, and walk the old town in the early light.',
      },
    ],
  },
  {
    slug: 'buenos-aires',
    name: 'Buenos Aires',
    country: 'Argentina',
    region: 'Latin America',
    flag: '🇦🇷',
    tagline: 'Europe in South America. World-class steak, tango, and a city that runs on coffee and late nights.',
    heroImage: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&w=1600&q=80',
    altText: 'Buenos Aires skyline with the Obelisco and Avenida 9 de Julio at dusk',
    sectionImages: {
      food: 'https://images.unsplash.com/photo-1529543544282-ea669407fca3?auto=format&fit=crop&w=1400&q=75',
      activities: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1400&q=75',
      sights: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&w=1400&q=75',
      remoteWork: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=75',
    },
    overview:
      'Buenos Aires is the most European city in South America and one of the most affordable big cities on the South Bound circuit. Palermo\'s wide, tree-lined streets, world-class restaurants, and a cafe culture that rivals Paris make it one of the most liveable cities anywhere. For South African remote workers, the combination of a cultured, modern city at developing-world prices is hard to beat. The only real friction is the time zone — seven hours behind South Africa — which either works for you or it does not.',
    quickStats: {
      monthlyBudget: 'R33,000 – R54,000',
      nomadRating: 8.0,
      bestMonths: 'Mar – May, Sep – Nov',
      visaFree: '90 days',
    },
    culture: {
      description:
        'Buenos Aires has a European soul with a distinctly South American pulse. The architecture is grand, the coffee is serious, and dinner happens at 10pm. Porteños are proud, sociable, and deeply invested in food, football, and conversation. The city has a rich arts scene, world-class theatre, and a literary culture that produces more bookshops per capita than almost anywhere else. Tango is not just for tourists here — it is woven into the city\'s identity. The pace of life is unhurried by day and electrifying by night.',
      highlights: [
        'One of the most vibrant nightlife and restaurant scenes in South America',
        'Serious coffee culture — independent cafes on every block, not chains',
        'Tango milongas in San Telmo that run until sunrise',
        'Strong arts and theatre scene: galleries, live music, street art in Palermo',
        'Sunday San Telmo market — one of the best flea markets in Latin America',
      ],
    },
    food: {
      description:
        'Buenos Aires may have the best food scene in Latin America for someone with a South African palate. Steak is the obvious headline — a properly cooked bife de chorizo at a parrilla costs R90 to R200 and will recalibrate your expectations for beef permanently. Beyond the meat: empanadas, medialunas with morning coffee, dulce de leche on everything, and a growing array of pasta, pizza, and international options. Palermo has restaurants that compete with Europe at a fraction of the cost.',
      mustTry: [
        'Bife de chorizo at a neighbourhood parrilla — share with one other person',
        'Medialunas with a cortado at a classic confitería in the morning',
        'Empanadas from a bakery in Palermo or Recoleta',
        'Dulce de leche in any form — spread, in pastries, eaten with a spoon',
        'Provoleta (grilled provolone with chimichurri) as a starter before the steak arrives',
      ],
      budgetBreakdown: {
        street: 'R45 – R90 for empanadas, choripán, or a market lunch',
        midRange: 'R100 – R250 at a local restaurant or parrilla',
        premium: 'R350+ at upscale Palermo or Recoleta restaurants',
      },
      topAreas: ['Palermo for variety and quality', 'San Telmo for traditional parrillas', 'Recoleta for upscale dining'],
    },
    activities: [
      {
        name: 'Tango Lesson or Milonga',
        description: 'Take a group tango lesson in San Telmo or Palermo (R350–R550) and then go to a milonga that evening. Skip the tourist dinner shows and go where locals actually dance.',
        emoji: '💃',
      },
      {
        name: 'La Boca and Caminito',
        description: 'The colourful corrugated-iron neighbourhood along the old harbour. Tourist-heavy on weekends but genuinely photogenic and historically interesting. Go on a Tuesday morning to beat the crowds.',
        emoji: '🎨',
      },
      {
        name: 'San Telmo Sunday Market',
        description: 'The oldest neighbourhood in BA comes alive on Sundays. Antiques, crafts, street performers, food stalls, and live tango at Plaza Dorrego. One of the best free afternoons in the city.',
        emoji: '🛍️',
      },
      {
        name: 'MALBA — Latin American Art Museum',
        description: 'One of the best modern art museums in South America. Strong Frida Kahlo and Diego Rivera collections. Located in Palermo. Entry around R140.',
        emoji: '🖼️',
      },
      {
        name: 'Day Trip to Colonia del Sacramento',
        description: 'A 1-hour ferry to Uruguay. A UNESCO-listed Portuguese colonial town with cobblestone streets and sea views. Easy to do in a day and a different country on the passport.',
        emoji: '⛴️',
      },
      {
        name: 'Football at La Bombonera or El Monumental',
        description: 'Boca Juniors or River Plate in their home stadiums. One of the most intense sporting atmospheres anywhere on earth. Buy tickets in advance and go with a group.',
        emoji: '⚽',
      },
      {
        name: 'Tigre Delta Day Trip',
        description: 'An hour north of BA by train. The Paraná Delta is a network of islands and waterways. Kayak, eat river fish, and see a completely different side of Argentina.',
        emoji: '🌊',
      },
      {
        name: 'Recoleta Cemetery',
        description: 'Genuinely one of the most impressive sites in the city. A small city of elaborate mausoleums where Eva Perón is buried. Worth an hour of your time.',
        emoji: '🏛️',
      },
    ],
    sights: {
      mustSee: [
        { name: 'Caminito, La Boca', note: 'Colourful tin-house street and birthplace of tango. Most photogenic on a weekday morning.' },
        { name: 'Recoleta Cemetery', note: 'Monumental mausoleums and the tomb of Eva Perón. Actually worth your time.' },
        { name: 'Plaza de Mayo and Casa Rosada', note: 'The historic heart of Argentina. Free, central, and flanked by grand architecture.' },
      ],
      livedIn: [
        { name: 'Palermo Soho morning coffee', note: 'Independent cafes on tree-lined streets. Order a cortado and sit. This is BA at its best.' },
        { name: 'Sunday San Telmo market', note: 'Antiques, food, tango in the square. The most mixed crowd in the city, every Sunday.' },
        { name: 'Avenida Corrientes bookshops', note: 'Buenos Aires has more bookshops per capita than any city. This strip runs all night.' },
        { name: 'Parrilla dinner at 9pm', note: 'Order late, share the table wine, take your time. Locals eat at 10pm. Join them.' },
      ],
    },
    neighbourhoods: [
      {
        name: 'Palermo',
        description:
          'The nomad and expat neighbourhood of Buenos Aires. Palermo Soho and Palermo Hollywood have the best cafes, restaurants, coworking spaces, and green parks. Wide streets with trees, walkable, and the most connected neighbourhood for remote workers.',
        bestFor: 'First-timers, those who want walkability and great food options nearby',
        monthlyRent: 'R9,000 – R18,000 for a modern studio or 1-bed',
      },
      {
        name: 'Recoleta',
        description:
          'Upscale, elegant, and quieter than Palermo. Grand Haussmann-style buildings, excellent restaurants, the famous cemetery. More expensive but the quality of apartments is higher and the neighbourhood is extremely safe.',
        bestFor: 'Those who want a premium base with classic BA character',
        monthlyRent: 'R11,000 – R22,000 for a 1-bed',
      },
      {
        name: 'San Telmo',
        description:
          'The oldest neighbourhood in BA, with cobblestone streets, antique dealers, and a raw creative energy. Cheaper than Palermo. The tango and arts scene is centred here. Slightly grittier but very characterful.',
        bestFor: 'Culture seekers, those who want authenticity over comfort',
        monthlyRent: 'R6,500 – R13,000 for a studio or 1-bed',
      },
    ],
    costOfLiving: {
      accommodation: { budget: 'R5,500 – R9,000', mid: 'R9,000 – R18,000', premium: 'R20,000+' },
      coworking: { dayPass: 'R250 – R450/day', monthly: 'R2,500 – R5,500' },
      food: { budget: 'R2,500 – R3,600', mid: 'R4,500 – R7,200', premium: 'R7,200 – R12,000' },
      transport: { budget: 'R200 – R360', mid: 'R360 – R900', premium: 'R900 – R2,000' },
      gym: { budget: 'R700 – R1,100', mid: 'R1,100 – R1,800', premium: 'R2,000+' },
      total: { budget: 'R27,000 – R36,000', mid: 'R40,000 – R54,000', premium: 'R65,000+' },
      note: 'Buenos Aires prices are largely pegged to the dollar for nomad-focused apartments. A comfortable Palermo studio runs R9,000 to R18,000/month — comparable to sharing a flat in Cape Town, but in a city with world-class restaurants, culture, and lifestyle on your doorstep.',
    },
    weekInTheLife: [
      { label: 'Morning routine', description: 'Coffee at a confitería on the corner — cortado and a medialuna for R45. Read, journal, or prep before the workday. Buenos Aires mornings are quiet and unhurried. This is the city showing its best side before 9am.' },
      { label: 'Work day', description: 'Coworking space in Palermo or working from a café with reliable WiFi. The 7-hour time difference to SA means most calls fall in your afternoon. Mornings are your deep-focus window — use them.' },
      { label: 'Lunch', description: 'Empanadas from the bakery two blocks away for R90. Or a three-course lunch menú ejecutivo at a local restaurant for R180 to R270. The set lunch culture in BA is exceptional value and how locals eat on weekdays.' },
      { label: 'Afternoon', description: 'Walk Parque Tres de Febrero in Palermo, browse bookshops on Corrientes, or wander into Recoleta. Buenos Aires is endlessly walkable and every neighbourhood has something going on.' },
      { label: 'Evening', description: 'Dinner before 9pm is a tourist tell. Join the locals and eat at 9:30pm. Parrilla with friends, a bottle of Malbec, and two hours at the table. This is where your budget gets spent and it is worth every rand.' },
      { label: 'Weekend', description: 'Sunday San Telmo market in the morning, tango milonga on Saturday night. Day trip to Tigre Delta or a ferry to Colonia del Sacramento. BA rewards slow exploration.' },
    ],
    theCatch:
      'The time zone is a genuine obstacle. Seven hours behind South Africa means a 9am Johannesburg meeting is 2am in Buenos Aires. If you have regular real-time calls with SA clients you will need to negotiate a schedule change or accept early mornings. Argentine economic instability means pricing can shift significantly between research and arrival — always check current conditions before committing. Safety requires constant awareness in tourist areas; pickpocketing is common and visible. Spanish is much more essential here than in Southeast Asia. BA rewards those who adapt to it.',
    remoteWork: {
      internetQuality:
        'Variable. Modern apartments in Palermo and Recoleta have reliable fibre at 50 to 100 Mbps. Older buildings can have unreliable connections. Always verify internet quality before committing to an apartment. Coworking spaces have guaranteed fast connections.',
      internetRating: 7,
      coworkingSpaces: [
        {
          name: 'Areatreinta',
          description: 'Two locations in Palermo. Modern, well-designed, good community, regular events. The strongest option for remote workers in BA.',
          price: 'From R2,700/month for a flex desk',
        },
        {
          name: 'La Maquinista',
          description: 'Historic converted factory in the city centre. Good for solo workers who want a change of scene. Character over polish.',
          price: 'Day pass from R280, monthly from R3,200',
        },
        {
          name: 'WeWork Buenos Aires',
          description: 'Multiple locations including Palermo. Consistent quality and reliable internet. Pricier than local options but predictable.',
          price: 'Hot desk from R4,500/month',
        },
      ],
      cafes:
        'Palermo and Recoleta have excellent work cafes. Los Galgos and El Federal in San Telmo are classics. Coffee runs R45 to R90. Extended sitting is normal. WiFi is usually available but verify speed before settling in for the day.',
    },
    visa: {
      headline: 'South Africans get 90 days visa-free',
      details: [
        '90 days visa-free entry for SA passport holders — no application needed',
        'Covers a 30-day South Bound stay with two months to spare',
        'Passport must be valid for the duration of your stay',
      ],
      longerStay:
        'Argentina does not currently offer a formal digital nomad visa. For stays beyond 90 days, the common approach is a border hop to Uruguay (1-hour ferry to Colonia del Sacramento) and re-entry for a fresh 90 days. This is widely used and generally accepted, though immigration policy can change. Verify current guidance before relying on this approach.',
      flag: null,
    },
    nomadRating: {
      overall: 8.0,
      scores: [
        { factor: 'Internet', score: 7, note: 'Good in modern buildings and coworking spaces. Variable in older apartments — always check before committing.' },
        { factor: 'Affordability', score: 8.5, note: 'World-class city at developing-world prices. Strong value for SA passport holders.' },
        { factor: 'Lifestyle', score: 9.5, note: 'Unmatched food, nightlife, culture, and walkability. One of the most liveable cities on earth.' },
        { factor: 'Safety', score: 7, note: 'Safe in Palermo and Recoleta. Pickpocketing is real in tourist areas. Normal urban awareness required.' },
        { factor: 'Community', score: 7.5, note: 'Growing nomad community, especially in Palermo. Less structured than Chiang Mai or Bali but active and social.' },
      ],
      summary:
        'Buenos Aires delivers a lifestyle that genuinely surprises people. The food, culture, and social scene are world-class. The main trade-offs are the time zone (7 hours behind SA), variable internet in older buildings, and an economic environment that requires flexibility. For those who adapt, it is one of the most rewarding cities on the South Bound circuit.',
    },
    bestTime: {
      ideal: 'March to May and September to November: shoulder seasons with 16 to 25°C and the full city in motion.',
      shoulder: 'June to August: mild winter (8–15°C), fewer tourists, lower prices, and the city at its most local.',
      avoid: 'January and February: hot (28–35°C), humid, and many locals leave for their own summer holidays. The city feels noticeably empty.',
      recommendation: 'April or October for a 30-day South Bound stay. Perfect weather, full social scene, and coworking spaces running at capacity.',
    },
    practicalTips: [
      {
        title: 'Use Wise or Revolut for payments',
        body: 'These give you much better exchange rates than official currency exchange booths or airport ATMs. Cash is useful for markets and smaller restaurants — keep pesos on you for day-to-day spending.',
      },
      {
        title: 'Verify internet before committing to an apartment',
        body: 'Run a speed test on the WiFi before signing any agreement. Ask specifically for fibre. Older buildings in Recoleta and San Telmo can have slow or unreliable connections that are not obvious until you try to join a call.',
      },
      {
        title: 'Spanish makes a real difference here',
        body: 'Unlike Southeast Asia, English is not widely spoken outside tourist zones and coworking spaces. Even basic Spanish — greetings, numbers, menu vocabulary — significantly improves your daily experience.',
      },
      {
        title: 'Eat dinner at 9pm or later',
        body: 'Restaurants fill up after 9pm. Arriving at 7pm gets you a tourist-empty room and an early kitchen. If you want the real BA experience — the energy, the long table, the conversation — go late.',
      },
      {
        title: 'Know your neighbourhoods',
        body: 'Palermo, Recoleta, and Belgrano are safe day and night. San Telmo is fine with awareness. Avoid the southern and western outskirts of the city after dark. Do not use your phone while walking on busy streets.',
      },
    ],
  },
  {
    slug: 'medellin',
    name: 'Medellín',
    country: 'Colombia',
    region: 'Latin America',
    flag: '🇨🇴',
    tagline: 'The City of Eternal Spring. Affordable, energetic, and built into a valley that earns the name.',
    heroImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1600&q=80',
    altText: 'Medellín panorama with green hillside comunas and the modern skyline in the Aburrá Valley',
    sectionImages: {
      food: 'https://images.unsplash.com/photo-1640603989047-f86a40e5e3c8?auto=format&fit=crop&w=1400&q=75',
      activities: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=1400&q=75',
      sights: 'https://images.unsplash.com/photo-1591805822070-0f43f3f37374?auto=format&fit=crop&w=1400&q=75',
      remoteWork: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=75',
    },
    overview:
      'Medellín gets called the City of Eternal Spring because the temperature rarely moves far from 24°C. The city sits in a narrow valley 1,500 metres above sea level in the Colombian Andes, and that elevation gives it one of the best year-round climates in Latin America. The nomad scene has expanded significantly over the past decade — El Poblado is full of coworking spaces and coffee shops — and the cost of living is low enough that most South Africans find themselves living significantly better here than at home for less money. The transformation from the city most people associate with Pablo Escobar to the innovative, design-forward place it is today is one of the most striking urban turnarounds anywhere in the world.',
    quickStats: {
      monthlyBudget: 'R22,000 – R36,000',
      nomadRating: 8.0,
      bestMonths: 'Dec – Feb, Jul – Aug',
      visaFree: '90 days',
    },
    culture: {
      description:
        'Paisas (people from the Antioquia region) are famously warm, entrepreneurial, and proud of their city. The turnaround from the Escobar era to the innovative, design-forward Medellín of today is a genuine source of civic pride. Street art and public sculpture are everywhere — Fernando Botero donated dozens of his famous bronze sculptures to the city. The metro system, one of the most reliable in South America, is treated as a point of local pride. The city invests heavily in public culture: free museums, open-air libraries, and accessible parks connect communities across the valley.',
      highlights: [
        'Botero Plaza — Fernando Botero\'s famous bronze sculptures in the open air, free to visit',
        'World-class metro and cable car system connecting communities across the valley',
        'Vibrant street art scene in the hillside comunas',
        'Feria de las Flores in August — Colombia\'s most famous flower festival',
        'Outstanding Colombian coffee culture — fresh, local, and very good everywhere',
      ],
    },
    food: {
      description:
        'Colombian food is hearty, unpretentious, and excellent value. The bandeja paisa — a plate piled with beans, rice, chicharrón, egg, sausage, and avocado — is the regional specialty and costs R90 to R180 at a local restaurant. Arepas are everywhere: grilled, stuffed, or fried. Fresh Colombian coffee is outstanding and costs almost nothing. El Poblado has international restaurants for variety. For budget eating, a full lunch menú corriente (set menu) runs R90 to R135 and is how locals eat every weekday.',
      mustTry: [
        'Bandeja paisa — the great Colombian plate, shared at a proper local restaurant',
        'Arepa con queso from a street cart or bakery for breakfast',
        'Fresh Colombian coffee, black, from a small independent café',
        'Empanadas de pipián at any street stand',
        'Sancocho — thick chicken and vegetable soup, especially good on a rainy evening',
      ],
      budgetBreakdown: {
        street: 'R45 – R90 for arepas, empanadas, and street snacks',
        midRange: 'R90 – R180 for a full menú corriente or casual restaurant meal',
        premium: 'R270 – R550 at El Poblado restaurants and rooftop bars',
      },
      topAreas: ['El Poblado for variety and international options', 'Laureles for local restaurants without tourist pricing', 'Parque del Periodista area for street food and cheap eats'],
    },
    activities: [
      {
        name: 'Guatapé Day Trip',
        description: 'Non-negotiable. A two-hour bus ride to a technicolour lakeside village with a 740-step rock (El Peñol) offering panoramic views across the surrounding landscape. One of the best day trips in South America.',
        emoji: '🪨',
      },
      {
        name: 'Metro Cable to Arví Park',
        description: 'Take the metro to the cable car terminus and ride up into forested hillside above the city. Arví Park has hiking trails, birdwatching, and market stalls. A half day that costs almost nothing.',
        emoji: '🚠',
      },
      {
        name: 'Street Art Tour of the Comunas',
        description: 'The transformation of the formerly dangerous hillside comunas is visible in its murals. Guided tours from El Poblado give the neighbourhood\'s history a context you miss without one.',
        emoji: '🎨',
      },
      {
        name: 'Coffee Farm Tour',
        description: 'A full-day trip to a finca in the Antioquia countryside, learning the full coffee production process from tree to cup. Book through a local operator for R450 to R650.',
        emoji: '☕',
      },
      {
        name: 'Botero Plaza and Antioquia Museum',
        description: 'Free, central, and genuinely interesting. Botero\'s oversized bronze sculptures fill the plaza. The Antioquia Museum next door is worth two hours.',
        emoji: '🏛️',
      },
      {
        name: 'Salsa Dancing',
        description: 'Medellín has a serious dance culture. Take a salsa class in El Poblado (R200–R350) and practice at a local baile on the weekend. The nights run until 4am.',
        emoji: '💃',
      },
      {
        name: 'Jardín Village',
        description: 'A three-hour bus ride into the Andes mountains. A perfectly preserved colonial mountain town with hummingbirds, fresh air, and exceptional coffee. Worth an overnight stay.',
        emoji: '🌺',
      },
      {
        name: 'El Peñol Rock Climb',
        description: '740 steps carved directly into the face of an enormous granite monolith. The view from the top over the reservoir and surrounding valleys is the most dramatic single view available from any day trip on the circuit.',
        emoji: '🏔️',
      },
    ],
    sights: {
      mustSee: [
        { name: 'Botero Plaza and Antioquia Museum', note: 'Free outdoor sculpture gallery with a world-class museum attached. Do them together.' },
        { name: 'El Peñol, Guatapé', note: 'The 740 steps. The view. If you do one day trip from Medellín, this is it.' },
        { name: 'La Catedral Metropolitana', note: 'One of the largest brick churches in the world. Parque de Bolívar surrounding it is the social heart of the city.' },
      ],
      livedIn: [
        { name: 'Parque Lleras morning coffee', note: 'The social hub of El Poblado. Grab coffee and people-watch before the day starts.' },
        { name: 'Laureles lunch', note: 'Cross the river for a menú corriente in Laureles. Better food, lower prices, and more local energy than El Poblado.' },
        { name: 'Metro ride across the valley', note: 'Just ride end-to-end. Free with a card. The elevated section shows the full scale of the city.' },
        { name: 'Envigado evening walk', note: 'The quieter suburb south of El Poblado where many long-term nomads live. Independent restaurants and calm streets.' },
      ],
    },
    neighbourhoods: [
      {
        name: 'El Poblado',
        description:
          'The nomad and expat hub of Medellín. All the coworking spaces, international restaurants, rooftop bars, and social infrastructure are here. Safe, walkable, and English-friendly. It is a bubble — comfortable and convenient — but you will meet most of your people here.',
        bestFor: 'First-timers, those who want community and convenience from day one',
        monthlyRent: 'R5,500 – R13,500 for a studio or 1-bed',
      },
      {
        name: 'Laureles',
        description:
          'A residential neighbourhood across the river from El Poblado. Quieter, more local, better value. Excellent for longer stays when you want to feel like you actually live in Medellín rather than the tourist zone. Good cafes, local restaurants, and leafy streets.',
        bestFor: 'Longer stays, those who want local life at good value',
        monthlyRent: 'R4,000 – R9,000 for a studio or 1-bed',
      },
      {
        name: 'Envigado',
        description:
          'A separate municipality that flows into the south of El Poblado. Very safe, very liveable, popular with long-term expats who have moved past the El Poblado party scene. Good gyms, restaurants, and easy metro access.',
        bestFor: 'Longer stays, those who prefer a quieter base',
        monthlyRent: 'R3,500 – R8,000 for a studio or 1-bed',
      },
    ],
    costOfLiving: {
      accommodation: { budget: 'R3,200 – R5,500', mid: 'R5,500 – R10,000', premium: 'R12,000+' },
      coworking: { dayPass: 'R160 – R350/day', monthly: 'R1,800 – R4,500' },
      food: { budget: 'R1,800 – R2,700', mid: 'R2,700 – R4,500', premium: 'R5,400 – R9,000' },
      transport: { budget: 'R90 – R180', mid: 'R180 – R450', premium: 'R450 – R900' },
      gym: { budget: 'R360 – R630', mid: 'R630 – R1,100', premium: 'R1,300+' },
      total: { budget: 'R18,000 – R25,000', mid: 'R27,000 – R36,000', premium: 'R45,000+' },
      note: 'Medellín is one of the most affordable cities in Latin America for the quality of life it delivers. R27,000/month in El Poblado gets you a well-furnished apartment, coworking access, restaurant meals, and an active social life. That is roughly what a single room in a Cape Town flatshare costs.',
    },
    weekInTheLife: [
      { label: 'Morning routine', description: 'Fresh Colombian filter coffee at a small café near Parque Lleras for R18. Sit outside. It is 24°C at 8am and will stay that way all day. This is why they call it eternal spring.' },
      { label: 'Work day', description: 'Selina or Atom House coworking in El Poblado. Reliable fibre, AC, coffee on tap. The 9-hour time difference to SA means most real-time calls land late morning to early afternoon your time.' },
      { label: 'Lunch', description: 'Walk to Laureles for a menú corriente — soup, rice, beans, protein, and juice for R90 to R135. This is how locals eat every weekday and it is the best value meal on the circuit.' },
      { label: 'Afternoon', description: 'Medellín has gym culture and outdoor culture. Parque Arví via cable car, a local gym for R360/month, or a late afternoon at a rooftop pool in El Poblado. The weather always cooperates.' },
      { label: 'Evenings', description: 'El Poblado nights run late. Dinner at 8pm, rooftop bars after 10pm, salsa until 3am if you want. The social scene is a genuine mix of locals, nomads, and expats who all end up in the same places.' },
      { label: 'Weekend', description: 'Saturday market at Parque El Poblado. Sunday Guatapé if you have not been — a two-hour bus each way and the most dramatic day trip available from any city on the South Bound circuit.' },
    ],
    theCatch:
      'The time zone is the biggest practical challenge for SA remote workers. Medellín is 9 hours behind SAST — a 9am Joburg call is midnight in Medellín. If you have regular real-time calls with SA clients this is a real problem that needs to be solved before you arrive. Safety in El Poblado and Laureles is genuinely fine, but Colombia requires more vigilance than Southeast Asia — phone snatching is real in busy areas and certain parts of the city are not safe. Use Uber or InDriver rather than street taxis. The Spanish barrier is real — less English is spoken here than in any Southeast Asian city. Monitor current Colombian travel advisories before departure.',
    remoteWork: {
      internetQuality:
        'Good in modern El Poblado and Laureles apartments. Fibre is standard in newer buildings. Coworking spaces have reliable connections at 100 Mbps+. Some older buildings have variable speeds — check before committing to accommodation.',
      internetRating: 7.5,
      coworkingSpaces: [
        {
          name: 'Selina Medellín',
          description: 'Part of the global Selina network. Good facilities, reliable internet, and a built-in community of nomads. In El Poblado with a hostel and social events attached.',
          price: 'Day pass from R280, monthly from R2,700',
        },
        {
          name: 'Atom House',
          description: 'El Poblado coworking with strong internet, meeting rooms, and a social atmosphere. Popular with longer-stay nomads who want a reliable base.',
          price: 'Monthly from R2,500',
        },
        {
          name: 'CoworkHouse',
          description: 'Quieter, more focused space in El Poblado. Good for deep work. Less social than Selina but better for productive days.',
          price: 'Day pass R180, monthly R1,800',
        },
      ],
      cafes:
        'El Poblado has a dense cluster of work-friendly cafes around Parque Lleras and along Avenida El Poblado. Pergamino Café is the standout — outstanding locally-sourced coffee, reliable WiFi, and a working culture. Coffee runs R35 to R90.',
    },
    visa: {
      headline: 'South Africans get 90 days visa-free',
      details: [
        '90 days visa-free entry for SA passport holders — no prior application needed',
        'No visa on arrival required — just arrive and go',
        'Covers a 30-day stay with two months of allowance remaining',
      ],
      longerStay:
        'Colombia launched a Digital Nomad Visa (Nómada Digital) allowing stays of up to 2 years. Requirements include proof of income of at least USD 684/month (≈R12,300) and a service contract with a company or clients outside Colombia. Apply through the Colombian Cancillería online platform. Fee is approximately USD 52 (≈R936).',
      flag: null,
    },
    nomadRating: {
      overall: 8.0,
      scores: [
        { factor: 'Internet', score: 7.5, note: 'Good in coworking spaces and modern apartments. Always verify your specific building before committing.' },
        { factor: 'Affordability', score: 9, note: 'One of the most affordable Latin American cities. R27,000/month covers a full, comfortable life.' },
        { factor: 'Lifestyle', score: 8.5, note: 'Excellent social scene, great coffee, outdoor activities, and consistent 24°C year-round.' },
        { factor: 'Safety', score: 7, note: 'Safe in El Poblado and Laureles with basic precautions. Requires more vigilance than Southeast Asia.' },
        { factor: 'Community', score: 8, note: 'Strong and growing nomad community in El Poblado. Regular meetups and events.' },
      ],
      summary:
        'Medellín is one of the most compelling destinations on the South Bound circuit. The weather, affordability, and lifestyle quality are genuinely excellent. The main challenges — time zone, safety vigilance, and language barrier — are all manageable with preparation. It consistently surprises people who arrive with an outdated image of Colombia.',
    },
    bestTime: {
      ideal: 'December to February and July to August: the two dry seasons. Clearest skies, least rain, and all activities running smoothly.',
      shoulder: 'March to May and September to November: some rain but still excellent weather and fewer tourists.',
      avoid: 'There is no truly bad time in Medellín weather-wise — the altitude keeps temperatures consistent. Avoid major Colombian holiday weeks when El Poblado gets crowded.',
      recommendation: 'January or July for a South Bound 30-day stay. Perfect dry-season weather and the full social scene running.',
    },
    practicalTips: [
      {
        title: 'Use Uber or InDriver, never street taxis',
        body: 'Street taxis in Medellín carry real risk in some situations. Uber and InDriver are widely used, safe, and fully tracked. Use them for all your transport needs without exception.',
      },
      {
        title: 'Parque Lleras is where you start',
        body: 'Parque Lleras in El Poblado is where the social scene radiates from. If you are new and looking to meet people, this is the first place to spend a Tuesday or Thursday evening.',
      },
      {
        title: 'Do Guatapé in the first week',
        body: 'Everyone who has been to Medellín says this. Do not leave it for the last week and then miss it. Go on a weekday, do the 740 steps, and the view is the payoff.',
      },
      {
        title: 'Learn basic Spanish before you arrive',
        body: 'Less English is spoken in Medellín than in Southeast Asia. Locals are warm and patient with non-Spanish speakers, but knowing basic phrases — numbers, food vocabulary, greetings — makes daily life significantly better.',
      },
      {
        title: 'Altitude adjustment is mild but real',
        body: 'Medellín sits at 1,495 metres. Most people feel fine but some notice mild fatigue in the first day or two. Drink extra water, go easy on alcohol the first night, and it resolves quickly.',
      },
    ],
  },
  {
    slug: 'mexico-city',
    name: 'Mexico City',
    country: 'Mexico',
    region: 'Latin America',
    flag: '🇲🇽',
    tagline: 'One of the great cities of the world. World-class food, a neighbourhood built for remote work, and 180 days on arrival.',
    heroImage: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&w=1600&q=80',
    altText: 'Mexico City Paseo de la Reforma at sunset with the Angel of Independence monument',
    sectionImages: {
      food: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=1400&q=75',
      activities: 'https://images.unsplash.com/photo-1547566797-94af2aa0d55e?auto=format&fit=crop&w=1400&q=75',
      sights: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=1400&q=75',
      remoteWork: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=75',
    },
    overview:
      'Mexico City — CDMX — is one of the largest cities in the world and one of the most underrated for long-term remote workers. The food scene is genuinely world-class. Roma Norte, the neighbourhood where most nomads base themselves, is a 19th-century Parisian-style grid of tree-lined streets, independent cafes, art galleries, and excellent restaurants. The cost of living is higher than Chiang Mai or Medellín but still significantly cheaper than Cape Town. With 180 days visa-free for South African passport holders, it is one of the most accessible long-stay destinations on the entire circuit.',
    quickStats: {
      monthlyBudget: 'R28,000 – R52,000',
      nomadRating: 8.5,
      bestMonths: 'Nov – Apr',
      visaFree: '180 days',
    },
    culture: {
      description:
        'Mexico City is a megacity with ancient Aztec foundations, colonial Spanish architecture built on top, and a contemporary culture of art, food, and design that punches above any city its size. The Museo Nacional de Antropología is one of the best museums in the world. Frida Kahlo, Diego Rivera, and León Trotsky all lived within walking distance of each other in Coyoacán. Street art fills entire building facades in Roma and Condesa. The city moves fast, eats well, and takes its creative culture seriously. South Africans tend to find it immediately comfortable — a large, diverse, chaotic city that runs on hustle and rewards people who engage.',
      highlights: [
        'One of the great food cities of the world — from street tacos to world-ranked restaurants',
        'The Museo Nacional de Antropología — one of the best museums anywhere, full stop',
        'Lucha Libre (Mexican wrestling) — a surreal, genuinely fun Friday night out',
        'Roma and Condesa street art scene among the best in Latin America',
        'Vibrant nightlife and a large nomad and expat community in Roma Norte',
      ],
    },
    food: {
      description:
        "Mexico City's food culture is a serious reason to make the trip. Street tacos from a corner cart at 11pm for R18 each. Chilaquiles for Sunday brunch at a terrace café for R90. A tasting menu at a world-ranked restaurant for R900 a head. The entire spectrum is available and every level of it is excellent. Tacos al pastor, cochinita pibil, mole negro, elotes, tamales — these are not snacks, they are a culinary tradition. Roma and Condesa have excellent restaurants at every price point. Coyoacán has the best market food in the city.",
      mustTry: [
        'Tacos al pastor from a street cart in Roma Norte after 9pm',
        'Chilaquiles with salsa verde and crema at a weekend brunch spot',
        'Tamales from a street stall — corn husk tamales, the real version',
        'Elotes or esquites (roasted corn with lime, cheese, and chilli)',
        'Mole negro over chicken at a traditional restaurant in Coyoacán',
      ],
      budgetBreakdown: {
        street: 'R18 – R65 for tacos, elotes, and market food',
        midRange: 'R90 – R270 at a neighbourhood restaurant in Roma or Condesa',
        premium: 'R400+ at upscale Polanco or Condesa restaurants',
      },
      topAreas: ['Roma Norte for everyday eating and café culture', 'Coyoacán for market food and local atmosphere', 'Polanco for upscale dining and international cuisine'],
    },
    activities: [
      {
        name: 'Teotihuacan Pyramids',
        description: 'An hour from CDMX by bus or tour. One of the most impressive ancient sites in the Americas. Arrive at 7am to beat the crowds. Climbing the Pyramid of the Sun is the moment of the trip.',
        emoji: '🏛️',
      },
      {
        name: 'Museo Nacional de Antropología',
        description: "Mexico's national anthropology museum. One of the best in the world. The Aztec Sun Stone alone justifies the visit. Budget 3 to 4 hours. Entry around R90.",
        emoji: '🗿',
      },
      {
        name: 'Frida Kahlo Museum (La Casa Azul)',
        description: "The Blue House in Coyoacán where Kahlo was born and died. Her personal items, paintings, and studio are preserved. Book tickets online well in advance — it sells out regularly.",
        emoji: '🎨',
      },
      {
        name: 'Lucha Libre at Arena México',
        description: 'Friday and Tuesday nights. Mexican wrestling with masks, theatrics, and an electric crowd. Buy a general ticket (R200–R350), sit near the ring, get food from inside vendors.',
        emoji: '🤼',
      },
      {
        name: 'Xochimilco Canals',
        description: 'Pre-Columbian canal network in the south of the city. Hire a trajinera (decorated barge), pack food and drinks, and float through the waterways with locals. Best on a Saturday.',
        emoji: '🚣',
      },
      {
        name: 'Day Trip to Tepoztlán',
        description: 'An hour and a half from CDMX. A small town at the base of a steep mountain with a hilltop pyramid, an excellent Sunday market, and a slower pace that contrasts well with the city.',
        emoji: '⛰️',
      },
      {
        name: 'Chapultepec Park',
        description: 'The largest urban park in Latin America. Two major museums, a lake, a castle, a zoo, and green space the entire city uses on Sundays. Free to enter, most museums charge separately.',
        emoji: '🌳',
      },
      {
        name: 'Mercado de Jamaica',
        description: 'The city\'s flower market. Row after row of cut flowers, orchids, and elaborate arrangements. The food section next to it has excellent simple tacos. Go early in the morning.',
        emoji: '🌸',
      },
    ],
    sights: {
      mustSee: [
        { name: 'Teotihuacan', note: 'Ancient pyramids an hour out. Go early. Climb the Pyramid of the Sun. Do not skip it.' },
        { name: 'Museo Nacional de Antropología', note: 'Half a day minimum. The Aztec Sun Stone room alone is worth the entry fee.' },
        { name: 'Zócalo and Metropolitan Cathedral', note: "The vast central square of CDMX. The cathedral sits on Aztec ruins. The city's historical anchor." },
      ],
      livedIn: [
        { name: 'Roma Norte morning taco run', note: 'Find your corner taco cart in the first week. Same cart, every morning. R18 each.' },
        { name: 'Condesa park walk', note: 'Parque México in Condesa is one of the best urban parks on the circuit. Morning run or afternoon read.' },
        { name: 'Coyoacán on a weekday', note: 'The Kahlo neighbourhood without the weekend crowds. Market food, cobblestones, and the Blue House.' },
        { name: 'Mezcal at a Roma bar', note: 'Order neat with orange and sal de gusano. Roma has excellent mezcal bars. This is how it is supposed to be drunk.' },
      ],
    },
    neighbourhoods: [
      {
        name: 'Roma Norte',
        description:
          'The epicentre of Mexico City nomad life. 19th-century grid streets with jacaranda trees, converted townhouses, the best café density in the city, and a walkable scale that makes the megacity feel manageable. Most coworking spaces, events, and social infrastructure are here.',
        bestFor: 'First-timers and anyone who wants the best of CDMX within walking distance',
        monthlyRent: 'R9,000 – R22,000 for a studio or 1-bed',
      },
      {
        name: 'Condesa',
        description:
          'Adjacent to Roma Norte and sharing much of its energy. Art deco buildings, Parque México at its centre, and a slightly more upscale feel. Excellent restaurants and cafes with more green space than Roma.',
        bestFor: 'Those who want Roma-quality lifestyle with more greenery and a calmer pace',
        monthlyRent: 'R11,000 – R25,000 for a studio or 1-bed',
      },
      {
        name: 'Coyoacán',
        description:
          'A historic neighbourhood in the south of the city that feels like a separate village. Colonial cobblestones, the Frida Kahlo museum, excellent market food, and a creative bohemian community. Further from the Roma Norte nomad scene but excellent for longer stays.',
        bestFor: 'Culture seekers, longer stays, those who prefer local atmosphere',
        monthlyRent: 'R7,200 – R14,400 for a studio or 1-bed',
      },
    ],
    costOfLiving: {
      accommodation: { budget: 'R5,400 – R9,000', mid: 'R9,000 – R18,000', premium: 'R20,000+' },
      coworking: { dayPass: 'R270 – R540/day', monthly: 'R2,700 – R6,300' },
      food: { budget: 'R2,700 – R4,500', mid: 'R4,500 – R8,100', premium: 'R8,100 – R14,400' },
      transport: { budget: 'R180 – R360', mid: 'R360 – R900', premium: 'R900 – R1,800' },
      gym: { budget: 'R540 – R900', mid: 'R900 – R1,800', premium: 'R2,000+' },
      total: { budget: 'R22,000 – R32,000', mid: 'R36,000 – R52,000', premium: 'R65,000+' },
      note: 'Mexico City costs more than Medellín or Chiang Mai, but significantly less than Cape Town for a comparable quality of life. A comfortable Roma Norte apartment, coworking access, and regular restaurant eating runs R40,000 to R52,000/month — similar to a Cape Town budget, but in a city with world-class food and culture on every block.',
    },
    weekInTheLife: [
      { label: 'Morning routine', description: 'Tacos al pastor from the corner cart at 7:30am. Two tacos and a horchata for R55. Then coffee at a café on Álvaro Obregón. CDMX mornings are quiet before 9am — this is the window to explore before the city wakes up.' },
      { label: 'Work day', description: 'Coworking at Homework or WeWork in Roma Norte, or focused work at a neighbourhood café. CDMX is 9 to 10 hours behind SA — most SA-hours calls fall in your early morning, leaving afternoons free.' },
      { label: 'Lunch', description: 'Comida corrida (set lunch) at a local fondita for R90 to R135 — soup, main, and a drink. This is the main meal of the day in Mexico. Eat like a local at lunch and save restaurants for dinner.' },
      { label: 'Afternoon', description: 'Parque México in Condesa for a walk or run, a museum, or a neighbourhood wander. The city is genuinely walkable between Roma and Condesa and interesting at every turn.' },
      { label: 'Evening', description: 'Dinner at 8pm is normal. Street tacos and a mezcal bar, or a proper restaurant in Roma for R200 including drinks. CDMX has more good restaurants per block than anywhere else on this list.' },
      { label: 'Weekend', description: 'Teotihuacan on a Saturday morning if you have not been. Sunday Coyoacán for market food and the Frida Kahlo museum. A day trip to Tepoztlán if you want mountains. Something is always on.' },
    ],
    theCatch:
      "Mexico City's biggest practical challenge for first-timers is altitude — at 2,240 metres, most people feel mild fatigue or breathlessness in the first few days. Plan for it. The 9 to 10 hour time difference to South Africa is difficult for anyone with regular real-time calls with SA clients. Traffic in CDMX is serious — budget 45 minutes to cross the city even in an Uber. Air quality can be poor during the dry season. Safety in Roma, Condesa, and Polanco is genuinely fine, but standard big-city precautions apply at all times.",
    remoteWork: {
      internetQuality:
        'Good to excellent in modern Roma Norte and Condesa apartments and in all coworking spaces. Fibre is standard in newer buildings at 100 to 300 Mbps. Older buildings in Coyoacán and other historic areas can have slower connections — verify before committing.',
      internetRating: 8,
      coworkingSpaces: [
        {
          name: 'Homework',
          description: 'Multiple locations in Roma Norte and Condesa. The best local coworking option for long-stay nomads. Design-forward spaces, reliable internet, and a good community.',
          price: 'Day pass from R350, monthly from R3,600',
        },
        {
          name: 'WeWork Mexico City',
          description: 'Multiple locations across the city including Reforma and Polanco. Consistent quality and good meeting rooms. More expensive than Homework but completely reliable.',
          price: 'Hot desk from R5,400/month',
        },
        {
          name: 'Centraal',
          description: 'Coworking in Condesa with a strong community focus and good events programme. Popular with tech workers and entrepreneurs.',
          price: 'Monthly from R2,700',
        },
      ],
      cafes:
        'Roma Norte has the highest density of excellent work cafes in Latin America. Café Nin, Blend Station, and dozens of independent spots all have reliable WiFi and a working culture. Coffee costs R45 to R90. Nobody will ask you to move on.',
    },
    visa: {
      headline: 'South Africans get 180 days visa-free',
      details: [
        '180 days visa-free entry for SA passport holders — one of the most generous allowances anywhere',
        'No prior application required — stamp on arrival',
        'A 30-day South Bound stay uses only one sixth of the available allowance',
      ],
      longerStay:
        'Mexico allows Temporary Resident status for remote workers through the Residente Temporal visa, applied for at a Mexican consulate in South Africa. Proof of income (approximately USD 2,600/month) and bank statements required. Fee around USD 150 (≈R2,700). Valid for 1 to 4 years depending on the category approved.',
      flag: null,
    },
    nomadRating: {
      overall: 8.5,
      scores: [
        { factor: 'Internet', score: 8, note: 'Good in modern apartments and coworking spaces. Verify individual building speeds before committing.' },
        { factor: 'Affordability', score: 7.5, note: 'More expensive than Medellín or Chiang Mai, but excellent value for a world-class city experience.' },
        { factor: 'Lifestyle', score: 9.5, note: 'Exceptional food, culture, museums, and a neighbourhood in Roma Norte purpose-built for quality living.' },
        { factor: 'Safety', score: 7.5, note: 'Roma, Condesa, and Polanco are very safe. Standard big-city awareness required outside these areas.' },
        { factor: 'Community', score: 8.5, note: 'Large, active nomad community in Roma Norte. Regular events and a well-developed social infrastructure.' },
      ],
      summary:
        "Mexico City consistently surprises people. The food alone justifies the trip. Roma Norte is one of the best places to be based as a remote worker anywhere in Latin America. The 180-day visa and 9-hour time difference are the two most important factors for planning. If your work schedule can accommodate the time zone, CDMX delivers a lifestyle that is hard to match.",
    },
    bestTime: {
      ideal: 'November to April: the dry season. Clear skies, manageable temperatures (18–25°C), and the full cultural calendar in motion.',
      shoulder: 'October: tail end of rainy season but much clearer than June to August. Good accommodation availability.',
      avoid: 'June to August: rainy season with daily afternoon downpours. Still liveable but plan your afternoons around it. Christmas and Semana Santa weeks are very busy and prices spike.',
      recommendation: 'February or March for a 30-day South Bound stay. Dry season, excellent weather, and fewer tourists than December or January.',
    },
    practicalTips: [
      {
        title: 'Altitude adjustment is real — plan for it',
        body: 'Mexico City sits at 2,240 metres. Most people feel some fatigue or mild breathlessness in the first 48 hours. Drink extra water, avoid heavy alcohol the first night, take the first day easy. It passes within 2 to 3 days.',
      },
      {
        title: 'Uber and Didi only — no street taxis',
        body: 'Street taxis carry risk in CDMX. Uber and Didi are cheap (R45 to R135 for most city trips), widely available, and tracked. Use them for everything.',
      },
      {
        title: 'Roma Norte is your home base',
        body: 'Most of what you need as a remote worker — cafes, coworking, restaurants, gyms, and social events — is within a 20-minute walk of Roma Norte. Find an apartment here for your first stay.',
      },
      {
        title: 'Book Frida Kahlo Museum tickets online',
        body: 'La Casa Azul sells out regularly, especially on weekends. Book on the official website at least a week in advance. Weekday morning tickets are easiest to secure.',
      },
      {
        title: 'The metro is excellent off-peak',
        body: 'The Mexico City metro covers the whole city for R5 per trip. Avoid 7:30 to 9:30am and 6 to 8pm when it is dangerously crowded. Off-peak it is fast, reliable, and one of the best transit systems on the circuit.',
      },
    ],
  },
  {
    slug: 'tbilisi',
    name: 'Tbilisi',
    country: 'Georgia',
    region: 'Eastern Europe',
    flag: '🇬🇪',
    tagline: 'Ancient wine, sulphur baths, and 365 days visa-free. One of the most unexpected finds on the circuit.',
    heroImage: 'https://images.unsplash.com/photo-1565610222536-ef125047c135?auto=format&fit=crop&w=1600&q=80',
    altText: 'Tbilisi Old Town with Narikala fortress, Metekhi church, and the Kura River at dusk',
    sectionImages: {
      food: 'https://images.unsplash.com/photo-1534433784960-62abd56f2251?auto=format&fit=crop&w=1400&q=75',
      activities: 'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=1400&q=75',
      sights: 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&w=1400&q=75',
      remoteWork: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1400&q=75',
    },
    overview:
      "Tbilisi is where South Africans genuinely surprise themselves. Nobody puts Georgia on a shortlist and then everyone who goes adds it to their highlights. The Old Town is a tangle of wooden balconies, sulphur bath houses, and ancient churches above a river gorge. The food is outstanding. The wine culture is the oldest in the world. The visa situation is extraordinary for SA passport holders: 365 days visa-free, making it one of the most accessible long-stay destinations on the planet. And the time zone is only 2 hours behind South Africa — the most favourable on the entire circuit for anyone working with SA clients.",
    quickStats: {
      monthlyBudget: 'R18,000 – R32,000',
      nomadRating: 8.0,
      bestMonths: 'Apr – Jun, Sep – Oct',
      visaFree: '365 days',
    },
    culture: {
      description:
        "Georgia sits at the crossroads of Europe and Asia, and Tbilisi feels like both. The old town has a layered history in every wall — Persian, Ottoman, Russian, and Soviet traces sit alongside each other without displacing the city's Georgian identity. Georgians are extraordinarily hospitable by culture. The supra — a traditional feast with a tamada (toastmaster) leading endless toasts — is one of the most memorable social experiences available to travellers anywhere. Wine is not just consumed here, it is an 8,000-year-old cultural institution. The natural wine scene has made Tbilisi a global pilgrimage for serious wine drinkers.",
      highlights: [
        'Sulphur bath houses in Abanotubani — an experience available nowhere else on the circuit',
        '8,000-year-old wine culture — Georgia invented winemaking. The natural wine bars are exceptional.',
        'Traditional Georgian polyphonic singing — a UNESCO intangible heritage tradition',
        'Georgian hospitality and the supra feast tradition',
        'A growing underground art and techno scene around Fabrika and the Old Town',
      ],
    },
    food: {
      description:
        "Georgian food is among the most distinctive and satisfying cuisines in the world and almost nobody outside the region knows it yet. Khachapuri — cheese-filled bread, especially the Adjaran boat-shaped version with an egg — is the dish you will eat multiple times per week. Khinkali are large dumplings filled with spiced meat broth that you eat with your hands. The combination of walnuts, spices, pomegranate, and fresh herbs that runs through Georgian cooking is unlike anything in Southeast Asia or Latin America. Budget eating costs almost nothing. A full restaurant meal with wine runs R180 to R360.",
      mustTry: [
        'Khachapuri Adjaruli — the boat-shaped cheese bread with egg and butter. Order it fresh from a proper bakery.',
        'Khinkali — Georgian soup dumplings. Eat 8 to 10 for R90. Drink the broth before you bite through.',
        'Badrijani nigvzit — fried eggplant rolls with walnut paste and pomegranate seeds',
        'Churchkhela — walnut-filled grape juice candy, sold at every market stall',
        'Georgian natural wine — amber Rkatsiteli or red Saperavi from a small Old Town wine bar',
      ],
      budgetBreakdown: {
        street: 'R27 – R54 for khachapuri, lobiani, or a market lunch',
        midRange: 'R90 – R270 at a local Georgian restaurant with wine included',
        premium: 'R270 – R540 at an upscale Old Town or Vera restaurant',
      },
      topAreas: ['Abanotubani for traditional Georgian food', 'Vera and Vake for upscale and international options', 'Fabrika food court for varied affordable eating'],
    },
    activities: [
      {
        name: 'Sulphur Bath Houses (Abanotubani)',
        description: 'The domed brick bath houses in the old sulphur district. Private or public hot sulphur pools for R90 to R360/hour. Soft-skin scrub services available. This is a living tradition, not a tourist attraction.',
        emoji: '♨️',
      },
      {
        name: 'Narikala Fortress and Old Town Walk',
        description: 'The 4th-century fortress above the Old Town. Take the cable car up for R18, walk the fortress walls, and descend through winding old streets. Best in late afternoon light.',
        emoji: '🏰',
      },
      {
        name: 'Day Trip to Mtskheta',
        description: "Georgia's ancient capital 20 minutes from Tbilisi. Svetitskhoveli Cathedral — one of the most important Orthodox sites in the world — surrounded by old town walls and mountain views.",
        emoji: '⛪',
      },
      {
        name: 'Kazbegi Mountains Trip',
        description: 'A day trip or overnight to the Caucasus. Gergeti Trinity Church perched above a valley at 2,200 metres with Mount Kazbek (5,047m) behind it. One of the most dramatic landscapes in Europe.',
        emoji: '🏔️',
      },
      {
        name: 'Kakheti Wine Region',
        description: "A day trip to Georgia's main wine region, 90 minutes east of Tbilisi. Visit ancient monastery complexes, see the qvevri (clay amphorae) where wine has been made for 8,000 years, and taste at family wineries.",
        emoji: '🍷',
      },
      {
        name: 'Fabrika Creative Hub',
        description: 'A Soviet-era sewing factory converted into outdoor bars, restaurants, independent shops, and art spaces. The social centre of young Tbilisi and home to the best bar scene in the city.',
        emoji: '🏭',
      },
      {
        name: 'Uplistsikhe Cave City',
        description: 'An ancient cave town carved into rock, 1 hour from Tbilisi. One of the oldest urban settlements in the Caucasus. Eerie, atmospheric, and largely unknown to tourists from outside Georgia.',
        emoji: '⛏️',
      },
      {
        name: 'Batumi on the Black Sea',
        description: "A 5-hour train or 4-hour drive to Georgia's Black Sea coast. A modern resort city with a long beach boulevard and botanic garden. Good for a long weekend when the Tbilisi heat peaks.",
        emoji: '🏖️',
      },
    ],
    sights: {
      mustSee: [
        { name: 'Narikala Fortress', note: '4th-century fortress with views over the entire Old Town and Kura River. Cable car up, walk down through the old streets.' },
        { name: 'Abanotubani Bath Houses', note: 'The sulphur district. Go in — do not just photograph the domes from outside.' },
        { name: 'Mtskheta', note: "20 minutes from Tbilisi. The ancient capital and the UNESCO Svetitskhoveli Cathedral. The most important stop outside the city." },
      ],
      livedIn: [
        { name: 'Old Town morning walk', note: 'Before 9am. Wooden balconies, cats everywhere, the city before it gets going.' },
        { name: 'Natural wine bar in the evening', note: 'Vino Underground or any small wine bar in the Old Town. Order a glass of amber Rkatsiteli and take it slowly.' },
        { name: 'Fabrika on a Friday evening', note: 'The creative hub fills up by evening. The best people-watching and bar-hopping in the city.' },
        { name: 'Dezerter Bazaar on a Saturday', note: 'The chaotic covered market near the train station. Spices, churchkhela, fresh produce, and everything else.' },
      ],
    },
    neighbourhoods: [
      {
        name: 'Old Town (Dzveli Tbilisi)',
        description:
          'The historic centre. Wooden balconied houses, sulphur bath domes, ancient churches, and the Narikala fortress above. The most atmospheric place to be based in Tbilisi. Walkable, interesting at every turn, and cheaper than you expect for the experience.',
        bestFor: 'Culture seekers and first-timers who want the full Tbilisi experience',
        monthlyRent: 'R3,600 – R8,100 for a studio or 1-bed',
      },
      {
        name: 'Vera',
        description:
          'Just above the Old Town. An artsy, residential neighbourhood with excellent cafes, independent restaurants, and a creative community. More modern apartments than the Old Town with better infrastructure. Popular with longer-stay nomads who want character without tourist-area crowds.',
        bestFor: 'Longer stays, creative types, those who want modern comfort and neighbourhood character',
        monthlyRent: 'R3,200 – R7,200 for a studio or 1-bed',
      },
      {
        name: 'Vake',
        description:
          'Upscale and residential. The neighbourhood where Tbilisi professionals and wealthy expats live. Vake Park is one of the best green spaces in the city. Quieter than Vera or the Old Town, with the most modern apartment stock.',
        bestFor: 'Premium stays, those who want the best modern infrastructure',
        monthlyRent: 'R4,500 – R10,800 for a 1-bed',
      },
    ],
    costOfLiving: {
      accommodation: { budget: 'R2,700 – R4,500', mid: 'R4,500 – R8,100', premium: 'R9,000+' },
      coworking: { dayPass: 'R90 – R200/day', monthly: 'R1,100 – R2,700' },
      food: { budget: 'R1,800 – R2,700', mid: 'R2,700 – R4,500', premium: 'R4,500 – R7,200' },
      transport: { budget: 'R90 – R180', mid: 'R180 – R360', premium: 'R360 – R720' },
      gym: { budget: 'R270 – R450', mid: 'R450 – R900', premium: 'R1,100+' },
      total: { budget: 'R15,000 – R22,000', mid: 'R22,000 – R32,000', premium: 'R40,000+' },
      note: 'Tbilisi is the most affordable city on the South Bound circuit with a genuine quality of life. R22,000/month covers everything — a good apartment, coworking, restaurant meals, and wine. That is what a single bedroom in Johannesburg costs to rent, with nothing else included.',
    },
    weekInTheLife: [
      { label: 'Morning routine', description: 'Coffee and khachapuri at a bakery near the Old Town for R54. The bread is freshly baked, the cheese is molten. This costs less than a single flat white in Cape Town and it is breakfast.' },
      { label: 'Work day', description: 'Impact Hub Tbilisi or a café in Vera. Georgia is only 2 hours behind South Africa — the most favourable time zone on the entire South Bound circuit for SA-based remote workers. A 9am Joburg call is 7am here. Manageable.' },
      { label: 'Lunch', description: 'Khinkali restaurant. Eight dumplings for R90. Eat them standing, holding the twisted knob at the top and biting carefully to drink the broth first. Best cheap lunch on the circuit.' },
      { label: 'Afternoon', description: 'Sulphur bath after a long work stretch. An hour in a private room at Chreli Abano or Royal Bath for R270 to R450. Emerges feeling genuinely restored. Nothing like this exists in Southeast Asia or Latin America.' },
      { label: 'Evening', description: 'Georgian natural wine bars serve by the glass from R45 to R90. The amber wines made in clay qvevri are unlike anything you have tasted. Order the Rkatsiteli, get a plate of cheese, and take the evening slowly.' },
      { label: 'Weekend', description: 'Mtskheta on Saturday morning for the UNESCO cathedral. Kazbegi mountains for an overnight if the weather is clear — the drive through the Georgian Military Highway alone is worth the trip.' },
    ],
    theCatch:
      "Georgia is not a globally connected nomad city in the way Bali or Chiang Mai are. The coworking infrastructure is improving but still developing — fewer spaces and less polish than Southeast Asia. The Georgian alphabet is entirely unique, which makes navigating non-tourist areas genuinely challenging at first. Some Old Town buildings have internet connectivity issues — fibre is not universal in historic buildings. The city is actively getting more popular with Western nomads, which means prices are rising noticeably. The Georgian political situation and its relationship with Russia is worth monitoring for travel advisories, though the country has remained stable and safe for visitors.",
    remoteWork: {
      internetQuality:
        'Good and improving. Fibre is standard in modern apartments in Vera and Vake. The Old Town has patchier connectivity in historic buildings. Coworking spaces have reliable connections. A local SIM with mobile data costs R90 for a month and works as a solid backup.',
      internetRating: 7,
      coworkingSpaces: [
        {
          name: 'Impact Hub Tbilisi',
          description: 'Part of the global Impact Hub network. The best-established coworking in Tbilisi. Good internet, meeting rooms, events, and a community of local entrepreneurs and nomads.',
          price: 'Day pass from R135, monthly from R1,350',
        },
        {
          name: 'GIPA Business Hub',
          description: 'University-affiliated coworking space in Vera. Reliable internet, quiet working atmosphere, affordable. Good for focused work.',
          price: 'Day pass from R90, monthly from R900',
        },
        {
          name: 'Fabrika Coworking',
          description: 'Inside the Fabrika creative complex. Open-plan, lively, and central. Not the best for deep focus but has fast internet and the best social atmosphere in the city.',
          price: 'Day pass from R120',
        },
      ],
      cafes:
        'Tbilisi has an excellent and growing café culture. Rooms Coffee (multiple locations), Entrée, and dozens of independent spots in Vera and the Old Town have reliable WiFi and a working culture. Coffee costs R25 to R70. Sitting for extended periods is completely normal.',
    },
    visa: {
      headline: 'South Africans get 365 days visa-free',
      details: [
        '365 days visa-free for SA passport holders — one of the most generous allowances in the world',
        'No application, no fee, no registration required on arrival',
        'A 30-day South Bound stay uses barely a month of a full year allowance',
      ],
      longerStay:
        "For stays beyond 365 days, a Residence Permit can be applied for through Georgia's Public Service Hall in Tbilisi. Georgia also has a streamlined process called Remotely from Georgia which provides tax advantages for foreign income earners residing in the country. See the Georgian Revenue Service (rs.ge) for current requirements.",
      flag: null,
    },
    nomadRating: {
      overall: 8.0,
      scores: [
        { factor: 'Internet', score: 7, note: 'Good and improving. Verify apartment connection before committing. Mobile data is a cheap backup.' },
        { factor: 'Affordability', score: 9.5, note: 'The most affordable quality-of-life city on the circuit. R22,000/month covers everything.' },
        { factor: 'Lifestyle', score: 8.5, note: 'Outstanding food, wine, culture, and access to some of the best mountain scenery in Europe.' },
        { factor: 'Safety', score: 9, note: 'One of the safest capitals in Europe. Street crime is low. Women travelling solo rate it consistently highly.' },
        { factor: 'Community', score: 6.5, note: 'Growing but smaller nomad community than Southeast Asia or Latin America. Meeting people requires more initiative.' },
      ],
      summary:
        "Tbilisi is the surprise hit on the South Bound circuit. The 365-day visa allowance, 2-hour time zone proximity to SA, extraordinary affordability, and genuinely distinctive culture make it a compelling option that few people have on their radar. Anyone who has been here will tell you to put it on the list.",
    },
    bestTime: {
      ideal: 'April to June and September to October: mild temperatures (18–25°C), clear skies, and all mountain trips accessible.',
      shoulder: 'March and November: fewer tourists and lower prices. Still very good weather for city exploration.',
      avoid: 'July and August: very hot (30–35°C) and the most crowded. January to February is cold (0–5°C) with occasional snow — manageable but the least comfortable period.',
      recommendation: 'May or September for a 30-day South Bound stay. Perfect weather, full cultural calendar, and accommodation at best availability.',
    },
    practicalTips: [
      {
        title: 'The 2-hour time zone is a genuine advantage',
        body: 'Georgia is only 2 hours behind South Africa. A 9am Johannesburg call is 7am in Tbilisi — early but very manageable. This makes Tbilisi the most work-schedule-friendly destination on the entire circuit for SA remote workers.',
      },
      {
        title: 'Try the sulphur baths in the first week',
        body: 'Book a private room at a bath house in Abanotubani rather than the public pool for your first time. One hour in the hot sulphur water with a scrub service runs R270 to R450 and is one of the most distinctive experiences on the circuit.',
      },
      {
        title: 'Use Bolt for all your transport',
        body: 'Bolt is the dominant ride-hailing app in Georgia. Cheap, reliable, and available throughout the city. A trip across Tbilisi rarely costs more than R90.',
      },
      {
        title: 'Keep some cash on you',
        body: 'Cards work in most restaurants and shops, but smaller Georgian restaurants, markets, and older establishments often prefer cash. Keep GEL on you. ATMs are everywhere and the withdrawal spread on GEL is small.',
      },
      {
        title: 'Do the Kazbegi mountains',
        body: 'Book a driver or take the marshrutka from Didube station. The 3-hour drive through the Georgian Military Highway to Stepantsminda is one of the most scenic routes in Europe. Gergeti Trinity Church above the valley earns every photograph ever taken of it.',
      },
    ],
  },
];

export function getCityBySlug(slug: string): CityData | undefined {
  return cities.find((c) => c.slug === slug);
}

export function getAllCities(): CityData[] {
  return cities;
}

export function getCitySlugs(): string[] {
  return cities.map((c) => c.slug);
}

export default cities;
