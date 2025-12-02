import RouteViewClient from './RouteViewClient';

type Params = {
  id: string;
};

export function generateStaticParams(): Params[] {
  // Return empty array - routes are loaded dynamically client-side
  return [];
}

export default function RouteViewPage() {
  return <RouteViewClient />;
}
