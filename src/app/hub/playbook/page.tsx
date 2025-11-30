import Link from 'next/link';
import { Heading } from '@/components/ui/Heading';
import { Card } from '@/components/ui/Card';
import { BookOpen, MessageSquare, Users, Target, ArrowRight } from 'lucide-react';

const chapters = [
  { 
    name: 'The Sales Flow', 
    href: '/hub/playbook/sales-flow', 
    icon: BookOpen, 
    desc: 'Step-by-step guide from first contact to closing the deal.' 
  },
  { 
    name: 'Scripts & Templates', 
    href: '/hub/playbook/scripts', 
    icon: MessageSquare, 
    desc: 'Copy-paste messages for outreach, follow-ups, and intros.' 
  },
  { 
    name: 'Objection Handling', 
    href: '/hub/playbook/objections', 
    icon: Users, 
    desc: 'Master the art of overcoming hesitation and "no".' 
  },
  { 
    name: 'Ideal Customer Profile', 
    href: '/hub/playbook/icp', 
    icon: Target, 
    desc: 'Green flags, red flags, and who we are actually looking for.' 
  },
];

export default function PlaybookPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Heading level={1} className="!text-3xl md:!text-4xl">The Playbook</Heading>
        <p className="text-lg text-stone-600">Your manual for selling South Bound.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {chapters.map((chapter) => (
            <Link key={chapter.name} href={chapter.href} className="block group">
                <Card className="h-full p-6 bg-white hover:shadow-lg transition-all border-stone-200 hover:border-orange-200">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-orange-50 text-[#E86B32] flex items-center justify-center group-hover:bg-[#E86B32] group-hover:text-white transition-colors">
                            <chapter.icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-stone-800">{chapter.name}</h3>
                    </div>
                    <p className="text-stone-600 mb-6">{chapter.desc}</p>
                    <div className="flex items-center text-[#E86B32] font-semibold text-sm group-hover:translate-x-1 transition-transform">
                        Open Chapter <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                </Card>
            </Link>
        ))}
      </div>
    </div>
  );
}

