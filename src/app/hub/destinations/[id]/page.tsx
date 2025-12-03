// Server component wrapper that exports generateStaticParams for static export
import RegionDetailClient from './RegionDetailClient';

// All supported region IDs
const regions = [
  'southeast-asia',
  'south-america',
  'central-america',
  'europe-central-asia',
];

// Required for static export - tells Next.js which routes to pre-generate
export async function generateStaticParams() {
  return regions.map((id) => ({ id }));
}

export default function RegionDetailPage() {
  return <RegionDetailClient />;
}

