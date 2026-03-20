import { notFound } from 'next/navigation';
import { TRIP_TEMPLATES } from '@/lib/tripTemplates';
import ItineraryClient from './ItineraryClient';

// Pre-render every itinerary at build time for static export
export function generateStaticParams() {
  return Object.values(TRIP_TEMPLATES)
    .flat()
    .map((t) => ({ id: t.id }));
}

function findTemplate(id: string) {
  for (const templates of Object.values(TRIP_TEMPLATES)) {
    const t = templates.find((t) => t.id === id);
    if (t) return t;
  }
  return null;
}

export default async function ItineraryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const template = findTemplate(id);
  if (!template) notFound();
  return <ItineraryClient id={id} />;
}
