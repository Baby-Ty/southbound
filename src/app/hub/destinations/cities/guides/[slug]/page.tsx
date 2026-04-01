import CityGuideEditor from './CityGuideEditor';
import { getCityBySlug, getCitySlugs } from '@/data/cities';

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = getCitySlugs();
  return slugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export default function CityGuidePage({ params }: { params: { slug: string } }) {
  const city = getCityBySlug(params.slug);

  if (!city) {
    return (
      <div className="p-8 text-center text-stone-500">
        <p className="text-lg font-medium">City guide not found</p>
      </div>
    );
  }

  return <CityGuideEditor initialData={city} slug={params.slug} />;
}
