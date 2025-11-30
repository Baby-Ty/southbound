import Link from 'next/link';
import { Heading } from '@/components/ui/Heading';
import { Card } from '@/components/ui/Card';
import { BookOpen, CheckCircle } from 'lucide-react';

const modules = [
  { id: 'welcome-and-positioning', title: '1. Welcome & Positioning', desc: 'What South Bound is, who it is for, and why 90+ day stays matter.' },
  { id: 'product-deep-dive', title: '2. Product Deep Dive', desc: 'Inclusions, exclusions, budgets, and how the service works.' },
  { id: 'ideal-customer-profile', title: '3. Ideal Customer Profile', desc: 'Green flags, red flags, and finding the right fit.' },
  { id: 'sales-flow', title: '4. Sales Flow', desc: 'Step-by-step from first conversation to handoff.' },
  { id: 'rep-earnings-guide', title: '5. Rep Earnings Guide', desc: 'Commission structures and potential earnings.' },
  { id: 'faq', title: '6. FAQ', desc: 'Common questions and answers.' },
];

export default function TrainingPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Heading level={1} className="!text-3xl md:!text-4xl">Training</Heading>
        <p className="text-lg text-stone-600">Master the South Bound product and sales process.</p>
      </div>

      <div className="grid gap-4">
        {modules.map((module) => (
            <Link key={module.id} href={`/hub/training/${module.id}`} className="block group">
                <Card className="p-6 bg-white hover:shadow-md transition-all border-stone-200 hover:border-orange-200 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-orange-100 text-[#E86B32] flex items-center justify-center group-hover:bg-[#E86B32] group-hover:text-white transition-colors">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-stone-800 group-hover:text-[#E86B32] transition-colors">{module.title}</h3>
                            <p className="text-stone-600">{module.desc}</p>
                        </div>
                    </div>
                    <div className="text-stone-300 group-hover:text-[#E86B32] transition-colors">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                </Card>
            </Link>
        ))}
      </div>
    </div>
  );
}

