import Link from 'next/link';
import { Heading } from '@/components/ui/Heading';
import { Card } from '@/components/ui/Card';
import { FileText, MessageSquare, Plane } from 'lucide-react';

export default function ResourcesPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Heading level={1} className="!text-3xl md:!text-4xl">Resources</Heading>
        <p className="text-lg text-stone-600">Quick reference guides, scripts, and templates.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Link href="/hub/resources/scripts" className="block group">
          <Card className="h-full p-6 bg-white hover:shadow-lg transition-all border-stone-200 hover:border-orange-200">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-stone-800 mb-2">Scripts & Templates</h3>
            <p className="text-stone-600">Copy-paste responses for outreach, follow-ups, and handling objections.</p>
          </Card>
        </Link>

        <Link href="/hub/resources/customer-info" className="block group">
           <Card className="h-full p-6 bg-white hover:shadow-lg transition-all border-stone-200 hover:border-orange-200">
            <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-stone-800 mb-2">Customer Facing Info</h3>
            <p className="text-stone-600">Reusable blurbs about South Bound, inclusions, and regions.</p>
          </Card>
        </Link>

        <Link href="/hub/resources/travel-info" className="block group">
           <Card className="h-full p-6 bg-white hover:shadow-lg transition-all border-stone-200 hover:border-orange-200">
            <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plane className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-stone-800 mb-2">General Travel Info</h3>
            <p className="text-stone-600">Visa basics, insurance recommendations, and flight tips.</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}

