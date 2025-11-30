import Link from 'next/link';
import { Heading } from '@/components/ui/Heading';
import { Card } from '@/components/ui/Card';
import { ArrowLeft, ThumbsUp, ThumbsDown } from 'lucide-react';

export default function ICPPage() {
  return (
    <div className="space-y-8">
       <div className="flex items-center gap-2 text-sm text-stone-500 mb-2">
            <Link href="/hub/playbook" className="hover:text-[#E86B32] flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Back to Playbook
            </Link>
        </div>
        
       <div className="space-y-2">
        <Heading level={1} className="!text-3xl md:!text-4xl">Ideal Customer Profile (ICP)</Heading>
        <p className="text-lg text-stone-600">Who we can help best (and who we can't).</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
          
          {/* Green Flags */}
          <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600 font-bold text-xl">
                  <ThumbsUp /> Green Flags (Chase These)
              </div>
              <Card className="p-6 bg-green-50 border-green-100 h-full">
                  <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                          <span className="font-bold text-green-700">1.</span>
                          <span className="text-stone-800">Already works remotely (or hybrid).</span>
                      </li>
                      <li className="flex items-start gap-3">
                          <span className="font-bold text-green-700">2.</span>
                          <span className="text-stone-800">Earns R35k+ per month (can afford the lifestyle).</span>
                      </li>
                      <li className="flex items-start gap-3">
                          <span className="font-bold text-green-700">3.</span>
                          <span className="text-stone-800">Aged 25-45 (our core community demographic).</span>
                      </li>
                      <li className="flex items-start gap-3">
                          <span className="font-bold text-green-700">4.</span>
                          <span className="text-stone-800">Wants community (afraid of being lonely).</span>
                      </li>
                      <li className="flex items-start gap-3">
                          <span className="font-bold text-green-700">5.</span>
                          <span className="text-stone-800">Looking for 1-3 months away (not just a week).</span>
                      </li>
                  </ul>
              </Card>
          </div>

           {/* Red Flags */}
           <div className="space-y-4">
              <div className="flex items-center gap-2 text-red-600 font-bold text-xl">
                  <ThumbsDown /> Red Flags (Avoid These)
              </div>
              <Card className="p-6 bg-red-50 border-red-100 h-full">
                  <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                          <span className="font-bold text-red-700">1.</span>
                          <span className="text-stone-800">Unemployed / "Looking for work abroad". (We can't help with visas for work).</span>
                      </li>
                      <li className="flex items-start gap-3">
                          <span className="font-bold text-red-700">2.</span>
                          <span className="text-stone-800">Budget under R15k total per month.</span>
                      </li>
                      <li className="flex items-start gap-3">
                          <span className="font-bold text-red-700">3.</span>
                          <span className="text-stone-800">Families with small kids (our housing isn't set up for it yet).</span>
                      </li>
                      <li className="flex items-start gap-3">
                          <span className="font-bold text-red-700">4.</span>
                          <span className="text-stone-800">Expects a 5-star hotel for hostel prices.</span>
                      </li>
                  </ul>
              </Card>
          </div>
      </div>
    </div>
  );
}

