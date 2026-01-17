export interface RouteCard {
  id: string;
  region: 'europe' | 'latin-america' | 'southeast-asia';
  name: string;
  tagline: string;
  icon: string;
  imageUrl: string;
  budget: string;
  budgetLabel: string;
  timezone: string;
  vibe: string;
  overview: string;
  featuredCities: string[];
  enabled: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}
