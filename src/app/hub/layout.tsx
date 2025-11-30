import React from 'react';
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';

export default function HubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-stone-50/50 text-stone-900 font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <MobileNav />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 max-w-7xl mx-auto w-full">
            {children}
        </main>
      </div>
    </div>
  );
}

