/**
 * Curated "things to do" for each destination city.
 * Add or update activities here — images are Unsplash URLs.
 */

export interface ThingToDo {
  name: string;
  image: string;        // Unsplash URL — replace with own photos over time
  category: string;     // 'Culture' | 'Adventure' | 'Food & Drink' | 'Nightlife' | 'Nature' | 'Wellness' | 'Day Trip' | 'Beach' | 'Shopping'
  description?: string; // One-line teaser (optional)
}

const u = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=600&h=400&fit=crop&auto=format`;

export const CITY_ACTIVITIES: Record<string, ThingToDo[]> = {

  // ── SOUTHEAST ASIA ─────────────────────────────────────────────────────────

  'Bali (Canggu)': [
    {
      name: 'Surf Batu Bolong Beach',
      image: u('1532274402911-5a369e4c4bb5'),
      category: 'Adventure',
      description: 'Iconic beginner-friendly break in the heart of Canggu.',
    },
    {
      name: 'Sunset at Tanah Lot',
      image: u('1537996194471-e657df975ab4'),
      category: 'Culture',
      description: 'Bali\'s most dramatic sea temple, best visited at golden hour.',
    },
    {
      name: 'Tegallalang rice terraces',
      image: u('1555400038-63f5ba517a47'),
      category: 'Nature',
      description: 'UNESCO-listed terraces north of Ubud — a classic half-day.',
    },
    {
      name: 'Beach club sundowner',
      image: u('1506929562872-bb421503ef21'),
      category: 'Nightlife',
      description: 'Finn\'s, Tropicola, or Atlas — Canggu\'s beach clubs are unreal.',
    },
    {
      name: 'Morning yoga in Canggu',
      image: u('1506126613408-eca07ce68773'),
      category: 'Wellness',
      description: 'Drop-in classes everywhere. Desa Seni and The Practice are the best.',
    },
    {
      name: 'Scooter to Uluwatu Cliffs',
      image: u('1558642452-9d2a7deb7f62'),
      category: 'Adventure',
      description: 'Ride south to the clifftop temple and catch a Kecak fire dance.',
    },
    {
      name: 'Late-night warung dinner',
      image: u('1512058564366-18510be2db19'),
      category: 'Food & Drink',
      description: 'Nasi goreng, grilled fish, cold Bintang. Under R100 a plate.',
    },
  ],

  'Ubud': [
    {
      name: 'Sacred Monkey Forest',
      image: u('1518548419970-58e3b4079ab2'),
      category: 'Nature',
      description: 'Ancient forest sanctuary with hundreds of long-tailed macaques.',
    },
    {
      name: 'Campuhan Ridge Walk',
      image: u('1555400038-63f5ba517a47'),
      category: 'Wellness',
      description: 'Sunrise walk through jungle and rice paddies — completely free.',
    },
    {
      name: 'Traditional Balinese cooking class',
      image: u('1476224203421-74177f19a981'),
      category: 'Food & Drink',
      description: 'Market visit, then cook satay, lawar, and black rice pudding.',
    },
    {
      name: 'Tirta Empul holy spring',
      image: u('1537996194471-e657df975ab4'),
      category: 'Culture',
      description: 'Participate in a water purification ritual at a 10th-century temple.',
    },
    {
      name: 'Ubud Palace Legong dance',
      image: u('1535202468039-117770371865'),
      category: 'Culture',
      description: 'Nightly performances at Puri Saren — intricate costumes, live gamelan.',
    },
    {
      name: 'Healing ceremony with a balian',
      image: u('1506126613408-eca07ce68773'),
      category: 'Wellness',
      description: 'Traditional Balinese healing session. Raw and genuinely moving.',
    },
  ],

  'Chiang Mai': [
    {
      name: 'Hike to Doi Suthep',
      image: u('1528360983277-13d401cdc186'),
      category: 'Culture',
      description: 'Sacred hilltop temple with panoramic city views. The 309 steps are worth it.',
    },
    {
      name: 'Elephant Nature Park',
      image: u('1559592413-7cbb6975d60c'),
      category: 'Nature',
      description: 'Ethical elephant sanctuary. A full-day experience that stays with you.',
    },
    {
      name: 'Sunday Walking Street market',
      image: u('1555217851-6141535e5c8b'),
      category: 'Food & Drink',
      description: 'Wualai Road shuts down every Sunday for the best street food in the city.',
    },
    {
      name: 'Old City temple trail',
      image: u('1537953773345-d172ccf13cf4'),
      category: 'Culture',
      description: 'Thirty temples in the ancient moat area — Wat Chedi Luang is the standout.',
    },
    {
      name: 'Thai cooking class',
      image: u('1476224203421-74177f19a981'),
      category: 'Food & Drink',
      description: 'Half-day class ending with a feast you cooked yourself. Thai Farm is excellent.',
    },
    {
      name: 'Muay Thai fight night',
      image: u('1551698618-1dfe5d97d256'),
      category: 'Nightlife',
      description: 'Kalare Boxing Stadium runs fights most nights. Loud, sweaty, electric.',
    },
    {
      name: 'Café hop around Nimman',
      image: u('1495474472287-4d71d06dfb8e'),
      category: 'Wellness',
      description: 'Nimman Soi 7 has more specialty coffee per block than anywhere in SE Asia.',
    },
  ],

  'Da Nang': [
    {
      name: 'Golden Bridge at Ba Na Hills',
      image: u('1583417319070-4a69db38a482'),
      category: 'Day Trip',
      description: 'The giant stone hands holding a golden bridge — every bit as wild in person.',
    },
    {
      name: 'My Khe Beach at dawn',
      image: u('1557804506-669a67965ba0'),
      category: 'Beach',
      description: '30km of quiet white sand. Morning runs here feel genuinely special.',
    },
    {
      name: 'Hoi An Ancient Town',
      image: u('1540541338287-41700207dee6'),
      category: 'Day Trip',
      description: '30 minutes south — lantern-lit streets, tailor shops, and excellent food.',
    },
    {
      name: 'Hai Van Pass motorbike',
      image: u('1526481280693-3bfa7568e0f3'),
      category: 'Adventure',
      description: 'One of the best coastal roads in Asia. Rent a semi-auto and go.',
    },
    {
      name: 'Marble Mountains',
      image: u('1501769175-3c97e17c4d77'),
      category: 'Culture',
      description: 'Five marble-and-limestone hills with caves, temples, and rooftop views.',
    },
    {
      name: 'Dragon Bridge fire show',
      image: u('1548013146-72479768bada'),
      category: 'Nightlife',
      description: 'Every Saturday and Sunday night the dragon breathes fire and water.',
    },
    {
      name: 'Bún bò Huế for breakfast',
      image: u('1541807084-5c52e6a02204'),
      category: 'Food & Drink',
      description: 'Spicy lemongrass beef noodle soup — the best bowl of your life for R35.',
    },
  ],

  'Bangkok': [
    {
      name: 'Grand Palace + Wat Pho',
      image: u('1519181245277-cffeb22da5af'),
      category: 'Culture',
      description: 'Go early to beat the crowds. The reclining Buddha alone is worth the trip.',
    },
    {
      name: 'Rooftop bar at sunset',
      image: u('1527257723830-82fc56ae0b3c'),
      category: 'Nightlife',
      description: 'Sky Bar at Lebua or Octave at Marriott — Bangkok looks incredible from above.',
    },
    {
      name: 'Street food in Yaowarat',
      image: u('1534482421-64566f976cfa'),
      category: 'Food & Drink',
      description: 'Bangkok\'s Chinatown is the best street food strip in the world. Go hungry.',
    },
    {
      name: 'Chao Phraya river ferry',
      image: u('1548013146-72479768bada'),
      category: 'Adventure',
      description: 'Cross the city by boat for R8. More efficient than a taxi and twice as fun.',
    },
    {
      name: 'Weekend market at Chatuchak',
      image: u('1563636742-8f78a1a55e5b'),
      category: 'Shopping',
      description: 'Over 15,000 stalls. Set a budget and plan to lose two hours minimum.',
    },
    {
      name: 'Day trip to Ayutthaya',
      image: u('1528360983277-13d401cdc186'),
      category: 'Day Trip',
      description: 'Ancient temples and ruins 90 minutes north. Go by slow train for the vibe.',
    },
  ],

  'Ho Chi Minh City': [
    {
      name: 'War Remnants Museum',
      image: u('1530103559-00a37c5e4be3'),
      category: 'Culture',
      description: 'Confronting, important, and brilliantly curated. Allow 2 hours.',
    },
    {
      name: 'Mekong Delta day trip',
      image: u('1559592413-7cbb6975d60c'),
      category: 'Day Trip',
      description: 'Boat through floating markets and rice paddies. A world apart from the city.',
    },
    {
      name: 'Bui Vien Walking Street',
      image: u('1532634237-0e4d7df6f9e9'),
      category: 'Nightlife',
      description: 'Asia\'s most chaotic backpacker street. Worth seeing once. Maybe twice.',
    },
    {
      name: 'Pho for breakfast',
      image: u('1541807084-5c52e6a02204'),
      category: 'Food & Drink',
      description: 'Pho Hoa on Pasteur Street opens at 6am and is always packed. That\'s the sign.',
    },
    {
      name: 'Cu Chi Tunnels',
      image: u('1501769175-3c97e17c4d77'),
      category: 'Day Trip',
      description: '250km of underground tunnels used during the Vietnam War. Genuinely claustrophobic.',
    },
    {
      name: 'Rooftop of the Saigon Skydeck',
      image: u('1527257723830-82fc56ae0b3c'),
      category: 'Adventure',
      description: '68 floors up. Glass floor included. The city sprawl from here is unreal.',
    },
  ],

  'Hanoi': [
    {
      name: 'Old Quarter walking tour',
      image: u('1551877152-0316ea69b3dd'),
      category: 'Culture',
      description: '36 streets, each named after the trade once sold there. Get lost.',
    },
    {
      name: 'Egg coffee in a rooftop café',
      image: u('1495474472287-4d71d06dfb8e'),
      category: 'Food & Drink',
      description: 'Creamy whipped egg yolk over dark coffee. It sounds wrong. It tastes incredible.',
    },
    {
      name: 'Halong Bay overnight cruise',
      image: u('1506905925346-21bda4d32df6'),
      category: 'Day Trip',
      description: 'Thousands of limestone karsts rising from the sea. Book 2 nights minimum.',
    },
    {
      name: 'Hoan Kiem Lake morning tai chi',
      image: u('1506126613408-eca07ce68773'),
      category: 'Wellness',
      description: 'Join locals for sunrise practice around the lake. Free and quietly brilliant.',
    },
    {
      name: 'Bun cha lunch in the Old Quarter',
      image: u('1541807084-5c52e6a02204'),
      category: 'Food & Drink',
      description: 'Grilled pork, noodles, fresh herbs, and dipping broth. Obama ate here.',
    },
    {
      name: 'Train Street coffee',
      image: u('1544967354-b0c32cd6e7bc'),
      category: 'Adventure',
      description: 'Tiny café on a track where trains pass within centimetres. Twice a day.',
    },
  ],

  'Kuala Lumpur': [
    {
      name: 'Petronas Towers skybridge',
      image: u('1558618666-fcd25c85cd64'),
      category: 'Culture',
      description: 'Book the bridge online early. The views across the city are worth it.',
    },
    {
      name: 'Batu Caves',
      image: u('1528360983277-13d401cdc186'),
      category: 'Culture',
      description: 'Hindu shrine inside a giant limestone cave — 272 rainbow steps to climb.',
    },
    {
      name: 'Jalan Alor street food night',
      image: u('1555217851-6141535e5c8b'),
      category: 'Food & Drink',
      description: 'KL\'s famous food street. Grilled stingray, satay, char kway teow all at once.',
    },
    {
      name: 'Day trip to Cameron Highlands',
      image: u('1555400038-63f5ba517a47'),
      category: 'Day Trip',
      description: 'Tea plantations in the misty hills. Cool air, strawberry farms, scones.',
    },
    {
      name: 'Bangsar café scene',
      image: u('1495474472287-4d71d06dfb8e'),
      category: 'Wellness',
      description: 'Best specialty coffee neighbourhood in the city. Build your WFH routine here.',
    },
    {
      name: 'Rooftop bar in KLCC',
      image: u('1527257723830-82fc56ae0b3c'),
      category: 'Nightlife',
      description: 'Heli Lounge Bar has no cover and sits on top of a helicopter pad.',
    },
  ],

  'Singapore': [
    {
      name: 'Gardens by the Bay at night',
      image: u('1525625293386-3f8f99389edd'),
      category: 'Culture',
      description: 'The Supertree light show runs at 7:45pm and 8:45pm. Free from the outside.',
    },
    {
      name: 'Maxwell Hawker Centre',
      image: u('1534482421-64566f976cfa'),
      category: 'Food & Drink',
      description: 'Tian Tian Hainanese chicken rice is two streets of queue and worth every minute.',
    },
    {
      name: 'Sentosa Island beach day',
      image: u('1507525428034-b723cf961d3e'),
      category: 'Beach',
      description: 'Palawan Beach isn\'t Bali but it\'s a clean, easy half-day escape.',
    },
    {
      name: 'Infinity pool at MBS',
      image: u('1506929562872-bb421503ef21'),
      category: 'Nightlife',
      description: 'The view from the Marina Bay Sands pool is the definitive Singapore photo.',
    },
    {
      name: 'Little India and Kampong Glam',
      image: u('1551877152-0316ea69b3dd'),
      category: 'Culture',
      description: 'Two neighbourhoods, one afternoon. Colour, spice, and the best roti you\'ve had.',
    },
    {
      name: 'Day trip to Bintan, Indonesia',
      image: u('1557804506-669a67965ba0'),
      category: 'Day Trip',
      description: 'One-hour ferry to white sand beaches with zero crowds.',
    },
  ],

  'Phnom Penh': [
    {
      name: 'Tuol Sleng Genocide Museum',
      image: u('1530103559-00a37c5e4be3'),
      category: 'Culture',
      description: 'The former S-21 prison. Harrowing and essential.',
    },
    {
      name: 'Royal Palace and Silver Pagoda',
      image: u('1528360983277-13d401cdc186'),
      category: 'Culture',
      description: 'Cambodia\'s most ornate complex — the Silver Pagoda floor is solid silver tiles.',
    },
    {
      name: 'Sundowner on the Tonle Sap',
      image: u('1548013146-72479768bada'),
      category: 'Nightlife',
      description: 'Grab a deckchair at any riverside bar. Sunset here is slow and golden.',
    },
    {
      name: 'Street food at Orussei Market',
      image: u('1541807084-5c52e6a02204'),
      category: 'Food & Drink',
      description: 'Lok lak, amok, and kuy teav noodle soup at honest local prices.',
    },
    {
      name: 'Day trip to the Killing Fields',
      image: u('1501769175-3c97e17c4d77'),
      category: 'Day Trip',
      description: 'Choeung Ek memorial site, 15km from the city. Deeply important.',
    },
  ],

  'Koh Lanta': [
    {
      name: 'Long Beach sunset',
      image: u('1507525428034-b723cf961d3e'),
      category: 'Beach',
      description: 'West-facing beach that turns amber every evening. Bring a beer.',
    },
    {
      name: 'Snorkel at Koh Rok',
      image: u('1468413253776-99e330af05e0'),
      category: 'Adventure',
      description: 'Day boat to uninhabited islands with electric-blue water and coral reefs.',
    },
    {
      name: 'Mangrove kayaking',
      image: u('1506905925346-21bda4d32df6'),
      category: 'Nature',
      description: 'Paddle through the mangroves in the north of the island at low tide.',
    },
    {
      name: 'Motorbike the whole island',
      image: u('1558642452-9d2a7deb7f62'),
      category: 'Adventure',
      description: 'Rent a semi-auto for R350/day. Jungle roads, hidden beaches, no traffic.',
    },
    {
      name: 'Reggae bar on the beach',
      image: u('1506929562872-bb421503ef21'),
      category: 'Nightlife',
      description: 'Koh Lanta is mellow. Fire shows on the beach, cold beers, early nights.',
    },
  ],

  'Koh Samui': [
    {
      name: 'Ang Thong Marine Park boat trip',
      image: u('1468413253776-99e330af05e0'),
      category: 'Day Trip',
      description: '42 islands of limestone and jungle. Snorkel, kayak, and hike in one day.',
    },
    {
      name: 'Big Buddha Temple',
      image: u('1528360983277-13d401cdc186'),
      category: 'Culture',
      description: '12-metre golden Buddha on a tiny island causeway. Sunset view is excellent.',
    },
    {
      name: 'Beachfront breakfast at Fisherman\'s Village',
      image: u('1507525428034-b723cf961d3e'),
      category: 'Food & Drink',
      description: 'The Friday night market here is also one of Samui\'s best.',
    },
    {
      name: 'Full Moon Party on Koh Phangan',
      image: u('1532634237-0e4d7df6f9e9'),
      category: 'Nightlife',
      description: '15-minute ferry from Ban Pier. The biggest beach party in Asia.',
    },
    {
      name: 'Namuang Waterfall hike',
      image: u('1555400038-63f5ba517a47'),
      category: 'Adventure',
      description: 'Jungle waterfall in the centre of the island. Swim at the base.',
    },
  ],

  'Phuket': [
    {
      name: 'Phi Phi Islands boat trip',
      image: u('1468413253776-99e330af05e0'),
      category: 'Day Trip',
      description: 'Maya Bay is back open. Go on a speedboat, not a packed tour.',
    },
    {
      name: 'Old Town street art',
      image: u('1551877152-0316ea69b3dd'),
      category: 'Culture',
      description: 'Thalang Road has incredible Sino-Portuguese architecture and a café on every corner.',
    },
    {
      name: 'Patong beach club',
      image: u('1506929562872-bb421503ef21'),
      category: 'Beach',
      description: 'Catch beach clubs above Karon or Kata instead. Quieter, same views.',
    },
    {
      name: 'Night market in Phuket Town',
      image: u('1555217851-6141535e5c8b'),
      category: 'Food & Drink',
      description: 'Sunday Walking Street is the best food market on the island.',
    },
    {
      name: 'Snorkel at Similan Islands',
      image: u('1557804506-669a67965ba0'),
      category: 'Adventure',
      description: 'World-class dive site. Day trip by speedboat from Khao Lak.',
    },
  ],


  // ── LATIN AMERICA ───────────────────────────────────────────────────────────

  'Mexico City': [
    {
      name: 'Teotihuacán pyramids',
      image: u('1569230919102-0cf8fcd6fcda'),
      category: 'Day Trip',
      description: 'Climb the Pyramid of the Sun before 9am and have it almost to yourself.',
    },
    {
      name: 'Frida Kahlo Museum',
      image: u('1551877152-0316ea69b3dd'),
      category: 'Culture',
      description: 'La Casa Azul in Coyoacán. Book well in advance — always sold out.',
    },
    {
      name: 'Street tacos in La Condesa',
      image: u('1534482421-64566f976cfa'),
      category: 'Food & Drink',
      description: 'Al pastor, carnitas, suadero — best eaten standing up at 1am.',
    },
    {
      name: 'Xochimilco trajinera boat trip',
      image: u('1548013146-72479768bada'),
      category: 'Day Trip',
      description: 'Colourful boats, mariachi bands, and micheladas on floating canals.',
    },
    {
      name: 'Rooftop mezcal bar in Roma',
      image: u('1527257723830-82fc56ae0b3c'),
      category: 'Nightlife',
      description: 'Roma Norte and Condesa have the best rooftop bar scene in Latin America.',
    },
    {
      name: 'Lucha libre wrestling match',
      image: u('1551698618-1dfe5d97d256'),
      category: 'Nightlife',
      description: 'Arena México on Tuesday and Friday. Masks, acrobatics, pure theatre.',
    },
  ],

  'Playa del Carmen': [
    {
      name: 'Cenote swim at Dos Ojos',
      image: u('1501769175-3c97e17c4d77'),
      category: 'Adventure',
      description: 'Crystal-clear underground sinkholes — snorkel through the cave system.',
    },
    {
      name: 'Tulum ruins at sunrise',
      image: u('1569230919102-0cf8fcd6fcda'),
      category: 'Day Trip',
      description: 'Clifftop Mayan ruins above turquoise sea. First entry at 8am.',
    },
    {
      name: 'Quinta Avenida night out',
      image: u('1532634237-0e4d7df6f9e9'),
      category: 'Nightlife',
      description: 'The pedestrian strip from the ferry terminal to Calle 38. Lively every night.',
    },
    {
      name: 'Day trip to Isla Cozumel',
      image: u('1468413253776-99e330af05e0'),
      category: 'Day Trip',
      description: 'World-class snorkelling and diving. 45-minute ferry from the pier.',
    },
    {
      name: 'Mariscos on the beach',
      image: u('1534482421-64566f976cfa'),
      category: 'Food & Drink',
      description: 'Grilled fish, aguachile, and ceviche for R200 at any palapa on the sand.',
    },
  ],

  'Oaxaca': [
    {
      name: 'Monte Albán ruins',
      image: u('1569230919102-0cf8fcd6fcda'),
      category: 'Day Trip',
      description: 'Zapotec hilltop city with sweeping mountain views. Go at opening time.',
    },
    {
      name: 'Mezcal tasting in the valley',
      image: u('1506929562872-bb421503ef21'),
      category: 'Food & Drink',
      description: 'Visit a palenque distillery and taste straight from the clay pots.',
    },
    {
      name: 'Hierve el Agua petrified waterfalls',
      image: u('1555400038-63f5ba517a47'),
      category: 'Nature',
      description: 'Mineral springs that have calcified into waterfall shapes. Otherworldly.',
    },
    {
      name: 'Mercado Benito Juárez',
      image: u('1555217851-6141535e5c8b'),
      category: 'Food & Drink',
      description: 'Tlayudas, mole negro, chocolate, and chapulines (grasshoppers) — try everything.',
    },
    {
      name: 'Day of the Dead cultural tour',
      image: u('1551877152-0316ea69b3dd'),
      category: 'Culture',
      description: 'Oaxaca is the best place in Mexico to experience Día de los Muertos.',
    },
  ],

  'Medellín': [
    {
      name: 'El Peñol hike',
      image: u('1506905925346-21bda4d32df6'),
      category: 'Adventure',
      description: '740 steps carved into a giant granite rock. Views over the lake at the top.',
    },
    {
      name: 'Cable car to the comunas',
      image: u('1548013146-72479768bada'),
      category: 'Culture',
      description: 'The metro cable system transformed the hillside comunas. Ride it.',
    },
    {
      name: 'Salsa dancing in El Poblado',
      image: u('1532634237-0e4d7df6f9e9'),
      category: 'Nightlife',
      description: 'Take a class first, then hit Parque del Periodista on a Thursday night.',
    },
    {
      name: 'Street art tour in Laureles',
      image: u('1551877152-0316ea69b3dd'),
      category: 'Culture',
      description: 'Walking tour of the murals and the transformation of the city since 2004.',
    },
    {
      name: 'Coffee farm day trip',
      image: u('1495474472287-4d71d06dfb8e'),
      category: 'Day Trip',
      description: 'Jardín is 3 hours south — a colonial town in the heart of coffee country.',
    },
    {
      name: 'Arepa lunch at the market',
      image: u('1534482421-64566f976cfa'),
      category: 'Food & Drink',
      description: 'Arepa de chócolo with hogao and white cheese. Nothing else like it.',
    },
  ],

  'Bogotá': [
    {
      name: 'Gold Museum',
      image: u('1551877152-0316ea69b3dd'),
      category: 'Culture',
      description: '55,000 pre-Hispanic gold objects in one building. The best museum in SA.',
    },
    {
      name: 'Monserrate hike or cable car',
      image: u('1506905925346-21bda4d32df6'),
      category: 'Adventure',
      description: '3,152 metres. Hike up and cable car down, or the other way around.',
    },
    {
      name: 'Coffee region day trip',
      image: u('1495474472287-4d71d06dfb8e'),
      category: 'Day Trip',
      description: 'Salento and the Valle de Cocora are 5 hours west. Rent a car.',
    },
    {
      name: 'Street food in La Candelaria',
      image: u('1534482421-64566f976cfa'),
      category: 'Food & Drink',
      description: 'Ajiaco santafereño, empanadas, and freshly squeezed lulo juice.',
    },
    {
      name: 'Usaquén Sunday market',
      image: u('1555217851-6141535e5c8b'),
      category: 'Shopping',
      description: 'Artisan crafts, antiques, and street food in a colonial neighbourhood.',
    },
  ],

  'Cartagena': [
    {
      name: 'Walled City evening walk',
      image: u('1556806787-142cb4925d82'),
      category: 'Culture',
      description: 'The Old City at dusk — colonial towers, bougainvillea, and Caribbean warmth.',
    },
    {
      name: 'Rosario Islands snorkel',
      image: u('1468413253776-99e330af05e0'),
      category: 'Day Trip',
      description: 'Boat trip to coral islands 45 minutes offshore. Crystal water, hammocks.',
    },
    {
      name: 'Rooftop sundowner in Getsemaní',
      image: u('1527257723830-82fc56ae0b3c'),
      category: 'Nightlife',
      description: 'Getsemaní has become Cartagena\'s coolest neighbourhood. The rooftop scene is great.',
    },
    {
      name: 'Palenquera fruit lady photo',
      image: u('1534482421-64566f976cfa'),
      category: 'Culture',
      description: 'Tropical fruit in a basket on her head. Ceviche on the street corner.',
    },
    {
      name: 'Day trip to Playa Blanca',
      image: u('1507525428034-b723cf961d3e'),
      category: 'Beach',
      description: 'An hour by boat — the white sand beach everyone pictures when they think Caribbean.',
    },
  ],

  'Rio': [
    {
      name: 'Christ the Redeemer at sunrise',
      image: u('1584559582128-b8be739912e1'),
      category: 'Culture',
      description: 'Get the first tram up at 8am. The view before the crowds is extraordinary.',
    },
    {
      name: 'Copacabana morning run',
      image: u('1507525428034-b723cf961d3e'),
      category: 'Beach',
      description: '4km of iconic beachfront. The post-run açaí bowl at a barraca is essential.',
    },
    {
      name: 'Hang gliding from Pedra Bonita',
      image: u('1532274402911-5a369e4c4bb5'),
      category: 'Adventure',
      description: 'Tandem glide over the Tijuca forest and land on São Conrado beach. Incredible.',
    },
    {
      name: 'Caipirinha at sunset in Ipanema',
      image: u('1506929562872-bb421503ef21'),
      category: 'Nightlife',
      description: 'Arpoador rock at the end of Ipanema — locals applaud when the sun goes down.',
    },
    {
      name: 'Favela Rocinha walking tour',
      image: u('1551877152-0316ea69b3dd'),
      category: 'Culture',
      description: 'Go with a local guide. Shifts how you understand the city entirely.',
    },
    {
      name: 'Sugarloaf cable car',
      image: u('1506905925346-21bda4d32df6'),
      category: 'Adventure',
      description: 'Two cable cars up. The view of Rio from the top is the defining postcard.',
    },
  ],

  'Buenos Aires': [
    {
      name: 'Tango show in San Telmo',
      image: u('1532634237-0e4d7df6f9e9'),
      category: 'Nightlife',
      description: 'La Catedral milonga for the real thing. Shows are for tourists; milongas are for dancers.',
    },
    {
      name: 'Sunday San Telmo market',
      image: u('1555217851-6141535e5c8b'),
      category: 'Shopping',
      description: 'Antiques, leather, and street tango performers. Starts around 10am.',
    },
    {
      name: 'Asado dinner',
      image: u('1534482421-64566f976cfa'),
      category: 'Food & Drink',
      description: 'Book La Cabrera on a Thursday for the best parrilla in Palermo.',
    },
    {
      name: 'La Boca neighbourhood',
      image: u('1589909202802-8f4aadce1849'),
      category: 'Culture',
      description: 'Colourful corrugated iron houses, Caminito street art, Boca stadium.',
    },
    {
      name: 'Day trip to Colonia, Uruguay',
      image: u('1548699604-4b86f5f8a09b'),
      category: 'Day Trip',
      description: 'One-hour ferry to a UNESCO colonial town. Cobblestones, wine, and quiet.',
    },
    {
      name: 'Recoleta Cemetery',
      image: u('1559827291-72ebde40b0ed'),
      category: 'Culture',
      description: 'An entire city of ornate mausoleums. Evita is here. It\'s not morbid — it\'s beautiful.',
    },
  ],

  'Santiago': [
    {
      name: 'Valle Nevado day trip',
      image: u('1506905925346-21bda4d32df6'),
      category: 'Adventure',
      description: 'Ski and snowboard 1.5 hours from Santiago. Ski season is June to October.',
    },
    {
      name: 'Maipo Valley wine tour',
      image: u('1506126613408-eca07ce68773'),
      category: 'Day Trip',
      description: 'Concha y Toro and Santa Rita are 45 minutes south. Book a tasting.',
    },
    {
      name: 'Central Market seafood lunch',
      image: u('1534482421-64566f976cfa'),
      category: 'Food & Drink',
      description: 'The ornate iron market building houses the best ceviche and empanadas in the city.',
    },
    {
      name: 'San Cristóbal Hill hike',
      image: u('1555400038-63f5ba517a47'),
      category: 'Adventure',
      description: 'Hike or funicular to the 300m summit. Views of the Andes on clear days.',
    },
    {
      name: 'Barrio Italia artisan market',
      image: u('1555217851-6141535e5c8b'),
      category: 'Shopping',
      description: 'Vintage furniture, ceramics, local design shops, and excellent coffee.',
    },
  ],

  'Montevideo': [
    {
      name: 'Mercado del Puerto',
      image: u('1534482421-64566f976cfa'),
      category: 'Food & Drink',
      description: 'The old port market. Chivito sandwiches, parrilla, and cold Pilsen at noon.',
    },
    {
      name: 'Rambla coastal walk',
      image: u('1507525428034-b723cf961d3e'),
      category: 'Beach',
      description: '22km of waterfront promenade — jog, cycle, or watch the sunset over the Plata.',
    },
    {
      name: 'Milonga (tango social dance)',
      image: u('1532634237-0e4d7df6f9e9'),
      category: 'Nightlife',
      description: 'More intimate than Buenos Aires. La Milonguita on Saturday nights.',
    },
    {
      name: 'Day trip to Colonia del Sacramento',
      image: u('1548699604-4b86f5f8a09b'),
      category: 'Day Trip',
      description: 'One-hour ferry. UNESCO colonial port with cobblestones and a lighthouse.',
    },
    {
      name: 'Punta Carretas Sunday market',
      image: u('1555217851-6141535e5c8b'),
      category: 'Shopping',
      description: 'Former prison turned artisan market. Leather goods, ceramics, mate gourds.',
    },
  ],

  'Lima': [
    {
      name: 'Larco Museum',
      image: u('1551877152-0316ea69b3dd'),
      category: 'Culture',
      description: '5,000 years of pre-Columbian art in a colonial mansion in Pueblo Libre.',
    },
    {
      name: 'Huacachina sand dune buggy',
      image: u('1526481280693-3bfa7568e0f3'),
      category: 'Adventure',
      description: '5 hours south — a desert oasis surrounded by enormous dunes. Sandboard down them.',
    },
    {
      name: 'Ceviche lunch in Miraflores',
      image: u('1541807084-5c52e6a02204'),
      category: 'Food & Drink',
      description: 'La Mar or El Mercado. Eat ceviche, leche de tigre, and tiradito. All at once.',
    },
    {
      name: 'Coastal cycle in Barranco',
      image: u('1558642452-9d2a7deb7f62'),
      category: 'Adventure',
      description: 'Rent a bike and ride the cliff-top Malecón from Miraflores to Barranco.',
    },
    {
      name: 'Pisco sour at a speakeasy',
      image: u('1527257723830-82fc56ae0b3c'),
      category: 'Nightlife',
      description: 'Barranco is Lima\'s bar neighbourhood. The cocktail bars are world-class.',
    },
  ],

  'São Paulo': [
    {
      name: 'MASP on Avenida Paulista',
      image: u('1551877152-0316ea69b3dd'),
      category: 'Culture',
      description: 'Brazil\'s finest art museum — the glass-and-concrete structure is iconic.',
    },
    {
      name: 'Vila Madalena street art',
      image: u('1560969184-10fe8719e047'),
      category: 'Culture',
      description: 'Beco do Batman is an open-air graffiti gallery that spills through the whole neighbourhood.',
    },
    {
      name: 'Rodízio BBQ dinner',
      image: u('1534482421-64566f976cfa'),
      category: 'Food & Drink',
      description: 'Fogo de Chão or Templo da Carne. All-you-can-eat churrasco with a red/green disc.',
    },
    {
      name: 'Ibirapuera Park weekend',
      image: u('1555400038-63f5ba517a47'),
      category: 'Wellness',
      description: 'SP\'s answer to Central Park. Runners, skaters, families, and food carts.',
    },
    {
      name: 'Japanese quarter in Liberdade',
      image: u('1555217851-6141535e5c8b'),
      category: 'Culture',
      description: 'The largest Japanese diaspora outside Japan. Sunday street market is excellent.',
    },
  ],


  // ── EUROPE ──────────────────────────────────────────────────────────────────

  'Lisbon': [
    {
      name: 'Tram 28 through Alfama',
      image: u('1585208798174-6cedd86e019a'),
      category: 'Culture',
      description: 'The classic Lisbon ride — yellow tram rattling through medieval streets.',
    },
    {
      name: 'Sunset from Miradouro da Graça',
      image: u('1559827291-72ebde40b0ed'),
      category: 'Culture',
      description: 'The best viewpoint in the city. Locals bring wine and plastic cups.',
    },
    {
      name: 'Pastéis de Belém',
      image: u('1544967354-b0c32cd6e7bc'),
      category: 'Food & Drink',
      description: 'The original custard tart since 1837. Queue is part of the experience.',
    },
    {
      name: 'Surf day at Cascais or Ericeira',
      image: u('1532274402911-5a369e4c4bb5'),
      category: 'Day Trip',
      description: '40-minute train to Atlantic surf. Ericeira is a World Surfing Reserve.',
    },
    {
      name: 'Fado show in Mouraria',
      image: u('1532634237-0e4d7df6f9e9'),
      category: 'Nightlife',
      description: 'Intimate restaurant fado in the neighbourhood where the music was born.',
    },
    {
      name: 'LX Factory Sunday market',
      image: u('1555217851-6141535e5c8b'),
      category: 'Shopping',
      description: 'Repurposed textile factory with design shops, food trucks, and live music.',
    },
  ],

  'Porto': [
    {
      name: 'Port wine cellars in Vila Nova de Gaia',
      image: u('1506126613408-eca07ce68773'),
      category: 'Food & Drink',
      description: 'Cross the Dom Luís Bridge and visit Sandeman or Taylor\'s for a tasting.',
    },
    {
      name: 'Dom Luís Bridge walk',
      image: u('1555881400-74d7acaacd81'),
      category: 'Culture',
      description: 'Top deck on foot with a view of the Douro valley and ceramic rooftops.',
    },
    {
      name: 'Livraria Lello bookshop',
      image: u('1548699604-4b86f5f8a09b'),
      category: 'Culture',
      description: 'One of the most beautiful bookshops in the world. Buy a postcard at minimum.',
    },
    {
      name: 'Azulejo tile hunting',
      image: u('1551877152-0316ea69b3dd'),
      category: 'Culture',
      description: 'São Bento Station has 20,000 hand-painted tiles. Capela das Almas is close by.',
    },
    {
      name: 'Day trip to Douro Valley',
      image: u('1555400038-63f5ba517a47'),
      category: 'Day Trip',
      description: 'Tiered vineyards above the river. Train or car — both equally beautiful.',
    },
    {
      name: 'Francesinha sandwich',
      image: u('1534482421-64566f976cfa'),
      category: 'Food & Drink',
      description: 'A monstrous layered sandwich in a beer-and-tomato sauce. Café Santiago is the spot.',
    },
  ],

  'Barcelona': [
    {
      name: 'Sagrada Família',
      image: u('1583422409516-2895a77efded'),
      category: 'Culture',
      description: 'Book the tower access online. The interior light at midday is otherworldly.',
    },
    {
      name: 'Tapas bar hop in El Born',
      image: u('1534482421-64566f976cfa'),
      category: 'Food & Drink',
      description: 'Bar del Pla, El Xampanyet, La Pepita. Go at 8pm when locals eat.',
    },
    {
      name: 'Park Güell at opening time',
      image: u('1559827291-72ebde40b0ed'),
      category: 'Culture',
      description: 'Gaudí\'s hillside mosaic park. Get the first entry slot to beat the crowds.',
    },
    {
      name: 'Barceloneta beach morning',
      image: u('1507525428034-b723cf961d3e'),
      category: 'Beach',
      description: 'Swim, jog the passeig, coffee at a chiringuito. Best before 10am.',
    },
    {
      name: 'Late-night Razzmatazz',
      image: u('1532634237-0e4d7df6f9e9'),
      category: 'Nightlife',
      description: 'Five rooms, five music styles. Doors at 1am, peak at 4am. Standard Barcelona.',
    },
    {
      name: 'Boqueria Market (before noon)',
      image: u('1555217851-6141535e5c8b'),
      category: 'Food & Drink',
      description: 'Go for breakfast, not lunch. Fresh fruit, jamón, and zero tourists at 9am.',
    },
  ],

  'Valencia': [
    {
      name: 'City of Arts and Sciences',
      image: u('1562135036-e455172d52c5'),
      category: 'Culture',
      description: 'Calatrava\'s futuristic complex. The Oceanogràfic is worth the entry fee.',
    },
    {
      name: 'Malvarrosa beach cycle',
      image: u('1507525428034-b723cf961d3e'),
      category: 'Beach',
      description: 'Rent a bike and cycle from the old city to the beach along the Turia riverbed.',
    },
    {
      name: 'Paella in the birthplace',
      image: u('1534482421-64566f976cfa'),
      category: 'Food & Drink',
      description: 'La Pepica or Casa Carmela on the seafront. Authentic Valencian rice, no shortcuts.',
    },
    {
      name: 'Mercado Central',
      image: u('1555217851-6141535e5c8b'),
      category: 'Food & Drink',
      description: 'One of the best covered markets in Europe. Art nouveau building, 1,000 stalls.',
    },
    {
      name: 'Turia Park morning run',
      image: u('1555400038-63f5ba517a47'),
      category: 'Wellness',
      description: '9km of green corridor where the river used to be. Runs through the city.',
    },
  ],

  'Split': [
    {
      name: 'Diocletian\'s Palace evening walk',
      image: u('1555990538-c3c52b21c548'),
      category: 'Culture',
      description: 'A Roman emperor\'s retirement palace that\'s now a living city. Just walk in.',
    },
    {
      name: 'Island hop to Hvar',
      image: u('1468413253776-99e330af05e0'),
      category: 'Day Trip',
      description: 'Ferry to the most glamorous island on the Adriatic. Go for a night.',
    },
    {
      name: 'Cliff jump at the Marjan Hill',
      image: u('1532274402911-5a369e4c4bb5'),
      category: 'Adventure',
      description: 'The rocks below Marjan are where locals jump. Cold, clear, Adriatic perfect.',
    },
    {
      name: 'Sunset drinks at Bačvice',
      image: u('1506929562872-bb421503ef21'),
      category: 'Nightlife',
      description: 'The beach café strip buzzes until late. Order an Ožujsko and watch the sea.',
    },
    {
      name: 'Peka lamb lunch',
      image: u('1534482421-64566f976cfa'),
      category: 'Food & Drink',
      description: 'Slow-cooked under a bell-shaped lid. Order the day before at Konoba Matejuška.',
    },
  ],

  'Dubrovnik': [
    {
      name: 'Old City walls walk',
      image: u('1556806787-142cb4925d82'),
      category: 'Culture',
      description: 'Two kilometres of medieval walls above the Adriatic. Go at 8am before the heat.',
    },
    {
      name: 'Game of Thrones tour',
      image: u('1548699604-4b86f5f8a09b'),
      category: 'Culture',
      description: 'Kings Landing is everywhere here. The Red Keep steps are Jesuit steps in reality.',
    },
    {
      name: 'Sea cave kayaking',
      image: u('1468413253776-99e330af05e0'),
      category: 'Adventure',
      description: 'Half-day kayak around the city walls and into the blue caves. Outstanding.',
    },
    {
      name: 'Cable car to Mount Srđ',
      image: u('1506905925346-21bda4d32df6'),
      category: 'Adventure',
      description: 'Views of the old city, Lokrum Island, and the Adriatic from 412 metres.',
    },
    {
      name: 'Sunset cocktails at Buža Bar',
      image: u('1527257723830-82fc56ae0b3c'),
      category: 'Nightlife',
      description: 'A bar cut into the cliff above the sea. Swim, then drink. Then swim again.',
    },
  ],

  'Athens': [
    {
      name: 'Acropolis at first entry',
      image: u('1603565816030-6b389eeb23cb'),
      category: 'Culture',
      description: 'Gates open at 8am. Get there. Beat 10,000 tourists and the 35°C heat.',
    },
    {
      name: 'Rooftop bar in Monastiraki',
      image: u('1527257723830-82fc56ae0b3c'),
      category: 'Nightlife',
      description: 'A360, The Couleur Locale, or Brettos — all have Acropolis views. All are excellent.',
    },
    {
      name: 'Athens Riviera beach',
      image: u('1507525428034-b723cf961d3e'),
      category: 'Beach',
      description: 'Tram to the coast (Vouliagmeni or Varkiza). Swim in the Saronic Gulf.',
    },
    {
      name: 'Souvlaki lunch in Monastiraki',
      image: u('1534482421-64566f976cfa'),
      category: 'Food & Drink',
      description: 'Bairaktaris or Thanasis. Pork skewers, fresh pita, tomato, and tzatziki. R60.',
    },
    {
      name: 'Day trip to Cape Sounion',
      image: u('1569230919102-0cf8fcd6fcda'),
      category: 'Day Trip',
      description: 'Temple of Poseidon on a cliff above the Aegean. 70km, go at sunset.',
    },
  ],

  'Budapest': [
    {
      name: 'Széchenyi thermal baths',
      image: u('1565426873118-a17ed65d7429'),
      category: 'Wellness',
      description: 'Outdoor pool, chess, and thermal water in a baroque palace. Go on a weekday.',
    },
    {
      name: 'Ruin bar night in the Jewish Quarter',
      image: u('1532634237-0e4d7df6f9e9'),
      category: 'Nightlife',
      description: 'Szimpla Kert is the original. Built in a derelict apartment block. Nothing like it.',
    },
    {
      name: 'Danube riverboat cruise',
      image: u('1548013146-72479768bada'),
      category: 'Culture',
      description: 'Evening cruise with the Parliament building lit up. The best view in the city.',
    },
    {
      name: 'Great Market Hall',
      image: u('1555217851-6141535e5c8b'),
      category: 'Food & Drink',
      description: 'Three floors of paprika, lángos, embroidery, and cold Hungarian wine.',
    },
    {
      name: 'Buda Castle District',
      image: u('1541849546-2165492d1373'),
      category: 'Culture',
      description: 'Fisherman\'s Bastion, Matthias Church, and the best views of Pest across the Danube.',
    },
  ],

  'Prague': [
    {
      name: 'Prague Castle at dawn',
      image: u('1541849546-2165492d1373'),
      category: 'Culture',
      description: 'The largest castle complex in the world. Go before 9am when it\'s quiet.',
    },
    {
      name: 'Czech beer culture',
      image: u('1532634237-0e4d7df6f9e9'),
      category: 'Nightlife',
      description: 'Lokál is the best Czech pub in the city. Kozel Dark on tap. R40 a pint.',
    },
    {
      name: 'Old Town Square and Astronomical Clock',
      image: u('1559827291-72ebde40b0ed'),
      category: 'Culture',
      description: 'The clock performs at the top of every hour. Crowds gather. Still worth seeing.',
    },
    {
      name: 'Riverbank walk and Nusle Valley',
      image: u('1548699604-4b86f5f8a09b'),
      category: 'Wellness',
      description: 'Walk the Vltava from Charles Bridge to Vyšehrad. An hour of perfect Prague.',
    },
    {
      name: 'Day trip to Český Krumlov',
      image: u('1555400038-63f5ba517a47'),
      category: 'Day Trip',
      description: 'Fairy-tale town 3 hours south. Medieval castle, river bend, cobblestones.',
    },
  ],

  'Berlin': [
    {
      name: 'East Side Gallery',
      image: u('1560969184-10fe8719e047'),
      category: 'Culture',
      description: '1.3km of original Berlin Wall covered in murals. Free and always open.',
    },
    {
      name: 'Berghain techno night',
      image: u('1532634237-0e4d7df6f9e9'),
      category: 'Nightlife',
      description: 'The most legendary club in the world. Enter on a Sunday morning, leave Tuesday.',
    },
    {
      name: 'Museum Island',
      image: u('1548699604-4b86f5f8a09b'),
      category: 'Culture',
      description: 'Five world-class museums on one island in the Spree. The Pergamon is unmissable.',
    },
    {
      name: 'Mauerpark flea market',
      image: u('1555217851-6141535e5c8b'),
      category: 'Shopping',
      description: 'Sunday flea market with live karaoke in the amphitheatre. Very Berlin.',
    },
    {
      name: 'Tempelhof airfield cycling',
      image: u('1558642452-9d2a7deb7f62'),
      category: 'Wellness',
      description: 'Decommissioned airport turned park. Cycle, skate, or fly kites on the old runway.',
    },
  ],

  'Amsterdam': [
    {
      name: 'Canal bike tour',
      image: u('1512470876302-687d6e3e6fbb'),
      category: 'Adventure',
      description: 'Rent a bike and follow the canal belt at golden hour. The light is exceptional.',
    },
    {
      name: 'Rijksmuseum',
      image: u('1548699604-4b86f5f8a09b'),
      category: 'Culture',
      description: 'Rembrandt, Vermeer, and the Night Watch. Block a full morning.',
    },
    {
      name: 'Stroopwafel and coffee at a brown café',
      image: u('1495474472287-4d71d06dfb8e'),
      category: 'Food & Drink',
      description: 'Proeflokaal Wynand Fockink or Café de Dokter. Traditional Dutch brown pubs.',
    },
    {
      name: 'Day trip to Keukenhof gardens',
      image: u('1555400038-63f5ba517a47'),
      category: 'Day Trip',
      description: '7 million tulips and bulbs in bloom. Open March to May only.',
    },
    {
      name: 'Jordaan neighbourhood wander',
      image: u('1559827291-72ebde40b0ed'),
      category: 'Culture',
      description: 'Narrow canals, independent galleries, the Anne Frank House, excellent cheese shops.',
    },
  ],

  'Florence': [
    {
      name: 'Uffizi Gallery',
      image: u('1534445867742-43195f401b6c'),
      category: 'Culture',
      description: 'Botticelli\'s Birth of Venus and Primavera. Book timed entry weeks ahead.',
    },
    {
      name: 'Sunset from Piazzale Michelangelo',
      image: u('1559827291-72ebde40b0ed'),
      category: 'Culture',
      description: 'The whole city below you, Duomo centre frame, turning orange. Go at 7pm.',
    },
    {
      name: 'Gelato at Gelateria dei Neri',
      image: u('1544967354-b0c32cd6e7bc'),
      category: 'Food & Drink',
      description: 'No shortcuts here. Pistachio, stracciatella, fig and ricotta.',
    },
    {
      name: 'Climb the Duomo',
      image: u('1548699604-4b86f5f8a09b'),
      category: 'Adventure',
      description: '463 steps to the top of Brunelleschi\'s dome. Worth every one.',
    },
    {
      name: 'Chianti wine tour',
      image: u('1555400038-63f5ba517a47'),
      category: 'Day Trip',
      description: 'Rent a car and drive the Chiantigiana through vineyards to Siena.',
    },
  ],

  'Seville': [
    {
      name: 'Real Alcázar',
      image: u('1559827291-72ebde40b0ed'),
      category: 'Culture',
      description: 'The oldest royal palace still in use in Europe. Moorish architecture at its peak.',
    },
    {
      name: 'Flamenco show in Triana',
      image: u('1532634237-0e4d7df6f9e9'),
      category: 'Nightlife',
      description: 'Tablao Flamenco El Arenal or Casa de la Memoria. Authentic and intense.',
    },
    {
      name: 'Tapas tour of Alameda',
      image: u('1534482421-64566f976cfa'),
      category: 'Food & Drink',
      description: 'Cazón en adobo, preso ibérico, and cold Cruzcampo in the shade.',
    },
    {
      name: 'Sunrise climb of La Giralda',
      image: u('1548699604-4b86f5f8a09b'),
      category: 'Culture',
      description: 'The cathedral bell tower — no steps inside, just a wide ramp. Views are staggering.',
    },
    {
      name: 'Boat trip on the Guadalquivir',
      image: u('1548013146-72479768bada'),
      category: 'Adventure',
      description: 'Slow boat down the river at sunset. Golden light on a golden city.',
    },
  ],

};
