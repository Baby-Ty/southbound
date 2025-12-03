import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Heading } from '@/components/ui/Heading';
import { 
  BookOpen, 
  Map, 
  MessageSquare, 
  ArrowRight, 
  Target, 
  Users, 
  DollarSign, 
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle2
} from 'lucide-react';

export default function HubHome() {
  const stats = [
    { 
      label: 'Active Leads', 
      value: '12', 
      change: '+2 this week',
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    { 
      label: 'Tasks Due', 
      value: '5', 
      change: '3 high priority',
      icon: CheckCircle2,
      color: 'text-orange-600',
      bg: 'bg-orange-100'
    },
    { 
      label: 'Pipeline Value', 
      value: '$24,500', 
      change: 'Potential comm.',
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
  ];

  const recentActivity = [
    {
      user: 'Sarah Jenkins',
      action: 'viewed proposal for',
      target: 'Bali, Indonesia',
      time: '2 hours ago',
      icon: Target,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      user: 'System',
      action: 'New lead assigned:',
      target: 'Mike Ross (South America)',
      time: '4 hours ago',
      icon: Users,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      user: 'You',
      action: 'completed training',
      target: 'Objection Handling 101',
      time: 'Yesterday',
      icon: CheckCircle2,
      color: 'text-green-600 bg-green-100'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Heading level={1} className="!text-3xl md:!text-4xl">Dashboard</Heading>
          <p className="text-lg text-stone-600">Good morning! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-stone-200 shadow-sm text-sm font-medium text-stone-600">
          <Calendar className="w-4 h-4 text-stone-400" />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        {stats.map((stat, i) => (
          <Card key={i} className="p-5 bg-white border-stone-200 flex items-center justify-between">
            <div>
              <p className="text-stone-500 text-sm font-medium mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-stone-900">{stat.value}</h3>
              <p className="text-xs text-stone-500 mt-1">{stat.change}</p>
            </div>
            <div className={`w-12 h-12 rounded-full ${stat.bg} ${stat.color} flex items-center justify-center`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Priority Actions */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-stone-800 text-lg">Quick Access</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {/* CRM */}
              <Link href="/hub/crm" className="block group">
                <Card className="h-full p-5 bg-white border-stone-200 hover:border-orange-200 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      <Target className="w-5 h-5" />
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="font-bold text-stone-900 mb-1">CRM & Leads</h3>
                  <p className="text-sm text-stone-600">Manage active conversations and pipeline.</p>
                </Card>
              </Link>

              {/* Destinations */}
              <Link href="/hub/destinations" className="block group">
                <Card className="h-full p-5 bg-white border-stone-200 hover:border-orange-200 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors">
                      <Map className="w-5 h-5" />
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="font-bold text-stone-900 mb-1">Destinations</h3>
                  <p className="text-sm text-stone-600">Guides, cheat sheets, and comparisons.</p>
                </Card>
              </Link>

              {/* Playbook */}
              <Link href="/hub/playbook" className="block group">
                <Card className="h-full p-5 bg-white border-stone-200 hover:border-orange-200 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 text-[#E86B32] flex items-center justify-center group-hover:bg-[#E86B32] group-hover:text-white transition-colors">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#E86B32] group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="font-bold text-stone-900 mb-1">Sales Playbook</h3>
                  <p className="text-sm text-stone-600">Scripts and objection handling guides.</p>
                </Card>
              </Link>

              {/* Ask SB */}
              <Link href="/hub/ask" className="block group">
                <Card className="h-full p-5 bg-white border-stone-200 hover:border-orange-200 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="font-bold text-stone-900 mb-1">Ask SB AI</h3>
                  <p className="text-sm text-stone-600">Get instant answers to your questions.</p>
                </Card>
              </Link>
            </div>
          </section>

           {/* Announcement */}
           <Card className="p-6 bg-gradient-to-r from-orange-50 to-white border-orange-100">
              <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm text-2xl">📣</div>
                  <div>
                      <h3 className="font-bold text-stone-800 text-lg">New Destination Added: Vietnam!</h3>
                      <p className="text-stone-600 mt-2">We've just added comprehensive guides, curated stays, and activity lists for Da Nang and Hoi An. Check out the new region guide to start selling.</p>
                      <Link href="/hub/destinations" className="inline-flex items-center text-[#E86B32] font-bold mt-4 hover:underline">
                          Explore Vietnam Guide <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                  </div>
              </div>
          </Card>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          {/* Activity Feed */}
          <Card className="bg-white border-stone-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-stone-900">Recent Activity</h3>
              <Clock className="w-4 h-4 text-stone-400" />
            </div>
            <div className="space-y-6">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className={`mt-1 w-8 h-8 rounded-full shrink-0 flex items-center justify-center ${item.color}`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm text-stone-800">
                      <span className="font-semibold">{item.user}</span> {item.action} <span className="font-medium">{item.target}</span>
                    </p>
                    <p className="text-xs text-stone-500 mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2 text-sm font-semibold text-stone-500 hover:text-stone-800 hover:bg-stone-50 rounded-lg transition-colors border border-transparent hover:border-stone-200">
              View All Activity
            </button>
          </Card>

          {/* Tools Widget */}
          <Card className="bg-stone-900 text-white p-6">
            <div className="mb-4">
              <h3 className="font-bold text-lg">Quick Tools</h3>
              <p className="text-stone-400 text-sm">Calculators & Builders</p>
            </div>
            <div className="space-y-3">
              <Link href="/hub/tools" className="block bg-white/10 hover:bg-white/20 transition-colors p-3 rounded-lg flex items-center justify-between">
                <span className="font-medium text-sm">Commission Calculator</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/hub/tools" className="block bg-white/10 hover:bg-white/20 transition-colors p-3 rounded-lg flex items-center justify-between">
                <span className="font-medium text-sm">Trip Builder</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
