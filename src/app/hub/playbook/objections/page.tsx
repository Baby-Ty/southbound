import Link from 'next/link';
import { Heading } from '@/components/ui/Heading';
import { Card } from '@/components/ui/Card';
import { ArrowLeft, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';

const objections = [
    {
        category: "Money",
        items: [
            { q: "It's too expensive.", a: "Actually, for many people it's cheaper than living in Cape Town or JHB. Our packages include accommodation, workspace, and support. When you factor in no car payments, cheaper food, and lifestyle, the 'cost of living' often balances out." },
            { q: "I can book this cheaper on Airbnb.", a: "You might find cheaper listings, but you won't know if the WiFi works, if there's construction next door, or if it's safe. We vet every single property for remote work. Plus, you get our on-ground support and community." }
        ]
    },
    {
        category: "Work / Career",
        items: [
            { q: "My boss won't let me.", a: "We have a guide for pitching this to your boss. The key is to frame it as a productivity boost, not a holiday. You'll be working same hours, just with a better view." },
            { q: "The timezones won't work.", a: "Actually, South America is only 5-6 hours behind SA, which is perfect for overlap. Southeast Asia is ahead, meaning you can have your mornings free to explore and work late afternoon/evening." }
        ]
    },
    {
        category: "Fear / Safety",
        items: [
            { q: "I'm scared to go alone.", a: "That's exactly why South Bound exists. You're never really alone. You'll land with a SIM card, a driver, and a community manager ready to welcome you. Plus, you'll be in a hub with other remote workers." },
            { q: "What about visas?", a: "We guide you through the whole process. For most of our destinations, it's just a simple visa on arrival or e-visa." }
        ]
    }
];

export default function ObjectionsPage() {
  return (
    <div className="space-y-8">
       <div className="flex items-center gap-2 text-sm text-stone-500 mb-2">
            <Link href="/hub/playbook" className="hover:text-[#E86B32] flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Back to Playbook
            </Link>
        </div>
        
       <div className="space-y-2">
        <Heading level={1} className="!text-3xl md:!text-4xl">Objection Handling</Heading>
        <p className="text-lg text-stone-600">How to turn a "No" into a "Tell me more".</p>
      </div>

      <div className="space-y-8">
          {objections.map((section, i) => (
              <section key={i}>
                  <h2 className="text-2xl font-bold text-stone-800 mb-4 flex items-center gap-2">
                      {section.category === 'Money' && <span className="text-green-600">$</span>}
                      {section.category === 'Work / Career' && <span className="text-blue-600">💼</span>}
                      {section.category === 'Fear / Safety' && <span className="text-orange-600">🛡️</span>}
                      {section.category}
                  </h2>
                  <div className="grid gap-4">
                      {section.items.map((item, j) => (
                          <Card key={j} className="p-6 bg-white border-stone-200">
                              <div className="flex gap-3 mb-3">
                                  <HelpCircle className="text-stone-400 w-6 h-6 flex-shrink-0" />
                                  <h3 className="font-bold text-lg text-stone-900">"{item.q}"</h3>
                              </div>
                              <div className="pl-9 text-stone-600 border-l-2 border-[#E86B32] ml-3 py-1">
                                  {item.a}
                              </div>
                          </Card>
                      ))}
                  </div>
              </section>
          ))}
      </div>
    </div>
  );
}

