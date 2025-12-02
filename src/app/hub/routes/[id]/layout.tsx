// This layout file is required for static export with dynamic routes
// It exports generateStaticParams() which tells Next.js which routes to pre-generate
// Since routes are loaded dynamically from the API, we return an empty array
// The page will still work client-side, but won't be pre-rendered at build time

export async function generateStaticParams() {
  // For static export, we can't fetch routes at build time since they're in CosmosDB
  // Return empty array - the page will be generated on-demand client-side
  return [];
}

export default function RouteDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

