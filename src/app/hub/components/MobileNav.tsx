'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Home, Map, BookOpen, Users, MessageSquare } from 'lucide-react';

const navItems = [
  { name: 'Home', href: '/hub', icon: Home },
  { name: 'Destinations', href: '/hub/destinations', icon: Map },
  { name: 'Playbook', href: '/hub/playbook', icon: BookOpen },
  { name: 'Leads', href: '/hub/leads', icon: Users },
  { name: 'Ask SB', href: '/hub/ask', icon: MessageSquare },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="md:hidden bg-stone-50 border-b border-stone-200 p-4 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <Link href="/hub" className="text-xl font-bold text-[#E86B32] font-handwritten">
          South Bound Hub
        </Link>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-stone-600">
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>
      
      {isOpen && (
        <nav className="mt-4 space-y-2 pb-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/hub' && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-orange-100 text-[#E86B32] font-medium'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
