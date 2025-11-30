import Link from 'next/link';
import { Heading } from '@/components/ui/Heading';
import { Card } from '@/components/ui/Card';
import { ArrowLeft, Copy } from 'lucide-react';

// Reusable Script Component
const ScriptBlock = ({ title, content }: { title: string; content: string }) => (
  <Card className="p-6 bg-white mb-6 border-stone-200">
    <div className="flex justify-between items-start mb-4">
        <h3 className="font-bold text-lg text-stone-800">{title}</h3>
        <button className="text-stone-400 hover:text-[#E86B32] transition-colors" title="Copy to clipboard">
            <Copy className="w-5 h-5" />
        </button>
    </div>
    <div className="bg-stone-50 p-4 rounded-lg border border-stone-200 font-mono text-sm text-stone-700 whitespace-pre-wrap selection:bg-orange-200">
        {content}
    </div>
  </Card>
);

export default function ScriptsPage() {
  return (
    <div className="space-y-8">
       <div className="flex items-center gap-2 text-sm text-stone-500 mb-2">
            <Link href="/hub/playbook" className="hover:text-[#E86B32] flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Back to Playbook
            </Link>
        </div>
        
       <div className="space-y-2">
        <Heading level={1} className="!text-3xl md:!text-4xl">Scripts & Templates</Heading>
        <p className="text-lg text-stone-600">Proven messaging for every stage of the conversation.</p>
      </div>

      <div className="space-y-8">
        <section>
            <h2 className="text-xl font-bold text-stone-800 mb-4 px-1">Outreach</h2>
            <ScriptBlock 
                title="First Outreach (Friend/Colleague)" 
                content={`Hey [Name], hope you're doing well! \n\nI wanted to reach out because I've started working with South Bound, helping people plan 90+ day remote work trips to places like Bali and Thailand. Since I know you can work remotely, I thought of you.\n\nHave you ever thought about taking your work on the road for a few months?`} 
            />
            <ScriptBlock 
                title="The 'Soft' Pitch" 
                content={`I'm testing out a new travel service for remote workers and thought you'd be the perfect person to run it by. We curate 3-month stays in places like Medellín and Da Nang. If you have 5 mins, I'd love to send you a link to play around with our trip builder?`} 
            />
        </section>

        <section>
            <h2 className="text-xl font-bold text-stone-800 mb-4 px-1">Nurturing</h2>
            <ScriptBlock 
                title="Share Itinerary Builder Link" 
                content={`Here's a link to our trip builder tool. It's a fun way to play around with destinations and see what a 3-month trip could look like within your budget:\n\n[LINK]\n\nLet me know what you come up with!`} 
            />
             <ScriptBlock 
                title="Follow Up (No Response)" 
                content={`Hey! Just bumping this up. I know life gets busy. If you're still curious about the remote work trip idea, let me know. If not, no stress at all!`} 
            />
        </section>

        <section>
            <h2 className="text-xl font-bold text-stone-800 mb-4 px-1">Closing / Handoff</h2>
            <ScriptBlock 
                title="Handoff to Tyler" 
                content={`Great! It sounds like you're ready to get into the specific details. I'm going to loop in Tyler, our head of product. He knows these destinations inside out and can help finalize your booking.\n\nI've cc'd him here - Tyler, meet [Name].`} 
            />
        </section>
      </div>
    </div>
  );
}

