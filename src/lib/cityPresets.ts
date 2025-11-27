export type CityPreset = {
  city: string;
  country: string;
  flag: string;
  budgetCoins: 1 | 2 | 3;
  tags: string[];
  imageUrl: string;
  highlights: {
    places: string[];
    accommodation: string;
    activities: string[];
    notesHint: string;
  };
  weather: {
    avgTemp: string;
    bestMonths: string;
    climate: 'tropical' | 'mediterranean' | 'temperate' | 'dry';
  };
  costs: {
    accommodation: string;
    coworking: string;
    meals: string;
    monthlyTotal: string;
  };
  nomadScore: number;
  internetSpeed: string;
};

export type RegionKey = 'europe' | 'latin-america' | 'southeast-asia';

export const REGION_HUBS: Record<RegionKey, string[]> = {
  europe: ['Lisbon', 'Barcelona', 'Split'],
  'latin-america': ['Mexico City', 'Medellín', 'Rio'],
  'southeast-asia': ['Bali (Canggu)', 'Chiang Mai', 'Da Nang'],
};

export const CITY_PRESETS: Record<RegionKey, CityPreset[]> = {
  europe: [
    {
      city: 'Lisbon',
      country: 'Portugal',
      flag: '🇵🇹',
      budgetCoins: 2,
      tags: ['coastal', 'culture', 'nightlife'],
      imageUrl: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800&auto=format&fit=crop',
      highlights: {
        places: ['Alfama', 'LX Factory', 'Miradouros'],
        accommodation: 'Apartment near cafés and coworking',
        activities: ['city walks', 'sunset viewpoints', 'weekend trips'],
        notesHint: 'Desk and strong Wi‑Fi. Day trips: Cascais, Sintra.',
      },
      weather: {
        avgTemp: '21°C',
        bestMonths: 'Mar-Jun, Sep-Nov',
        climate: 'mediterranean'
      },
      costs: {
        accommodation: '$1,200 - $1,800',
        coworking: '$150 - $250',
        meals: '$400 - $600',
        monthlyTotal: '$2,200 - $3,000'
      },
      nomadScore: 9,
      internetSpeed: '100 Mbps avg'
    },
    {
      city: 'Porto',
      country: 'Portugal',
      flag: '🇵🇹',
      budgetCoins: 2,
      tags: ['history', 'wine', 'coastal'],
      imageUrl: 'https://images.unsplash.com/photo-1555881400-74d7acaacd81?w=800&auto=format&fit=crop',
      highlights: {
        places: ['Ribeira', 'Foz', 'Vila Nova de Gaia'],
        accommodation: 'Historic apartment with river view',
        activities: ['port wine tasting', 'river cruises', 'tiled churches'],
        notesHint: 'Hilly streets, bring good shoes.',
      },
      weather: {
        avgTemp: '20°C',
        bestMonths: 'May-Sep',
        climate: 'mediterranean'
      },
      costs: {
        accommodation: '$1,000 - $1,500',
        coworking: '$120 - $200',
        meals: '$350 - $550',
        monthlyTotal: '$1,800 - $2,600'
      },
      nomadScore: 8,
      internetSpeed: '90 Mbps avg'
    },
    {
      city: 'Barcelona',
      country: 'Spain',
      flag: '🇪🇸',
      budgetCoins: 3,
      tags: ['city', 'design', 'beach'],
      imageUrl: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&auto=format&fit=crop',
      highlights: {
        places: ['El Born', 'Eixample', 'Barceloneta'],
        accommodation: 'Apartment near metro',
        activities: ['tapas', 'Gaudí', 'beach runs', 'coworking'],
        notesHint: 'Near L4 or L3 lines.',
      },
      weather: {
        avgTemp: '24°C',
        bestMonths: 'Apr-Jun, Sep-Nov',
        climate: 'mediterranean'
      },
      costs: {
        accommodation: '$1,500 - $2,500',
        coworking: '$200 - $300',
        meals: '$500 - $800',
        monthlyTotal: '$2,800 - $4,000'
      },
      nomadScore: 9,
      internetSpeed: '150 Mbps avg'
    },
    {
      city: 'Valencia',
      country: 'Spain',
      flag: '🇪🇸',
      budgetCoins: 2,
      tags: ['sunny', 'food', 'beach'],
      imageUrl: 'https://images.unsplash.com/photo-1562135036-e455172d52c5?w=800&auto=format&fit=crop',
      highlights: {
        places: ['Ruzafa', 'El Carmen', 'City of Arts'],
        accommodation: 'Modern flat in Ruzafa',
        activities: ['paella cooking', 'Turia park runs', 'beach days'],
        notesHint: 'Great for cycling.',
      },
      weather: {
        avgTemp: '23°C',
        bestMonths: 'Mar-Nov',
        climate: 'mediterranean'
      },
      costs: {
        accommodation: '$1,100 - $1,600',
        coworking: '$150 - $250',
        meals: '$400 - $600',
        monthlyTotal: '$2,000 - $2,800'
      },
      nomadScore: 8,
      internetSpeed: '120 Mbps avg'
    },
    {
      city: 'Split',
      country: 'Croatia',
      flag: '🇭🇷',
      budgetCoins: 2,
      tags: ['coast', 'islands', 'history'],
      imageUrl: 'https://images.unsplash.com/photo-1555990538-c3c52b21c548?w=800&auto=format&fit=crop',
      highlights: {
        places: ['Old Town', 'Riva', 'Marjan'],
        accommodation: 'Apartment with AC',
        activities: ['island hops', 'swims', 'sunset hikes'],
        notesHint: 'Shoulder season is best.',
      },
      weather: {
        avgTemp: '26°C',
        bestMonths: 'May-Jun, Sep-Oct',
        climate: 'mediterranean'
      },
      costs: {
        accommodation: '$1,000 - $1,800',
        coworking: '$150 - $220',
        meals: '$400 - $600',
        monthlyTotal: '$2,000 - $2,900'
      },
      nomadScore: 8,
      internetSpeed: '60 Mbps avg'
    },
    {
      city: 'Dubrovnik',
      country: 'Croatia',
      flag: '🇭🇷',
      budgetCoins: 3,
      tags: ['history', 'coastal', 'premium'],
      imageUrl: 'https://images.unsplash.com/photo-1556806787-142cb4925d82?w=800&auto=format&fit=crop',
      highlights: {
        places: ['Old Town', 'Lapad', 'Banje Beach'],
        accommodation: 'Sea view apartment',
        activities: ['city walls walk', 'Game of Thrones tours', 'kayaking'],
        notesHint: 'Very busy in peak summer.',
      },
      weather: {
        avgTemp: '25°C',
        bestMonths: 'Apr-May, Sep-Oct',
        climate: 'mediterranean'
      },
      costs: {
        accommodation: '$1,500 - $2,500',
        coworking: '$180 - $250',
        meals: '$600 - $900',
        monthlyTotal: '$2,800 - $4,000'
      },
      nomadScore: 7,
      internetSpeed: '50 Mbps avg'
    },
    {
      city: 'Athens',
      country: 'Greece',
      flag: '🇬🇷',
      budgetCoins: 2,
      tags: ['history', 'culture', 'food'],
      imageUrl: 'https://images.unsplash.com/photo-1603565816030-6b389eeb23cb?w=800&auto=format&fit=crop',
      highlights: {
        places: ['Plaka', 'Monastiraki', 'Koukaki'],
        accommodation: 'Rooftop view of Acropolis',
        activities: ['ancient ruins', 'rooftop bars', 'island day trips'],
        notesHint: 'Can get very hot in July/August.',
      },
      weather: {
        avgTemp: '27°C',
        bestMonths: 'Apr-Jun, Sep-Nov',
        climate: 'mediterranean'
      },
      costs: {
        accommodation: '$800 - $1,300',
        coworking: '$120 - $200',
        meals: '$300 - $500',
        monthlyTotal: '$1,600 - $2,400'
      },
      nomadScore: 8,
      internetSpeed: '45 Mbps avg'
    },
    {
      city: 'Budapest',
      country: 'Hungary',
      flag: '🇭🇺',
      budgetCoins: 1,
      tags: ['party', 'history', 'thermal'],
      imageUrl: 'https://images.unsplash.com/photo-1565426873118-a17ed65d7429?w=800&auto=format&fit=crop',
      highlights: {
        places: ['District VII', 'Buda Castle', 'Danube'],
        accommodation: 'High-ceiling classic apartment',
        activities: ['thermal baths', 'ruin bars', 'river cruises'],
        notesHint: 'Great value for money.',
      },
      weather: {
        avgTemp: '22°C',
        bestMonths: 'May-Sep',
        climate: 'temperate'
      },
      costs: {
        accommodation: '$700 - $1,100',
        coworking: '$100 - $180',
        meals: '$300 - $500',
        monthlyTotal: '$1,400 - $2,100'
      },
      nomadScore: 9,
      internetSpeed: '80 Mbps avg'
    },
    {
      city: 'Prague',
      country: 'Czech Republic',
      flag: '🇨🇿',
      budgetCoins: 2,
      tags: ['history', 'beer', 'architecture'],
      imageUrl: 'https://images.unsplash.com/photo-1541849546-2165492d1373?w=800&auto=format&fit=crop',
      highlights: {
        places: ['Old Town', 'Vinohrady', 'Letná'],
        accommodation: 'Cozy flat near parks',
        activities: ['beer gardens', 'castle visits', 'river walks'],
        notesHint: 'Very walkable city.',
      },
      weather: {
        avgTemp: '20°C',
        bestMonths: 'May-Sep',
        climate: 'temperate'
      },
      costs: {
        accommodation: '$900 - $1,400',
        coworking: '$130 - $200',
        meals: '$350 - $550',
        monthlyTotal: '$1,700 - $2,500'
      },
      nomadScore: 8,
      internetSpeed: '70 Mbps avg'
    },
    {
      city: 'Berlin',
      country: 'Germany',
      flag: '🇩🇪',
      budgetCoins: 2,
      tags: ['nightlife', 'art', 'startup'],
      imageUrl: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=800&auto=format&fit=crop',
      highlights: {
        places: ['Kreuzberg', 'Neukölln', 'Mitte'],
        accommodation: 'Hip loft or WG room',
        activities: ['techno clubs', 'art galleries', 'tempelhof park'],
        notesHint: 'Cash is still king in many places.',
      },
      weather: {
        avgTemp: '19°C',
        bestMonths: 'May-Sep',
        climate: 'temperate'
      },
      costs: {
        accommodation: '$1,200 - $1,800',
        coworking: '$150 - $250',
        meals: '$400 - $700',
        monthlyTotal: '$2,200 - $3,200'
      },
      nomadScore: 9,
      internetSpeed: '60 Mbps avg'
    },
    {
      city: 'Amsterdam',
      country: 'Netherlands',
      flag: '🇳🇱',
      budgetCoins: 3,
      tags: ['canals', 'cycling', 'liberal'],
      imageUrl: 'https://images.unsplash.com/photo-1512470876302-687d6e3e6fbb?w=800&auto=format&fit=crop',
      highlights: {
        places: ['De Pijp', 'Jordaan', 'Oost'],
        accommodation: 'Canal view apartment',
        activities: ['cycling', 'museums', 'park picnics'],
        notesHint: 'Housing market is very tough.',
      },
      weather: {
        avgTemp: '18°C',
        bestMonths: 'Jun-Aug',
        climate: 'temperate'
      },
      costs: {
        accommodation: '$2,000 - $3,000',
        coworking: '$200 - $350',
        meals: '$600 - $900',
        monthlyTotal: '$3,500 - $5,000'
      },
      nomadScore: 7,
      internetSpeed: '100 Mbps avg'
    },
     {
      city: 'Florence',
      country: 'Italy',
      flag: '🇮🇹',
      budgetCoins: 3,
      tags: ['art', 'food', 'wine'],
      imageUrl: 'https://images.unsplash.com/photo-1534445867742-43195f401b6c?w=800&auto=format&fit=crop',
      highlights: {
        places: ['Santo Spirito', 'Santa Croce', 'Oltrarno'],
        accommodation: 'Historic flat with frescoes',
        activities: ['Uffizi Gallery', 'Tuscan wine tours', 'sunset at Piazzale Michelangelo'],
        notesHint: 'Internet can be patchy in old buildings.',
      },
      weather: {
        avgTemp: '25°C',
        bestMonths: 'Apr-Jun, Sep-Oct',
        climate: 'mediterranean'
      },
      costs: {
        accommodation: '$1,300 - $2,000',
        coworking: '$150 - $250',
        meals: '$500 - $800',
        monthlyTotal: '$2,500 - $3,500'
      },
      nomadScore: 8,
      internetSpeed: '50 Mbps avg'
    },
    {
      city: 'Seville',
      country: 'Spain',
      flag: '🇪🇸',
      budgetCoins: 2,
      tags: ['history', 'flamenco', 'warm'],
      imageUrl: 'https://images.unsplash.com/photo-1559563973-6e589c2344eb?w=800&auto=format&fit=crop',
      highlights: {
        places: ['Triana', 'Alameda', 'Santa Cruz'],
        accommodation: 'Andalusian patio house',
        activities: ['Real Alcázar', 'flamenco shows', 'tapas hopping'],
        notesHint: 'Avoid July/August (extremely hot).',
      },
      weather: {
        avgTemp: '28°C',
        bestMonths: 'Mar-May, Oct-Nov',
        climate: 'mediterranean'
      },
      costs: {
        accommodation: '$900 - $1,400',
        coworking: '$120 - $200',
        meals: '$350 - $550',
        monthlyTotal: '$1,700 - $2,500'
      },
      nomadScore: 8,
      internetSpeed: '100 Mbps avg'
    }
  ],
  'latin-america': [
    {
      city: 'Mexico City',
      country: 'Mexico',
      flag: '🇲🇽',
      budgetCoins: 2,
      tags: ['food', 'culture', 'urban'],
      imageUrl: 'https://images.unsplash.com/photo-1518638150340-f706e86654de?w=800&auto=format&fit=crop',
      highlights: {
        places: ['Condesa', 'Roma', 'Coyoacán'],
        accommodation: 'Apartment with desk',
        activities: ['taco crawl', 'museums', 'street art', 'rooftop coworking'],
        notesHint: 'Aim for Day of the Dead if timing fits.',
      },
      weather: {
        avgTemp: '20°C',
        bestMonths: 'Oct-May',
        climate: 'temperate'
      },
      costs: {
        accommodation: '$900 - $1,500',
        coworking: '$150 - $250',
        meals: '$300 - $500',
        monthlyTotal: '$1,600 - $2,500'
      },
      nomadScore: 9,
      internetSpeed: '50 Mbps avg'
    },
    {
      city: 'Medellín',
      country: 'Colombia',
      flag: '🇨🇴',
      budgetCoins: 1,
      tags: ['mild climate', 'community', 'mountain'],
      imageUrl: 'https://images.unsplash.com/photo-1568632234157-ce7aecd03d0d?w=800&auto=format&fit=crop',
      highlights: {
        places: ['El Poblado', 'Laureles', 'Envigado'],
        accommodation: 'Apartment near cafés',
        activities: ['language classes', 'coworking', 'coffee farms'],
        notesHint: 'Blackout curtains for early calls.',
      },
      weather: {
        avgTemp: '22°C',
        bestMonths: 'Year-round',
        climate: 'tropical'
      },
      costs: {
        accommodation: '$600 - $1,000',
        coworking: '$100 - $180',
        meals: '$250 - $400',
        monthlyTotal: '$1,200 - $1,800'
      },
      nomadScore: 9,
      internetSpeed: '40 Mbps avg'
    },
    {
      city: 'Rio',
      country: 'Brazil',
      flag: '🇧🇷',
      budgetCoins: 2,
      tags: ['beach', 'festivals', 'nature'],
      imageUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&auto=format&fit=crop',
      highlights: {
        places: ['Ipanema', 'Leblon', 'Botafogo'],
        accommodation: 'Near beach and metro',
        activities: ['beach mornings', 'hikes', 'samba nights'],
        notesHint: 'Book early for Carnival.',
      },
      weather: {
        avgTemp: '26°C',
        bestMonths: 'Dec-Mar (hot), Apr-Jun (mild)',
        climate: 'tropical'
      },
      costs: {
        accommodation: '$1,000 - $1,600',
        coworking: '$120 - $200',
        meals: '$350 - $600',
        monthlyTotal: '$1,800 - $2,800'
      },
      nomadScore: 8,
      internetSpeed: '80 Mbps avg'
    },
    {
      city: 'Buenos Aires',
      country: 'Argentina',
      flag: '🇦🇷',
      budgetCoins: 1,
      tags: ['food', 'culture', 'nightlife'],
      imageUrl: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?w=800&auto=format&fit=crop',
      highlights: {
        places: ['Palermo Soho', 'Recoleta', 'San Telmo'],
        accommodation: 'Loft in Palermo',
        activities: ['tango shows', 'steak dinners', 'soccer matches'],
        notesHint: 'Bring cash (Blue Dollar rate).',
      },
      weather: {
        avgTemp: '24°C',
        bestMonths: 'Oct-Apr',
        climate: 'temperate'
      },
      costs: {
        accommodation: '$600 - $1,000',
        coworking: '$100 - $180',
        meals: '$250 - $450',
        monthlyTotal: '$1,200 - $1,900'
      },
      nomadScore: 9,
      internetSpeed: '40 Mbps avg'
    },
    {
      city: 'Lima',
      country: 'Peru',
      flag: '🇵🇪',
      budgetCoins: 1,
      tags: ['food', 'coastal', 'surfing'],
      imageUrl: 'https://images.unsplash.com/photo-1531968455001-5c5272a41129?w=800&auto=format&fit=crop',
      highlights: {
        places: ['Miraflores', 'Barranco', 'San Isidro'],
        accommodation: 'Ocean view condo',
        activities: ['ceviche tasting', 'surfing', 'paragliding'],
        notesHint: 'Food scene is world-class.',
      },
      weather: {
        avgTemp: '22°C',
        bestMonths: 'Dec-Apr',
        climate: 'dry'
      },
      costs: {
        accommodation: '$600 - $1,000',
        coworking: '$100 - $180',
        meals: '$250 - $450',
        monthlyTotal: '$1,100 - $1,800'
      },
      nomadScore: 7,
      internetSpeed: '30 Mbps avg'
    },
    {
      city: 'Bogotá',
      country: 'Colombia',
      flag: '🇨🇴',
      budgetCoins: 1,
      tags: ['culture', 'business', 'cool'],
      imageUrl: 'https://images.unsplash.com/photo-1596326232679-91765e4356e6?w=800&auto=format&fit=crop',
      highlights: {
        places: ['Chapinero', 'Usaquén', 'Zona T'],
        accommodation: 'Modern brick apartment',
        activities: ['museums', 'Monserrate hike', 'craft beer'],
        notesHint: 'Carry an umbrella, weather changes fast.',
      },
      weather: {
        avgTemp: '14°C',
        bestMonths: 'Dec-Mar',
        climate: 'temperate'
      },
      costs: {
        accommodation: '$500 - $900',
        coworking: '$100 - $160',
        meals: '$250 - $400',
        monthlyTotal: '$1,000 - $1,600'
      },
      nomadScore: 7,
      internetSpeed: '35 Mbps avg'
    },
    {
      city: 'Playa del Carmen',
      country: 'Mexico',
      flag: '🇲🇽',
      budgetCoins: 2,
      tags: ['beach', 'diving', 'nightlife'],
      imageUrl: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&auto=format&fit=crop',
      highlights: {
        places: ['Centro', 'Playacar', '5th Avenue'],
        accommodation: 'Condo with pool',
        activities: ['cenote diving', 'beach clubs', 'tulum day trips'],
        notesHint: 'Sargassum season is summer.',
      },
      weather: {
        avgTemp: '28°C',
        bestMonths: 'Nov-Apr',
        climate: 'tropical'
      },
      costs: {
        accommodation: '$1,000 - $1,800',
        coworking: '$150 - $250',
        meals: '$350 - $600',
        monthlyTotal: '$1,800 - $2,800'
      },
      nomadScore: 8,
      internetSpeed: '40 Mbps avg'
    },
    {
      city: 'Oaxaca',
      country: 'Mexico',
      flag: '🇲🇽',
      budgetCoins: 1,
      tags: ['food', 'culture', 'traditional'],
      imageUrl: 'https://images.unsplash.com/photo-1566068085656-7d733763881d?w=800&auto=format&fit=crop',
      highlights: {
        places: ['Centro', 'Jalatlaco', 'Reforma'],
        accommodation: 'Colonial casa',
        activities: ['mezcal tasting', 'cooking classes', 'Monte Albán'],
        notesHint: 'Internet can be unstable.',
      },
      weather: {
        avgTemp: '24°C',
        bestMonths: 'Oct-Apr',
        climate: 'dry'
      },
      costs: {
        accommodation: '$500 - $900',
        coworking: '$100 - $150',
        meals: '$200 - $350',
        monthlyTotal: '$1,000 - $1,600'
      },
      nomadScore: 7,
      internetSpeed: '20 Mbps avg'
    },
    {
      city: 'Cartagena',
      country: 'Colombia',
      flag: '🇨🇴',
      budgetCoins: 2,
      tags: ['history', 'beach', 'hot'],
      imageUrl: 'https://images.unsplash.com/photo-1583531352515-8884af319dc1?w=800&auto=format&fit=crop',
      highlights: {
        places: ['Walled City', 'Getsemaní', 'Bocagrande'],
        accommodation: 'Colonial boutique stay',
        activities: ['island hopping', 'sunset walls', 'salsa'],
        notesHint: 'Very hot and humid.',
      },
      weather: {
        avgTemp: '30°C',
        bestMonths: 'Dec-Apr',
        climate: 'tropical'
      },
      costs: {
        accommodation: '$800 - $1,400',
        coworking: '$120 - $200',
        meals: '$300 - $500',
        monthlyTotal: '$1,500 - $2,400'
      },
      nomadScore: 7,
      internetSpeed: '30 Mbps avg'
    },
    {
      city: 'São Paulo',
      country: 'Brazil',
      flag: '🇧🇷',
      budgetCoins: 2,
      tags: ['urban', 'food', 'business'],
      imageUrl: 'https://images.unsplash.com/photo-1583266063560-65249162535e?w=800&auto=format&fit=crop',
      highlights: {
        places: ['Vila Madalena', 'Pinheiros', 'Paulista'],
        accommodation: 'Modern high-rise studio',
        activities: ['gastronomy tours', 'museums', 'nightlife'],
        notesHint: 'Traffic is intense.',
      },
      weather: {
        avgTemp: '22°C',
        bestMonths: 'Mar-Jun, Sep-Nov',
        climate: 'tropical'
      },
      costs: {
        accommodation: '$800 - $1,400',
        coworking: '$120 - $200',
        meals: '$300 - $500',
        monthlyTotal: '$1,500 - $2,400'
      },
      nomadScore: 7,
      internetSpeed: '90 Mbps avg'
    },
    {
      city: 'Santiago',
      country: 'Chile',
      flag: '🇨🇱',
      budgetCoins: 2,
      tags: ['mountain', 'wine', 'modern'],
      imageUrl: 'https://images.unsplash.com/photo-1523664842332-9c266f8c2d4e?w=800&auto=format&fit=crop',
      highlights: {
        places: ['Providencia', 'Lastarria', 'Bellavista'],
        accommodation: 'Apartment with Andes view',
        activities: ['wine tasting', 'skiing (winter)', 'hiking'],
        notesHint: 'Smog in winter (Jun-Aug).',
      },
      weather: {
        avgTemp: '20°C',
        bestMonths: 'Sep-Apr',
        climate: 'mediterranean'
      },
      costs: {
        accommodation: '$700 - $1,200',
        coworking: '$120 - $200',
        meals: '$300 - $500',
        monthlyTotal: '$1,400 - $2,200'
      },
      nomadScore: 7,
      internetSpeed: '100 Mbps avg'
    },
    {
      city: 'Montevideo',
      country: 'Uruguay',
      flag: '🇺🇾',
      budgetCoins: 2,
      tags: ['calm', 'beach', 'progressive'],
      imageUrl: 'https://images.unsplash.com/photo-1612293590501-c274308b74bd?w=800&auto=format&fit=crop',
      highlights: {
        places: ['Pocitos', 'Ciudad Vieja', 'Punta Carretas'],
        accommodation: 'Apartment near Rambla',
        activities: ['Rambla walks', 'wineries', 'beach days'],
        notesHint: 'Very quiet in January.',
      },
      weather: {
        avgTemp: '21°C',
        bestMonths: 'Nov-Mar',
        climate: 'temperate'
      },
      costs: {
        accommodation: '$900 - $1,400',
        coworking: '$150 - $220',
        meals: '$400 - $600',
        monthlyTotal: '$1,700 - $2,500'
      },
      nomadScore: 7,
      internetSpeed: '80 Mbps avg'
    }
  ],
  'southeast-asia': [
    {
      city: 'Bali (Canggu)',
      country: 'Indonesia',
      flag: '🇮🇩',
      budgetCoins: 1,
      tags: ['tropical', 'creative', 'surf'],
      imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop',
      highlights: {
        places: ['Berawa', 'Batu Bolong', 'Pererenan'],
        accommodation: 'Villa or guesthouse with desk',
        activities: ['surf', 'cafés', 'yoga', 'scooter trips'],
        notesHint: 'Check generator and Wi‑Fi backup.',
      },
      weather: {
        avgTemp: '28°C',
        bestMonths: 'May-Sep',
        climate: 'tropical'
      },
      costs: {
        accommodation: '$800 - $1,500',
        coworking: '$150 - $250',
        meals: '$300 - $500',
        monthlyTotal: '$1,500 - $2,500'
      },
      nomadScore: 10,
      internetSpeed: '40 Mbps avg'
    },
    {
      city: 'Chiang Mai',
      country: 'Thailand',
      flag: '🇹🇭',
      budgetCoins: 1,
      tags: ['calm', 'walkable', 'temples'],
      imageUrl: 'https://images.unsplash.com/photo-1598965675045-13e5a5c5bf1f?w=800&auto=format&fit=crop',
      highlights: {
        places: ['Nimman', 'Old City', 'Santitham'],
        accommodation: 'Condo near Nimman',
        activities: ['temples', 'coworking', 'night markets'],
        notesHint: 'Best Nov to Feb. Avoid burning season (Feb-Apr).',
      },
      weather: {
        avgTemp: '26°C',
        bestMonths: 'Oct-Feb',
        climate: 'tropical'
      },
      costs: {
        accommodation: '$400 - $700',
        coworking: '$100 - $150',
        meals: '$200 - $350',
        monthlyTotal: '$900 - $1,400'
      },
      nomadScore: 9,
      internetSpeed: '100 Mbps avg'
    },
    {
      city: 'Da Nang',
      country: 'Vietnam',
      flag: '🇻🇳',
      budgetCoins: 1,
      tags: ['beach', 'easy', 'modern'],
      imageUrl: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800&auto=format&fit=crop',
      highlights: {
        places: ['My An', 'An Thuong', 'Son Tra'],
        accommodation: 'Apartment near beach',
        activities: ['beach runs', 'Hoi An weekends', 'coworking'],
        notesHint: 'Rainy Oct to Dec.',
      },
      weather: {
        avgTemp: '27°C',
        bestMonths: 'Jan-Aug',
        climate: 'tropical'
      },
      costs: {
        accommodation: '$400 - $700',
        coworking: '$80 - $130',
        meals: '$200 - $350',
        monthlyTotal: '$900 - $1,400'
      },
      nomadScore: 9,
      internetSpeed: '60 Mbps avg'
    },
    {
      city: 'Bangkok',
      country: 'Thailand',
      flag: '🇹🇭',
      budgetCoins: 1,
      tags: ['urban', 'food', 'nightlife'],
      imageUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop',
      highlights: {
        places: ['Thong Lo', 'Ekkamai', 'Ari'],
        accommodation: 'High-rise condo with pool',
        activities: ['street food', 'rooftop bars', 'shopping'],
        notesHint: 'Traffic is terrible, stay near BTS.',
      },
      weather: {
        avgTemp: '30°C',
        bestMonths: 'Nov-Feb',
        climate: 'tropical'
      },
      costs: {
        accommodation: '$600 - $1,000',
        coworking: '$120 - $200',
        meals: '$300 - $500',
        monthlyTotal: '$1,300 - $2,000'
      },
      nomadScore: 9,
      internetSpeed: '200 Mbps avg'
    },
    {
      city: 'Ho Chi Minh City',
      country: 'Vietnam',
      flag: '🇻🇳',
      budgetCoins: 1,
      tags: ['urban', 'chaos', 'coffee'],
      imageUrl: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800&auto=format&fit=crop',
      highlights: {
        places: ['District 1', 'Thao Dien', 'District 3'],
        accommodation: 'Serviced apartment',
        activities: ['coffee shops', 'motorbiking', 'street food'],
        notesHint: 'Thao Dien for expat bubble.',
      },
      weather: {
        avgTemp: '29°C',
        bestMonths: 'Dec-Apr',
        climate: 'tropical'
      },
      costs: {
        accommodation: '$500 - $900',
        coworking: '$100 - $160',
        meals: '$250 - $400',
        monthlyTotal: '$1,100 - $1,700'
      },
      nomadScore: 8,
      internetSpeed: '60 Mbps avg'
    },
    {
      city: 'Kuala Lumpur',
      country: 'Malaysia',
      flag: '🇲🇾',
      budgetCoins: 1,
      tags: ['urban', 'food', 'diverse'],
      imageUrl: 'https://images.unsplash.com/photo-1535202468039-117770371865?w=800&auto=format&fit=crop',
      highlights: {
        places: ['Bukit Bintang', 'KLCC', 'Bangsar'],
        accommodation: 'Luxury condo with infinity pool',
        activities: ['food courts', 'Batu Caves', 'shopping'],
        notesHint: 'Very walkable in center (via tunnels/bridges).',
      },
      weather: {
        avgTemp: '28°C',
        bestMonths: 'Year-round (rainy afternoons)',
        climate: 'tropical'
      },
      costs: {
        accommodation: '$500 - $900',
        coworking: '$100 - $150',
        meals: '$250 - $450',
        monthlyTotal: '$1,100 - $1,800'
      },
      nomadScore: 8,
      internetSpeed: '100 Mbps avg'
    },
    {
      city: 'Singapore',
      country: 'Singapore',
      flag: '🇸🇬',
      budgetCoins: 3,
      tags: ['modern', 'clean', 'green'],
      imageUrl: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&auto=format&fit=crop',
      highlights: {
        places: ['Tiong Bahru', 'Bugis', 'Marina Bay'],
        accommodation: 'Co-living or condo',
        activities: ['Gardens by the Bay', 'hawker centers', 'rooftop bars'],
        notesHint: 'Strict laws, very safe.',
      },
      weather: {
        avgTemp: '29°C',
        bestMonths: 'Year-round',
        climate: 'tropical'
      },
      costs: {
        accommodation: '$2,000 - $3,500',
        coworking: '$250 - $400',
        meals: '$500 - $900',
        monthlyTotal: '$3,500 - $5,500'
      },
      nomadScore: 7,
      internetSpeed: '250 Mbps avg'
    },
    {
      city: 'Phnom Penh',
      country: 'Cambodia',
      flag: '🇰🇭',
      budgetCoins: 1,
      tags: ['raw', 'history', 'river'],
      imageUrl: 'https://images.unsplash.com/photo-1583209002892-1c67a83bc665?w=800&auto=format&fit=crop',
      highlights: {
        places: ['BKK1', 'Riverside', 'Russian Market'],
        accommodation: 'Modern apartment',
        activities: ['river sunsets', 'markets', 'history museums'],
        notesHint: 'Cash economy (USD used).',
      },
      weather: {
        avgTemp: '30°C',
        bestMonths: 'Nov-Feb',
        climate: 'tropical'
      },
      costs: {
        accommodation: '$500 - $800',
        coworking: '$100 - $150',
        meals: '$250 - $400',
        monthlyTotal: '$1,100 - $1,600'
      },
      nomadScore: 7,
      internetSpeed: '30 Mbps avg'
    },
    {
      city: 'Hanoi',
      country: 'Vietnam',
      flag: '🇻🇳',
      budgetCoins: 1,
      tags: ['culture', 'food', 'lake'],
      imageUrl: 'https://images.unsplash.com/photo-1509060807232-6e83e320c825?w=800&auto=format&fit=crop',
      highlights: {
        places: ['Tay Ho', 'Old Quarter', 'Ba Dinh'],
        accommodation: 'Lakeside apartment',
        activities: ['egg coffee', 'lake walks', 'street food'],
        notesHint: 'Cold and misty in winter (Jan-Feb).',
      },
      weather: {
        avgTemp: '24°C',
        bestMonths: 'Sep-Nov, Mar-Apr',
        climate: 'temperate'
      },
      costs: {
        accommodation: '$450 - $750',
        coworking: '$90 - $140',
        meals: '$200 - $350',
        monthlyTotal: '$900 - $1,500'
      },
      nomadScore: 8,
      internetSpeed: '50 Mbps avg'
    },
    {
      city: 'Ubud',
      country: 'Indonesia',
      flag: '🇮🇩',
      budgetCoins: 2,
      tags: ['jungle', 'yoga', 'spiritual'],
      imageUrl: 'https://images.unsplash.com/photo-1536693789243-d72b7b1e4d8f?w=800&auto=format&fit=crop',
      highlights: {
        places: ['Hanoman', 'Penestanan', 'Nyuh Kuning'],
        accommodation: 'Villa in rice fields',
        activities: ['yoga', 'monkey forest', 'healthy food'],
        notesHint: 'Traffic can be gridlocked.',
      },
      weather: {
        avgTemp: '26°C',
        bestMonths: 'May-Sep',
        climate: 'tropical'
      },
      costs: {
        accommodation: '$800 - $1,400',
        coworking: '$150 - $250',
        meals: '$300 - $500',
        monthlyTotal: '$1,600 - $2,500'
      },
      nomadScore: 9,
      internetSpeed: '40 Mbps avg'
    },
    {
      city: 'Koh Lanta',
      country: 'Thailand',
      flag: '🇹🇭',
      budgetCoins: 1,
      tags: ['island', 'chill', 'beach'],
      imageUrl: 'https://images.unsplash.com/photo-1532663286381-1b5969b6f99c?w=800&auto=format&fit=crop',
      highlights: {
        places: ['Long Beach', 'Klong Khong'],
        accommodation: 'Bungalow near beach',
        activities: ['sunsets', 'motorbiking', 'snorkeling'],
        notesHint: 'Very quiet in low season.',
      },
      weather: {
        avgTemp: '28°C',
        bestMonths: 'Nov-Mar',
        climate: 'tropical'
      },
      costs: {
        accommodation: '$500 - $900',
        coworking: '$150 - $220',
        meals: '$250 - $400',
        monthlyTotal: '$1,100 - $1,800'
      },
      nomadScore: 9,
      internetSpeed: '40 Mbps avg'
    },
    {
      city: 'Koh Samui',
      country: 'Thailand',
      flag: '🇹🇭',
      budgetCoins: 2,
      tags: ['island', 'luxury', 'wellness'],
      imageUrl: 'https://images.unsplash.com/photo-1537794819045-2c9f859e7f98?w=800&auto=format&fit=crop',
      highlights: {
        places: ['Fisherman\'s Village', 'Lamai', 'Chaweng'],
        accommodation: 'Villa with sea view',
        activities: ['beaches', 'night markets', 'spa treatments'],
        notesHint: 'More expensive than mainland.',
      },
      weather: {
        avgTemp: '29°C',
        bestMonths: 'Dec-Mar',
        climate: 'tropical'
      },
      costs: {
        accommodation: '$800 - $1,500',
        coworking: '$150 - $250',
        meals: '$350 - $600',
        monthlyTotal: '$1,600 - $2,600'
      },
      nomadScore: 8,
      internetSpeed: '50 Mbps avg'
    },
    {
      city: 'Phuket',
      country: 'Thailand',
      flag: '🇹🇭',
      budgetCoins: 2,
      tags: ['island', 'fitness', 'beach'],
      imageUrl: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800&auto=format&fit=crop',
      highlights: {
        places: ['Rawai', 'Chalong', 'Bang Tao'],
        accommodation: 'Condo or villa',
        activities: ['Muay Thai', 'beach clubs', 'island hopping'],
        notesHint: 'Need a scooter or car.',
      },
      weather: {
        avgTemp: '28°C',
        bestMonths: 'Nov-Mar',
        climate: 'tropical'
      },
      costs: {
        accommodation: '$700 - $1,300',
        coworking: '$120 - $200',
        meals: '$300 - $550',
        monthlyTotal: '$1,400 - $2,300'
      },
      nomadScore: 8,
      internetSpeed: '80 Mbps avg'
    }
  ],
};

export const WORK_NEEDS = [
  'Fast internet',
  'Quiet workspace',
  'Phone calls',
  'Second screen',
  'Co-working',
  'Private desk',
  'Flexible schedule',
  'Late meetings',
  'Backup power',
] as const;

export const ACCOMMODATION_TYPES = [
  'Private Apartment',
  'Coliving Space',
  'Hotel',
  'Hostel',
  'Villa',
  'Guesthouse',
  'Homestay'
] as const;

export const ACTIVITIES = [
  'Surfing',
  'Hiking',
  'Yoga',
  'Scuba Diving',
  'Snorkeling',
  'Food Tours',
  'Cooking Classes',
  'Wine Tasting',
  'Coffee Culture',
  'Nightlife',
  'Live Music',
  'Festivals',
  'Coworking',
  'Networking',
  'Language Exchange',
  'Museums',
  'History',
  'City Walks',
  'Photography',
  'Beach Days',
  'Boat Trips',
  'Nature'
] as const;

export const VIBES = [
  'Food',
  'Nightlife',
  'Beach',
  'Hiking',
  'Surf',
  'Temples',
  'Photography',
  'Diving',
  'Wellness',
  'Festivals',
  'Culture',
  'Nature',
  'City walks',
  'Gym',
] as const;
