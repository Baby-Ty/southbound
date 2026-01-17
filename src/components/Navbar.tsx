'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export const Navbar = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isHomePage = pathname === '/';
  const isDiscover = pathname?.startsWith('/discover');
  
  // Don't render navbar on discover page
  if (isDiscover) {
    return null;
  }
  
  // Increased readability: stronger font weight, larger text, better shadow
  const textColorClass = isHomePage ? 'text-white hover:text-white/90' : 'text-stone-800 hover:text-stone-600';
  const activeTextColorClass = isHomePage ? 'text-white font-bold border-b-2 border-white pb-1' : 'text-stone-900 font-bold border-b-2 border-stone-900 pb-1';
  
  const navItems = [
    ...(!isHomePage ? [{ name: 'Home', href: '/' }] : []),
    { name: 'Popular Routes', href: '/templates' },
    { name: 'Plan My Route', href: '/route-builder' },
    { name: 'About', href: '/about' },
  ];

  return (
    <>
        {/* Desktop Nav */}
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-8 left-0 right-0 z-50 hidden md:block pointer-events-none"
        >
        <div className={`pointer-events-auto max-w-7xl mx-auto px-6 flex items-center justify-end gap-12`}>
            {/* Logo Removed as requested */}
            
            <div className="flex items-center gap-10">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                                text-base font-semibold tracking-wide transition-all duration-300
                                ${isActive ? activeTextColorClass : textColorClass}
                            `}
                            style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }} // Stronger shadow for better readability
                        >
                            {item.name}
                        </Link>
                    );
                })}
            </div>
        </div>
        </motion.nav>

        {/* Mobile Nav */}
        <div className="md:hidden absolute top-6 left-6 right-6 z-50 flex justify-end items-center pointer-events-none">
            {/* Logo Removed */}
             <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`pointer-events-auto text-base font-semibold ${textColorClass}`}
                style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
             >
                {isMobileMenuOpen ? 'Close' : 'Menu'}
             </button>
        </div>

        <AnimatePresence>
            {isMobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-40 bg-stone-900/95 backdrop-blur-xl pt-24 px-6 md:hidden flex flex-col items-center justify-center"
                >
                    <div className="flex flex-col gap-8 items-center text-center">
                         {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-3xl font-bold text-white/90 hover:text-white py-2 tracking-tight"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </>
  );
};
