// Server component wrapper that exports generateStaticParams for static export
import CityPageClient from './CityPageClient';

// City slugs are static in the data file — no API fetch needed
const CITY_SLUGS = [
  'chiang-mai',
  'bali',
  'bangkok',
  'da-nang',
  'buenos-aires',
  'medellin',
  'mexico-city',
  'tbilisi',
];

// Required for static export - tells Next.js which city routes to pre-generate
export function generateStaticParams(): { city: string }[] {
  return CITY_SLUGS.map((city) => ({ city }));
}

// Disable dynamic params - only cities returned above will be available
export const dynamicParams = false;

export default function CityPage() {
  return <CityPageClient />;
}
