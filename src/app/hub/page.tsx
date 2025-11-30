import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Heading } from '@/components/ui/Heading';
import { BookOpen, Map, MessageSquare, ArrowRight, Target } from 'lucide-react';

export default function HubHome() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <Heading level={1} className="!text-3xl md:!text-4xl">Welcome Back 👋</Heading>
        <p className="text-lg text-stone-600">Everything you need to close deals today.</p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid md:grid-cols-3 gap-6">
          {/* Destinations */}
          <Link href="/hub/destinations" className="block group">
              <Card className="h-full p-6 bg-white border-stone-200 hover:border-orange-200 hover:shadow-lg transition-all flex flex-col justify-between">
                  <div>
                      <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Map className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold text-stone-800 mb-2">Destinations</h3>
                      <p className="text-stone-600">Cheat sheets, comparisons, and quick facts for every region.</p>
                  </div>
                  <div className="mt-6 text-green-600 font-semibold text-sm flex items-center">
                      Browse Regions <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
              </Card>
          </Link>

          {/* The Playbook */}
          <Link href="/hub/playbook" className="block group">
              <Card className="h-full p-6 bg-white border-stone-200 hover:border-orange-200 hover:shadow-lg transition-all flex flex-col justify-between">
                  <div>
                      <div className="w-12 h-12 rounded-full bg-orange-100 text-[#E86B32] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <BookOpen className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold text-stone-800 mb-2">The Playbook</h3>
                      <p className="text-stone-600">Scripts, objection handling, and the sales flow guide.</p>
                  </div>
                  <div className="mt-6 text-[#E86B32] font-semibold text-sm flex items-center">
                      Open Playbook <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
              </Card>
          </Link>

          {/* Ask SB */}
          <Link href="/hub/ask" className="block group">
              <Card className="h-full p-6 bg-white border-stone-200 hover:border-orange-200 hover:shadow-lg transition-all flex flex-col justify-between">
                  <div>
                      <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <MessageSquare className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold text-stone-800 mb-2">Ask SB</h3>
                      <p className="text-stone-600">Not sure about a visa rule? Ask our AI assistant.</p>
                  </div>
                  <div className="mt-6 text-blue-600 font-semibold text-sm flex items-center">
                      Start Chat <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
              </Card>
          </Link>
      </div>

      {/* Secondary Actions */}
       <div className="grid md:grid-cols-2 gap-6">
           <Card className="p-6 bg-stone-50 border-stone-200 flex items-center justify-between group cursor-pointer hover:bg-white hover:border-stone-300 transition-colors">
               <div className="flex items-center gap-4">
                   <div className="bg-purple-100 p-3 rounded-lg text-purple-600">
                       <Target className="w-6 h-6" />
                   </div>
                   <div>
                       <h3 className="font-bold text-stone-800">View My Leads</h3>
                       <p className="text-sm text-stone-500">Check up on your active conversations</p>
                   </div>
               </div>
               <Link href="/hub/leads" className="bg-white border border-stone-200 px-4 py-2 rounded-lg text-sm font-bold text-stone-600 hover:bg-stone-50">
                   Open CRM
               </Link>
           </Card>

           {/* Announcement */}
            <Card className="p-6 bg-white border-orange-100">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-orange-50 rounded-lg shadow-sm text-2xl">📣</div>
                    <div>
                        <h3 className="font-bold text-stone-800">New Destination Added: Vietnam!</h3>
                        <p className="text-stone-600 mt-1 text-sm">We've just added comprehensive guides and curated stays for Da Nang and Hoi An.</p>
                        <Link href="/hub/destinations/southeast-asia" className="inline-flex items-center text-[#E86B32] font-semibold mt-2 text-sm hover:underline">
                            Read more <ArrowRight className="w-3 h-3 ml-1" />
                        </Link>
                    </div>
                </div>
            </Card>
       </div>
    </div>
  );
}
