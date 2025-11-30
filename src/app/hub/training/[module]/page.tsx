import Link from 'next/link';
import { Heading } from '@/components/ui/Heading';
import { Card } from '@/components/ui/Card';
import { ArrowLeft } from 'lucide-react';

interface ModuleData {
    title: string;
    intro: string;
    content: { title: string; body: string }[];
}

const moduleData: Record<string, ModuleData> = {
    'welcome-and-positioning': {
        title: 'Welcome & Positioning',
        intro: 'Understanding the core of South Bound.',
        content: [
            { title: 'What is South Bound?', body: 'South Bound is a travel service for South Africans who want to live and work abroad for 90+ days. We are not a typical travel agency; we are a remote work facilitator.' },
            { title: 'Why 90+ Days?', body: 'Most "digital nomad" programs focus on short trips. We believe true immersion and productivity happen when you stay longer. Plus, it makes the flight cost worth it.' }
        ]
    },
    'product-deep-dive': {
        title: 'Product Deep Dive',
        intro: 'Everything included in a South Bound trip.',
        content: [
            { title: 'Inclusions', body: 'Accommodation (vetted for wifi), Airport pickup, SIM card on arrival, Local community manager support, Co-working access (optional add-on).' },
            { title: 'The Process', body: '1. Discovery Call -> 2. Itinerary Builder -> 3. Deposit -> 4. Booking -> 5. Onboarding.' }
        ]
    },
    'ideal-customer-profile': {
        title: 'Ideal Customer Profile',
        intro: 'Who are we looking for?',
        content: [
            { title: 'Green Flags', body: 'Already works remotely, earns R35k+, wants to stay 3+ months, adventurous but wants safety.' },
            { title: 'Red Flags', body: 'Looking for a 2 week holiday, needs us to find them a job, budget under R20k total.' }
        ]
    },
    'sales-flow': {
        title: 'Sales Flow',
        intro: 'From lead to close.',
        content: [
            { title: 'Step 1: Qualify', body: 'Ensure they have remote work and budget.' },
            { title: 'Step 2: Inspire', body: 'Send them the Trip Builder link.' },
            { title: 'Step 3: Handoff', body: 'Connect them with Tyler for the closing call.' }
        ]
    },
     'rep-earnings-guide': {
        title: 'Rep Earnings Guide',
        intro: 'How you get paid.',
        content: [
            { title: 'Commission Structure', body: 'You earn a flat fee per client per month booked. \n\n1 Client = R2,500\n3 Clients = R10,000 (bonus tier)' },
            { title: 'Payment Terms', body: 'Commissions are paid on the 25th of the month following the client deposit.' }
        ]
    },
     'faq': {
        title: 'FAQ',
        intro: 'Common questions.',
        content: [
            { title: 'Do you handle flights?', body: 'No, we advise on flights but clients book their own.' },
            { title: 'Is insurance included?', body: 'No, but we have a partner we recommend.' }
        ]
    }
};

interface ModulePageProps {
  params: Promise<{
    module: string
  }>
}

export default async function ModulePage({ params }: ModulePageProps) {
    const { module: moduleSlug } = await params;
    const module = moduleData[moduleSlug] || {
        title: 'Coming Soon',
        intro: 'This module is under construction.',
        content: []
    };

    return (
        <div className="space-y-8">
             <div className="flex items-center gap-2 text-sm text-stone-500">
                <Link href="/hub/training" className="hover:text-[#E86B32] flex items-center gap-1">
                    <ArrowLeft className="w-4 h-4" /> Back to Training
                </Link>
            </div>

             <div className="space-y-2">
                <Heading level={1} className="!text-3xl md:!text-4xl">{module.title}</Heading>
                <p className="text-lg text-stone-600">{module.intro}</p>
            </div>

            <div className="space-y-6">
                {module.content.length > 0 ? (
                    module.content.map((section, idx) => (
                        <Card key={idx} className="p-6 bg-white border-stone-200">
                            <h2 className="text-xl font-bold text-stone-800 mb-3">{section.title}</h2>
                            <p className="text-stone-700 whitespace-pre-wrap">{section.body}</p>
                        </Card>
                    ))
                ) : (
                     <Card className="p-12 bg-stone-50 border-stone-200 text-center border-dashed">
                        <p className="text-stone-500">Content coming soon...</p>
                    </Card>
                )}
            </div>
        </div>
    );
}

