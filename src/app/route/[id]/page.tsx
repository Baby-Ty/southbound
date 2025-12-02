// Server component wrapper that exports generateStaticParams for static export
import RouteViewClient from './RouteViewClient';

// Required for static export - tells Next.js which routes to pre-generate
// Since routes are loaded dynamically from API, return empty array
// The page will still work client-side, but won't be pre-rendered at build time
export async function generateStaticParams() {
  return [];
}

export default function RouteViewPage() {
  return <RouteViewClient />;
}
