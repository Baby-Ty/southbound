/**
 * Curated food & drink items per South Bound city.
 * Each city has 5–6 items: local dishes, street food, local beer, soft drink.
 * Prices in USD unless noted.
 */

export type FoodType = 'Dish' | 'Street Food' | 'Breakfast' | 'Dessert' | 'Beer' | 'Drink';

export interface FoodItem {
  name: string;
  image: string;
  type: FoodType;
  description: string;
  price: string;
}

const u = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=600&h=400&fit=crop&auto=format`;

export const FOOD_TYPE_EMOJI: Record<FoodType, string> = {
  Dish:        '🍽️',
  'Street Food': '🥡',
  Breakfast:   '🍳',
  Dessert:     '🍮',
  Beer:        '🍺',
  Drink:       '🥤',
};

export const CITY_FOOD: Record<string, FoodItem[]> = {

  // ─── Southeast Asia ──────────────────────────────────────────────────────────

  'Bali (Canggu)': [
    { name: 'Nasi campur',          type: 'Dish',        image: u('1565299624946-b28f40a0ae38'), description: 'Rice with a rotating selection of curries, tempeh, and sambal. The local daily meal.', price: '$2–3' },
    { name: 'Babi guling',          type: 'Dish',        image: u('1540189549336-e6e99eb4b0b9'), description: 'Balinese slow-roasted suckling pig, spiced with turmeric and lemongrass. A feast.', price: '$4–6' },
    { name: 'Smoothie bowl',        type: 'Breakfast',   image: u('1494597706938-d57b7f3f12ce'), description: 'Açaí or dragon fruit base piled with fresh tropical fruit, granola, and coconut. Iconic.', price: '$5–7' },
    { name: 'Bintang beer',         type: 'Beer',        image: u('1535958850688-6a9ba75bdb54'), description: 'Bali\'s light, easy-drinking lager. Goes with everything. Every beach, every warung.', price: '$2–3' },
    { name: 'Young coconut',        type: 'Drink',       image: u('1555993539-1732b0258900'), description: 'Fresh off the cart, straight from the palm — cold, sweet, and better than anything bottled.', price: '$1' },
    { name: 'Mie goreng',           type: 'Street Food', image: u('1562802378-063ec186a863'), description: 'Fried noodles with egg, veg, and chilli. Late-night street food staple across the island.', price: '$2' },
  ],

  'Ubud': [
    { name: 'Bebek betutu',         type: 'Dish',        image: u('1540189549336-e6e99eb4b0b9'), description: 'Slow-cooked duck rubbed in Balinese spice paste, wrapped in banana leaf. Rich and smoky.', price: '$6–9' },
    { name: 'Jamu',                 type: 'Drink',       image: u('1555993539-1732b0258900'), description: 'Traditional Balinese herbal tonic — turmeric, ginger, tamarind. Sold fresh every morning.', price: '$1' },
    { name: 'Waffle with coconut',  type: 'Breakfast',   image: u('1494597706938-d57b7f3f12ce'), description: 'Café scene in Ubud leans healthy — coconut waffles, açaí, turmeric lattes everywhere.', price: '$5–8' },
    { name: 'Bintang beer',         type: 'Beer',        image: u('1535958850688-6a9ba75bdb54'), description: 'Light and cold, served everywhere. Best enjoyed on a rice field terrace at sunset.', price: '$2–3' },
    { name: 'Nasi goreng',          type: 'Street Food', image: u('1562802378-063ec186a863'), description: 'Indonesian fried rice with a fried egg on top — the best hangover food on the island.', price: '$2' },
    { name: 'Luwak coffee',         type: 'Drink',       image: u('1509042239860-f550ce710b93'), description: 'World\'s most unusual coffee, produced locally. Skip the civet version — go for specialty instead.', price: '$4–6' },
  ],

  'Chiang Mai': [
    { name: 'Khao soi',             type: 'Dish',        image: u('1562802378-063ec186a863'), description: 'Northern Thai coconut curry noodle soup with crispy noodles on top. The city\'s signature dish.', price: '$1.50–2' },
    { name: 'Sai ua sausage',       type: 'Street Food', image: u('1565299624946-b28f40a0ae38'), description: 'Herby northern Thai pork sausage grilled over charcoal. Buy by the link at the market.', price: '$1/link' },
    { name: 'Khai kata',            type: 'Breakfast',   image: u('1494597706938-d57b7f3f12ce'), description: 'Fried egg in a small clay pot with butter and toast — traditional Thai breakfast, best in Nimman.', price: '$2' },
    { name: 'Chang beer',           type: 'Beer',        image: u('1535958850688-6a9ba75bdb54'), description: 'Thailand\'s original lager. Stronger than Singha, colder from a bucket at a rooftop bar.', price: '$1.50–2' },
    { name: 'Cha yen',              type: 'Drink',       image: u('1555993539-1732b0258900'), description: 'Thai iced tea — strong orange tea sweetened with condensed milk, poured over crushed ice.', price: '$0.70' },
    { name: 'Mango sticky rice',    type: 'Dessert',     image: u('1540189549336-e6e99eb4b0b9'), description: 'Sweet glutinous rice with fresh mango and coconut cream. Best dessert in Southeast Asia.', price: '$1.50' },
  ],

  'Da Nang': [
    { name: 'Mi Quang',             type: 'Dish',        image: u('1562802378-063ec186a863'), description: 'Da Nang\'s signature noodle dish — turmeric-yellow noodles with shrimp, pork, peanuts, fresh herbs.', price: '$1.50–2' },
    { name: 'Banh xeo',             type: 'Street Food', image: u('1565299624946-b28f40a0ae38'), description: 'Sizzling Vietnamese crepe stuffed with shrimp and bean sprouts, wrapped in lettuce leaves.', price: '$2–3' },
    { name: 'Banh mi',              type: 'Street Food', image: u('1540189549336-e6e99eb4b0b9'), description: 'Crispy baguette with pâté, cold cuts, pickled veg, chilli, and coriander. Breakfast staple.', price: '$0.80–1.50' },
    { name: 'Bia hoi',              type: 'Beer',        image: u('1535958850688-6a9ba75bdb54'), description: 'Fresh-brewed draught beer made daily. Almost no alcohol. Poured into a plastic cup for next to nothing.', price: '$0.30' },
    { name: 'Ca phe trung',         type: 'Drink',       image: u('1509042239860-f550ce710b93'), description: 'Vietnamese egg coffee — rich espresso topped with a whipped egg yolk and condensed milk foam.', price: '$1.50' },
    { name: 'Che',                  type: 'Dessert',     image: u('1494597706938-d57b7f3f12ce'), description: 'Sweet Vietnamese dessert soup — beans, jelly, coconut milk, tapioca. Served hot or cold.', price: '$1' },
  ],

  'Bangkok': [
    { name: 'Pad kra pao',          type: 'Dish',        image: u('1562802378-063ec186a863'), description: 'Spicy stir-fried basil with pork or chicken, served on rice with a fried egg on top.', price: '$1.50–2' },
    { name: 'Som tam',              type: 'Street Food', image: u('1565299624946-b28f40a0ae38'), description: 'Green papaya salad — pounded in a mortar with lime, fish sauce, peanuts, and dried shrimp.', price: '$1' },
    { name: 'Jok',                  type: 'Breakfast',   image: u('1540189549336-e6e99eb4b0b9'), description: 'Thai rice porridge with ginger, egg, and minced pork. Classic Bangkok early morning breakfast.', price: '$1.50' },
    { name: 'Singha beer',          type: 'Beer',        image: u('1535958850688-6a9ba75bdb54'), description: 'Thailand\'s premium lager — crisp, clean, good with street food. Comes in a bucket at Khao San Rd.', price: '$2' },
    { name: 'Coconut water',        type: 'Drink',       image: u('1555993539-1732b0258900'), description: 'Chopped to order on every corner. Young Thai coconuts are sweeter than anywhere else.', price: '$1' },
    { name: 'Pad thai, street stall', type: 'Street Food', image: u('1494597706938-d57b7f3f12ce'), description: 'Wok-fried rice noodles with tamarind sauce, peanuts, egg, and your choice of protein.', price: '$1.50–2' },
  ],

  'Ho Chi Minh City': [
    { name: 'Pho bo',               type: 'Dish',        image: u('1562802378-063ec186a863'), description: 'Slow-simmered beef bone broth, rice noodles, thinly sliced beef, fresh herbs and lime.', price: '$2–3' },
    { name: 'Banh mi',              type: 'Street Food', image: u('1540189549336-e6e99eb4b0b9'), description: 'The Saigon version — richer, more complex filling than the north. Under $1 from a street cart.', price: '$0.80' },
    { name: 'Hu tieu',              type: 'Breakfast',   image: u('1565299624946-b28f40a0ae38'), description: 'Clear pork broth with rice noodles and toppings. The southern alternative to pho. Morning staple.', price: '$1.50' },
    { name: '333 (Ba Ba Ba)',       type: 'Beer',        image: u('1535958850688-6a9ba75bdb54'), description: 'Saigon\'s iconic local lager. Light and watery — perfect for 35°C afternoons on a plastic stool.', price: '$0.60' },
    { name: 'Ca phe sua da',        type: 'Drink',       image: u('1509042239860-f550ce710b93'), description: 'Vietnamese iced coffee — strong drip over condensed milk and ice. Ordered at every street cafe.', price: '$0.80' },
    { name: 'Banh xeo',             type: 'Street Food', image: u('1494597706938-d57b7f3f12ce'), description: 'Giant sizzling crepe stuffed with shrimp, pork, bean sprouts — wrap in lettuce and eat whole.', price: '$2–3' },
  ],

  'Hanoi': [
    { name: 'Bun cha',              type: 'Dish',        image: u('1562802378-063ec186a863'), description: 'Grilled pork patties in a light dipping broth with rice noodles and fresh herbs. Obama ate here.', price: '$2–3' },
    { name: 'Banh cuon',            type: 'Breakfast',   image: u('1540189549336-e6e99eb4b0b9'), description: 'Steamed rice rolls with minced pork and wood ear mushroom. The best Hanoi breakfast there is.', price: '$1.50' },
    { name: 'Cha ca',               type: 'Dish',        image: u('1565299624946-b28f40a0ae38'), description: 'Turmeric and dill fish, cooked tableside in a sizzling pan. Hanoi\'s most iconic dish.', price: '$6–9' },
    { name: 'Bia hoi',              type: 'Beer',        image: u('1535958850688-6a9ba75bdb54'), description: 'Fresh-brewed corner beer. Sit on a tiny plastic stool with locals and drink for $0.30 a glass.', price: '$0.30' },
    { name: 'Tra da',               type: 'Drink',       image: u('1555993539-1732b0258900'), description: 'Free iced green tea served with every meal at local restaurants. Endlessly refilled.', price: 'Free' },
    { name: 'Banh mi pate',         type: 'Street Food', image: u('1494597706938-d57b7f3f12ce'), description: 'Hanoi\'s banh mi is simpler than Saigon\'s — pâté, butter, chilli. Perfection in a baguette.', price: '$0.80' },
  ],

  'Kuala Lumpur': [
    { name: 'Nasi lemak',           type: 'Dish',        image: u('1562802378-063ec186a863'), description: 'Malaysia\'s national dish — coconut rice, sambal, anchovies, peanuts, cucumber, soft-boiled egg.', price: '$1.50–3' },
    { name: 'Char kway teow',       type: 'Street Food', image: u('1565299624946-b28f40a0ae38'), description: 'Wok-fried flat rice noodles with shrimp, egg, bean sprouts and dark soy sauce. Hawker classic.', price: '$2' },
    { name: 'Roti canai',           type: 'Breakfast',   image: u('1540189549336-e6e99eb4b0b9'), description: 'Flaky flatbread served with dhal and sambal. The breakfast of KL, from any mamak stall.', price: '$0.50' },
    { name: 'Tiger beer',           type: 'Beer',        image: u('1535958850688-6a9ba75bdb54'), description: 'Southeast Asia\'s most recognised lager — brewed here, ice cold at any rooftop bar.', price: '$4–5' },
    { name: 'Teh tarik',            type: 'Drink',       image: u('1509042239860-f550ce710b93'), description: '"Pulled tea" — black tea mixed with condensed milk, poured between cups for froth. Everywhere.', price: '$0.50' },
    { name: 'Laksa',                type: 'Dish',        image: u('1494597706938-d57b7f3f12ce'), description: 'Spicy coconut noodle soup — Curry laksa is KL\'s version. Rich, creamy, absolutely worth the mess.', price: '$2.50–4' },
  ],

  'Singapore': [
    { name: 'Hainanese chicken rice', type: 'Dish',      image: u('1562802378-063ec186a863'), description: 'Singapore\'s unofficial national dish — poached chicken, fragrant rice, ginger sauce. Michelin stars.', price: '$3–5' },
    { name: 'Chilli crab',          type: 'Dish',        image: u('1565299624946-b28f40a0ae38'), description: 'Mud crab in a sweet, spicy tomato-egg gravy. Messy, expensive, and absolutely worth it.', price: '$30–50' },
    { name: 'Kaya toast',           type: 'Breakfast',   image: u('1540189549336-e6e99eb4b0b9'), description: 'Toasted bread with coconut jam and butter, soft-boiled eggs, kopi. The classic Singapore breakfast.', price: '$3' },
    { name: 'Tiger beer',           type: 'Beer',        image: u('1535958850688-6a9ba75bdb54'), description: 'Brewed in Singapore since 1932. Best enjoyed at a hawker centre on a humid evening.', price: '$5–7' },
    { name: 'Milo dinosaur',        type: 'Drink',       image: u('1555993539-1732b0258900'), description: 'Cold Milo with an extra heap of Milo powder on top. Singapore\'s legendary school-canteen drink.', price: '$2' },
    { name: 'Laksa',                type: 'Dish',        image: u('1494597706938-d57b7f3f12ce'), description: 'Singapore laksa — thick coconut curry broth with prawns, fishcake, cockles, and thick noodles.', price: '$4–6' },
  ],

  'Phnom Penh': [
    { name: 'Fish amok',            type: 'Dish',        image: u('1562802378-063ec186a863'), description: 'Cambodia\'s national dish — fish in a fragrant coconut curry mousse steamed in banana leaf.', price: '$4–6' },
    { name: 'Lok lak',              type: 'Dish',        image: u('1565299624946-b28f40a0ae38'), description: 'Stir-fried beef cubes on a bed of lettuce with lime-pepper dipping sauce. Local favourite.', price: '$4–6' },
    { name: 'Nom banh chok',        type: 'Breakfast',   image: u('1540189549336-e6e99eb4b0b9'), description: 'Rice noodles in green curry fish sauce broth with fresh herbs. Breakfast sold from street baskets.', price: '$1' },
    { name: 'Angkor beer',          type: 'Beer',        image: u('1535958850688-6a9ba75bdb54'), description: 'Cambodia\'s own lager — light, refreshing, and very affordable. The national beer.', price: '$1–1.50' },
    { name: 'Sugar cane juice',     type: 'Drink',       image: u('1555993539-1732b0258900'), description: 'Freshly pressed from a street cart with ice and a squeeze of lime. The best $0.50 you\'ll spend.', price: '$0.50' },
    { name: 'Bai sach chrouk',      type: 'Street Food', image: u('1494597706938-d57b7f3f12ce'), description: 'Grilled pork over rice, served with pickled daikon and cucumber broth. Morning street staple.', price: '$1.50' },
  ],

  'Koh Lanta': [
    { name: 'Grilled seafood',      type: 'Dish',        image: u('1562802378-063ec186a863'), description: 'Choose your fish, squid, or prawns fresh from the display — grilled to order at beachfront stalls.', price: '$5–10' },
    { name: 'Massaman curry',       type: 'Dish',        image: u('1565299624946-b28f40a0ae38'), description: 'Slow-cooked curry with potato and peanuts — mild, fragrant, originally from Southern Thailand.', price: '$3–5' },
    { name: 'Coconut pancakes',     type: 'Breakfast',   image: u('1540189549336-e6e99eb4b0b9'), description: 'Thai kanom krok — crispy-edged coconut custard pancakes cooked in a cast-iron pan. Island breakfast.', price: '$1.50' },
    { name: 'Chang beer',           type: 'Beer',        image: u('1535958850688-6a9ba75bdb54'), description: 'Cold, cheap, and goes perfectly with grilled fish at sunset. Every beach bar stocks it.', price: '$1.50' },
    { name: 'Iced lime juice',      type: 'Drink',       image: u('1555993539-1732b0258900'), description: 'Fresh lime juice with a little sugar and salt, poured over crushed ice. Essential in the heat.', price: '$1' },
    { name: 'Pad thai',             type: 'Street Food', image: u('1494597706938-d57b7f3f12ce'), description: 'Wok-fried noodles at the beach night market. Everything tastes better with sand between your toes.', price: '$2' },
  ],

  'Koh Samui': [
    { name: 'Tom kha gai',          type: 'Dish',        image: u('1562802378-063ec186a863'), description: 'Coconut milk soup with galangal, lemongrass, chicken and mushrooms. Comforting and fragrant.', price: '$3–5' },
    { name: 'Pad kra pao',          type: 'Dish',        image: u('1565299624946-b28f40a0ae38'), description: 'Spicy basil stir-fry — every restaurant on the island does a good version. Order it with egg.', price: '$3–4' },
    { name: 'Tropical fruit platter', type: 'Breakfast', image: u('1494597706938-d57b7f3f12ce'), description: 'Rambutan, longan, dragonfruit, papaya — fresh from the market every morning.', price: '$2–3' },
    { name: 'Singha beer',          type: 'Beer',        image: u('1535958850688-6a9ba75bdb54'), description: 'Crisp Thai lager served ice cold at every beach bar. Best at golden hour on Chaweng Beach.', price: '$2' },
    { name: 'Coconut shake',        type: 'Drink',       image: u('1555993539-1732b0258900'), description: 'Blended coconut milk and ice cream with coconut water. Only on Koh Samui. Get two.', price: '$2' },
    { name: 'Seafood BBQ',          type: 'Street Food', image: u('1540189549336-e6e99eb4b0b9'), description: 'Evening seafood markets along the beach — lobster, tiger prawns, whole fish for $5–15.', price: '$5–15' },
  ],

  'Phuket': [
    { name: 'Phuket lobster',       type: 'Dish',        image: u('1562802378-063ec186a863'), description: 'Local Phuket lobster — grilled with butter and garlic at a Rawai or Kata seafood restaurant.', price: '$15–25' },
    { name: 'Mee hokkien',          type: 'Dish',        image: u('1565299624946-b28f40a0ae38'), description: 'Thick yellow noodles in a rich prawn broth — Phuket Old Town speciality from Chinese heritage.', price: '$2.50–4' },
    { name: 'Khao tom',             type: 'Breakfast',   image: u('1540189549336-e6e99eb4b0b9'), description: 'Thai rice congee with fish or pork. Light breakfast eaten at outdoor stalls at 7am in Rawai.', price: '$2' },
    { name: 'Singha beer',          type: 'Beer',        image: u('1535958850688-6a9ba75bdb54'), description: 'Phuket\'s beach bars have buckets of beer on ice. Singha in a bucket costs less than a cocktail.', price: '$2' },
    { name: 'Young coconut',        type: 'Drink',       image: u('1555993539-1732b0258900'), description: 'Sold on every beach by vendors with ice boxes. Cold, sweet, hydrating, and completely natural.', price: '$1' },
    { name: 'Roti with condensed milk', type: 'Street Food', image: u('1494597706938-d57b7f3f12ce'), description: 'Thai roti cooked on a griddle until crispy, then drowned in condensed milk and banana. Late night.', price: '$1.50' },
  ],

  // ─── Central America & Mexico ────────────────────────────────────────────────

  'Mexico City': [
    { name: 'Tacos al pastor',      type: 'Street Food', image: u('1565299624946-b28f40a0ae38'), description: 'Marinated pork shaved from a trompo spit, with pineapple, onion, coriander. The CDMX staple.', price: '$0.50/taco' },
    { name: 'Chilaquiles',          type: 'Breakfast',   image: u('1540189549336-e6e99eb4b0b9'), description: 'Fried tortilla chips simmered in green or red salsa, topped with cream, cheese, and egg.', price: '$5–8' },
    { name: 'Mole negro',           type: 'Dish',        image: u('1562802378-063ec186a863'), description: 'Slow-cooked sauce of 30+ ingredients including chocolate and chilli. Served over turkey or chicken.', price: '$8–12' },
    { name: 'Victoria cerveza',     type: 'Beer',        image: u('1535958850688-6a9ba75bdb54'), description: 'CDMX\'s beloved amber lager. Drink it from the bottle with a squeeze of lime and a pinch of salt.', price: '$1–2' },
    { name: 'Agua fresca',          type: 'Drink',       image: u('1555993539-1732b0258900'), description: 'Fresh juice blended with water and a little sugar — hibiscus, tamarind, watermelon. From $0.50.', price: '$0.50–1' },
    { name: 'Torta ahogada',        type: 'Street Food', image: u('1494597706938-d57b7f3f12ce'), description: '"Drowned sandwich" — a crusty roll stuffed with carnitas, then submerged in a fiery chile sauce.', price: '$3–5' },
  ],

  'Playa del Carmen': [
    { name: 'Cochinita pibil tacos', type: 'Dish',       image: u('1562802378-063ec186a863'), description: 'Slow-roasted Yucatan pork with pickled onion and habanero. The Mayan taco. Unmissable.', price: '$1.50/taco' },
    { name: 'Ceviche',              type: 'Dish',        image: u('1565299624946-b28f40a0ae38'), description: 'Fresh fish marinated in lime juice with tomato, onion, coriander and jalapeño. Eat on 5th Ave.', price: '$8–12' },
    { name: 'Huevos rancheros',     type: 'Breakfast',   image: u('1540189549336-e6e99eb4b0b9'), description: 'Eggs on a corn tortilla, smothered in salsa roja with black beans and avocado. The local breakfast.', price: '$4–7' },
    { name: 'Modelo Especial',      type: 'Beer',        image: u('1535958850688-6a9ba75bdb54'), description: 'Mexico\'s most popular export beer. Ice cold with lime on the beach or at a rooftop bar.', price: '$2–3' },
    { name: 'Horchata',             type: 'Drink',       image: u('1555993539-1732b0258900'), description: 'Sweet cinnamon-rice milk served ice cold. The best non-alcoholic drink on the Yucatan peninsula.', price: '$1' },
    { name: 'Elote',                type: 'Street Food', image: u('1494597706938-d57b7f3f12ce'), description: 'Corn on the cob or in a cup, smothered in mayo, chilli powder, lime, and cotija cheese.', price: '$2' },
  ],

  'Oaxaca': [
    { name: 'Tlayuda',              type: 'Dish',        image: u('1562802378-063ec186a863'), description: 'Giant crispy tortilla base spread with black beans, Oaxacan cheese, meat and toppings. A full meal.', price: '$4–7' },
    { name: 'Mole negro',           type: 'Dish',        image: u('1565299624946-b28f40a0ae38'), description: 'Oaxaca is the home of mole. 7 types — negro is the most complex and the one you came for.', price: '$8–14' },
    { name: 'Memelas at the market', type: 'Breakfast',  image: u('1540189549336-e6e99eb4b0b9'), description: 'Thick oval masa cakes topped with black beans and cheese, from the Mercado Benito Juárez at 8am.', price: '$1.50' },
    { name: 'Mezcal',               type: 'Drink',       image: u('1535958850688-6a9ba75bdb54'), description: 'Oaxaca is the mezcal capital of the world. Sip it neat — smoky, complex, and consumed here with an orange slice and sal de gusano.', price: '$3–6' },
    { name: 'Tejate',               type: 'Drink',       image: u('1555993539-1732b0258900'), description: 'Pre-Hispanic drink made from maize, cacao, rosita de cacao, and mamey seed. Frothy and cool.', price: '$1' },
    { name: 'Chapulines',           type: 'Street Food', image: u('1494597706938-d57b7f3f12ce'), description: 'Toasted grasshoppers seasoned with lime and chilli. The Oaxacan snack. Try them on a tlayuda.', price: '$2–4' },
  ],

  // ─── South America ───────────────────────────────────────────────────────────

  'Medellín': [
    { name: 'Bandeja paisa',        type: 'Dish',        image: u('1562802378-063ec186a863'), description: 'Colombia\'s most iconic plate — rice, beans, chicharrón, ground beef, egg, chorizo, avocado, arepa.', price: '$5–8' },
    { name: 'Arepa con todo',       type: 'Street Food', image: u('1565299624946-b28f40a0ae38'), description: 'Thick corn cake loaded with egg, cheese, and hogao (tomato sauce). Classic Medellín street food.', price: '$2–3' },
    { name: 'Changua',              type: 'Breakfast',   image: u('1540189549336-e6e99eb4b0b9'), description: 'Warm milk soup with poached egg and stale bread. Sounds odd. Tastes comforting. Traditional Antioquian breakfast.', price: '$2' },
    { name: 'Aguila beer',          type: 'Beer',        image: u('1535958850688-6a9ba75bdb54'), description: 'Colombia\'s classic lager. Light and easy. Cold Aguila in Parque Lleras is a Medellín rite of passage.', price: '$1.50–2' },
    { name: 'Tinto',                type: 'Drink',       image: u('1509042239860-f550ce710b93'), description: 'Small cup of black Colombian coffee — strong, sweet, served in a tiny cup. Every Colombian\'s fuel.', price: '$0.30' },
    { name: 'Empanadas',            type: 'Street Food', image: u('1494597706938-d57b7f3f12ce'), description: 'Fried corn dough pockets stuffed with potato and meat. Best from a cart in El Poblado at midnight.', price: '$0.50' },
  ],

  'Bogotá': [
    { name: 'Ajiaco',               type: 'Dish',        image: u('1562802378-063ec186a863'), description: 'Bogotá\'s signature soup — three types of potato, chicken, corn, and guascas herb. Warming and thick.', price: '$5–8' },
    { name: 'Changua',              type: 'Breakfast',   image: u('1540189549336-e6e99eb4b0b9'), description: 'Andean milk and egg soup. Bogotá gets cold — this warm, simple breakfast makes sense at 2,600m.', price: '$2.50' },
    { name: 'Mazorca asada',        type: 'Street Food', image: u('1565299624946-b28f40a0ae38'), description: 'Grilled corn rubbed with butter and cream cheese, sold from carts on every major street corner.', price: '$1.50' },
    { name: 'Club Colombia',        type: 'Beer',        image: u('1535958850688-6a9ba75bdb54'), description: 'Colombia\'s premium lager — cleaner and crispier than Águila. The Bogotá business crowd\'s choice.', price: '$2–3' },
    { name: 'Tinto',                type: 'Drink',       image: u('1509042239860-f550ce710b93'), description: 'Black Colombian coffee in a small cup. Offered everywhere — restaurants, friends\' homes, meetings.', price: '$0.30' },
    { name: 'Aguardiente',          type: 'Drink',       image: u('1555993539-1732b0258900'), description: 'Anise-flavoured Colombian spirit. The national drink. Very cheap, very social, handle with care.', price: '$1/shot' },
  ],

  'Cartagena': [
    { name: 'Ceviche de camarones', type: 'Dish',        image: u('1562802378-063ec186a863'), description: 'Caribbean-style shrimp ceviche — sweeter and coconut-forward than Pacific versions. Perfect in the heat.', price: '$4–7' },
    { name: 'Patacones',            type: 'Street Food', image: u('1565299624946-b28f40a0ae38'), description: 'Double-fried green plantain, smashed flat and crispy. Topped with shrimp, hogao, or guacamole.', price: '$2–4' },
    { name: 'Arepa de huevo',       type: 'Breakfast',   image: u('1540189549336-e6e99eb4b0b9'), description: 'Deep-fried arepa stuffed with a whole egg inside. A Cartagena breakfast street food classic.', price: '$1' },
    { name: 'Águila beer',          type: 'Beer',        image: u('1535958850688-6a9ba75bdb54'), description: 'Cold Águila in the shade of the walled city. The only appropriate response to 35°C heat.', price: '$1.50' },
    { name: 'Corozo juice',         type: 'Drink',       image: u('1555993539-1732b0258900'), description: 'Tart tropical berry juice unique to the Colombian Caribbean coast. Brilliant colour, refreshing.', price: '$1' },
    { name: 'Arroz con coco',       type: 'Dish',        image: u('1494597706938-d57b7f3f12ce'), description: 'Coconut rice — slightly sweet, slightly caramelised, served with every seafood dish on the coast.', price: 'Side' },
  ],

  'Rio': [
    { name: 'Açaí bowl',            type: 'Breakfast',   image: u('1494597706938-d57b7f3f12ce'), description: 'Blended açaí berry, thick and unsweetened, topped with granola, banana, and guaraná syrup.', price: '$4–7' },
    { name: 'Churrasco',            type: 'Dish',        image: u('1562802378-063ec186a863'), description: 'Brazilian grilled beef — picanha is the cut. A rodízio churrascaria for all-you-can-eat.', price: '$15–25' },
    { name: 'Pão de queijo',        type: 'Street Food', image: u('1565299624946-b28f40a0ae38'), description: 'Chewy, cheesy tapioca bread balls — served warm at every café and bakery every morning.', price: '$0.50' },
    { name: 'Brahma beer',          type: 'Beer',        image: u('1535958850688-6a9ba75bdb54'), description: 'Brazil\'s most-drunk lager. Ice cold in a can on Ipanema beach — the Rio experience in a sip.', price: '$2–3' },
    { name: 'Caipirinha',           type: 'Drink',       image: u('1555993539-1732b0258900'), description: 'Cachaça, lime, and sugar — Brazil\'s national cocktail. First one on the beach at sunset. Always.', price: '$4–6' },
    { name: 'Pastel',               type: 'Street Food', image: u('1540189549336-e6e99eb4b0b9'), description: 'Deep-fried pastry stuffed with cheese, meat, or shrimp. The most popular street snack in Brazil.', price: '$1.50' },
  ],

  'Buenos Aires': [
    { name: 'Asado',                type: 'Dish',        image: u('1562802378-063ec186a863'), description: 'Argentine BBQ is a ritual — slow-cooked over wood embers, everything from ribs to offal. Sunday institution.', price: '$12–20 with wine' },
    { name: 'Medialunas',           type: 'Breakfast',   image: u('1540189549336-e6e99eb4b0b9'), description: 'Buttery Argentine croissants, sweeter than French, smaller — eaten with café con leche every morning.', price: '$0.30 each' },
    { name: 'Empanadas',            type: 'Street Food', image: u('1565299624946-b28f40a0ae38'), description: 'Oven-baked dough pockets stuffed with spiced beef, olives and egg. From $0.50 at any panadería.', price: '$0.50–1' },
    { name: 'Quilmes beer',         type: 'Beer',        image: u('1535958850688-6a9ba75bdb54'), description: 'Argentina\'s national lager, crisp and cold. Ordered in a litre-bottle at any parrilla.', price: '$2' },
    { name: 'Malbec',               type: 'Drink',       image: u('1555993539-1732b0258900'), description: 'Mendoza Malbec is world-class and costs almost nothing in BA. House wine at $3 a glass is excellent.', price: '$3–8/glass' },
    { name: 'Dulce de leche',       type: 'Dessert',     image: u('1494597706938-d57b7f3f12ce'), description: 'Caramelised milk spread eaten with everything — toast, ice cream, alfajores, medialunas. Everywhere.', price: '$0.50' },
  ],

  'Santiago': [
    { name: 'Cazuela',              type: 'Dish',        image: u('1562802378-063ec186a863'), description: 'Chilean beef or chicken stew with potato, corn, and pumpkin. Winter comfort food. Served daily at lunch.', price: '$5–8' },
    { name: 'Completo',             type: 'Street Food', image: u('1565299624946-b28f40a0ae38'), description: 'Chilean hot dog loaded with avocado, mayo and tomato. Massive. Cheap. Delicious. Great after drinks.', price: '$2–3' },
    { name: 'Pan con palta',        type: 'Breakfast',   image: u('1540189549336-e6e99eb4b0b9'), description: 'Toast with avocado — Chile\'s everyday breakfast, long before avocado toast was a trend. Perfect.', price: '$3' },
    { name: 'Cristal beer',         type: 'Beer',        image: u('1535958850688-6a9ba75bdb54'), description: 'Chile\'s most popular lager — light, fizzy, goes with everything. Ask for a schop (draught) at any bar.', price: '$2–3' },
    { name: 'Carménère wine',       type: 'Drink',       image: u('1555993539-1732b0258900'), description: 'Chile\'s signature grape — a lost Bordeaux variety found growing here. A glass of good Carménère for $3.', price: '$3–6/glass' },
    { name: 'Sopaipillas',          type: 'Street Food', image: u('1494597706938-d57b7f3f12ce'), description: 'Fried pumpkin dough rounds sold from carts when it rains. Eaten with pebre or mustard. Winter street food.', price: '$0.50' },
  ],

  'Montevideo': [
    { name: 'Chivito',              type: 'Dish',        image: u('1562802378-063ec186a863'), description: 'Uruguay\'s iconic steak sandwich — churrasco, ham, cheese, egg, lettuce, tomato in a soft roll. Enormous.', price: '$6–10' },
    { name: 'Asado',                type: 'Dish',        image: u('1565299624946-b28f40a0ae38'), description: 'Uruguay\'s beef quality rivals Argentina. Weekend asado at the family table is a national ritual.', price: '$12–18 with wine' },
    { name: 'Medialunas',           type: 'Breakfast',   image: u('1540189549336-e6e99eb4b0b9'), description: 'Same buttery Argentine croissant. Every Montevideo cafe opens with a basket of them. Unmissable at 8am.', price: '$0.40 each' },
    { name: 'Patricia beer',        type: 'Beer',        image: u('1535958850688-6a9ba75bdb54'), description: 'Uruguay\'s own lager — smooth, light, and very local. Order it at any bodegón by the Rambla.', price: '$2–3' },
    { name: 'Mate',                 type: 'Drink',       image: u('1555993539-1732b0258900'), description: 'Uruguay\'s national obsession — bitter herbal tea sipped through a metal straw, passed among friends all day.', price: 'Free (social)' },
    { name: 'Torta frita',          type: 'Street Food', image: u('1494597706938-d57b7f3f12ce'), description: 'Fried dough discs sold from carts when it rains. Dusted with sugar. Uruguay\'s version of sopapillas.', price: '$0.50' },
  ],

  'Lima': [
    { name: 'Ceviche',              type: 'Dish',        image: u('1562802378-063ec186a863'), description: 'Lima invented ceviche as we know it — fresh fish cured in lime, ají amarillo, onion, salt. Elite.', price: '$6–12' },
    { name: 'Lomo saltado',         type: 'Dish',        image: u('1565299624946-b28f40a0ae38'), description: 'Chinese-Peruvian stir-fried beef with onion, tomato, and chips. Lima\'s fusion classic.', price: '$6–10' },
    { name: 'Pan con chicharrón',   type: 'Breakfast',   image: u('1540189549336-e6e99eb4b0b9'), description: 'Slow-fried pork in a crusty bread roll with sweet potato and salsa criolla. The Lima breakfast.', price: '$3–5' },
    { name: 'Cristal beer',         type: 'Beer',        image: u('1535958850688-6a9ba75bdb54'), description: 'Peru\'s most popular lager — cold Cristal pairs perfectly with ceviche at a Lima cevichería.', price: '$2–3' },
    { name: 'Inca Kola',            type: 'Drink',       image: u('1555993539-1732b0258900'), description: 'Peru\'s neon-yellow bubble gum soda. More popular than Coca-Cola here. Try it once — you\'ll understand.', price: '$0.80' },
    { name: 'Pisco sour',           type: 'Drink',       image: u('1494597706938-d57b7f3f12ce'), description: 'Grape brandy shaken with lime, egg white, syrup, and bitters. The national cocktail. Always happy hour somewhere.', price: '$4–7' },
  ],

  'São Paulo': [
    { name: 'Feijoada',             type: 'Dish',        image: u('1562802378-063ec186a863'), description: 'Brazil\'s soul food — black beans slow-cooked with every cut of pork. Served Saturdays with caipirinha.', price: '$8–15' },
    { name: 'Coxinha',              type: 'Street Food', image: u('1565299624946-b28f40a0ae38'), description: 'Teardrop-shaped fried dough stuffed with shredded chicken and catupiry cheese. The Brazilian snack.', price: '$1' },
    { name: 'Tapioca pancake',      type: 'Breakfast',   image: u('1540189549336-e6e99eb4b0b9'), description: 'Cassava-flour crepe filled with coconut or cheese — gluten-free, light, sold on every street in Pinheiros.', price: '$2' },
    { name: 'Brahma beer',          type: 'Beer',        image: u('1535958850688-6a9ba75bdb54'), description: 'Brazil\'s iconic amber lager. Cold Brahma at a boteco in Vila Madalena is a Sunday ritual.', price: '$2–3' },
    { name: 'Guaraná Antarctica',   type: 'Drink',       image: u('1555993539-1732b0258900'), description: 'Brazil\'s beloved guaraná berry soda — sweet, slightly herbal, absolutely everywhere.', price: '$1' },
    { name: 'Pastel',               type: 'Street Food', image: u('1494597706938-d57b7f3f12ce'), description: 'SP\'s street food king — enormous deep-fried pastry from the Feira da Liberdade Japanese market.', price: '$2' },
  ],

  // ─── Southern Europe ─────────────────────────────────────────────────────────

  'Lisbon': [
    { name: 'Pastel de nata',       type: 'Dessert',     image: u('1562802378-063ec186a863'), description: 'Flaky pastry shell with a creamy, slightly caramelised egg custard inside. From Pastéis de Belém.', price: '€1.30' },
    { name: 'Bacalhau à brás',      type: 'Dish',        image: u('1565299624946-b28f40a0ae38'), description: 'Shredded salted cod with scrambled egg, potato sticks and olives. The definitive Portuguese dish.', price: '€9–14' },
    { name: 'Tosta mista',          type: 'Breakfast',   image: u('1540189549336-e6e99eb4b0b9'), description: 'Grilled ham and cheese toast — the default Portuguese breakfast, ordered at any café for €2.', price: '€2' },
    { name: 'Super Bock',           type: 'Beer',        image: u('1535958850688-6a9ba75bdb54'), description: 'Portugal\'s beloved lager. A cold imperial (small draught) on a terrace in Alfama is a Lisbon staple.', price: '€1.50–2.50' },
    { name: 'Galão',                type: 'Drink',       image: u('1509042239860-f550ce710b93'), description: 'Portuguese latte — espresso with lots of foamy milk, served in a tall glass. Morning in every café.', price: '€1.50' },
    { name: 'Bifanas',              type: 'Street Food', image: u('1494597706938-d57b7f3f12ce'), description: 'Marinated pork in a crusty roll with mustard and piri-piri sauce. The Lisbon street snack.', price: '€2.50' },
  ],

  'Porto': [
    { name: 'Francesinha',          type: 'Dish',        image: u('1562802378-063ec186a863'), description: 'Porto\'s iconic sandwich — stacked meats under melted cheese and a beer-based spicy sauce. Enormous.', price: '€9–14' },
    { name: 'Bacalhau',             type: 'Dish',        image: u('1565299624946-b28f40a0ae38'), description: '365 ways to cook salted cod — the Portuguese say one for every day of the year. Bacalhau com natas is the classic.', price: '€8–12' },
    { name: 'Tosta mista',          type: 'Breakfast',   image: u('1540189549336-e6e99eb4b0b9'), description: 'Ham and cheese toast — same as Lisbon, just better when eaten watching the Douro from the lower city.', price: '€2' },
    { name: 'Super Bock',           type: 'Beer',        image: u('1535958850688-6a9ba75bdb54'), description: 'Super Bock is brewed in Porto. A cold one on the Ribeira quayside at sunset is mandatory.', price: '€1.50–2.50' },
    { name: 'Port wine',            type: 'Drink',       image: u('1555993539-1732b0258900'), description: 'Port is made across the river in Vila Nova de Gaia — do a tasting at any lodge. White Port on ice as an aperitif.', price: '€2–5/glass' },
    { name: 'Tripas à moda do Porto', type: 'Dish',      image: u('1494597706938-d57b7f3f12ce'), description: 'Tripe with white beans — Porto\'s dish so famous that locals are still called "tripeiros" (tripe-eaters).', price: '€7–10' },
  ],

  'Barcelona': [
    { name: 'Pan con tomate',       type: 'Breakfast',   image: u('1540189549336-e6e99eb4b0b9'), description: 'Toasted bread rubbed with ripe tomato, drizzled with olive oil and salt. The Catalan breakfast ritual.', price: '€2–4' },
    { name: 'Patatas bravas',       type: 'Street Food', image: u('1565299624946-b28f40a0ae38'), description: 'Fried potato cubes with aioli and a spicy brava sauce. Ordered at every bar in Barcelona. Always.', price: '€4–6' },
    { name: 'Croquetes de jamón',   type: 'Street Food', image: u('1562802378-063ec186a863'), description: 'Crispy breadcrumbed béchamel croquettes with jamón ibérico. The best tapa in Spain, full stop.', price: '€1–2 each' },
    { name: 'Estrella Damm',        type: 'Beer',        image: u('1535958850688-6a9ba75bdb54'), description: 'Barcelona\'s local lager — brewed here since 1876. Ice cold with tapas in the Born or Gràcia.', price: '€2–4' },
    { name: 'Cava',                 type: 'Drink',       image: u('1555993539-1732b0258900'), description: 'Catalan sparkling wine — as good as Champagne, half the price. A glass at a terrace bar from €4.', price: '€4–7/glass' },
    { name: 'Bocadillo de calamares', type: 'Dish',      image: u('1494597706938-d57b7f3f12ce'), description: 'Crispy fried squid rings in a crusty roll, nothing else. The simplest and most satisfying lunch.', price: '€3–5' },
  ],

  'Valencia': [
    { name: 'Paella Valenciana',    type: 'Dish',        image: u('1562802378-063ec186a863'), description: 'The original paella — rabbit, chicken, green beans, bomba rice, saffron. Cooked outside over orange-wood fire.', price: '€12–18' },
    { name: 'Horchata and fartons', type: 'Drink',       image: u('1555993539-1732b0258900'), description: 'Tiger nut milk served ice cold with sweet elongated pastry for dipping. Valencia\'s iconic afternoon snack.', price: '€2.50' },
    { name: 'Pan con tomate',       type: 'Breakfast',   image: u('1540189549336-e6e99eb4b0b9'), description: 'Same as Barcelona — tomato and oil on toast, Valencia\'s daily breakfast. Every corner café.', price: '€2–3' },
    { name: 'Amstel Valencia',      type: 'Beer',        image: u('1535958850688-6a9ba75bdb54'), description: 'Amstel is brewed locally in Valencia — and Valencians will insist the local version is the best in the world.', price: '€2–3' },
    { name: 'Agua de Valencia',     type: 'Drink',       image: u('1494597706938-d57b7f3f12ce'), description: 'Valencia\'s unofficial cocktail — Cava, OJ, vodka, and gin in a big pitcher. Dangerous and delicious.', price: '€5–8' },
    { name: 'Fideuà',               type: 'Dish',        image: u('1565299624946-b28f40a0ae38'), description: 'Short pasta noodles cooked like paella with seafood in a rich fish stock. Arguably better than paella.', price: '€12–16' },
  ],

  // ─── Balkans & Eastern Europe ────────────────────────────────────────────────

  'Split': [
    { name: 'Peka',                 type: 'Dish',        image: u('1562802378-063ec186a863'), description: 'Lamb, vegetables and potatoes slow-cooked under an iron bell covered in embers. Order a day ahead.', price: '€12–18' },
    { name: 'Grilled fish',         type: 'Dish',        image: u('1565299624946-b28f40a0ae38'), description: 'Whole sea bream or sea bass grilled with olive oil, garlic, lemon and blitva (chard). Simply perfect.', price: '€15–25' },
    { name: 'Burek',                type: 'Breakfast',   image: u('1540189549336-e6e99eb4b0b9'), description: 'Flaky phyllo pastry filled with cheese or meat, eaten with plain yoghurt. Breakfast in the Balkans.', price: '€1.50–2.50' },
    { name: 'Karlovačko beer',      type: 'Beer',        image: u('1535958850688-6a9ba75bdb54'), description: 'Croatia\'s popular lager from Karlovac. Cold on the Riva promenade watching the Adriatic.', price: '€2.50–4' },
    { name: 'Gemišt',               type: 'Drink',       image: u('1555993539-1732b0258900'), description: 'White wine mixed with sparkling water — the Dalmatian spritzer. Drunk all day in Split.', price: '€3–4' },
    { name: 'Fresh oysters',        type: 'Dish',        image: u('1494597706938-d57b7f3f12ce'), description: 'Ston oysters from the Pelješac peninsula — wild-farmed, plump, and briny. €1 each at the market.', price: '€1 each' },
  ],

  'Dubrovnik': [
    { name: 'Crni rižot',           type: 'Dish',        image: u('1562802378-063ec186a863'), description: 'Black risotto — rice cooked with squid and squid ink. Deeply savoury and uniquely Dalmatian.', price: '€12–16' },
    { name: 'Grilled fish',         type: 'Dish',        image: u('1565299624946-b28f40a0ae38'), description: 'Fresh Adriatic fish grilled with olive oil and sea salt. Everything in the sea here is edible and good.', price: '€14–22' },
    { name: 'Burek',                type: 'Breakfast',   image: u('1540189549336-e6e99eb4b0b9'), description: 'Cheese or meat phyllo pastry — available early morning from bakeries just outside the old city walls.', price: '€2' },
    { name: 'Karlovačko beer',      type: 'Beer',        image: u('1535958850688-6a9ba75bdb54'), description: 'Croatian lager — get a cold one from a corner shop and find a wall to sit on overlooking the sea.', price: '€2–4' },
    { name: 'Prošek',               type: 'Drink',       image: u('1555993539-1732b0258900'), description: 'Dalmatian sweet dessert wine made from dried grapes. Small glass after a seafood meal. Local tradition.', price: '€3–5' },
    { name: 'Soparnik',             type: 'Street Food', image: u('1494597706938-d57b7f3f12ce'), description: 'Flat pastry filled with Swiss chard, olive oil and garlic. Traditional Dalmatian peasant food, now a delicacy.', price: '€3–5' },
  ],

  'Athens': [
    { name: 'Souvlaki',             type: 'Street Food', image: u('1562802378-063ec186a863'), description: 'Grilled pork skewers in a warm pita with tomato, onion, tzatziki and chips. The Athenian fast food.', price: '€2.50–3.50' },
    { name: 'Greek salad',          type: 'Dish',        image: u('1565299624946-b28f40a0ae38'), description: 'Tomato, cucumber, olives, green pepper, and a whole slab of feta with olive oil. The best version is in Athens.', price: '€5–8' },
    { name: 'Spanakopita',          type: 'Breakfast',   image: u('1540189549336-e6e99eb4b0b9'), description: 'Spinach and feta in flaky phyllo — from every corner bakery for breakfast or a mid-morning snack.', price: '€1.50–2.50' },
    { name: 'Mythos beer',          type: 'Beer',        image: u('1535958850688-6a9ba75bdb54'), description: 'Greece\'s most popular lager — light, clean, always cold. Best at a rooftop bar with the Acropolis lit up.', price: '€3–5' },
    { name: 'Frappe',               type: 'Drink',       image: u('1509042239860-f550ce710b93'), description: 'Greek iced coffee — instant espresso shaken with water and ice, served in a tall glass. The national drink.', price: '€1.50–2.50' },
    { name: 'Loukoumades',          type: 'Dessert',     image: u('1494597706938-d57b7f3f12ce'), description: 'Ancient Greek honey puffs — fried dough balls drizzled with thyme honey and crushed walnuts.', price: '€4–6' },
  ],

  'Budapest': [
    { name: 'Goulash',              type: 'Dish',        image: u('1562802378-063ec186a863'), description: 'Beef and paprika stew — rich, warming, and the origin of the word "goulash" everywhere else.', price: '€4–8' },
    { name: 'Lángos',               type: 'Street Food', image: u('1565299624946-b28f40a0ae38'), description: 'Deep-fried dough slathered in sour cream and grated cheese. The Budapest street food classic.', price: '€2–3.50' },
    { name: 'Rétes',                type: 'Breakfast',   image: u('1540189549336-e6e99eb4b0b9'), description: 'Hungarian strudel — thin pastry filled with apple and cinnamon or sour cherry. From every pékség (bakery).', price: '€1.50' },
    { name: 'Dreher beer',          type: 'Beer',        image: u('1535958850688-6a9ba75bdb54'), description: 'Budapest\'s own lager, brewed here since 1854. Cold pint in a ruin bar in the Jewish Quarter.', price: '€2–4' },
    { name: 'Unicum',               type: 'Drink',       image: u('1555993539-1732b0258900'), description: 'Hungary\'s legendary herbal bitters — 40 herbs, aged in oak barrels. Sip before or after a meal.', price: '€2–3/shot' },
    { name: 'Kürtős kalács',        type: 'Dessert',     image: u('1494597706938-d57b7f3f12ce'), description: 'Chimney cake — sweet dough wound around a wooden spit, grilled over coals and rolled in cinnamon sugar.', price: '€3–4' },
  ],

  'Prague': [
    { name: 'Svíčková',             type: 'Dish',        image: u('1562802378-063ec186a863'), description: 'Slow-braised beef in creamy root vegetable sauce, served with bread dumplings and cranberry jam.', price: '€6–10' },
    { name: 'Trdelník',             type: 'Street Food', image: u('1565299624946-b28f40a0ae38'), description: 'Cinnamon sugar spit cake — a Prague Old Town constant. Touristy but still warm and delicious.', price: '€2–4' },
    { name: 'Chlebíčky',            type: 'Breakfast',   image: u('1540189549336-e6e99eb4b0b9'), description: 'Open-faced baguette topped with cream cheese, ham, egg, and pickled veg. Czech delicatessen staple.', price: '€1.50–3' },
    { name: 'Pilsner Urquell',      type: 'Beer',        image: u('1535958850688-6a9ba75bdb54'), description: 'The original pilsner — invented in Czech Republic. Cold pint in Prague for €1.50. Better than anywhere.', price: '€1.50–3' },
    { name: 'Svařák',               type: 'Drink',       image: u('1555993539-1732b0258900'), description: 'Czech mulled wine spiced with cinnamon and star anise. Sold from street stalls in winter. Warming.', price: '€2' },
    { name: 'Smažený sýr',          type: 'Street Food', image: u('1494597706938-d57b7f3f12ce'), description: 'Fried cheese in breadcrumbs with tartare sauce — the late-night staple across Czech Republic. €3.', price: '€3–4' },
  ],

  'Berlin': [
    { name: 'Döner kebab',          type: 'Street Food', image: u('1562802378-063ec186a863'), description: 'Berlin\'s own invention — thick spiced meat, salad, red cabbage and garlic sauce in a grilled pita.', price: '€5–7' },
    { name: 'Currywurst',           type: 'Street Food', image: u('1565299624946-b28f40a0ae38'), description: 'Sliced pork sausage drowned in curried ketchup, served with chips. The Berlin street food icon.', price: '€3–5' },
    { name: 'Brötchen',             type: 'Breakfast',   image: u('1540189549336-e6e99eb4b0b9'), description: 'German bread rolls from the bakery every morning — dense, chewy, eaten with cold cuts and cheese.', price: '€1–2' },
    { name: 'Berliner Kindl',       type: 'Beer',        image: u('1535958850688-6a9ba75bdb54'), description: 'Berlin\'s local Pilsner — cold from a kiosk at a street corner or from a club at 7am.', price: '€1.50–4' },
    { name: 'Club-Mate',            type: 'Drink',       image: u('1555993539-1732b0258900'), description: 'Berlin\'s caffeine-infused mate soda — the late-night co-working fuel. Comes in every Späti (corner store).', price: '€1.50' },
    { name: 'Flammkuchen',          type: 'Dish',        image: u('1494597706938-d57b7f3f12ce'), description: 'Alsatian thin-crust tart with crème fraîche, onions, and lardons. On every German restaurant menu.', price: '€8–12' },
  ],

  'Amsterdam': [
    { name: 'Bitterballen',         type: 'Street Food', image: u('1562802378-063ec186a863'), description: 'Deep-fried crispy ragout balls — the Dutch beer snack. Always with mustard. Every bar in the city.', price: '€5–8 (portion)' },
    { name: 'Stroopwafel',          type: 'Dessert',     image: u('1565299624946-b28f40a0ae38'), description: 'Two thin waffles sandwiched with caramel syrup. Warm from the Albert Cuyp market on a cold morning.', price: '€1' },
    { name: 'Uitsmijter',           type: 'Breakfast',   image: u('1540189549336-e6e99eb4b0b9'), description: 'Open-faced bread with fried eggs and ham or cheese. The Dutch brunch staple.', price: '€8–12' },
    { name: 'Heineken',             type: 'Beer',        image: u('1535958850688-6a9ba75bdb54'), description: 'Brewed in Amsterdam since 1873. Cold from a brown café (bruin café) on a canal. €4 a glass.', price: '€4–5' },
    { name: 'Jenever',              type: 'Drink',       image: u('1555993539-1732b0258900'), description: 'Dutch gin — older and more complex than London dry. Sip from a traditional tulip glass at a proeflokaal.', price: '€3–5/shot' },
    { name: 'Indonesian rijsttafel', type: 'Dish',       image: u('1494597706938-d57b7f3f12ce'), description: 'A feast of 15–25 Indonesian small dishes — Amsterdam\'s colonial-era gift to Dutch cuisine. Full Saturday dinner.', price: '€20–30' },
  ],

  'Florence': [
    { name: 'Bistecca Fiorentina',  type: 'Dish',        image: u('1562802378-063ec186a863'), description: 'T-bone from Chianina cattle, grilled rare over charcoal, seasoned with salt and olive oil. Always for two.', price: '€40–60 (shared)' },
    { name: 'Lampredotto',          type: 'Street Food', image: u('1565299624946-b28f40a0ae38'), description: 'Slow-cooked tripe sandwich in a crusty roll, dipped in broth. Florence\'s street food, from Nerbone at the market.', price: '€3.50–5' },
    { name: 'Cornetto and cappuccino', type: 'Breakfast', image: u('1540189549336-e6e99eb4b0b9'), description: 'Italian ritual — croissant and cappuccino at the bar, standing up. €2.50 total. Do not sit down.', price: '€2.50' },
    { name: 'Peroni Nastro Azzurro', type: 'Beer',       image: u('1535958850688-6a9ba75bdb54'), description: 'Italy\'s premium lager. Cold Peroni at an Oltrarno enoteca terrace on a warm evening.', price: '€3–5' },
    { name: 'Chianti Classico',     type: 'Drink',       image: u('1555993539-1732b0258900'), description: 'Made in the hills 30 minutes from here. A glass of house Chianti at lunch costs €3. This is life.', price: '€3–6/glass' },
    { name: 'Gelato',               type: 'Dessert',     image: u('1494597706938-d57b7f3f12ce'), description: 'Real Florentine gelato — denser and more intense than anywhere else. Go to Gelateria dei Neri in Oltrarno.', price: '€2.50–3.50' },
  ],

  'Seville': [
    { name: 'Jamón ibérico',        type: 'Dish',        image: u('1562802378-063ec186a863'), description: 'Acorn-fed Iberian ham, sliced paper-thin. A tapa plate with bread and manchego cheese. Nothing better.', price: '€6–12' },
    { name: 'Tapas round',          type: 'Street Food', image: u('1565299624946-b28f40a0ae38'), description: 'In Seville, tapas come free with drinks at many bars. Three bars, three rounds — you\'ve had dinner for €10.', price: 'Free–€3 each' },
    { name: 'Tostada con aceite',   type: 'Breakfast',   image: u('1540189549336-e6e99eb4b0b9'), description: 'Grilled bread with olive oil and either tomato paste or Seville orange jam. €2 at any local bar at 9am.', price: '€2' },
    { name: 'Cruzcampo',            type: 'Beer',        image: u('1535958850688-6a9ba75bdb54'), description: 'Seville\'s own lager, brewed here since 1904. Ice cold caña (small draught) in the Triana neighbourhood.', price: '€1.50–2.50' },
    { name: 'Tinto de verano',      type: 'Drink',       image: u('1555993539-1732b0258900'), description: 'Red wine mixed with lemon Fanta and ice — cheaper than sangria, equally refreshing in 40°C heat.', price: '€2–3' },
    { name: 'Churros con chocolate', type: 'Dessert',    image: u('1494597706938-d57b7f3f12ce'), description: 'Thick fried dough sticks dipped in a cup of thick hot chocolate. Order at La Campana on a Sunday morning.', price: '€4–6' },
  ],
};
