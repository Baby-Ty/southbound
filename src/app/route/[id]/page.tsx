import RouteViewClient from './RouteViewClient';

export async function generateStaticParams() {
  return [];
}

export default function RouteViewPage() {
  return <RouteViewClient />;
}

