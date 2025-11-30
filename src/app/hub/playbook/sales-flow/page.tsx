import Link from 'next/link';
import { Heading } from '@/components/ui/Heading';
import { Card } from '@/components/ui/Card';
import { ArrowLeft, CheckCircle } from 'lucide-react';

const steps = [
    {
        title: "Step 1: Qualify & Excite",
        desc: "Find out if they are a good fit and get them dreaming.",
        points: [
            "Confirm they have a remote job (or can get one).",
            "Check if they have a budget of at least R25k/month.",
            "Ask: 'Where have you always wanted to go?'"
        ]
    },
    {
        title: "Step 2: The Trip Builder",
        desc: "Let them play with the tool to visualize the trip.",
        points: [
            "Send them your personal tracking link.",
            "Encourage them to try different combinations (e.g. 1 month Bali + 2 months Thailand).",
            "Ask them to share a screenshot of their favorite itinerary."
        ]
    },
    {
        title: "Step 3: Answer Questions",
        desc: "Remove friction and address doubts.",
        points: [
            "Use the 'Objections' section of the Playbook.",
            "Share the destination cheat sheets.",
            "Keep it casual - don't be pushy."
        ]
    },
    {
        title: "Step 4: The Handoff",
        desc: "Pass the baton to the core team to close.",
        points: [
            "Once they say 'I'm serious about this', introduce Tyler via email/WhatsApp.",
            "Give Tyler context: 'Sarah is interested in 3 months in Vietnam starting in June'.",
            "You stay in the loop, but Tyler handles the deposit and contract."
        ]
    }
];

export default function SalesFlowPage() {
  return (
    <div className="space-y-8">
       <div className="flex items-center gap-2 text-sm text-stone-500 mb-2">
            <Link href="/hub/playbook" className="hover:text-[#E86B32] flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Back to Playbook
            </Link>
        </div>
        
       <div className="space-y-2">
        <Heading level={1} className="!text-3xl md:!text-4xl">The Sales Flow</Heading>
        <p className="text-lg text-stone-600">From casual chat to closed deal in 4 steps.</p>
      </div>

      <div className="space-y-6">
          {steps.map((step, i) => (
              <Card key={i} className="p-6 bg-white border-stone-200 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#E86B32]"></div>
                  <h2 className="text-xl font-bold text-stone-800 mb-2">{step.title}</h2>
                  <p className="text-stone-600 mb-4">{step.desc}</p>
                  <ul className="space-y-2">
                      {step.points.map((p, j) => (
                          <li key={j} className="flex items-start gap-3 text-stone-700">
                              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                              {p}
                          </li>
                      ))}
                  </ul>
              </Card>
          ))}
      </div>
    </div>
  );
}

