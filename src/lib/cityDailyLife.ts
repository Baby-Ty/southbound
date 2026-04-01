/**
 * Curated day-to-day life snapshots for each South Bound city.
 * Categories: Apartment · Workspace · Gym · Coworking · Cafe
 * Food & drink is handled separately in cityFood.ts
 */

export type DailyLifeCategory =
  | 'Apartment'
  | 'Workspace'
  | 'Gym'
  | 'Coworking'
  | 'Cafe';

export interface DailyLifeItem {
  category: DailyLifeCategory;
  name: string;
  image: string;
  description?: string;
}

const u = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=600&h=400&fit=crop&auto=format`;

// Category colour accents (Tailwind bg classes for fallback)
export const DAILY_LIFE_GRADIENT: Record<DailyLifeCategory, string> = {
  Apartment:  'from-slate-500 to-slate-700',
  Workspace:  'from-blue-500 to-indigo-700',
  Gym:        'from-rose-500 to-red-700',
  Coworking:  'from-amber-500 to-orange-600',
  Cafe:       'from-yellow-600 to-amber-700',
};

export const DAILY_LIFE_EMOJI: Record<DailyLifeCategory, string> = {
  Apartment:  '🏠',
  Workspace:  '💻',
  Gym:        '🏋️',
  Coworking:  '🖥️',
  Cafe:       '☕',
};

export const CITY_DAILY_LIFE: Record<string, DailyLifeItem[]> = {

  // ─── Southeast Asia ──────────────────────────────────────────────────────────

  'Bali (Canggu)': [
    { category: 'Apartment',  name: 'Villa with private pool',        image: u('1571896349842-57327a2f0e27'), description: 'Tropical villas with rice-field or pool views from ~$600/month in Canggu.' },
    { category: 'Workspace',  name: 'Rooftop desk setup',             image: u('1593642632559-0c6d3fc62b89'), description: 'Most Canggu villas have fast fibre and a dedicated desk or balcony office.' },
    { category: 'Gym',        name: 'Outdoor functional training',    image: u('1534438327276-14e5300c3a48'), description: 'Multiple CrossFit boxes and outdoor gyms, many open-air. ~$30–60/month.' },
    { category: 'Coworking',  name: 'Dojo Bali, Canggu',              image: u('1497366216548-37526070297c'), description: 'Bali\'s most popular coworking hub — fast WiFi, community events, rooftop.' },
    { category: 'Cafe',       name: 'The Shady Shack',                image: u('1509042239860-f550ce710b93'), description: 'Lush garden setting, cold brew and smoothie bowls. Reliable WiFi.' },
  ],

  'Ubud': [
    { category: 'Apartment',  name: 'Jungle-view villa',              image: u('1537996194471-e657df975ab4'), description: 'Monthly rentals in Ubud from ~$400 — lush gardens, open-air bathrooms.' },
    { category: 'Workspace',  name: 'Open-air desk with rice fields', image: u('1486312338219-ce68d2c6f44d'), description: 'Peaceful work vibes — many villas set up directly for remote work.' },
    { category: 'Gym',        name: 'Yoga shala and gym combo',       image: u('1518611012118-696072aa579a'), description: 'Ubud is known for yoga but CrossFit and functional gyms are growing. ~$40/month.' },
    { category: 'Coworking',  name: 'Hubud, Ubud',                    image: u('1581291518857-4d27a81c2c5d'), description: 'One of Bali\'s original coworking spaces — bamboo architecture, strong community.' },
    { category: 'Cafe',       name: 'Kafe, Monkey Forest Rd',         image: u('1501339847302-ac426a4a7cbb'), description: 'Organic cafe with courtyard seating and fast WiFi. Work all morning.' },
  ],

  'Chiang Mai': [
    { category: 'Apartment',  name: 'Modern condo, Nimman',           image: u('1555854571-0f5d4e13d1ba'), description: 'Fully furnished condos near Nimman from ~$300–500/month. Pool and gym often included.' },
    { category: 'Workspace',  name: 'Dual-monitor home office setup', image: u('1593642632822-ea3c4b44d0bf'), description: 'Most condos in Chiang Mai have reliable fibre and space for a full desk setup.' },
    { category: 'Gym',        name: 'Muay Thai training',             image: u('1517438984742-1262db08379e'), description: 'Train at one of 50+ Muay Thai gyms. Full daily sessions from ~$80/month.' },
    { category: 'Coworking',  name: 'CAMP, Maya Mall',                image: u('1432888622747-4eb9a8efeb07'), description: 'Open 24/7, free WiFi with coffee purchase. A Chiang Mai remote work institution.' },
    { category: 'Cafe',       name: 'Ristr8to, Nimman',               image: u('1445116572257-1e5c3f661bc2'), description: 'Specialty espresso bar with focused work atmosphere. Excellent single-origins.' },
  ],

  'Da Nang': [
    { category: 'Apartment',  name: 'Beach-view apartment',           image: u('1522708323590-d24dbb6b0267'), description: 'Sea-view apartments 5 min from My Khe Beach from ~$400–600/month.' },
    { category: 'Workspace',  name: 'Home office with balcony',       image: u('1593642632735-2dea5c41e5ef'), description: 'Most expat apartments come furnished with desk space and strong fibre internet.' },
    { category: 'Gym',        name: 'California Fitness, Da Nang',    image: u('1534438327276-14e5300c3a48'), description: 'International-standard gym. Monthly membership ~$35. Multiple locations.' },
    { category: 'Coworking',  name: 'Toong, An Thuong area',          image: u('1497366216548-37526070297c'), description: 'Growing coworking scene in An Thuong. Clean spaces, good WiFi, from $100/month.' },
    { category: 'Cafe',       name: 'Cong Caphe, beach strip',        image: u('1509042239860-f550ce710b93'), description: 'Retro Vietnamese coffee chain — coconut cold brew, chill vibe, strong WiFi.' },
  ],

  'Bangkok': [
    { category: 'Apartment',  name: 'High-rise condo, Silom',         image: u('1555854571-0f5d4e13d1ba'), description: 'Fully furnished condos with rooftop pools from $500–800/month in Silom or Ari.' },
    { category: 'Workspace',  name: 'Standing desk setup',            image: u('1593642632559-0c6d3fc62b89'), description: 'Bangkok condos typically have fast fibre and dedicated desk space for remote work.' },
    { category: 'Gym',        name: 'Virgin Active, Terminal 21',     image: u('1534438327276-14e5300c3a48'), description: 'World-class facilities in major malls. Monthly memberships from ~$50.' },
    { category: 'Coworking',  name: 'The Hive, Thonglor',             image: u('1497366216548-37526070297c'), description: 'Design-forward coworking with strong community events. Day passes and memberships.' },
    { category: 'Cafe',       name: 'Koffee Maldives, Ari',           image: u('1501339847302-ac426a4a7cbb'), description: 'Specialty coffee in Ari\'s best neighbourhood for remote work cafes.' },
  ],

  'Ho Chi Minh City': [
    { category: 'Apartment',  name: 'Serviced apartment, D1',         image: u('1522708323590-d24dbb6b0267'), description: 'Serviced apartments in D1 or D3 from ~$500/month — cleaning included.' },
    { category: 'Workspace',  name: 'Bright home office corner',      image: u('1486312338219-ce68d2c6f44d'), description: 'Expat-friendly apartments in D1 come fully equipped for remote work.' },
    { category: 'Gym',        name: 'California Fitness, Saigon',     image: u('1518611012118-696072aa579a'), description: 'Full facilities, pool, classes. ~$50/month. Also local gyms for $10–15.' },
    { category: 'Coworking',  name: 'Toong, D1',                      image: u('1581291518857-4d27a81c2c5d'), description: 'Multiple locations across Saigon. Hot desks and private offices available.' },
    { category: 'Cafe',       name: 'The Workshop, D1',               image: u('1509042239860-f550ce710b93'), description: 'Saigon\'s best specialty coffee shop — multiple floors, excellent espresso bar.' },
  ],

  'Hanoi': [
    { category: 'Apartment',  name: 'Old Quarter alley apartment',    image: u('1537996194471-e657df975ab4'), description: 'Compact but characterful apartments in the Old Quarter from ~$400/month.' },
    { category: 'Workspace',  name: 'Rooftop workspace, Old Quarter', image: u('1593642632822-ea3c4b44d0bf'), description: 'Many apartments and guesthouses have rooftop areas ideal for working outdoors.' },
    { category: 'Gym',        name: 'California Fitness, Hanoi',      image: u('1534438327276-14e5300c3a48'), description: 'Well-equipped international gym chain. ~$45/month. Local options cheaper.' },
    { category: 'Coworking',  name: 'Toong, Hoan Kiem',               image: u('1432888622747-4eb9a8efeb07'), description: 'Hanoi\'s growing coworking scene. Reliable fibre, friendly community.' },
    { category: 'Cafe',       name: 'Cafe Pho Co, rooftop',           image: u('1501339847302-ac426a4a7cbb'), description: 'Climb through a silk shop to reach this legendary rooftop with lake views.' },
  ],

  'Kuala Lumpur': [
    { category: 'Apartment',  name: 'KLCC twin-tower view condo',     image: u('1555854571-0f5d4e13d1ba'), description: 'Serviced condos with Petronas Tower views in KLCC from ~$600/month.' },
    { category: 'Workspace',  name: 'Bright corner desk setup',       image: u('1593642632559-0c6d3fc62b89'), description: 'KL has excellent fibre infrastructure — most condos offer 100–500Mbps.' },
    { category: 'Gym',        name: 'Celebrity Fitness, Pavilion',    image: u('1518611012118-696072aa579a'), description: 'Premium chain in major malls. ~$50/month. Smaller local gyms from $15.' },
    { category: 'Coworking',  name: 'Common Ground, Bangsar South',   image: u('1497366216548-37526070297c'), description: 'Upscale coworking with private offices, event space, rooftop terrace.' },
    { category: 'Cafe',       name: 'VCR, Bangsar',                   image: u('1509042239860-f550ce710b93'), description: 'Award-winning specialty coffee. Packed with remote workers on weekday mornings.' },
  ],

  'Singapore': [
    { category: 'Apartment',  name: 'HDB flat, Tiong Bahru',          image: u('1522708323590-d24dbb6b0267'), description: 'Clean, well-connected HDB apartments in Tiong Bahru or Tanjong Pagar from ~$1,500/month.' },
    { category: 'Workspace',  name: 'Minimal desk, city view',        image: u('1486312338219-ce68d2c6f44d'), description: 'Singapore has world-class broadband. Apartments are compact but well-designed.' },
    { category: 'Gym',        name: 'Fitness First, Orchard',         image: u('1534438327276-14e5300c3a48'), description: 'Premium facilities across the island. ~$80–100/month. Government rec centres cheaper.' },
    { category: 'Coworking',  name: 'WeWork, Marina One',             image: u('1581291518857-4d27a81c2c5d'), description: 'Multiple WeWork and Spaces locations in the CBD. Hot desks from ~$300/month.' },
    { category: 'Cafe',       name: 'Nylon Coffee, Everton Park',     image: u('1445116572257-1e5c3f661bc2'), description: 'Renowned specialty coffee roaster in a heritage shophouse. Queue expected.' },
  ],

  'Phnom Penh': [
    { category: 'Apartment',  name: 'Riverside serviced apartment',   image: u('1537996194471-e657df975ab4'), description: 'Spacious serviced apartments near the Mekong riverside from ~$350/month.' },
    { category: 'Workspace',  name: 'Expat apartment desk setup',     image: u('1593642632822-ea3c4b44d0bf'), description: 'Most expat apartments include fast WiFi and a desk — good base for remote work.' },
    { category: 'Gym',        name: 'Royal PP Gym',                   image: u('1518611012118-696072aa579a'), description: 'Well-equipped gym in BKK1 expat area. ~$25–40/month. Multiple local options.' },
    { category: 'Coworking',  name: 'Factory, BKK1',                  image: u('1432888622747-4eb9a8efeb07'), description: 'Phnom Penh\'s coworking scene is small but reliable. BKK1 is the hub.' },
    { category: 'Cafe',       name: 'Brown Coffee, Riverside',        image: u('1501339847302-ac426a4a7cbb'), description: 'Cambodia\'s best coffee chain — reliable WiFi, good espresso, comfy seating.' },
  ],

  'Koh Lanta': [
    { category: 'Apartment',  name: 'Beachside bungalow',             image: u('1571896349842-57327a2f0e27'), description: 'Simple but beautiful bungalows steps from the beach from ~$300/month.' },
    { category: 'Workspace',  name: 'Cafe desk with beach view',      image: u('1593642632735-2dea5c41e5ef'), description: 'Internet is reliable in the main strip. Work best from cafes with sea views.' },
    { category: 'Gym',        name: 'Beachfront yoga and fitness',    image: u('1518611012118-696072aa579a'), description: 'Multiple yoga studios and small gyms. Sessions from $5. Fitness here is lifestyle.' },
    { category: 'Coworking',  name: 'Ko Lanta Coworking Hub',         image: u('1497366216548-37526070297c'), description: 'Small but functional. Good for a few hours of focused work between beach sessions.' },
    { category: 'Cafe',       name: 'Hammock cafe, Lanta Old Town',   image: u('1509042239860-f550ce710b93'), description: 'Swing in a hammock with fresh coconut and cold brew. Island life at its best.' },
  ],

  'Koh Samui': [
    { category: 'Apartment',  name: 'Pool villa, Chaweng area',       image: u('1571896349842-57327a2f0e27'), description: 'Private pool villas in Chaweng and Lamai from ~$600/month.' },
    { category: 'Workspace',  name: 'Villa terrace desk',             image: u('1486312338219-ce68d2c6f44d'), description: 'Most villas have terrace or outdoor desk setups. Island fibre is improving.' },
    { category: 'Gym',        name: 'Samui Muay Thai gym',            image: u('1517438984742-1262db08379e'), description: 'Several Muay Thai training camps on the island. Group sessions ~$15/day.' },
    { category: 'Coworking',  name: 'The Hive, Chaweng',              image: u('1432888622747-4eb9a8efeb07'), description: 'Samui\'s coworking options are limited — best to work from villa or cafes.' },
    { category: 'Cafe',       name: 'La Baguette, Chaweng',           image: u('1445116572257-1e5c3f661bc2'), description: 'French bakery cafe with reliable WiFi and great coffee. Work all morning.' },
  ],

  'Phuket': [
    { category: 'Apartment',  name: 'Kata Hills condo',               image: u('1522708323590-d24dbb6b0267'), description: 'Sea-view condos in Kata and Rawai from ~$500/month. Great long-stay deals.' },
    { category: 'Workspace',  name: 'Sea-view terrace desk',          image: u('1593642632559-0c6d3fc62b89'), description: 'Rawai and Kata condos popular with digital nomads. Fibre in most buildings.' },
    { category: 'Gym',        name: 'Tiger Muay Thai, Chalong',       image: u('1534438327276-14e5300c3a48'), description: 'World-famous training camp. Monthly packages from ~$200. All levels welcome.' },
    { category: 'Coworking',  name: 'Garage Society, Rawai',          image: u('1581291518857-4d27a81c2c5d'), description: 'Best coworking spot on the island — professional setup, community vibe.' },
    { category: 'Cafe',       name: 'Two Chefs Coffee, Rawai',        image: u('1501339847302-ac426a4a7cbb'), description: 'Popular remote work cafe — fast WiFi, good espresso, local crowd.' },
  ],

  // ─── Central America & Mexico ────────────────────────────────────────────────

  'Mexico City': [
    { category: 'Apartment',  name: 'Condesa art-deco apartment',     image: u('1555854571-0f5d4e13d1ba'), description: 'Beautiful pre-war apartments in Condesa and Roma from ~$700–1,000/month.' },
    { category: 'Workspace',  name: 'Desk with leafy courtyard view', image: u('1593642632822-ea3c4b44d0bf'), description: 'Roma and Condesa apartments have great natural light and fibre internet.' },
    { category: 'Gym',        name: 'Smartfit, Condesa',              image: u('1518611012118-696072aa579a'), description: 'Massive chain with 500+ locations. ~$20–25/month. Well-equipped facilities.' },
    { category: 'Coworking',  name: 'WeWork, Paseo de la Reforma',    image: u('1497366216548-37526070297c'), description: 'Several WeWork and local coworking options in Roma, Condesa, Polanco.' },
    { category: 'Cafe',       name: 'Quentin, Roma Norte',            image: u('1445116572257-1e5c3f661bc2'), description: 'Specialty coffee paradise. Roma Norte has more good cafes per block than anywhere.' },
  ],

  'Playa del Carmen': [
    { category: 'Apartment',  name: 'Condo near 5th Avenue',          image: u('1571896349842-57327a2f0e27'), description: 'Furnished condos steps from the beach and 5th Ave from ~$700/month.' },
    { category: 'Workspace',  name: 'Rooftop apartment terrace',      image: u('1486312338219-ce68d2c6f44d'), description: 'Most condos have rooftop terraces and fast fibre — ideal for working mornings.' },
    { category: 'Gym',        name: 'Sportium, PDC',                  image: u('1534438327276-14e5300c3a48'), description: 'Well-equipped gym with pool. ~$40–50/month. Outdoor fitness is popular here.' },
    { category: 'Coworking',  name: 'Nest Cowork, Centro',            image: u('1432888622747-4eb9a8efeb07'), description: 'Beach-town coworking with solid WiFi, open space and community meetups.' },
    { category: 'Cafe',       name: 'Chez Celine, 5th Ave',           image: u('1509042239860-f550ce710b93'), description: 'French bakery with strong espresso and good WiFi. Reliable remote work spot.' },
  ],

  'Oaxaca': [
    { category: 'Apartment',  name: 'Colonial casa with courtyard',   image: u('1537996194471-e657df975ab4'), description: 'Beautifully preserved colonial homes with internal courtyards from ~$500/month.' },
    { category: 'Workspace',  name: 'Rooftop desk, centro historico', image: u('1593642632735-2dea5c41e5ef'), description: 'Oaxaca\'s fibre is surprisingly good in the historic centre. Work from rooftop terraces.' },
    { category: 'Gym',        name: 'Argo Gym, Centro',               image: u('1518611012118-696072aa579a'), description: 'Small functional gym downtown. ~$20/month. Yoga studios are popular here too.' },
    { category: 'Coworking',  name: 'La Cafebreria, Centro',          image: u('1581291518857-4d27a81c2c5d'), description: 'Bookshop-cafe hybrid with solid WiFi and a creative working atmosphere.' },
    { category: 'Cafe',       name: 'Brujula Coffee, Alcala',         image: u('1501339847302-ac426a4a7cbb'), description: 'Specialty coffee roaster on the main pedestrian strip. The best espresso in Oaxaca.' },
  ],

  // ─── South America ───────────────────────────────────────────────────────────

  'Medellín': [
    { category: 'Apartment',  name: 'El Poblado high-rise',           image: u('1555854571-0f5d4e13d1ba'), description: 'Modern furnished apartments in El Poblado or Laureles from ~$600–900/month.' },
    { category: 'Workspace',  name: 'Bright apartment desk setup',    image: u('1593642632559-0c6d3fc62b89'), description: 'Medellín apartments have fast fibre. Eternal spring climate makes working here a pleasure.' },
    { category: 'Gym',        name: 'Smartfit, El Poblado',           image: u('1534438327276-14e5300c3a48'), description: 'Well-equipped chain across the city. ~$15–20/month. Some condos have building gyms.' },
    { category: 'Coworking',  name: 'Selina Medellin, El Centro',     image: u('1497366216548-37526070297c'), description: 'Popular nomad hub with rooftop, fast WiFi, social events. Day passes available.' },
    { category: 'Cafe',       name: 'Pergamino, El Poblado',          image: u('1509042239860-f550ce710b93'), description: 'Colombia\'s best specialty coffee roaster, right here in Medellín. A must-visit.' },
  ],

  'Bogotá': [
    { category: 'Apartment',  name: 'Chapinero Alto apartment',       image: u('1522708323590-d24dbb6b0267'), description: 'Modern apartments in Chapinero or Usaquén from ~$500–800/month.' },
    { category: 'Workspace',  name: 'Apartment desk, Chapinero',      image: u('1486312338219-ce68d2c6f44d'), description: 'Fast fibre is standard. Bogotá has a serious work culture — good for focus.' },
    { category: 'Gym',        name: 'Smartfit, Chapinero',            image: u('1518611012118-696072aa579a'), description: 'Massive modern gyms at affordable prices. ~$15–20/month.' },
    { category: 'Coworking',  name: 'Selina Bogotá, Chapinero',       image: u('1432888622747-4eb9a8efeb07'), description: 'Multiple coworking spaces in Chapinero and Usaquén. Active nomad community.' },
    { category: 'Cafe',       name: 'Amor Perfecto, Chapinero',       image: u('1445116572257-1e5c3f661bc2'), description: 'Award-winning specialty roaster. Bogotá has an elite specialty coffee culture.' },
  ],

  'Cartagena': [
    { category: 'Apartment',  name: 'Walled City colonial apartment', image: u('1537996194471-e657df975ab4'), description: 'Colourful colonial apartments inside the walled city from ~$700/month.' },
    { category: 'Workspace',  name: 'Rooftop terrace desk',           image: u('1593642632822-ea3c4b44d0bf'), description: 'Many apartments have rooftop terraces with sea breezes — perfect for early mornings.' },
    { category: 'Gym',        name: 'Smartfit, El Centro',            image: u('1534438327276-14e5300c3a48'), description: 'Standard chain gym available. Heat here means early morning workouts are popular.' },
    { category: 'Coworking',  name: 'Selina Cartagena',               image: u('1581291518857-4d27a81c2c5d'), description: 'Popular with nomads — pool, coworking, rooftop bar. Social hub for the city.' },
    { category: 'Cafe',       name: 'Alma, Walled City',              image: u('1501339847302-ac426a4a7cbb'), description: 'Boutique cafe inside the walls with specialty coffee and reliable WiFi.' },
  ],

  'Rio': [
    { category: 'Apartment',  name: 'Ipanema apartment, beach blocks', image: u('1555854571-0f5d4e13d1ba'), description: 'Two-bedroom apartments a few blocks from Ipanema beach from ~$800/month.' },
    { category: 'Workspace',  name: 'Beach-block home office',        image: u('1593642632559-0c6d3fc62b89'), description: 'Good fibre in Ipanema, Leblon and Botafogo. Work mornings, beach afternoons.' },
    { category: 'Gym',        name: 'Bodytech, Ipanema',              image: u('1518611012118-696072aa579a'), description: 'Premium Brazilian gym chain. ~$40/month. Outdoor workout stations on the beach too.' },
    { category: 'Coworking',  name: 'WeWork, Leblon',                 image: u('1497366216548-37526070297c'), description: 'Several WeWork locations and local coworking in Ipanema, Leblon and Botafogo.' },
    { category: 'Cafe',       name: 'Fogo de Chão coffee bar',        image: u('1509042239860-f550ce710b93'), description: 'Rio has a strong cafe culture. Ipanema and Botafogo are full of specialty spots.' },
  ],

  'Buenos Aires': [
    { category: 'Apartment',  name: 'Palermo Soho apartment',         image: u('1522708323590-d24dbb6b0267'), description: 'Stylish apartments in Palermo or San Telmo from ~$600–900/month. Great value.' },
    { category: 'Workspace',  name: 'Apartment desk, European style', image: u('1486312338219-ce68d2c6f44d'), description: 'BA apartments are spacious by Latin American standards. Fibre is fast and cheap.' },
    { category: 'Gym',        name: 'Megatlon, Palermo',              image: u('1534438327276-14e5300c3a48'), description: 'Large local chain with great facilities. ~$20/month. CrossFit popular in Palermo.' },
    { category: 'Coworking',  name: 'Areatres, Palermo',              image: u('1432888622747-4eb9a8efeb07'), description: 'BA has one of Latin America\'s best coworking scenes. From $60/month in Palermo.' },
    { category: 'Cafe',       name: 'El Federal, San Telmo',          image: u('1445116572257-1e5c3f661bc2'), description: 'Historic corner cafe, open since 1864. Excellent coffee and medialunas all day.' },
  ],

  'Santiago': [
    { category: 'Apartment',  name: 'Providencia apartment',          image: u('1537996194471-e657df975ab4'), description: 'Modern furnished apartments in Providencia or Las Condes from ~$700/month.' },
    { category: 'Workspace',  name: 'High-rise desk setup',           image: u('1593642632735-2dea5c41e5ef'), description: 'Santiago has some of South America\'s fastest internet. Remote work friendly.' },
    { category: 'Gym',        name: 'Bodytech, Providencia',          image: u('1518611012118-696072aa579a'), description: 'Good chain gyms across the city. ~$35/month. Outdoor running in Cerro San Cristóbal.' },
    { category: 'Coworking',  name: 'Spaces, Providencia',            image: u('1581291518857-4d27a81c2c5d'), description: 'Professional coworking spaces in Providencia and Las Condes business district.' },
    { category: 'Cafe',       name: 'Café Quínoa, Barrio Italia',     image: u('1501339847302-ac426a4a7cbb'), description: 'Specialty coffee and avocado toast in Barrio Italia — Santiago\'s coolest neighbourhood.' },
  ],

  'Montevideo': [
    { category: 'Apartment',  name: 'Pocitos beachfront apartment',   image: u('1571896349842-57327a2f0e27'), description: 'Elegant apartments near the Rambla in Pocitos from ~$600/month.' },
    { category: 'Workspace',  name: 'Light apartment, Pocitos',       image: u('1593642632822-ea3c4b44d0bf'), description: 'Spacious, light-filled apartments. Fibre internet is widespread across the city.' },
    { category: 'Gym',        name: 'Club Uruguay, Pocitos',          image: u('1534438327276-14e5300c3a48'), description: 'Well-equipped gym near the waterfront. ~$25–35/month.' },
    { category: 'Coworking',  name: 'Sinergia, Centro',               image: u('1432888622747-4eb9a8efeb07'), description: 'Montevideo\'s main coworking hub — relaxed atmosphere, good community.' },
    { category: 'Cafe',       name: 'Café Brasilero, Ciudad Vieja',   image: u('1445116572257-1e5c3f661bc2'), description: 'One of South America\'s oldest cafes. Gorgeous interior, excellent coffee.' },
  ],

  'Lima': [
    { category: 'Apartment',  name: 'Miraflores ocean-view apartment', image: u('1555854571-0f5d4e13d1ba'), description: 'Modern apartments in Miraflores with Pacific views from ~$700/month.' },
    { category: 'Workspace',  name: 'Cliffside desk setup, Miraflores', image: u('1593642632559-0c6d3fc62b89'), description: 'Excellent fibre. Many apartments have ocean or garden views — a privilege to work from.' },
    { category: 'Gym',        name: 'Bodytech, Miraflores',           image: u('1518611012118-696072aa579a'), description: 'Premium chain with great facilities. ~$40/month. Running along the Malecón is free.' },
    { category: 'Coworking',  name: 'Comunal, Miraflores',            image: u('1497366216548-37526070297c'), description: 'Lima\'s best coworking — professional setup, strong WiFi, event space.' },
    { category: 'Cafe',       name: 'Tostaduría Bisetti, Barranco',   image: u('1509042239860-f550ce710b93'), description: 'One of Lima\'s top specialty coffee spots. Barranco is the cool neighbourhood for cafes.' },
  ],

  'São Paulo': [
    { category: 'Apartment',  name: 'Vila Madalena apartment',        image: u('1522708323590-d24dbb6b0267'), description: 'Vibrant neighbourhood with colourful apartments from ~$700/month. Art and food everywhere.' },
    { category: 'Workspace',  name: 'Modern desk, Vila Madalena',     image: u('1486312338219-ce68d2c6f44d'), description: 'SP has excellent fibre. The city works hard — remote work culture is established.' },
    { category: 'Gym',        name: 'Bodytech, Pinheiros',            image: u('1534438327276-14e5300c3a48'), description: 'Premium gym chain. ~$45/month. CrossFit studios are popular in Pinheiros and Itaim.' },
    { category: 'Coworking',  name: 'WeWork, Itaim Bibi',             image: u('1581291518857-4d27a81c2c5d'), description: 'Multiple WeWork and Spaces locations in Pinheiros, Itaim and Paulista.' },
    { category: 'Cafe',       name: 'Isso é Café, Pinheiros',         image: u('1501339847302-ac426a4a7cbb'), description: 'SP punches above its weight on specialty coffee. Pinheiros is the best neighbourhood.' },
  ],

  // ─── Southern Europe ─────────────────────────────────────────────────────────

  'Lisbon': [
    { category: 'Apartment',  name: 'Alfama tiled-azulejo apartment', image: u('1555854571-0f5d4e13d1ba'), description: 'Characterful apartments in Príncipe Real or Mouraria from ~€900/month.' },
    { category: 'Workspace',  name: 'Terrace desk, Bairro Alto',      image: u('1593642632822-ea3c4b44d0bf'), description: 'Lisbon apartments have fast NOS/MEO fibre. Terraces with city views are common.' },
    { category: 'Gym',        name: 'Holmes Place, Avenida',          image: u('1518611012118-696072aa579a'), description: 'Premium chain across Lisbon. ~€40–50/month. Several CrossFit boxes in Príncipe Real.' },
    { category: 'Coworking',  name: 'Second Home, Mercado da Ribeira', image: u('1432888622747-4eb9a8efeb07'), description: 'Iconic coworking inside the Time Out Market building. Stunning design, vibrant energy.' },
    { category: 'Cafe',       name: 'Copenhagen Coffee Lab, Santos',  image: u('1445116572257-1e5c3f661bc2'), description: 'Lisbon\'s specialty coffee scene is excellent. Santos and LX Factory are the hubs.' },
  ],

  'Porto': [
    { category: 'Apartment',  name: 'Bonfim neighbourhood apartment', image: u('1537996194471-e657df975ab4'), description: 'Renovated apartments in Bonfim or Cedofeita from ~€700–900/month.' },
    { category: 'Workspace',  name: 'Apartment desk, Bonfim',         image: u('1593642632735-2dea5c41e5ef'), description: 'Porto apartments are larger than Lisbon for the same price. Fast fibre throughout.' },
    { category: 'Gym',        name: 'Solinca, Porto',                 image: u('1534438327276-14e5300c3a48'), description: 'Good local chain gym. ~€35/month. Running along the Douro riverfront is popular.' },
    { category: 'Coworking',  name: 'Porto i/o, Centre',              image: u('1581291518857-4d27a81c2c5d'), description: 'Porto\'s best coworking spaces — creative atmosphere, regular events.' },
    { category: 'Cafe',       name: 'Pádua, Bonfim',                  image: u('1501339847302-ac426a4a7cbb'), description: 'Specialty coffee and slow brunch in Bonfim. Porto\'s coolest neighbourhood for cafes.' },
  ],

  'Barcelona': [
    { category: 'Apartment',  name: 'Gràcia neighbourhood apartment', image: u('1571896349842-57327a2f0e27'), description: 'Charming apartments in Gràcia or Eixample from ~€1,100/month.' },
    { category: 'Workspace',  name: 'Apartment desk, Eixample',       image: u('1486312338219-ce68d2c6f44d'), description: 'Barcelona apartments have excellent fibre and lots of natural light. Work-friendly.' },
    { category: 'Gym',        name: 'DIR, Eixample',                  image: u('1518611012118-696072aa579a'), description: 'Barcelona\'s premium gym chain with pools. ~€60/month. Beach running is free.' },
    { category: 'Coworking',  name: 'Betahaus, Poblenou',             image: u('1497366216548-37526070297c'), description: 'Strong coworking scene in Poblenou tech district (22@). Day passes available.' },
    { category: 'Cafe',       name: 'Nomad Coffee, El Born',          image: u('1509042239860-f550ce710b93'), description: 'One of Europe\'s best specialty roasters. El Born and Gràcia are the cafe neighbourhoods.' },
  ],

  'Valencia': [
    { category: 'Apartment',  name: 'Ruzafa neighbourhood apartment', image: u('1522708323590-d24dbb6b0267'), description: 'Trendy Ruzafa apartments from ~€800/month — great value vs Barcelona.' },
    { category: 'Workspace',  name: 'Bright apartment, Ruzafa',       image: u('1593642632559-0c6d3fc62b89'), description: 'Fast fibre, lower rents, sunnier weather than Barcelona. Remote workers love Valencia.' },
    { category: 'Gym',        name: 'Anytime Fitness, Ruzafa',        image: u('1534438327276-14e5300c3a48'), description: '24-hour access chain. ~€30/month. City park running circuit nearby.' },
    { category: 'Coworking',  name: 'VLCcoworking, Centro',           image: u('1432888622747-4eb9a8efeb07'), description: 'Valencia\'s coworking scene is growing — cheaper than Barcelona with the same sun.' },
    { category: 'Cafe',       name: 'Pourover Café, Ruzafa',          image: u('1445116572257-1e5c3f661bc2'), description: 'Excellent specialty coffee in the heart of the coolest neighbourhood.' },
  ],

  // ─── Balkans & Eastern Europe ────────────────────────────────────────────────

  'Split': [
    { category: 'Apartment',  name: 'Old Town Diocletian Palace flat', image: u('1537996194471-e657df975ab4'), description: 'Apartments inside or near the 1,700-year-old palace walls from ~€700/month.' },
    { category: 'Workspace',  name: 'Terrace desk with Adriatic view', image: u('1593642632822-ea3c4b44d0bf'), description: 'Croatia has rolled out fast fibre. Working from a terrace overlooking the sea is the standard.' },
    { category: 'Gym',        name: 'Termag gym, Split',              image: u('1518611012118-696072aa579a'), description: 'Well-equipped local gym. ~€30/month. Running along the Riva promenade is popular.' },
    { category: 'Coworking',  name: 'Hub385, Split',                  image: u('1581291518857-4d27a81c2c5d'), description: 'Croatia\'s main coworking network. Good space with sea views and fast fibre.' },
    { category: 'Cafe',       name: 'Paradigma, Stari Grad',          image: u('1501339847302-ac426a4a7cbb'), description: 'Specialty coffee inside the palace walls. Best morning spot in Split.' },
  ],

  'Dubrovnik': [
    { category: 'Apartment',  name: 'Old Town walled city apartment', image: u('1571896349842-57327a2f0e27'), description: 'Atmospheric apartments inside the city walls from ~€900/month — touristy but magical.' },
    { category: 'Workspace',  name: 'Terrace desk, Old Town',         image: u('1486312338219-ce68d2c6f44d'), description: 'Fast fibre in the old town. Work from your terrace with Adriatic views and coffee.' },
    { category: 'Gym',        name: 'Local gym, Gruž',                image: u('1534438327276-14e5300c3a48'), description: 'Basic but functional gym in the Gruž district away from the tourist centre. ~€25/month.' },
    { category: 'Coworking',  name: 'Coworking Dubrovnik, Centre',    image: u('1432888622747-4eb9a8efeb07'), description: 'Small coworking spaces in the city — good for focused work between sightseeing.' },
    { category: 'Cafe',       name: 'D\'Vino Wine Bar and Cafe',      image: u('1445116572257-1e5c3f661bc2'), description: 'Old Town cafe with reliable WiFi. Wine list excellent come evening.' },
  ],

  'Athens': [
    { category: 'Apartment',  name: 'Koukaki apartment, Acropolis view', image: u('1555854571-0f5d4e13d1ba'), description: 'Renovated apartments near the Acropolis in Koukaki from ~€700/month.' },
    { category: 'Workspace',  name: 'Rooftop desk with Acropolis view', image: u('1593642632559-0c6d3fc62b89'), description: 'Many Athens apartments have rooftop access with Acropolis views. Strong fibre too.' },
    { category: 'Gym',        name: 'Holmes Place, Athens',           image: u('1518611012118-696072aa579a'), description: 'Premium chain with pools and classes. ~€50/month. Outdoor stair workouts at Lycabettus.' },
    { category: 'Coworking',  name: 'The Cube, Syntagma',             image: u('1497366216548-37526070297c'), description: 'Athens has a growing coworking scene. Best spaces in Syntagma and Monastiraki.' },
    { category: 'Cafe',       name: 'Little Tree Books & Coffee, Pagrati', image: u('1509042239860-f550ce710b93'), description: 'Book-lined specialty coffee shop in the local neighbourhood of Pagrati. Perfect for work.' },
  ],

  'Budapest': [
    { category: 'Apartment',  name: 'Jewish Quarter ruin bar apartment', image: u('1522708323590-d24dbb6b0267'), description: 'Eclectic apartments in Budapest VII from ~€600–800/month. Steps from the ruin bars.' },
    { category: 'Workspace',  name: 'Budapest apartment home office', image: u('1486312338219-ce68d2c6f44d'), description: 'Hungary has excellent fibre infrastructure. Budapest apartments are spacious and affordable.' },
    { category: 'Gym',        name: 'Fit Arena, District V',          image: u('1534438327276-14e5300c3a48'), description: 'Well-equipped local gyms from ~€20–30/month. Thermal baths count as wellness.' },
    { category: 'Coworking',  name: 'Kaptar, District VII',           image: u('1432888622747-4eb9a8efeb07'), description: 'Budapest\'s best coworking — design-forward, community driven, great events.' },
    { category: 'Cafe',       name: 'Gerbeaud, Vörösmarty Square',    image: u('1445116572257-1e5c3f661bc2'), description: 'Historic grand cafe open since 1858. For daily work, Specialty bars in District V are better.' },
  ],

  'Prague': [
    { category: 'Apartment',  name: 'Vinohrady apartment',            image: u('1537996194471-e657df975ab4'), description: 'Elegant art nouveau apartments in Vinohrady from ~€800/month.' },
    { category: 'Workspace',  name: 'Prague apartment home office',   image: u('1593642632735-2dea5c41e5ef'), description: 'Czech fibre is fast. Prague apartments are larger than most Western European cities.' },
    { category: 'Gym',        name: 'Holmes Place, Vinohrady',        image: u('1518611012118-696072aa579a'), description: 'Premium chain. ~€40/month. Running in Riegrovy Sady park a 2-minute walk.' },
    { category: 'Coworking',  name: 'Locus Workspace, Vinohrady',     image: u('1581291518857-4d27a81c2c5d'), description: 'Community-focused coworking in Prague\'s best neighbourhood for remote workers.' },
    { category: 'Cafe',       name: 'Kavárna co hledá jméno, Žižkov', image: u('1501339847302-ac426a4a7cbb'), description: 'Specialty coffee and a calm atmosphere for focused morning work in Žižkov.' },
  ],

  'Berlin': [
    { category: 'Apartment',  name: 'Prenzlauer Berg apartment',      image: u('1571896349842-57327a2f0e27'), description: 'Spacious pre-war Altbau apartments in Prenzlauer Berg or Kreuzberg from ~€1,000/month.' },
    { category: 'Workspace',  name: 'Altbau desk setup, high ceilings', image: u('1486312338219-ce68d2c6f44d'), description: 'Berlin apartments are large and well-lit. Deutsche Telekom fibre is fast everywhere.' },
    { category: 'Gym',        name: 'Holmes Place, Mitte',            image: u('1534438327276-14e5300c3a48'), description: 'Berlin has excellent gym options. ~€30–50/month. CrossFit studios in every neighbourhood.' },
    { category: 'Coworking',  name: 'Betahaus, Kreuzberg',            image: u('1432888622747-4eb9a8efeb07'), description: 'Berlin\'s most established coworking hub — legendary creative community.' },
    { category: 'Cafe',       name: 'The Barn, Mitte',                image: u('1445116572257-1e5c3f661bc2'), description: 'Berlin\'s top specialty coffee roaster. Multiple locations. Serious about extraction.' },
  ],

  'Amsterdam': [
    { category: 'Apartment',  name: 'Canal house apartment',          image: u('1555854571-0f5d4e13d1ba'), description: 'Characterful canal apartments in Jordaan or De Pijp from ~€1,400/month.' },
    { category: 'Workspace',  name: 'Canal-view home office',         image: u('1593642632822-ea3c4b44d0bf'), description: 'Amsterdam apartments are compact but fibre is excellent. Canal views make up for size.' },
    { category: 'Gym',        name: 'Vondelgym, Vondelpark',          image: u('1518611012118-696072aa579a'), description: 'Popular CrossFit-style gym near Vondelpark. ~€50/month. Cycling everywhere is free.' },
    { category: 'Coworking',  name: 'Spaces, Herengracht',            image: u('1497366216548-37526070297c'), description: 'Spaces is Amsterdam-born. Multiple beautiful canal-side coworking locations.' },
    { category: 'Cafe',       name: 'Lot Sixty One, Kinkerstraat',    image: u('1509042239860-f550ce710b93'), description: 'Amsterdam\'s top specialty roaster. Jordaan and De Pijp have the best cafe streets.' },
  ],

  'Florence': [
    { category: 'Apartment',  name: 'Oltrarno neighbourhood apartment', image: u('1522708323590-d24dbb6b0267'), description: 'Charming apartments in Oltrarno or San Niccolò from ~€900/month.' },
    { category: 'Workspace',  name: 'Tuscan apartment desk setup',    image: u('1486312338219-ce68d2c6f44d'), description: 'Florence apartments have character. Fibre is reliable. Work mornings, museums afternoons.' },
    { category: 'Gym',        name: 'Anytime Fitness, Centro',        image: u('1534438327276-14e5300c3a48'), description: '24-hour gym access. ~€30–40/month. Running across Ponte Vecchio at 7am is magic.' },
    { category: 'Coworking',  name: 'Impact Hub, Novoli',             image: u('1432888622747-4eb9a8efeb07'), description: 'Florence\'s coworking scene is smaller but growing. Impact Hub is the main hub.' },
    { category: 'Cafe',       name: 'Ditta Artigianale, Oltrarno',    image: u('1445116572257-1e5c3f661bc2'), description: 'Florence\'s best specialty coffee. Multiple locations, excellent espresso and pour-overs.' },
  ],

  'Seville': [
    { category: 'Apartment',  name: 'Triana neighbourhood apartment', image: u('1537996194471-e657df975ab4'), description: 'Colourful apartments across the river in Triana from ~€700/month.' },
    { category: 'Workspace',  name: 'Apartment desk, El Centro',      image: u('1593642632559-0c6d3fc62b89'), description: 'Good fibre in Seville. Work early mornings before the afternoon heat. Siestas optional.' },
    { category: 'Gym',        name: 'Anytime Fitness, El Centro',     image: u('1534438327276-14e5300c3a48'), description: '24-hour access. ~€25/month. Cycling or running along the river in morning is superb.' },
    { category: 'Coworking',  name: 'Utopic_US, El Centro',           image: u('1581291518857-4d27a81c2c5d'), description: 'Spanish coworking chain. Friendly atmosphere, strong community in Seville.' },
    { category: 'Cafe',       name: 'La Fábrica, El Centro',          image: u('1501339847302-ac426a4a7cbb'), description: 'Best specialty coffee in Seville. Work until noon before heading into the heat.' },
  ],
};
