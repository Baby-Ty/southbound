'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Map, BookOpen, Users, MessageSquare, Route, Linkedin, List, Sparkles, MapPin } from 'lucide-react';

const navItems = [
  { name: 'Home', href: '/hub', icon: Home },
  { name: 'Destinations', href: '/hub/destinations', icon: Map },
  { name: 'Playbook', href: '/hub/playbook', icon: BookOpen },
  { name: 'Routes', href: '/hub/routes', icon: Route },
  { name: 'Templates', href: '/hub/templates', icon: Sparkles },
  { name: 'Route Cards', href: '/hub/route-cards', icon: MapPin },
  { name: 'Default Trips', href: '/hub/default-trips', icon: List },
  { name: 'Leads', href: '/hub/leads', icon: Users },
  { name: 'LinkedIn', href: '/hub/linkedin', icon: Linkedin },
  { name: 'Ask SB', href: '/hub/ask', icon: MessageSquare },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-stone-50 border-r border-stone-200 h-screen sticky top-0 flex-col p-4 hidden md:flex">
      <div className="mb-8 px-2">
        <Link href="/hub" className="text-2xl font-bold text-[#E86B32] font-handwritten">
          South Bound Hub
        </Link>
      </div>
      <nav className="space-y-1 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/hub' && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive
                  ? 'bg-orange-100 text-[#E86B32] font-medium'
                  : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto px-4 py-4 text-xs text-stone-400">
        <p>© 2025 South Bound</p>
      </div>
    </div>
  );
}
